import { Psbt } from "bitcoinjs-lib";
import type { WalletNetwork } from "../types";
import { SatsConnector } from "./base";
type Response<T> = {
    jsonrpc: string;
    id: string;
    result: T;
};
type AddressResult = {
    symbol: "BTC" | "STX";
    type: "p2wpkh" | "p2tr";
    address: string;
    publicKey: string;
    tweakedPublicKey: string;
    derivationPath: string;
};
interface SignPsbtRequestParams {
    hex: string;
    allowedSighash?: any[];
    signAtIndex?: number | number[];
    network?: any;
    account?: number;
    broadcast?: boolean;
}
type RequestAddressesResult = {
    addresses: AddressResult[];
};
type RequestAddressesFn = (method: "getAddresses") => Promise<Response<RequestAddressesResult>>;
type SignMessageResult = {
    signature: string;
    address: string;
    message: string;
};
type SignMessageFn = (method: "signMessage", options: {
    message: string;
    paymentType?: "p2wpkh" | "p2tr";
    network?: any;
    account?: number;
}) => Promise<Response<SignMessageResult>>;
type SendBTCFn = (method: "sendTransfer", options: {
    address: string;
    amount: string;
    network: WalletNetwork;
}) => Promise<Response<{
    txid: string;
}>>;
type SignPsbtFn = (method: "signPsbt", options: SignPsbtRequestParams) => Promise<Response<{
    hex: string;
}>>;
declare global {
    interface Window {
        btc: {
            request: SignMessageFn & RequestAddressesFn & SendBTCFn & SignPsbtFn;
        };
    }
}
export declare class LeatherConnector extends SatsConnector {
    id: string;
    name: string;
    homepage: string;
    derivationPath: string | undefined;
    constructor(network: WalletNetwork);
    connect(): Promise<void>;
    isReady(): Promise<boolean>;
    signMessage(message: string): Promise<string>;
    sendToAddress(toAddress: string, amount: number): Promise<string>;
    signInput(inputIndex: number, psbt: Psbt): Promise<Psbt>;
}
export {};
