#!/usr/bin/env node

/**
 * Deploy RentBy program to devnet using Solana web3.js
 * Usage: node deploy-program.js
 */

const fs = require('fs');
const path = require('path');
const {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  BPF_LOADER_PROGRAM_ID,
  BPF_LOADER_UPGRADABLE_PROGRAM_ID,
} = require('@solana/web3.js');

// Configuration
const PROGRAM_ID = new PublicKey('HmRuwkcYtKaCmx1uXycwCrjVcYBH5o9KGNd6ZF3S6Eq3');
const PROGRAM_PATH = path.join(__dirname, 'target/sbpf-solana-solana/release/rentby.so');
const DEPLOYER_KEYPAIR_PATH = '/tmp/deploy-keypair.json';
const RPC_URL = 'https://api.devnet.solana.com';

async function deployProgram() {
  console.log('🚀 Deploying RentBy Program to Devnet');
  console.log('=====================================\n');

  // Load deployer keypair
  console.log('📝 Loading deployer keypair...');
  let deployerKeypair;
  try {
    const secretKey = JSON.parse(fs.readFileSync(DEPLOYER_KEYPAIR_PATH, 'utf8'));
    deployerKeypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
    console.log('✅ Deployer loaded:', deployerKeypair.publicKey.toBase58());
  } catch (error) {
    console.error('❌ Failed to load deployer keypair:', error.message);
    process.exit(1);
  }

  // Load program binary
  console.log('\n📦 Loading program binary...');
  let programBuffer;
  try {
    const programData = fs.readFileSync(PROGRAM_PATH);
    programBuffer = Buffer.from(programData);
    console.log('✅ Program loaded, size:', programBuffer.length, 'bytes');
  } catch (error) {
    console.error('❌ Failed to load program:', error.message);
    console.error('   Make sure to run: anchor build');
    process.exit(1);
  }

  // Connect to devnet
  console.log('\n🔌 Connecting to devnet...');
  const connection = new Connection(RPC_URL, 'confirmed');
  console.log('✅ Connected to:', RPC_URL);

  // Check balance
  console.log('\n💰 Checking deployer balance...');
  try {
    const balance = await connection.getBalance(deployerKeypair.publicKey);
    const balanceSol = balance / LAMPORTS_PER_SOL;
    console.log('Balance:', balanceSol.toFixed(4), 'SOL');

    if (balance < 0.5 * LAMPORTS_PER_SOL) {
      console.log('⚠️  Low balance! Requesting airdrop...');
      const signature = await connection.requestAirdrop(
        deployerKeypair.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(signature);
      console.log('✅ Airdrop received!');
    }
  } catch (error) {
    console.error('❌ Failed to check balance:', error.message);
  }

  // Calculate program size
  console.log('\n📊 Program information:');
  const programSize = programBuffer.length;
  const rentExemption = await connection.getMinimumBalanceForRentExemption(programSize);
  const rentExemptionSol = rentExemption / LAMPORTS_PER_SOL;
  console.log('   Size:', programSize, 'bytes');
  console.log('   Rent exemption:', rentExemptionSol.toFixed(4), 'SOL');

  // Create program transaction
  console.log('\n🔨 Creating deployment transaction...');
  try {
    // For programs < 10KB, we can use the upgradable loader
    // Create program transaction with proper data layout
    const programData = programBuffer;
    const programLen = programData.length;

    console.log('   Creating program account...');
    const programTransaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: deployerKeypair.publicKey,
        newAccountPubkey: PROGRAM_ID,
        lamports: rentExemption,
        space: programLen,
        programId: BPF_LOADER_PROGRAM_ID,
      })
    );

    // Load program data
    const loadTransaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: deployerKeypair.publicKey,
        toPubkey: PROGRAM_ID,
        lamports: rentExemption,
      })
    );

    // Simple approach: write program data directly
    // Note: This is a simplified deployment. For production, use Anchor CLI
    console.log('   Loading program data...');

    // Since we can't easily use BPFLoader without the proper instruction data,
    // let's inform the user about the limitation

    console.error('\n❌ Direct program deployment requires Solana CLI or Anchor CLI');
    console.error('\nThe web3.js library doesn\'t include the BPFLoader program instructions.');
    console.error('To deploy, you need:');
    console.error('  1. Install Solana CLI: https://docs.solana.com/cli/install-solana-cli-tools');
    console.error('  2. Install Anchor CLI: https://www.anchor-lang.com/docs/installation');
    console.error('  3. Run: anchor deploy --provider.cluster devnet');
    console.error('\nAlternatively, use a CI/CD pipeline (GitHub Actions) with pre-installed tools.');
    console.error('\nProgram binary is ready at:');
    console.error('  ' + PROGRAM_PATH);
    console.error('\nProgram ID:');
    console.error('  ' + PROGRAM_ID.toBase58());
    process.exit(1);

  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    if (error.logs) {
      console.error('\nTransaction logs:');
      error.logs.forEach(log => console.error('  ', log));
    }
    process.exit(1);
  }
}

// Run deployment
deployProgram().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
