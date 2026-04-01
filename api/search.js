export default async function handler(req, res) {
  const { q } = req.query

  if (!q) {
    return res.status(400).json({ error: 'Missing query parameter: q' })
  }

  const apiKey = process.env.VITE_SERPAPI_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const url = `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(q)}&api_key=${apiKey}`

  const response = await fetch(url)
  const data = await response.json()

  res.status(response.status).json(data)
}
