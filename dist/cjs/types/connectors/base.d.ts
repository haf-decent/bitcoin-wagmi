import { Psbt } from "bitcoinjs-lib";
import type { WalletNetwork } from "../types";
type Address = string;
type Events = {
    accountChanged: ((account: string, accounts: string[], publicKey: string) => void)[];
    networkChanged: ((network: WalletNetwork) => void)[];
};
export declare abstract class SatsConnector {
    /** Unique connector id */
    abstract readonly id: string;
    /** Connector name */
    abstract readonly name: string;
    /** Extension or Snap homepage */
    abstract homepage: string;
    /** Whether connector is usable */
    ready: boolean;
    accounts: Address[];
    address: Address | undefined;
    publicKey: string | undefined;
    network: WalletNetwork;
    listeners: Events;
    constructor(network: WalletNetwork);
    abstract isReady(): Promise<boolean>;
    abstract connect(): Promise<void>;
    getAccount(): string | undefined;
    getAccounts(): string[];
    isAuthorized(): boolean;
    on<T extends keyof Events>(event: T, handler: Events[T][0]): () => void;
    switchNetwork(toNetwork: WalletNetwork): Promise<void>;
    abstract signMessage(message: string): Promise<string>;
    abstract sendToAddress(toAddress: string, amount: number): Promise<string>;
    abstract signInput(inputIndex: number, psbt: Psbt): Promise<Psbt>;
    abstract sendInscription(address: string, inscriptionId: string, feeRate?: number): Promise<string>;
    disconnect(): void;
    getNetwork(): WalletNetwork;
    getPublicKey(): Promise<string>;
    getSigner(): SatsConnector;
}
export {};
