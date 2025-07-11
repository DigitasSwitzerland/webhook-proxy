// api/webhook-proxy.js
export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // Your webhook.site token - replace with your actual token
    const WEBHOOK_TOKEN = 'c6daea10-b915-4f67-b786-b02b985e6573';
    
    // Fetch the latest requests from webhook.site
    const response = await fetch(`https://webhook.site/token/${WEBHOOK_TOKEN}/requests`, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Find the most recent request with your data
    const latestRequest = data.data?.[0];
    
    if (!latestRequest) {
      return res.status(404).json({ error: 'No requests found' });
    }
    
    // Parse the content (it might be a string that needs parsing)
    let content;
    try {
      content = typeof latestRequest.content === 'string' 
        ? JSON.parse(latestRequest.content) 
        : latestRequest.content;
    } catch (e) {
      content = latestRequest.content;
    }
    
    // Return the data in a clean format
    res.status(200).json({
      timestamp: content.timestamp || latestRequest.created_at,
      total_number_of_drives: content.total_number_of_drives || 0,
      last_updated: latestRequest.created_at
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch webhook data',
      details: error.message 
    });
  }
}
