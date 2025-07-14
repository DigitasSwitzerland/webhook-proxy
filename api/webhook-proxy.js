export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // Try to get the latest request from webhook.site
    const webhookUrl = 'https://webhook.site/token/c6daea10-b915-4f67-b786-b02b985e6573/requests';
    
    const response = await fetch(webhookUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; WebhookProxy/1.0)',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Get the latest request from webhook.site
    const latestRequest = data.data && data.data.length > 0 ? data.data[0] : null;
    
    if (latestRequest && latestRequest.content) {
      // Parse the JSON content from the latest webhook request
      const webhookData = JSON.parse(latestRequest.content);
      
      // Return the data in the expected format
      res.status(200).json({
        timestamp: Date.now(),
        total_number_of_drives: webhookData.total_number_of_drives || 0,
        last_updated: latestRequest.created_at || new Date().toISOString(),
        status: "live_data"
      });
    } else {
      // No recent data found
      res.status(200).json({
        timestamp: Date.now(),
        total_number_of_drives: 198385, // fallback
        last_updated: new Date().toISOString(),
        status: "no_recent_data"
      });
    }
    
  } catch (error) {
    console.error('Webhook proxy error:', error);
    
    // Return fallback data if the real source fails
    res.status(200).json({
      timestamp: Date.now(),
      total_number_of_drives: 198385, // fallback number
      last_updated: new Date().toISOString(),
      status: "fallback_data",
      error: error.message
    });
  }
}
