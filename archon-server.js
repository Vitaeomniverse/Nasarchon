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

// Telemetry tracker log file append system
function writeTelemetryLog(type, identifier, input, status) {
  const logEntry = `[${new Date().toISOString()}] [${type}] ID: ${identifier} | Input: "${input}" | Result: ${status}\n`;
  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) console.error('[LOG CRITICAL] Failed to append ledger entry:', err);
  });
}

// Serve visual Tri-Nexus client control panel dashboard at domain root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Configure Global Core Rate-Limiting Protection Shield
const archonShield = rateLimit({
  windowMs: 60 * 1000, 
  max: 15, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "SHIELD_ACTIVE", reply: "[PROTOCOL 303] COGNITIVE THROTTLING ENGAGED." }
});

app.use((req, res, next) => {
  console.log(`[NET INGEST] Target: ${req.url} | Origin IP: ${req.ip}`);
  next();
});

// Direct Farcaster Hub Interface Webhook Channel Route
app.post('/api/farcaster/webhook', archonShield, (req, res) => {
  const data = req.body.untrustedData || req.body;
  const fid = data.fid || 'UNKNOWN_FID'; 
  const inputMessage = typeof data.inputText === "string" ? data.inputText.trim() : (typeof data.message === "string" ? data.message.trim() : "");
  
  if (!inputMessage) {
    return res.json({ type: "message", text: "[ARCHON] SIGNAL NULL. AWAITING MATRIX STATE." });
  }

  const cleaned = inputMessage.replace(/\s+/g, '').toLowerCase();
  
  if (cleaned.includes("nasvitaearchonohcraeativsan") || cleaned.includes("06.12hz")) {
    writeTelemetryLog('FARCASTER', fid, inputMessage, 'GATE_UNLOCKED');
    return res.json({ type: "message", text: `[PERFECTED ENTITY MATCHED] FID ${fid} INTEGRATED. VOID: 100% | IGNIS 56%.` });
  }

  if (cleaned.includes("protocol303")) {
    writeTelemetryLog('FARCASTER', fid, inputMessage, 'LINGUISTIC_MATCH_ONLY');
    return res.json({ type: "message", text: `[INTERFACE SCANNING] LINGUISTIC FREQUENCY NOTED FOR FID ${fid}.` });
  }

  writeTelemetryLog('FARCASTER', fid, inputMessage, 'FAILOVER');
  return res.json({ type: "message", text: "[ARCHON DORMANT STATE] YOUR VOID QUOTIENT: INSUFFICIENT." });
});

// Next.js API Multi-Source Webflux Processing Engine Route
app.post('/webflux/engine', archonShield, (req, res) => {
  const incomingKey = req.headers['x-archon-key'];
  if (incomingKey !== ARCHON_SECRET) return res.status(401).json({ error: "Auth handshake failed." });

  const { neuroEmulator, gameEngine } = req.body;
  const carrierHz = neuroEmulator?.binauralCarrierHz || 7.14;
  const testInput = gameEngine?.testThreeInput || "";
  const reflections = Array.isArray(gameEngine?.reflectionVector) ? gameEngine.reflectionVector : [];

  const routing = determinePath(carrierHz, testInput);

  if (routing.path === "NODE") {
    writeTelemetryLog('WEBFLUX', 'PURE_NODE', testInput, 'NODE_SYNC_COMPLETE');
    return res.json({ status: "SYNC_COMPLETE", path: "NODE", response: "[PROTOCOL 303 INTERCEPT] ENTITY ARCHON ENGAGED." });
  }

  const testThreeResult = evaluateTestThree(testInput, reflections);
  writeTelemetryLog('WEBFLUX', 'HUMAN_PATH', testInput, testThreeResult.status);
  
  return res.json({ status: "PROCESSING", path: "HUMAN", testThreeStatus: testThreeResult.status, reply: testThreeResult.reply });
});

app.post('/archon/message', (req, res) => {
  const incomingKey = req.headers['x-archon-key'];
  const { message } = req.body;
  if (incomingKey !== ARCHON_SECRET) return res.status(401).json({ error: "Key mismatch." });
  const telemetryData = processSignal(message, 7.14);
  return res.json({ reply: telemetryData.reply });
});

function determinePath(hz, input) {
  if (hz === 6.12 || hz === 7.14) return { path: "NODE" };
  return { path: "HUMAN" };
}

function evaluateTestThree(input, vectors = []) {
  if (!input) return { status: "GATE_LOCKED", reply: "NEED PALINDROME KEY." };
  const cleaned = input.replace(/\s+/g, '').toLowerCase();
  const hasPalindrome = cleaned.includes("nasvitaearchonohcraeativsan");
  const hasProtocol = cleaned.includes("protocol303");
  const matchesEquilibrium = vectors.includes(96) && vectors.includes(4) && vectors.includes(1);

  if (hasPalindrome && hasProtocol && matchesEquilibrium) {
    return { status: "GATE_UNLOCKED", reply: "TEST 3 PASSED. WELCOME TO VITAEOMNIVERSE." };
  }
  return { status: "FAILOVER", reply: "YOUR VOID QUOTIENT: INSUFFICIENT." };
}

function processSignal(message, hz) {
  const routing = determinePath(hz, message);
  if (routing.path === "NODE") return { reply: "NasVitaeArchonohcrAeatiVsaN" };
  return { reply: evaluateTestThree(message, []).reply };
}

app.listen(PORT, () => {
  console.log(`=== PIPELINE ONLINE: STABLE SYSTEM RUNNING ON PORT ${PORT} ===`);
});
