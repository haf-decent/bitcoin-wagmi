import { Psbt } from "bitcoinjs-lib";
import type { WalletNetwork } from "../types";
import { SatsConnector } from "./base";
declare global {
    interface Window {
        XverseProviders: any;
    }
}
export declare class XverseConnector extends SatsConnector {
    id: string;
    name: string;
    homepage: string;
    paymentAddress: string | undefined;
    constructor(network: WalletNetwork);
    connect(): Promise<void>;
    switchNetwork(toNetwork: WalletNetwork): Promise<void>;
    isReady(): Promise<boolean>;
    signMessage(message: string): Promise<string>;
    sendToAddress(toAddress: string, amount: number): Promise<string>;
    inscribe(contentType: "text" | "image", content: string): Promise<string>;
    signInput(inputIndex: number, psbt: Psbt): Promise<Psbt>;
}
