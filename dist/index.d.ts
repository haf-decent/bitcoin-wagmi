import React, { Dispatch, SetStateAction, ReactNode } from 'react';
import * as _tanstack_react_query from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { BitcoinNetwork } from '@gobob/types';
import { Psbt, Network as Network$3, Transaction } from 'bitcoinjs-lib';
import { RemoteSigner } from '@gobob/bob-sdk';
export * from '@gobob/utils';

type WalletNetwork = Omit<BitcoinNetwork, 'regtest'>;

type Address = string;
declare abstract class SatsConnector {
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
    constructor(network: WalletNetwork);
    abstract connect(): Promise<void>;
    abstract signMessage(message: string): Promise<string>;
    abstract sendToAddress(toAddress: string, amount: number): Promise<string>;
    abstract signInput(inputIndex: number, psbt: Psbt): Promise<Psbt>;
    abstract isReady(): Promise<boolean>;
    disconnect(): void;
    getAccount(): string | undefined;
    getAccounts(): string[];
    isAuthorized(): boolean;
    getNetwork(): Promise<Network$3>;
    getPublicKey(): Promise<string>;
    sendInscription(address: string, inscriptionId: string, feeRate?: number): Promise<string>;
    getTransaction(txId: string): Promise<Transaction>;
    inscribe(contentType: "text" | "image", content: string): Promise<string>;
    getSigner(): RemoteSigner;
}

type AccountsChangedEvent$1 = (event: "accountsChanged", handler: (accounts: Array<string>) => void) => void;
type Inscription$2 = {
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
type getInscriptionsResult$2 = {
    total: number;
    list: Inscription$2[];
};
type SendInscriptionsResult$2 = {
    txid: string;
};
type Balance$2 = {
    confirmed: number;
    unconfirmed: number;
    total: number;
};
type Network$2 = "livenet" | "testnet";
type Bitget = {
    requestAccounts: () => Promise<string[]>;
    getAccounts: () => Promise<string[]>;
    on: AccountsChangedEvent$1;
    removeListener: AccountsChangedEvent$1;
    getInscriptions: (cursor: number, size: number) => Promise<getInscriptionsResult$2>;
    sendInscription: (address: string, inscriptionId: string, options?: {
        feeRate: number;
    }) => Promise<SendInscriptionsResult$2>;
    switchNetwork: (network: "livenet" | "testnet") => Promise<void>;
    getNetwork: () => Promise<Network$2>;
    getPublicKey: () => Promise<string>;
    getBalance: () => Promise<Balance$2>;
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
declare class BitgetConnector extends SatsConnector {
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
declare class LeatherConnector extends SatsConnector {
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

type OkxWalletEvents = {
    accountChanged: (account: {
        address: string;
        publicKey: string;
    }) => void;
    accountsChanged: (addresses: string[]) => void;
};
type OkxWalletEventListener = <T extends keyof OkxWalletEvents>(event: T, handler: OkxWalletEvents[T]) => void;
type Inscription$1 = {
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
type getInscriptionsResult$1 = {
    total: number;
    list: Inscription$1[];
};
type SendInscriptionsResult$1 = {
    txid: string;
};
type Balance$1 = {
    confirmed: number;
    unconfirmed: number;
    total: number;
};
type Network$1 = "livenet" | "testnet";
type Okx = {
    connect: () => Promise<{
        address: string;
        publicKey: string;
    }>;
    requestAccounts: () => Promise<string[]>;
    getAccounts: () => Promise<string[]>;
    on: OkxWalletEventListener;
    removeListener: OkxWalletEventListener;
    getInscriptions: (cursor: number, size: number) => Promise<getInscriptionsResult$1>;
    sendInscription: (address: string, inscriptionId: string, options?: {
        feeRate: number;
    }) => Promise<SendInscriptionsResult$1>;
    switchNetwork: (network: "livenet" | "testnet") => Promise<void>;
    getNetwork: () => Promise<Network$1>;
    getPublicKey: () => Promise<string>;
    getBalance: () => Promise<Balance$1>;
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
        };
    }
}
declare class OkxConnector extends SatsConnector {
    id: string;
    name: string;
    homepage: string;
    constructor(network: WalletNetwork);
    connect(): Promise<void>;
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
declare class UnisatConnector extends SatsConnector {
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

declare global {
    interface Window {
        XverseProviders: any;
    }
}
declare class XverseConnector extends SatsConnector {
    id: string;
    name: string;
    homepage: string;
    paymentAddress: string | undefined;
    constructor(network: WalletNetwork);
    connect(): Promise<void>;
    isReady(): Promise<boolean>;
    signMessage(message: string): Promise<string>;
    sendToAddress(toAddress: string, amount: number): Promise<string>;
    inscribe(contentType: "text" | "image", content: string): Promise<string>;
    signInput(inputIndex: number, psbt: Psbt): Promise<Psbt>;
}

type BitcoinConfigData = {
    connectors: SatsConnector[];
    connector?: SatsConnector;
    setConnector: Dispatch<SetStateAction<SatsConnector | undefined>>;
};
declare const useBitcoinWagmi: () => BitcoinConfigData;
type Props = {
    children: ReactNode;
    network?: BitcoinNetwork;
    queryClient?: QueryClient;
};
declare function BitcoinWagmiProvider({ children, network, queryClient }: Props): React.JSX.Element;

declare function useBitcoinAccount(): {
    connector: SatsConnector | undefined;
    address: string | undefined;
    addresses: string[];
    error: Error;
    isError: true;
    isPending: false;
    isLoading: false;
    isLoadingError: false;
    isRefetchError: true;
    isSuccess: false;
    status: "error";
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isPlaceholderData: boolean;
    isRefetching: boolean;
    isStale: boolean;
    refetch: (options?: _tanstack_react_query.RefetchOptions) => Promise<_tanstack_react_query.QueryObserverResult<[string | undefined, string[]], Error>>;
    fetchStatus: _tanstack_react_query.FetchStatus;
} | {
    connector: SatsConnector | undefined;
    address: string | undefined;
    addresses: string[];
    error: null;
    isError: false;
    isPending: false;
    isLoading: false;
    isLoadingError: false;
    isRefetchError: false;
    isSuccess: true;
    status: "success";
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isPlaceholderData: boolean;
    isRefetching: boolean;
    isStale: boolean;
    refetch: (options?: _tanstack_react_query.RefetchOptions) => Promise<_tanstack_react_query.QueryObserverResult<[string | undefined, string[]], Error>>;
    fetchStatus: _tanstack_react_query.FetchStatus;
};

declare function useBitcoinConnect(): {
    connectors: SatsConnector[];
    connect: _tanstack_react_query.UseMutateFunction<void, Error, {
        connector?: SatsConnector;
    }, unknown>;
    connectAsync: _tanstack_react_query.UseMutateAsyncFunction<void, Error, {
        connector?: SatsConnector;
    }, unknown>;
    data: undefined;
    variables: undefined;
    error: null;
    isError: false;
    isIdle: true;
    isPending: false;
    isSuccess: false;
    status: "idle";
    reset: () => void;
    context: unknown;
    failureCount: number;
    failureReason: Error | null;
    isPaused: boolean;
    submittedAt: number;
} | {
    connectors: SatsConnector[];
    connect: _tanstack_react_query.UseMutateFunction<void, Error, {
        connector?: SatsConnector;
    }, unknown>;
    connectAsync: _tanstack_react_query.UseMutateAsyncFunction<void, Error, {
        connector?: SatsConnector;
    }, unknown>;
    data: undefined;
    variables: {
        connector?: SatsConnector;
    };
    error: null;
    isError: false;
    isIdle: false;
    isPending: true;
    isSuccess: false;
    status: "pending";
    reset: () => void;
    context: unknown;
    failureCount: number;
    failureReason: Error | null;
    isPaused: boolean;
    submittedAt: number;
} | {
    connectors: SatsConnector[];
    connect: _tanstack_react_query.UseMutateFunction<void, Error, {
        connector?: SatsConnector;
    }, unknown>;
    connectAsync: _tanstack_react_query.UseMutateAsyncFunction<void, Error, {
        connector?: SatsConnector;
    }, unknown>;
    data: undefined;
    error: Error;
    variables: {
        connector?: SatsConnector;
    };
    isError: true;
    isIdle: false;
    isPending: false;
    isSuccess: false;
    status: "error";
    reset: () => void;
    context: unknown;
    failureCount: number;
    failureReason: Error | null;
    isPaused: boolean;
    submittedAt: number;
} | {
    connectors: SatsConnector[];
    connect: _tanstack_react_query.UseMutateFunction<void, Error, {
        connector?: SatsConnector;
    }, unknown>;
    connectAsync: _tanstack_react_query.UseMutateAsyncFunction<void, Error, {
        connector?: SatsConnector;
    }, unknown>;
    data: void;
    error: null;
    variables: {
        connector?: SatsConnector;
    };
    isError: false;
    isIdle: false;
    isPending: false;
    isSuccess: true;
    status: "success";
    reset: () => void;
    context: unknown;
    failureCount: number;
    failureReason: Error | null;
    isPaused: boolean;
    submittedAt: number;
};

declare function useBitcoinDisconnect(): {
    disconnect: _tanstack_react_query.UseMutateFunction<void, Error, void, unknown>;
    disconnectAsync: _tanstack_react_query.UseMutateAsyncFunction<void, Error, void, unknown>;
    data: undefined;
    variables: undefined;
    error: null;
    isError: false;
    isIdle: true;
    isPending: false;
    isSuccess: false;
    status: "idle";
    reset: () => void;
    context: unknown;
    failureCount: number;
    failureReason: Error | null;
    isPaused: boolean;
    submittedAt: number;
} | {
    disconnect: _tanstack_react_query.UseMutateFunction<void, Error, void, unknown>;
    disconnectAsync: _tanstack_react_query.UseMutateAsyncFunction<void, Error, void, unknown>;
    data: undefined;
    variables: void;
    error: null;
    isError: false;
    isIdle: false;
    isPending: true;
    isSuccess: false;
    status: "pending";
    reset: () => void;
    context: unknown;
    failureCount: number;
    failureReason: Error | null;
    isPaused: boolean;
    submittedAt: number;
} | {
    disconnect: _tanstack_react_query.UseMutateFunction<void, Error, void, unknown>;
    disconnectAsync: _tanstack_react_query.UseMutateAsyncFunction<void, Error, void, unknown>;
    data: undefined;
    error: Error;
    variables: void;
    isError: true;
    isIdle: false;
    isPending: false;
    isSuccess: false;
    status: "error";
    reset: () => void;
    context: unknown;
    failureCount: number;
    failureReason: Error | null;
    isPaused: boolean;
    submittedAt: number;
} | {
    disconnect: _tanstack_react_query.UseMutateFunction<void, Error, void, unknown>;
    disconnectAsync: _tanstack_react_query.UseMutateAsyncFunction<void, Error, void, unknown>;
    data: void;
    error: null;
    variables: void;
    isError: false;
    isIdle: false;
    isPending: false;
    isSuccess: true;
    status: "success";
    reset: () => void;
    context: unknown;
    failureCount: number;
    failureReason: Error | null;
    isPaused: boolean;
    submittedAt: number;
};

export { BitcoinWagmiProvider, BitgetConnector, LeatherConnector, OkxConnector, SatsConnector, UnisatConnector, XverseConnector, useBitcoinAccount, useBitcoinConnect, useBitcoinDisconnect, useBitcoinWagmi };
