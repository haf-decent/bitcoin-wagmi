import { Psbt } from "bitcoinjs-lib";
import type { WalletNetwork } from "../types";
import { SatsConnector } from "./base";
type BitgetNetwork = "livenet" | "testnet" | "signet";
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
type Bitget = {
    requestAccounts: () => Promise<string[]>;
    getAccounts: () => Promise<string[]>;
    on: AccountsChangedEvent;
    removeListener: AccountsChangedEvent;
    getInscriptions: (cursor: number, size: number) => Promise<getInscriptionsResult>;
    sendInscription: (address: string, inscriptionId: string, options?: {
        feeRate: number;
    }) => Promise<SendInscriptionsResult>;
    switchNetwork: (network: BitgetNetwork) => Promise<void>;
    getNetwork: () => Promise<BitgetNetwork>;
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
        bitkeep: {
            unisat: Bitget;
        };
    }
}
export declare class BitgetConnector extends SatsConnector {
    id: string;
    name: string;
    homepage: string;
    constructor(network: WalletNetwork);
    connect(): Promise<void>;
    switchNetwork(toNetwork: WalletNetwork): Promise<void>;
    disconnect(): void;
    changeAccount(accounts: string[]): Promise<void>;
    isReady(): Promise<boolean>;
    signMessage(message: string): Promise<string>;
    sendToAddress(toAddress: string, amount: number): Promise<string>;
    signInput(inputIndex: number, psbt: Psbt): Promise<Psbt>;
    sendInscription(address: string, inscriptionId: string, feeRate?: number): Promise<string>;
}
export {};
