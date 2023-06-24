
const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);


app.use(express.json());

app.post('/question', async (req, res) => {
    console.log(req.body)
    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md",
            }
        });
        return;
    }
    console.log(req.body.question)
    const question = req.body.question || '';

    if (question.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a valid question",
            }
        });
        return;
    }

    try {
        const answer = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${question}`,
            temperature: 0.2,
            max_tokens: 2000
        });
        res.json({ answer: answer.data.choices[0].text });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "An error occurred during your request."
            }
        });
    }
});

app.post("/image", async (req, res) => {
    console.log("HERE")
    try {
        const response = await openai.createImage({
            prompt: req.body.question,
            n: 1,
            size: "1024x1024",
        });
        const imageUrl = response.data.data[0].url;
        res.status(200).json({ imageUrl })
    } catch (err) {
        res.status(500).json({ err })
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
