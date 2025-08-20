const ANDROMEDA_API_URL = process.env.ANDROMEDA_API_URL;
const ANDROMEDA_API_KEY = process.env.ANDROMEDA_API_KEY;
const SYSTEM_INSTRUCTIONS = process.env.SYSTEM_INSTRUCTIONS || "";

async function askAndromeda(message) {

    const body = {
        contents: [
            {
                role: "user",
                parts: [{ text: message }]
            }
        ]
    };

    if(SYSTEM_INSTRUCTIONS) {

        body.system_instruction = {
            role: "system",
            parts: [{ text: SYSTEM_INSTRUCTIONS }]
        };

    }

    const url = `${ANDROMEDA_API_URL}?key=${ANDROMEDA_API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if(
            data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts[0] &&
            typeof data.candidates[0].content.parts[0].text === "string"
        ) {

            return data.candidates[0].content.parts[0].text;

        } else {

            return "No response from Andromeda.";

        }
    } catch (error) {

        console.error("Andromeda response error: " + error);
        return "Error communicating with Andromeda.";

    }
    
}

module.exports = { askAndromeda };