export default async function handler(req, res) {

  try {

    const API_KEY = process.env.API_KEY;
    const { prompt } = req.body;

    const response = await fetch(
      "https://integrate.api.nvidia.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          model: "stabilityai/stable-diffusion-xl",
          prompt: prompt,
          size: "1024x1024"
        })
      }
    );

    const data = await response.json();

    res.status(200).json(data);

  } catch (error) {

    res.status(500).json({
      error: "Image generation failed",
      details: error.message
    });

  }
}
