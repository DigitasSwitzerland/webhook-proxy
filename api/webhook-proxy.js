// Simple in-memory storage for the latest webhook data
let latestWebhookData = {
  total_number_of_drives: 198385,
  last_updated: new Date().toISOString(),
  status: "waiting_for_data"
};

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Handle POST requests (incoming webhook data)
  if (req.method === 'POST') {
    try {
      const webhookData = req.body;
      
      // Store the latest data
      latestWebhookData = {
        total_number_of_drives: webhookData.total_number_of_drives || 0,
        last_updated: new Date().toISOString(),
        status: "live_data",
        received_at: new Date().toISOString()
      };
      
      console.log('Received webhook data:', latestWebhookData);
      
      // Respond to the webhook sender
      res.status(200).json({ 
        message: 'Webhook received successfully',
        timestamp: Date.now()
      });
      
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Failed to process webhook data' });
    }
  }
  
  // Handle GET requests (serve data to Webflow)
  else if (req.method === 'GET') {
    try {
      // Return the latest stored data
      res.status(200).json({
        timestamp: Date.now(),
        total_number_of_drives: latestWebhookData.total_number_of_drives,
        last_updated: latestWebhookData.last_updated,
        status: latestWebhookData.status
      });
      
    } catch (error) {
      console.error('Error serving data:', error);
      res.status(500).json({ 
        error: 'Failed to serve webhook data',
        details: error.message 
      });
    }
  }
  
  // Handle other methods
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
