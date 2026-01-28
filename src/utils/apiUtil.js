const GEMINI_API_URL = process.env.GEMINI_API_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SYSTEM_INSTRUCTIONS = process.env.SYSTEM_INSTRUCTIONS || '';

function injectSystemInstruction(history, instruction) {
    return history.map(msg => {
        if (msg.role === "system") return msg;
        return {
            ...msg,
            parts: [
                { text: instruction },
                ...msg.parts
            ]
        };
    });
}

async function askGemini(contents) {
    let newContents = contents;

    if (!Array.isArray(contents)) contents = [];

    if (!contents.length || contents[0].role !== "system") {
        newContents = [
            { role: "system", parts: [{ text: SYSTEM_INSTRUCTIONS }] },
            ...contents
        ];
    }

    newContents = injectSystemInstruction(newContents, SYSTEM_INSTRUCTIONS);

    const body = {
        contents: newContents
    };

    if (SYSTEM_INSTRUCTIONS) {
        body.system_instruction = {
            parts: [{ text: SYSTEM_INSTRUCTIONS }]
        };
    }

    const url = `${GEMINI_API_URL}${GEMINI_API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini API error:", data.error);
            return `API Error: ${data.error.message || JSON.stringify(data.error)}`;
        }

        if (
            data.candidates &&
            Array.isArray(data.candidates) &&
            data.candidates[0] &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts[0] &&
            typeof data.candidates[0].content.parts[0].text === "string"
        ) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "No response from Gemini.";
        }
    } catch (error) {
        console.error("Gemini response error: " + error);
        return "Error communicating with Gemini.";
    }
}

module.exports = { askGemini };
