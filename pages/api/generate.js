import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `Write me a blog post in the style of Paul Graham with the title below. Please make sure the blog post goes in-depth on the topic and shows that the writer did their research.

Title:
`

const generateAction = async (req, res) => {
    // Run first prompt
    console.log('API: ${basePromptPrefix}${req.body.userInput}')

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `$(basePromptPrefix)${req.body.userInput}\n`,
        temperature: 0.8,
        max_tokens: 250,
    });

    const basePromptOutput = baseCompletion.data.choices.pop();

    // Build Prompt #2
    const secondPrompt =
    `
    Take the table of contents and title of the blog post below and generate a blog post written in thwe style of Paul Graham. Make it feel like a story. Don't just list the points. Go deep into each one. Explain why.

    Title: ${req.body.userInput}

    Table of Contents: ${basePromptOutput.text}

    Blog Post:
    `

    // Call the OpenAI API a second time with Prompy #2
    const secondPromptCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${secondPrompt}`,
        temperature: 0.85,
        max_tokens: 1250,
    });

    // Get the output
    const secondPromptOutput = secondPromptCompletion.data.choices.pop();

    // Send over the Prompt #2's output to the UI
    res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;