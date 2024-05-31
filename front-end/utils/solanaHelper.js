import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import IDL from "../idl.json"
// Define your program ID and IDL
const PROGRAM_ID = new PublicKey("6pAhjEV2iy9wJmyybVMqaVAi3q6K9sxxiZ5P23XSz188");



// Initialize the connection and provider

const getProvider = async() => {
    const network = "https://api.devnet.solana.com"; // Devnet endpoint
    const connection = new Connection(network, "processed");
    const wallet = {
        publicKey: new PublicKey(),
        signTransaction: async (tx) => {
            return connection.sendTransaction(tx, [wallet]);
        },
        signAllTransactions: async (transactions) => {
            return Promise.all(transactions.map((tx) => wallet.signTransaction(tx)));
        }
    };
    return new anchor.Provider(connection, wallet, anchor.AnchorProvider.defaultOptions());
};

const getProgram = async (publicKey) => {
    const provider = await getProvider(publicKey);
    return new anchor.Program(IDL, PROGRAM_ID, provider);
};


export { getProvider, getProgram };
