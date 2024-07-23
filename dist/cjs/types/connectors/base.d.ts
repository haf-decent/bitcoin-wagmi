import { type Network as LibNetwork, Psbt, Transaction } from "bitcoinjs-lib";
import { type RemoteSigner } from "@gobob/bob-sdk";
import type { WalletNetwork } from "../types";
type Address = string;
export declare abstract class SatsConnector {
    /** Unique connector id */
    abstract readonly id: string;
    /** Connector name */
    abstract readonly name: string;
    /** Extension or Snap homepage */
    abstract homepage: string;
    /** Whether connector is usable */
    ready: boolean;
    address: Address | undefined;
    publicKey: string | undefined;
    network: WalletNetwork;
    constructor(network: WalletNetwork);
    abstract connect(): Promise<void>;
    abstract signMessage(message: string): Promise<string>;
    abstract sendToAddress(toAddress: string, amount: number): Promise<string>;
    abstract signInput(inputIndex: number, psbt: Psbt): Promise<Psbt>;
    abstract isReady(): Promise<boolean>;
    disconnect(): void;
    getAccount(): string | undefined;
    isAuthorized(): boolean;
    getNetwork(): Promise<LibNetwork>;
    getPublicKey(): Promise<string>;
    sendInscription(address: string, inscriptionId: string, feeRate?: number): Promise<string>;
    getTransaction(txId: string): Promise<Transaction>;
    inscribe(contentType: "text" | "image", content: string): Promise<string>;
    getSigner(): RemoteSigner;
}
export {};
