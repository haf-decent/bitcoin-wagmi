import { Psbt } from "bitcoinjs-lib";
import { WalletNetwork } from "../types";
import { SatsConnector } from "./base";
type AccountsChangedEvent = (event: "accountsChanged", handler: (accounts: Array<string>) => void) => void;
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
type Network = "livenet" | "testnet";
type Unisat = {
    requestAccounts: () => Promise<string[]>;
    getAccounts: () => Promise<string[]>;
    on: AccountsChangedEvent;
    removeListener: AccountsChangedEvent;
    getInscriptions: (cursor: number, size: number) => Promise<getInscriptionsResult>;
    sendInscription: (address: string, inscriptionId: string, options?: {
        feeRate: number;
    }) => Promise<SendInscriptionsResult>;
    switchNetwork: (network: "livenet" | "testnet") => Promise<void>;
    getNetwork: () => Promise<Network>;
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
        unisat: Unisat;
    }
}
export declare class UnisatConnector extends SatsConnector {
    id: string;
    name: string;
    homepage: string;
    constructor(network: WalletNetwork);
    connect(): Promise<void>;
    disconnect(): void;
    changeAccount([account]: string[]): Promise<void>;
    isReady(): Promise<boolean>;
    signMessage(message: string): Promise<string>;
    sendToAddress(toAddress: string, amount: number): Promise<string>;
    signInput(inputIndex: number, psbt: Psbt): Promise<Psbt>;
    sendInscription(address: string, inscriptionId: string, feeRate?: number): Promise<string>;
}
export {};
