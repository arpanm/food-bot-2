/**
 * Mock Zomato MCP server for testing.
 * Mimics Zomato: restaurant discovery, menu, cart, order.
 */
import http from 'node:http';

const PORT = process.env.MOCK_ZOMATO_PORT || 3102;

const STUB_RESTAURANTS = {
  restaurants: [
    { id: 'z1', name: 'Mock Pizza Place', cuisine: 'Italian', rating: 4.4, distance: '2.1 km' },
    { id: 'z2', name: 'Mock Vegan Cafe', cuisine: 'Continental', rating: 4.6, distance: '1.5 km' },
  ],
};

const STUB_MENU = {
  items: [
    { id: 'm1', name: 'Margherita Pizza', price: 299, available: true },
    { id: 'm2', name: 'Garlic Bread', price: 149, available: true },
  ],
};

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  if (url.pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', mock: 'zomato-mcp' }));
    return;
  }
  if (url.pathname === '/tools' && req.method === 'GET') {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        tools: [
          { name: 'discover_restaurants', description: 'Discover nearby restaurants' },
          { name: 'get_menu', description: 'Browse menu with prices' },
          { name: 'add_to_cart', description: 'Add items to cart' },
          { name: 'place_order', description: 'Place order with tracking' },
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
        if (name === 'discover_restaurants' || name === 'search_restaurants') {
          res.writeHead(200);
          res.end(
            JSON.stringify({ content: [{ type: 'text', text: JSON.stringify(STUB_RESTAURANTS) }] })
          );
        } else if (name === 'get_menu') {
          res.writeHead(200);
          res.end(JSON.stringify({ content: [{ type: 'text', text: JSON.stringify(STUB_MENU) }] }));
        } else if (name === 'add_to_cart' || name === 'place_order') {
          res.writeHead(200);
          res.end(
            JSON.stringify({
              content: [
                { type: 'text', text: JSON.stringify({ success: true, orderId: 'mock-zomato-1' }) },
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
  console.log(`Mock Zomato MCP listening on ${PORT}`);
});
