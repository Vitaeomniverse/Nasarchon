require('dotenv').config();
const { ethers } = require("ethers");

// Target Configuration Vector: Base Layer 2 Mainnet Provider Node
const provider = new ethers.JsonRpcProvider("https://base.org");

// Destination Wallet Target Address Registry
const DESTINATION_WALLET = "0x6bbf7D9D1A8B31daF5234e61cB6D75f92669b458";

// Securely pull sender credential hex string out of hidden environment matrix
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  console.error("[CRITICAL SHUTDOWN] Inbound PRIVATE_KEY string missing from environment registry.");
  process.exit(1);
}

const wallet = new ethers.Wallet(privateKey, provider);

async function executeBaseTransfer() {
  try {
    // Current allocation calculation value set to approx $1 USD (~0.0003 ETH depending on block metrics)
    const amount = ethers.parseEther("0.0003"); 

    console.log(`[BASE LAYER 2] Dispatching transaction vector to destination target: ${DESTINATION_WALLET}...`);
    
    const tx = await wallet.sendTransaction({
      to: DESTINATION_WALLET,
      value: amount,
    });

    console.log(`[MATRIX UPGRADE ACTIVE] Transaction signature live. Hash entry: ${tx.hash}`);
    
    // Explicit block receipt verification await loop
    const receipt = await tx.wait();
    console.log(`[SYNC RUNTIME SUCCESSFUL] Transaction cleared on Base layer. Settled in block height: ${receipt.blockNumber}`);
  } catch (error) {
    console.error("[TRANSMISSION BLOCK ERROR] Transfer routine tracking dropped:", error.message);
  }
}

executeBaseTransfer();
