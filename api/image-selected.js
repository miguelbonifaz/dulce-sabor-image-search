export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const webhookUrl = process.env.VITE_IMAGE_SELECTED_WEBHOOK_URL

  if (!webhookUrl) {
    return res.status(500).json({ error: 'Webhook URL not configured' })
  }

  const { number, imageUrl } = req.body ?? {}

  if (!number || !imageUrl) {
    return res.status(400).json({ error: 'Missing number or imageUrl' })
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        number,
        imageUrl,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return res.status(response.status).json({
        error: 'Webhook request failed',
        details: errorText,
      })
    }

    return res.status(200).json({ ok: true })
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to reach webhook',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
