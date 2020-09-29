//
// index.ts — mbp-rolls-server
// ~/src
//

import { server as WebSocketServer } from 'websocket';
import { createServer } from 'http';

import { streaming } from './streaming';
import { log, errorlog } from './logging';

const httpServer = createServer((req, res) => res.writeHead(404).end());
const port = 54321;

httpServer.on('error', (error) => errorlog('http server error:', error));
httpServer.listen(port, () => log('Server is listening on port %s', port));

const server = new WebSocketServer({
	httpServer,
	autoAcceptConnections: false,
});

server.on('request', streaming);
