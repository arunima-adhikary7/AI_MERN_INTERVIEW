// controllers/speechController.js

export const getSpeechToken = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Text is required",
            });
        }

        const apiKey = process.env.ELEVENLABS_API_KEY;
        const voiceId = process.env.ELEVENLABS_VOICE_ID;

        if (!apiKey || !voiceId) {
            return res.status(500).json({
                message: "ElevenLabs configuration is missing",
            });
        }

        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "xi-api-key": apiKey,
                },

                body: JSON.stringify({
                    text: text.trim(),
                    model_id: "eleven_multilingual_v2",
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();

            console.error(
                "[ElevenLabs] API Error:",
                errorText
            );

            return res.status(response.status).json({
                message: "ElevenLabs speech generation failed",
                error: errorText,
            });
        }

        const data = await response.json();

        return res.status(200).json({
            audio_base64: data.audio_base64,
            alignment: data.alignment,
        });

    } catch (error) {
        console.error(
            "[ElevenLabs] Speech Controller Error:",
            error
        );

        return res.status(500).json({
            message: "Speech generation failed",
            error: error.message,
        });
    }
};