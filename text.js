export default async function handler(req, res) {

  try {

    const API_KEY = process.env.API_KEY;
    const { prompt } = req.body;

    const response = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          model: "moonshotai/kimi-k2.5",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 1024,
          temperature: 1.0,
          top_p: 1.0,
          stream: false
        })
      }
    );

    const data = await response.json();

    res.status(200).json(data);

  } catch (error) {

    res.status(500).json({
      error: "Text generation failed",
      details: error.message
    });

  }
}
