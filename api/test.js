export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Hello World',
    timestamp: new Date().toISOString()
  });
}
