import { Psbt } from "bitcoinjs-lib";
import type { WalletNetwork } from "../types";
import { SatsConnector } from "./base";
type OkxNetwork = "livenet" | "testnet" | "signet";
type OkxWalletEvents = {
    accountChanged: (account: {
        address: string;
        publicKey: string;
    }) => void;
    accountsChanged: (addresses: string[]) => void;
};
type OkxWalletEventListener = <T extends keyof OkxWalletEvents>(event: T, handler: OkxWalletEvents[T]) => void;
type Inscription = {
    inscriptionId: string;
    inscriptionNumber: string;
    address: string;
    outputValue: string;
    content: string;
    contentLength: string;
    contentType: string;
    preview: string;
    timestamp: number;
    offset: number;
    genesisTransaction: string;
    location: string;
};
type getInscriptionsResult = {
    total: number;
    list: Inscription[];
};
type SendInscriptionsResult = {
    txid: string;
};
type Balance = {
    confirmed: number;
    unconfirmed: number;
    total: number;
};
type Okx = {
    connect: () => Promise<{
        address: string;
        publicKey: string;
    }>;
    requestAccounts: () => Promise<string[]>;
    getAccounts: () => Promise<string[]>;
    on: OkxWalletEventListener;
    removeListener: OkxWalletEventListener;
    getInscriptions: (cursor: number, size: number) => Promise<getInscriptionsResult>;
    sendInscription: (address: string, inscriptionId: string, options?: {
        feeRate: number;
    }) => Promise<SendInscriptionsResult>;
    switchNetwork: (network: OkxNetwork) => Promise<void>;
    getNetwork: () => Promise<OkxNetwork>;
    getPublicKey: () => Promise<string>;
    getBalance: () => Promise<Balance>;
    signMessage: (message: string) => Promise<string>;
    sendBitcoin: (address: string, atomicAmount: number, options?: {
        feeRate: number;
    }) => Promise<string>;
    signPsbt: (psbtHex: string, options?: {
        autoFinalized?: boolean;
        toSignInputs: {
            index: number;
            address?: string;
            publicKey?: string;
            sighashTypes?: number[];
            disableTweakSigner?: boolean;
        }[];
    }) => Promise<string>;
};
declare global {
    interface Window {
        okxwallet: {
            bitcoin: Okx;
            bitcoinTestnet: Pick<Okx, "connect" | "getAccounts" | "signMessage" | "signPsbt">;
            bitcoinSignet: Pick<Okx, "connect" | "getAccounts" | "signMessage" | "signPsbt">;
        };
    }
}
export declare class OkxConnector extends SatsConnector {
    id: string;
    name: string;
    homepage: string;
    key: "bitcoin" | "bitcoinTestnet" | "bitcoinSignet";
    constructor(network: WalletNetwork);
    connect(): Promise<void>;
    switchNetwork(toNetwork: WalletNetwork): Promise<void>;
    disconnect(): void;
    changeAccount(account: {
        address: string;
        publicKey: string;
    }): Promise<void>;
    isReady(): Promise<boolean>;
    signMessage(message: string): Promise<string>;
    sendToAddress(toAddress: string, amount: number): Promise<string>;
    signInput(inputIndex: number, psbt: Psbt): Promise<Psbt>;
    sendInscription(address: string, inscriptionId: string, feeRate?: number): Promise<string>;
}
export {};
