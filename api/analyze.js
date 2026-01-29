export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const body = await req.json();
    const imageBase64 = body.image;

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "pplx-vision",
        messages: [
          {
            role: "system",
            content: "Analyze the image and generate 4 creative prompts."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Generate 4 image prompts based on this image." },
              { type: "image_base64", image_base64: imageBase64 }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    const text = data.choices[0].message.content;

    const prompts = text
      .split("\n")
      .filter(l => l.length > 10)
      .slice(0, 4);

    res.status(200).json({ prompts });

  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}
