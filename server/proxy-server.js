import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = 3001;
const PYTHON_SERVICE_URL = 'http://localhost:5000';

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Proxy API requests to the Python service
app.use('/api', createProxyMiddleware({
  target: PYTHON_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // No path rewriting needed
  },
}));

// Proxy audio file requests
app.get('/audio/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const response = await axios.get(`${PYTHON_SERVICE_URL}/audio/${filename}`, {
      responseType: 'stream'
    });
    
    // Set appropriate headers
    res.set('Content-Type', 'audio/mpeg');
    
    // Pipe the audio stream to the response
    response.data.pipe(res);
  } catch (error) {
    console.error('Error proxying audio:', error);
    res.status(500).json({ error: 'Failed to retrieve audio file' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'proxy-server' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
