export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const response = await fetch(
      "https://api.perplexity.ai/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "sonar-pro",
          messages: [
            {
              role: "system",
              content: "You generate creative image prompts."
            },
            {
              role: "user",
              content: "Generate 4 creative image prompts based on a single theme."
            }
          ]
        })
      }
    );

    const data = await response.json();
    const text = data.choices[0].message.content;

    const prompts = text
      .split("\n")
      .filter(l => l.length > 10)
      .slice(0, 4);

    res.status(200).json({ prompts });

  } catch (e) {
    res.status(500).json({ error: "Server error", details: e.message });
  }
}
