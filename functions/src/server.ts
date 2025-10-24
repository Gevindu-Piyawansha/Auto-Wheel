import express, { Request, Response } from 'express';
import cors from 'cors';
import { MongoClient, Db } from 'mongodb';

// Mongo connection (Atlas free tier)
const mongoUri = process.env.MONGODB_URI as string;
const mongoDbName = 'auto-wheel';

if (!mongoUri) {
  console.error('MONGODB_URI environment variable is not set!');
  process.exit(1);
}

let cachedDb: Db | null = null;
async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb;
  const client = new MongoClient(mongoUri);
  await client.connect();
  cachedDb = client.db(mongoDbName);
  return cachedDb;
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Health check
app.get('/', (_req: Request, res: Response) => {
  return res.json({ status: 'ok', message: 'Auto-Wheel API is running' });
});

// GET /api/cars
app.get('/api/cars', async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
    const cars = await db.collection('Cars').find({}).toArray();
    return res.json(cars);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

// POST /api/inquiries
app.post('/api/inquiries', async (req: Request, res: Response) => {
  try {
    const payload = req.body || {};
    if (!payload.customerName || !payload.customerEmail || !payload.carId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const db = await getDb();
    payload.createdAt = new Date();
    await db.collection('Inquiries').insertOne(payload);
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create inquiry' });
  }
});

// GET /api/inquiries (simple admin list; add auth later)
app.get('/api/inquiries', async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
    const items = await db.collection('Inquiries').find({}).sort({ createdAt: -1 }).toArray();
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Auto-Wheel API listening on port ${PORT}`);
});
