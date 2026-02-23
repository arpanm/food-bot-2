/**
 * Mock ONDC MCP server for testing.
 * Mimics ONDC-style search and order placement.
 */
import http from 'node:http';

const PORT = process.env.MOCK_ONDC_PORT || 3200;

const STUB_SEARCH = {
  providers: [
    { id: 'ondc-p1', name: 'Mock ONDC Restaurant 1', category: 'Food', rating: 4.3 },
    { id: 'ondc-p2', name: 'Mock ONDC Restaurant 2', category: 'Food', rating: 4.0 },
  ],
  items: [
    { id: 'i1', name: 'Dal Rice', price: 120, providerId: 'ondc-p1' },
    { id: 'i2', name: 'Paneer Curry', price: 180, providerId: 'ondc-p1' },
  ],
};

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  if (url.pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', mock: 'ondc-mcp' }));
    return;
  }
  if (url.pathname === '/tools' && req.method === 'GET') {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        tools: [
          { name: 'search', description: 'Search catalog (ONDC protocol)' },
          { name: 'init_order', description: 'Initialize order' },
          { name: 'confirm_order', description: 'Confirm and place order' },
        ],
      })
    );
    return;
  }
  if (url.pathname === '/tools/call' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const { name } = JSON.parse(body || '{}');
        if (name === 'search') {
          res.writeHead(200);
          res.end(
            JSON.stringify({ content: [{ type: 'text', text: JSON.stringify(STUB_SEARCH) }] })
          );
        } else if (name === 'init_order' || name === 'confirm_order') {
          res.writeHead(200);
          res.end(
            JSON.stringify({
              content: [
                { type: 'text', text: JSON.stringify({ success: true, orderId: 'mock-ondc-1' }) },
              ],
            })
          );
        } else {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Unknown tool' }));
        }
      } catch {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid request' }));
      }
    });
    return;
  }
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Mock ONDC MCP listening on ${PORT}`);
});
