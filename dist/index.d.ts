import React, { Dispatch, SetStateAction, ReactNode } from 'react';
import * as _tanstack_react_query from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { Psbt } from 'bitcoinjs-lib';

type WalletNetwork = "mainnet" | "testnet" | "signet";

type Address = string;
type Events$1 = {
    accountChanged: ((account: string, accounts: string[], publicKey: string) => void)[];
    networkChanged: ((network: WalletNetwork) => void)[];
};
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
    listeners: Events$1;
    constructor(network: WalletNetwork);
    abstract isReady(): Promise<boolean>;
    abstract connect(): Promise<void>;
    getAccount(): string | undefined;
    getAccounts(): string[];
    isAuthorized(): boolean;
    on<T extends keyof Events$1>(event: T, handler: Events$1[T][0]): () => void;
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

type BitgetNetwork = "livenet" | "testnet" | "signet";
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
type Bitget = {
    requestAccounts: () => Promise<string[]>;
    getAccounts: () => Promise<string[]>;
    on: AccountsChangedEvent$1;
    removeListener: AccountsChangedEvent$1;
    getInscriptions: (cursor: number, size: number) => Promise<getInscriptionsResult$2>;
    sendInscription: (address: string, inscriptionId: string, options?: {
        feeRate: number;
    }) => Promise<SendInscriptionsResult$2>;
    switchNetwork: (network: BitgetNetwork) => Promise<void>;
    getNetwork: () => Promise<BitgetNetwork>;
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
    switchNetwork(toNetwork: WalletNetwork): Promise<void>;
    disconnect(): void;
    changeAccount(accounts: string[]): Promise<void>;
    isReady(): Promise<boolean>;
    signMessage(message: string): Promise<string>;
    sendToAddress(toAddress: string, amount: number): Promise<string>;
    signInput(inputIndex: number, psbt: Psbt): Promise<Psbt>;
    sendInscription(address: string, inscriptionId: string, feeRate?: number): Promise<string>;
}

type OkxNetwork = "livenet" | "testnet" | "signet";
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
    switchNetwork: (network: OkxNetwork) => Promise<void>;
    getNetwork: () => Promise<OkxNetwork>;
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
            bitcoinTestnet: Pick<Okx, "connect" | "getAccounts" | "signMessage" | "signPsbt">;
            bitcoinSignet: Pick<Okx, "connect" | "getAccounts" | "signMessage" | "signPsbt">;
        };
    }
}
declare class OkxConnector extends SatsConnector {
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

type UnisatNetwork = "livenet" | "testnet" | "signet";
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
type Unisat = {
    requestAccounts: () => Promise<string[]>;
    getAccounts: () => Promise<string[]>;
    on: AccountsChangedEvent;
    removeListener: AccountsChangedEvent;
    getInscriptions: (cursor: number, size: number) => Promise<getInscriptionsResult>;
    sendInscription: (address: string, inscriptionId: string, options?: {
        feeRate: number;
    }) => Promise<SendInscriptionsResult>;
    switchNetwork: (network: UnisatNetwork) => Promise<void>;
    getNetwork: () => Promise<UnisatNetwork>;
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
    switchNetwork(toNetwork: WalletNetwork): Promise<void>;
    disconnect(): void;
    changeAccount(accounts: string[]): Promise<void>;
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
    switchNetwork(toNetwork: WalletNetwork): Promise<void>;
    isReady(): Promise<boolean>;
    signMessage(message: string): Promise<string>;
    sendToAddress(toAddress: string, amount: number): Promise<string>;
    inscribe(contentType: "text" | "image", content: string): Promise<string>;
    signInput(inputIndex: number, psbt: Psbt): Promise<Psbt>;
    sendInscription(): Promise<string>;
}

type Events = {
    networkChanged: ((toNetwork: WalletNetwork) => void)[];
};
type BitcoinConfigData = {
    connectors: SatsConnector[];
    connector?: SatsConnector;
    setConnector: Dispatch<SetStateAction<SatsConnector | undefined>>;
    network: WalletNetwork;
    switchNetwork: (toNetwork: WalletNetwork) => Promise<void>;
    on: <T extends keyof Events>(event: T, handler: Events[T][0]) => (() => void);
};
declare const useBitcoinWagmi: () => BitcoinConfigData;
type Props = {
    children: ReactNode;
    initialNetwork?: WalletNetwork;
    queryClient?: QueryClient;
};
declare function BitcoinWagmiProvider({ children, initialNetwork, queryClient }: Props): React.JSX.Element;

declare function useBitcoinAccount(): {
    refetch: (options?: _tanstack_react_query.RefetchOptions) => Promise<_tanstack_react_query.QueryObserverResult<[string | undefined, string[]], Error>>;
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
    isPlaceholderData: false;
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
    isRefetching: boolean;
    isStale: boolean;
    fetchStatus: _tanstack_react_query.FetchStatus;
    promise: Promise<[string | undefined, string[]]>;
} | {
    refetch: (options?: _tanstack_react_query.RefetchOptions) => Promise<_tanstack_react_query.QueryObserverResult<[string | undefined, string[]], Error>>;
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
    isPlaceholderData: false;
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
    isRefetching: boolean;
    isStale: boolean;
    fetchStatus: _tanstack_react_query.FetchStatus;
    promise: Promise<[string | undefined, string[]]>;
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

declare function useBitcoinNetwork(): {
    network: WalletNetwork;
    switchNetwork: _tanstack_react_query.UseMutateFunction<void, Error, WalletNetwork, unknown>;
    switchNetworkAsync: _tanstack_react_query.UseMutateAsyncFunction<void, Error, WalletNetwork, unknown>;
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
    network: WalletNetwork;
    switchNetwork: _tanstack_react_query.UseMutateFunction<void, Error, WalletNetwork, unknown>;
    switchNetworkAsync: _tanstack_react_query.UseMutateAsyncFunction<void, Error, WalletNetwork, unknown>;
    data: undefined;
    variables: WalletNetwork;
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
    network: WalletNetwork;
    switchNetwork: _tanstack_react_query.UseMutateFunction<void, Error, WalletNetwork, unknown>;
    switchNetworkAsync: _tanstack_react_query.UseMutateAsyncFunction<void, Error, WalletNetwork, unknown>;
    data: undefined;
    error: Error;
    variables: WalletNetwork;
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
    network: WalletNetwork;
    switchNetwork: _tanstack_react_query.UseMutateFunction<void, Error, WalletNetwork, unknown>;
    switchNetworkAsync: _tanstack_react_query.UseMutateAsyncFunction<void, Error, WalletNetwork, unknown>;
    data: void;
    error: null;
    variables: WalletNetwork;
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

export { BitcoinWagmiProvider, BitgetConnector, OkxConnector, SatsConnector, UnisatConnector, XverseConnector, useBitcoinAccount, useBitcoinConnect, useBitcoinDisconnect, useBitcoinNetwork, useBitcoinWagmi };
export type { WalletNetwork };
