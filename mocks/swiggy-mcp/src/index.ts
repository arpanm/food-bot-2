/**
 * Mock Swiggy MCP server for testing.
 * Mimics Swiggy Food: restaurant search, menu, cart, order.
 */
import http from 'node:http';

const PORT = process.env.MOCK_SWIGGY_PORT || 3101;

const STUB_RESTAURANTS = {
  restaurants: [
    {
      id: 'r1',
      name: 'Mock South Indian Kitchen',
      cuisine: 'South Indian',
      rating: 4.5,
      deliveryTime: '25-35 mins',
    },
    {
      id: 'r2',
      name: 'Mock Biryani House',
      cuisine: 'North Indian',
      rating: 4.2,
      deliveryTime: '30-40 mins',
    },
  ],
};

const STUB_MENU = {
  items: [
    { id: 'd1', name: 'Masala Dosa', price: 89, available: true },
    { id: 'd2', name: 'Idli (4 pcs)', price: 59, available: true },
  ],
};

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  if (url.pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', mock: 'swiggy-mcp' }));
    return;
  }
  if (url.pathname === '/tools' && req.method === 'GET') {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        tools: [
          { name: 'search_restaurants', description: 'Search restaurants by cuisine or name' },
          { name: 'get_menu', description: 'Get restaurant menu' },
          { name: 'add_to_cart', description: 'Add item to cart' },
          { name: 'place_order', description: 'Place order (COD only in mock)' },
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
        if (name === 'search_restaurants') {
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
                { type: 'text', text: JSON.stringify({ success: true, message: 'Mock success' }) },
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
  console.log(`Mock Swiggy MCP listening on ${PORT}`);
});
