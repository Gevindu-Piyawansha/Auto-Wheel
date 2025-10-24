"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = require("mongodb");
// Mongo connection (Atlas free tier)
const mongoUri = process.env.MONGODB_URI;
const mongoDbName = 'auto-wheel';
if (!mongoUri) {
    console.error('MONGODB_URI environment variable is not set!');
    process.exit(1);
}
let cachedDb = null;
async function getDb() {
    if (cachedDb)
        return cachedDb;
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI configured:', !!mongoUri);
    console.log('Database name:', mongoDbName);
    try {
        const client = new mongodb_1.MongoClient(mongoUri);
        await client.connect();
        console.log('MongoDB connected successfully');
        cachedDb = client.db(mongoDbName);
        return cachedDb;
    }
    catch (error) {
        console.error('MongoDB connection failed:', error);
        throw error;
    }
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
// Health check
app.get('/', (_req, res) => {
    return res.json({ status: 'ok', message: 'Auto-Wheel API is running' });
});
// Health check with DB
app.get('/health', async (_req, res) => {
    try {
        const db = await getDb();
        await db.admin().ping();
        return res.json({
            status: 'ok',
            message: 'Auto-Wheel API is running',
            database: 'connected',
            mongoUri: mongoUri ? 'configured' : 'missing'
        });
    }
    catch (err) {
        console.error('Health check failed:', err);
        return res.status(503).json({
            status: 'error',
            message: 'Database connection failed',
            error: err instanceof Error ? err.message : 'Unknown error'
        });
    }
});
// GET /api/cars
app.get('/api/cars', async (_req, res) => {
    try {
        const db = await getDb();
        const cars = await db.collection('Cars').find({}).toArray();
        return res.json(cars);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch cars' });
    }
});
// POST /api/cars - Create new car
app.post('/api/cars', async (req, res) => {
    try {
        const car = req.body;
        if (!car.make || !car.model || !car.year || !car.price) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const db = await getDb();
        const result = await db.collection('Cars').insertOne({
            ...car,
            createdAt: new Date()
        });
        return res.status(201).json({ id: result.insertedId, ...car });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create car' });
    }
});
// PUT /api/cars/:id - Update car
app.put('/api/cars/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const car = req.body;
        const db = await getDb();
        const result = await db.collection('Cars').updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { ...car, updatedAt: new Date() } });
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }
        return res.json({ id, ...car });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update car' });
    }
});
// DELETE /api/cars/:id - Delete car
app.delete('/api/cars/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDb();
        const result = await db.collection('Cars').deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }
        return res.status(204).send();
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete car' });
    }
});
// POST /api/inquiries
app.post('/api/inquiries', async (req, res) => {
    try {
        const payload = req.body || {};
        if (!payload.customerName || !payload.customerEmail || !payload.carId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const db = await getDb();
        payload.createdAt = new Date();
        await db.collection('Inquiries').insertOne(payload);
        return res.status(201).json({ ok: true });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create inquiry' });
    }
});
// GET /api/inquiries (simple admin list; add auth later)
app.get('/api/inquiries', async (_req, res) => {
    try {
        const db = await getDb();
        const items = await db.collection('Inquiries').find({}).sort({ createdAt: -1 }).toArray();
        return res.json(items);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Auto-Wheel API listening on port ${PORT}`);
});
//# sourceMappingURL=server.js.map