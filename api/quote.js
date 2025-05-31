export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://api.uniswap.org/v1/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://react-uniswap-widget.vercel.app'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error fetching quote:', error);
    return res.status(500).json({ error: 'Failed to fetch quote' });
  }
} 