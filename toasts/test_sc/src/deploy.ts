import * as dotenv from 'dotenv';
import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { deploySC, WalletClient, ISCData } from '@massalabs/massa-sc-deployer';
import { Args, fromMAS } from '@massalabs/massa-web3';
import { debug } from 'console';

// Load .env file content into process.env
dotenv.config();

// Get the URL for a public JSON RPC API endpoint from the environment variables
const publicApi = process.env.JSON_RPC_URL_PUBLIC;
if (!publicApi) {
  throw new Error('Missing JSON_RPC_URL_PUBLIC in .env file');
}

// Get the secret key for the wallet to be used for the deployment from the environment variables
const secretKey = process.env.WALLET_SECRET_KEY;
if (!secretKey) {
  throw new Error('Missing WALLET_SECRET_KEY in .env file');
}

// Create an account using the private key
const deployerAccount = await WalletClient.getAccountFromSecretKey(secretKey);

// Obtain the current file name and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

/**
 * Deploy one or more smart contracts.
 *
 * @remarks
 * Multiple smart contracts can be deployed by adding more objects to the array.
 * In this example one contract located at 'build/main.wasm' is deployed with
 * 0.1 MASSA and an argument 'Test'.
 *
 * After all deployments, it terminates the process.
 */
(async () => {
  const dir = 'build';

  // get the list of '.proto' files in the directory
  function getProtoFiles(protoDir: string): string[] {
    const dirPath = path.join(__dirname, protoDir);
    const files = readdirSync(dirPath);
    const protoFiles = files
      .filter((file) => path.extname(file) === '.proto')
      .map((file) => path.join(dirPath, file));

    return protoFiles;
  }

  await deploySC(
    publicApi, // JSON RPC URL
    deployerAccount, // account deploying the smart contract(s)
    [
      {
        data: readFileSync(path.join(__dirname, dir, 'main.wasm')), // smart contract bytecode
        coins: fromMAS(0.1), // coins for deployment
        args: new Args().addString('Test'), // arguments for deployment
        protoPaths: getProtoFiles(dir),
      } as ISCData,
      // Additional smart contracts can be added here for deployment
    ],
    0n, // fees for deployment
    4_200_000_000n, // max gas for deployment
    true, // if true, waits for the first event before returning
  );
  process.exit(0); // terminate the process after deployment(s)
})();
