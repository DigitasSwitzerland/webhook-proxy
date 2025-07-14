export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === 'GET') {
    try {
      // Your webhook.site token ID
      const tokenId = 'c6daea10-b915-4f67-b786-b02b985e6573';
      
      // Your webhook.site API key
      const apiKey = '66a6b7ef-6b5f-4672-9e72-969e2ae835b5';
      
      // Correct webhook.site API endpoint
      const webhookUrl = `https://webhook.site/token/${tokenId}/requests?sorting=newest&page=1`;
      
      const response = await fetch(webhookUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Api-Key': apiKey, // This is how webhook.site expects the API key
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Get the most recent request
      const latestRequest = data.data && data.data.length > 0 ? data.data[0] : null;
      
      if (latestRequest && latestRequest.content) {
        // Parse the JSON content from the latest webhook request
        const webhookData = JSON.parse(latestRequest.content);
        
        // Return the data in the expected format
        res.status(200).json({
          timestamp: Date.now(),
          total_number_of_drives: webhookData.total_number_of_drives || 0,
          last_updated: latestRequest.created_at || new Date().toISOString(),
          status: "live_data_from_webhook_site"
        });
      } else {
        // No recent data found
        res.status(200).json({
          timestamp: Date.now(),
          total_number_of_drives: 198385, // fallback
          last_updated: new Date().toISOString(),
          status: "no_recent_webhook_data"
        });
      }
      
    } catch (error) {
      console.error('Webhook.site API error:', error);
      
      // Return fallback data if the API fails
      res.status(200).json({
        timestamp: Date.now(),
        total_number_of_drives: 198385, // fallback number
        last_updated: new Date().toISOString(),
        status: "fallback_data",
        error: error.message
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
