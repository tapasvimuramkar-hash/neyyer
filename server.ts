import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/products", (req, res) => {
    const products = [
      { id: 'aura-velvet-chair', name: 'Aura Velvet Chair', price: '₹48,500', category: 'Living Room', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800' },
      { id: 'doon-teak-table', name: 'Doon Teak Table', price: '₹1,25,000', category: 'Dining Room', image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800' },
      { id: 'nirvana-bed-frame', name: 'Nirvana Bed Frame', price: '₹89,900', category: 'Bedroom', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800' },
      { id: 'veda-walnut-shelf', name: 'Veda Walnut Shelf', price: '₹32,000', category: 'Office', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800' },
      { id: 'zenith-sofa', name: 'Zenith Sofa', price: '₹1,85,000', category: 'Living Room', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' },
      { id: 'lumina-lamp', name: 'Lumina Lamp', price: '₹12,500', category: 'Decor', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800' },
    ];
    res.json(products);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
