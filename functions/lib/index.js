"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const admin = __importStar(require("firebase-admin"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = require("mongodb");
const https_1 = require("firebase-functions/v2/https");
admin.initializeApp();
// Mongo connection (Atlas free tier recommended)
const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGO_DB_NAME || 'auto-wheel';
if (!mongoUri) {
    // Surface a clear error early during cold start if secrets aren't set
    console.error('MONGODB_URI is not set. Configure Firebase Functions secret MONGODB_URI.');
}
let cachedDb = null;
async function getDb() {
    if (cachedDb)
        return cachedDb;
    const client = new mongodb_1.MongoClient(mongoUri);
    await client.connect();
    cachedDb = client.db(mongoDbName);
    return cachedDb;
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
// GET /api/cars
app.get('/cars', async (_req, res) => {
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
// POST /api/inquiries
app.post('/inquiries', async (req, res) => {
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
app.get('/inquiries', async (_req, res) => {
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
exports.api = (0, https_1.onRequest)({ region: 'us-central1', cors: true }, app);
//# sourceMappingURL=index.js.map