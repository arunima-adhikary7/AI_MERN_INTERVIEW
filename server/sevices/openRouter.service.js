import axios from "axios";

export const askAi = async (messages) => {
    try {
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new Error("Message array is empty.");
        }
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: 'openai/gpt-4o-mini',
            messages: messages
        },
            {headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },}
        )

        const content = response?.data?.choice?.[0]?.messages?.content;
        if(!content || !content.trim())
            throw new Error("Open Router Ai error");
    } catch (error) {
        console.log(error.message);
        
    }
}