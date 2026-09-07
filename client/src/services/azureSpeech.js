import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

const API_URL = import.meta.env.VITE_API_URL;

// Stop currently playing Azure speech
export const stopAzureSpeech = (lipSyncRef) => {
    const lipSync = lipSyncRef.current;

    if (lipSync?.audio) {
        try {
            lipSync.audio.pause();
            lipSync.audio.currentTime = 0;
        } catch (error) {
            console.error("Failed to stop Azure audio:", error);
        }
    }

    if (lipSync) {
        lipSync.active = false;
        lipSync.audio = null;
        lipSync.frames = [];
        lipSync.startedAt = 0;
    }
};


// Speak text using Azure Speech + FacialExpression
export const speakWithAzure = async (
    text,
    lipSyncRef,
    callbacks = {}
) => {
    // Get temporary Azure token from your backend
    const response = await fetch(
        `${API_URL}/api/speech/token`,
        {
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to get Azure Speech token");
    }

    const { token, region } = await response.json();

    // Azure Speech configuration
    const speechConfig =
        SpeechSDK.SpeechConfig.fromAuthorizationToken(
            token,
            region
        );

    speechConfig.speechSynthesisVoiceName =
        "en-US-AvaNeural";

    speechConfig.speechSynthesisOutputFormat =
        SpeechSDK.SpeechSynthesisOutputFormat
            .Riff24Khz16BitMonoPcm;

    // null = don't automatically play through SDK
    const synthesizer =
        new SpeechSDK.SpeechSynthesizer(
            speechConfig,
            null
        );

    const frames = [];

    // Receive FacialExpression animation
    synthesizer.visemeReceived = (_, event) => {
        if (!event.animation) return;

        try {
            const animation =
                JSON.parse(event.animation);

            const startFrame =
                animation.FrameIndex ?? 0;

            const blendShapes =
                animation.BlendShapes ?? [];

            blendShapes.forEach(
                (frame, index) => {
                    frames[startFrame + index] = frame;
                }
            );
        } catch (error) {
            console.error(
                "Failed to parse Azure facial animation:",
                error
            );
        }
    };

    // Escape XML characters
    const safeText = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

    const ssml = `
    <speak
      version="1.0"
      xmlns="http://www.w3.org/2001/10/synthesis"
      xmlns:mstts="http://www.w3.org/2001/mstts"
      xml:lang="en-US">

      <voice name="en-US-AvaNeural">

        <mstts:viseme type="FacialExpression"/>

        ${safeText}

      </voice>
    </speak>
  `;

    // Wait for Azure synthesis
    const result = await new Promise(
        (resolve, reject) => {
            synthesizer.speakSsmlAsync(
                ssml,
                resolve,
                reject
            );
        }
    );

    synthesizer.close();

    if (
        result.reason !==
        SpeechSDK.ResultReason.SynthesizingAudioCompleted
    ) {
        throw new Error(
            "Azure Speech synthesis failed"
        );
    }

    // Fill missing frames
    let lastFrame = null;

    for (let i = 0; i < frames.length; i++) {
        if (frames[i]) {
            lastFrame = frames[i];
        } else if (lastFrame) {
            frames[i] = lastFrame;
        }
    }

    // Convert Azure audio into playable audio
    const audioBlob = new Blob(
        [result.audioData],
        {
            type: "audio/wav",
        }
    );

    const audioUrl =
        URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);

    // Store everything needed by the GLB
    lipSyncRef.current = {
        active: false,
        frames,
        startedAt: 0,
        frameRate: 60,
        audio,
    };

    audio.onplay = () => {
        lipSyncRef.current.active = true;
        lipSyncRef.current.startedAt =
            performance.now();

        callbacks.onStart?.();
    };

    audio.onended = () => {
        lipSyncRef.current.active = false;

        callbacks.onEnd?.();

        URL.revokeObjectURL(audioUrl);
    };

    audio.onerror = (error) => {
        lipSyncRef.current.active = false;

        callbacks.onError?.(error);

        URL.revokeObjectURL(audioUrl);
    };

    await audio.play();

    return audio;
};