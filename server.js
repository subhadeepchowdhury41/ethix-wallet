import { createServer } from 'http';
import { join } from 'path';
import { createServer as _createServer } from 'http-server';

// Set the path to your React build folder
const buildPath = join(__dirname, 'path/to/your/react/build/folder');

// Create an HTTP server
const server = createServer();

// Create an http-server instance
const staticServer = _createServer({
  root: buildPath,
});

// Handle incoming requests
server.on('request', (req, res) => {
  staticServer.serve(req, res);
});

// Start the server on a specific port
const PORT = 3000; // Change this to your desired port
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
