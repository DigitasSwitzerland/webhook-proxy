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
    // Return hardcoded data for testing
    res.status(200).json({
      timestamp: Date.now(),
      total_number_of_drives: 198385,
      last_updated: new Date().toISOString(),
      status: "test_data"
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch webhook data',
      details: error.message 
    });
  }
}
