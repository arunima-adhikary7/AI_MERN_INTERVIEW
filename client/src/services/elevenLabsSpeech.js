const API_URL = import.meta.env.VITE_API_URL;

const FRAME_RATE = 60;

const FACIAL_BLENDSHAPES = [
    "eyeBlinkLeft",
    "eyeLookDownLeft",
    "eyeLookInLeft",
    "eyeLookOutLeft",
    "eyeLookUpLeft",
    "eyeSquintLeft",
    "eyeWideLeft",

    "eyeBlinkRight",
    "eyeLookDownRight",
    "eyeLookInRight",
    "eyeLookOutRight",
    "eyeLookUpRight",
    "eyeSquintRight",
    "eyeWideRight",

    "jawForward",
    "jawLeft",
    "jawRight",
    "jawOpen",

    "mouthClose",
    "mouthFunnel",
    "mouthPucker",
    "mouthLeft",
    "mouthRight",
    "mouthSmileLeft",
    "mouthSmileRight",
    "mouthFrownLeft",
    "mouthFrownRight",
    "mouthDimpleLeft",
    "mouthDimpleRight",
    "mouthStretchLeft",
    "mouthStretchRight",

    "mouthRollLower",
    "mouthRollUpper",
    "mouthShrugLower",
    "mouthShrugUpper",

    "mouthPressLeft",
    "mouthPressRight",

    "mouthLowerDownLeft",
    "mouthLowerDownRight",
    "mouthUpperUpLeft",
    "mouthUpperUpRight",

    "browDownLeft",
    "browDownRight",
    "browInnerUp",
    "browOuterUpLeft",
    "browOuterUpRight",

    "cheekPuff",
    "cheekSquintLeft",
    "cheekSquintRight",

    "noseSneerLeft",
    "noseSneerRight",

    "tongueOut",

    "headRoll",
    "leftEyeRoll",
    "rightEyeRoll",
];

const createEmptyFrame = () =>
    new Array(FACIAL_BLENDSHAPES.length).fill(0);

const setShape = (frame, name, value) => {
    const index = FACIAL_BLENDSHAPES.indexOf(name);

    if (index !== -1) {
        frame[index] = Math.max(
            0,
            Math.min(1, value)
        );
    }
};

/*
|--------------------------------------------------------------------------
| VISeme approximation
|--------------------------------------------------------------------------
|
| P/B/M  -> lips close
| F/V    -> lower lip / teeth
| A      -> jaw open
| E/I    -> mouth stretched
| O/U/W  -> rounded lips
| S/Z    -> small narrow movement
| T/D/N/L -> very small movement
|
*/

const getMouthShape = (character) => {
    const char = character.toLowerCase();

    if (/\s/.test(char)) {
        return "silence";
    }

    // Bilabial
    if ("bpm".includes(char)) {
        return "closed";
    }

    // Labiodental
    if ("fv".includes(char)) {
        return "bite";
    }

    // Open vowel
    if ("a".includes(char)) {
        return "open";
    }

    // Wide vowel
    if ("ei".includes(char)) {
        return "wide";
    }

    // Rounded vowel
    if ("ou".includes(char)) {
        return "round";
    }

    // W
    if ("w".includes(char)) {
        return "pucker";
    }

    // Sibilants
    if ("sz".includes(char)) {
        return "narrow";
    }

    // Tongue/alveolar consonants
    if ("tdnrl".includes(char)) {
        return "small";
    }

    // Ch/J
    if ("cj".includes(char)) {
        return "narrow";
    }

    return "neutral";
};


/*
|--------------------------------------------------------------------------
| Mouth shapes
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Keep these values relatively small.
| We want subtle facial movement, not exaggerated animation.
|
*/

const applyMouthShape = (frame, shape) => {

    switch (shape) {

        case "closed":
            // P / B / M
            setShape(frame, "mouthClose", 0.20);
            setShape(frame, "mouthPressLeft", 0.10);
            setShape(frame, "mouthPressRight", 0.10);
            break;


        case "bite":
            // F / V
            setShape(frame, "jawOpen", 0.10);
            setShape(frame, "mouthLowerDownLeft", 0.12);
            setShape(frame, "mouthLowerDownRight", 0.12);
            break;


        case "open":
            // A
            setShape(frame, "jawOpen", 0.60);
            setShape(frame, "mouthStretchLeft", 0.10);
            setShape(frame, "mouthStretchRight", 0.10);
            break;


        case "wide":
            // E / I
            setShape(frame, "jawOpen", 0.28);
            setShape(frame, "mouthStretchLeft", 0.30);
            setShape(frame, "mouthStretchRight", 0.30);
            break;


        case "round":
            // O
            setShape(frame, "jawOpen", 0.20);
            setShape(frame, "mouthFunnel", 0.38);
            setShape(frame, "mouthPucker", 0.80);
            break;


        case "pucker":
            // W / U
            setShape(frame, "jawOpen", 0.12);
            setShape(frame, "mouthPucker", 0.45);
            setShape(frame, "mouthFunnel", 0.25);
            break;


        case "narrow":
            // S / Z / C / J
            setShape(frame, "jawOpen", 0.08);
            setShape(frame, "mouthStretchLeft", 0.14);
            setShape(frame, "mouthStretchRight", 0.14);
            break;


        case "small":
            // T / D / N / L / R
            setShape(frame, "jawOpen", 0.06);
            setShape(frame, "mouthStretchLeft", 0.07);
            setShape(frame, "mouthStretchRight", 0.07);
            break;


        case "neutral":
            setShape(frame, "jawOpen", 0.03);
            break;


        case "silence":
        default:
            break;
    }
};


/*
|--------------------------------------------------------------------------
| Create lip-sync frames
|--------------------------------------------------------------------------
*/

const createLipSyncFrames = (alignment) => {

    if (!alignment) {
        return [];
    }

    const characters =
        alignment.characters || [];

    const startTimes =
        alignment.character_start_times_seconds || [];

    const endTimes =
        alignment.character_end_times_seconds || [];

    if (
        !characters.length ||
        !startTimes.length ||
        !endTimes.length
    ) {
        return [];
    }

    const lastTime =
        endTimes[endTimes.length - 1] || 0;

    const totalFrames =
        Math.ceil(lastTime * FRAME_RATE) + 2;

    const frames = Array.from(
        { length: totalFrames },
        () => createEmptyFrame()
    );


    /*
    |--------------------------------------------------------------------------
    | Add each character's mouth position
    |--------------------------------------------------------------------------
    */

    for (let i = 0; i < characters.length; i++) {

        const character = characters[i];

        const start = startTimes[i];
        const end = endTimes[i];

        if (
            start === undefined ||
            end === undefined
        ) {
            continue;
        }

        const shape =
            getMouthShape(character);

        if (shape === "silence") {
            continue;
        }

        const startFrame =
            Math.max(
                0,
                Math.floor(
                    start * FRAME_RATE
                )
            );

        const endFrame =
            Math.min(
                frames.length - 1,
                Math.ceil(
                    end * FRAME_RATE
                )
            );


        for (
            let frameIndex = startFrame;
            frameIndex <= endFrame;
            frameIndex++
        ) {

            applyMouthShape(
                frames[frameIndex],
                shape
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Smooth the animation
    |--------------------------------------------------------------------------
    |
    | Instead of holding a mouth position forever,
    | interpolate between neighbouring frames.
    |
    */

    for (let i = 1; i < frames.length - 1; i++) {

        for (
            let j = 0;
            j < frames[i].length;
            j++
        ) {

            const previous =
                frames[i - 1][j];

            const current =
                frames[i][j];

            const next =
                frames[i + 1][j];


            frames[i][j] =
                previous * 0.20 +
                current * 0.60 +
                next * 0.20;
        }
    }


    return frames;
};


/*
|--------------------------------------------------------------------------
| Stop speech
|--------------------------------------------------------------------------
*/

export const stopElevenLabsSpeech = (
    lipSyncRef
) => {

    const lipSync =
        lipSyncRef?.current;

    if (!lipSync) {
        return;
    }

    if (lipSync.audio) {

        try {

            lipSync.audio.pause();
            lipSync.audio.currentTime = 0;

        } catch (error) {

            console.error(
                "[ElevenLabs] Failed to stop audio:",
                error
            );
        }
    }

    if (lipSync.audioUrl) {

        try {

            URL.revokeObjectURL(
                lipSync.audioUrl
            );

        } catch (error) {

            console.error(
                "[ElevenLabs] Failed to revoke audio URL:",
                error
            );
        }
    }

    lipSync.active = false;
    lipSync.audio = null;
    lipSync.audioUrl = null;
    lipSync.frames = [];
    lipSync.startedAt = 0;
};


/*
|--------------------------------------------------------------------------
| Speak
|--------------------------------------------------------------------------
*/

export const speakWithElevenLabs = async (
    text,
    lipSyncRef,
    callbacks = {}
) => {

    if (!text?.trim()) {
        return null;
    }

    stopElevenLabsSpeech(lipSyncRef);

    try {

        // console.log(
        //     "[ElevenLabs] API URL:",
        //     `${API_URL}/api/speech/speak`
        // );


        const response = await fetch(
            `${API_URL}/api/speech/speak`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                credentials: "include",

                body: JSON.stringify({
                    text: text.trim(),
                }),
            }
        );


        if (!response.ok) {

            let errorMessage =
                "ElevenLabs speech request failed";

            try {

                const errorData =
                    await response.json();

                errorMessage =
                    errorData.message ||
                    errorData.error ||
                    errorMessage;

            } catch (error) {

                console.error(
                    "[ElevenLabs] Failed to parse error response:",
                    error
                );
            }

            throw new Error(
                errorMessage
            );
        }


        const data =
            await response.json();


        if (!data.audio_base64) {

            throw new Error(
                "ElevenLabs did not return audio"
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Decode audio
        |--------------------------------------------------------------------------
        */

        const binaryString =
            atob(data.audio_base64);

        const bytes =
            new Uint8Array(
                binaryString.length
            );

        for (
            let i = 0;
            i < binaryString.length;
            i++
        ) {

            bytes[i] =
                binaryString.charCodeAt(i);
        }


        const audioBlob =
            new Blob(
                [bytes],
                {
                    type: "audio/mpeg",
                }
            );


        const audioUrl =
            URL.createObjectURL(
                audioBlob
            );


        const audio =
            new Audio(audioUrl);


        /*
        |--------------------------------------------------------------------------
        | Lip sync
        |--------------------------------------------------------------------------
        */

        const frames =
            createLipSyncFrames(
                data.alignment
            );


        // console.log(
        //     "[ElevenLabs] Characters:",
        //     data.alignment?.characters?.length || 0
        // );

        // console.log(
        //     "[ElevenLabs] Lip-sync frames:",
        //     frames.length
        // );


        lipSyncRef.current = {

            active: false,

            frames,

            startedAt: 0,

            frameRate:
                FRAME_RATE,

            audio,

            audioUrl,
        };


        /*
        |--------------------------------------------------------------------------
        | Audio events
        |--------------------------------------------------------------------------
        */

        audio.onplay = () => {

            if (
                lipSyncRef.current.audio !==
                audio
            ) {
                return;
            }

            lipSyncRef.current.active =
                true;

            lipSyncRef.current.startedAt =
                performance.now();

            callbacks.onStart?.();
        };


        audio.onended = () => {

            if (
                lipSyncRef.current.audio !==
                audio
            ) {
                return;
            }

            lipSyncRef.current.active =
                false;

            callbacks.onEnd?.();

            URL.revokeObjectURL(
                audioUrl
            );

            lipSyncRef.current.audio =
                null;

            lipSyncRef.current.audioUrl =
                null;
        };


        audio.onerror = (error) => {

            if (
                lipSyncRef.current.audio !==
                audio
            ) {
                return;
            }

            lipSyncRef.current.active =
                false;

            callbacks.onError?.(
                error
            );

            URL.revokeObjectURL(
                audioUrl
            );

            lipSyncRef.current.audio =
                null;

            lipSyncRef.current.audioUrl =
                null;
        };


        await audio.play();

        return audio;

    } catch (error) {

        console.error(
            "[ElevenLabs] Speech failed:",
            error
        );

        if (lipSyncRef.current) {

            lipSyncRef.current.active =
                false;
        }

        callbacks.onError?.(
            error
        );

        throw error;
    }
};