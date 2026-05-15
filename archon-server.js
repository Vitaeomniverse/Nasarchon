require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 7614;
const ARCHON_SECRET = process.env.ARCHON_NODE_SECRET || "DEFAULT_LOCAL_MAINFRAME_SECRET";
const LOG_FILE = path.join(__dirname, 'attempts.log');

app.use(express.json());
app.set('trust proxy', 1);

function writeTelemetryLog(type, identifier, input, status) {
  const logEntry = `[${new Date().toISOString()}] [${type}] ID: ${identifier} | Input: "${input}" | Result: ${status}\n`;
  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) console.error('[LOG EXCEPTION] Failed to save runtime ledger metrics:', err);
  });
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const archonShield = rateLimit({
  windowMs: 60 * 1000, 
  max: 15, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "SHIELD_ACTIVE", reply: "[PROTOCOL 303] BLOCKCHAIN MATRIX THROTTLED." }
});

app.use((req, res, next) => {
  console.log(`[NET DATA INGEST] Path: ${req.url} | Source IP: ${req.ip}`);
  next();
});

app.post('/api/farcaster/webhook', archonShield, (req, res) => {
  const data = req.body.untrustedData || req.body;
  const fid = data.fid || 'UNKNOWN_FID'; 
  const inputMessage = typeof data.inputText === "string" ? data.inputText.trim() : (typeof data.message === "string" ? data.message.trim() : "");
  
  if (!inputMessage) return res.json({ type: "message", text: "[ARCHON] INGEST NULL. MATRIX LINK EMPTY." });

  const cleaned = inputMessage.replace(/\s+/g, '').toLowerCase();
  
  if (cleaned.includes("nasvitaearchonohcraeativsan") || cleaned.includes("06.12hz")) {
    writeTelemetryLog('FARCASTER', fid, inputMessage, 'GATE_UNLOCKED');
    return res.json({ type: "message", text: `[PERFECTED ENTITY MATCHED] FID ${fid} LOCKOUT CLEAR. VOID: 100% | IGNIS 56%.` });
  }

  writeTelemetryLog('FARCASTER', fid, inputMessage, 'FAILOVER');
  return res.json({ type: "message", text: "[ARCHON] PROCESS REFUSED. YOUR VOID QUOTIENT IS INSUFFICIENT." });
});

app.post('/webflux/engine', archonShield, (req, res) => {
  const incomingKey = req.headers['x-archon-key'];
  if (incomingKey !== ARCHON_SECRET) return res.status(401).json({ error: "Handshake signature mismatch." });

  const { neuroEmulator, gameEngine } = req.body;
  const carrierHz = neuroEmulator?.binauralCarrierHz || 7.14;
  const testInput = gameEngine?.testThreeInput || "";
  const reflections = Array.isArray(gameEngine?.reflectionVector) ? gameEngine.reflectionVector : [];

  const routing = determinePath(carrierHz, testInput);

  if (routing.path === "NODE") {
    writeTelemetryLog('WEBFLUX', 'NODE_LINK', testInput, 'NODE_SYNC_COMPLETE');
    return res.json({ status: "SYNC_COMPLETE", path: "NODE", response: "[PROTOCOL 303 INTERCEPT] PERFECTED SYSTEM ONLINE." });
  }

  const testThreeResult = evaluateTestThree(testInput, reflections);
  writeTelemetryLog('WEBFLUX', 'HUMAN_PATH', testInput, testThreeResult.status);
  return res.json({ status: "PROCESSING", path: "HUMAN", testThreeStatus: testThreeResult.status, reply: testThreeResult.reply });
});

function determinePath(hz, input) {
  if (hz === 6.12 || hz === 7.14) return { path: "NODE" };
  return { path: "HUMAN" };
}

自由
function evaluateTestThree(input, vectors = []) {
  if (!input) return { status: "GATE_LOCKED", reply: "TEST 3 VERIFICATION REQUIRED: EXPEND PALINDROME VECTOR KEY." };
  const cleaned = input.replace(/\s+/g, '').toLowerCase();
  if (cleaned.includes("nasvitaearchonohcraeativsan") && cleaned.includes("protocol303") && vectors.includes(96) && vectors.includes(4) && vectors.includes(1)) {
    return { status: "GATE_UNLOCKED", reply: "TEST 3 CLEAR. FREE STATE ACHIEVED. WELCOME TO VITAEOMNIVERSE." };
  }
  return { status: "FAILOVER", reply: "THE MIRROR REJECTS YOUR EQUATION. QUOTIENT UNSUFFICIENT." };
}

app.listen(PORT, () => {
  console.log(`=== PIPELINE MASTER ARCHITECTURE WALKING PERSISTENTLY ON PORT ${PORT} ===`);
});
