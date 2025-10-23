import * as admin from 'firebase-admin';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { MongoClient, Db } from 'mongodb';
import { onRequest } from 'firebase-functions/v2/https';

admin.initializeApp();

// Mongo connection (Atlas free tier recommended)
const mongoUri = process.env.MONGODB_URI as string;
const mongoDbName = (process.env.MONGO_DB_NAME as string) || 'auto-wheel';

if (!mongoUri) {
  // Surface a clear error early during cold start if secrets aren't set
  console.error('MONGODB_URI is not set. Configure Firebase Functions secret MONGODB_URI.');
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

// GET /api/cars
app.get('/cars', async (_req: Request, res: Response) => {
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
app.post('/inquiries', async (req: Request, res: Response) => {
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
app.get('/inquiries', async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
    const items = await db.collection('Inquiries').find({}).sort({ createdAt: -1 }).toArray();
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

export const api = onRequest({ region: 'us-central1', cors: true }, app as any);
