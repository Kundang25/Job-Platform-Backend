const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const parseResume = async (resumeText) => {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Extract skills, projects, experience from resume."
        },
        {
          role: "user",
          content: resumeText
        }
      ]
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = {
  parseResume
};