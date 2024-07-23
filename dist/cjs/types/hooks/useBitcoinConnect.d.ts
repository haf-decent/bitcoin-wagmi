import { SatsConnector } from "../connectors";
export declare function useBitcoinConnect(): {
    connectors: SatsConnector[];
    connect: import("@tanstack/react-query").UseMutateFunction<void, Error, {
        connector?: SatsConnector;
    }, unknown>;
    connectAsync: import("@tanstack/react-query").UseMutateAsyncFunction<void, Error, {
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
    connect: import("@tanstack/react-query").UseMutateFunction<void, Error, {
        connector?: SatsConnector;
    }, unknown>;
    connectAsync: import("@tanstack/react-query").UseMutateAsyncFunction<void, Error, {
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
    connect: import("@tanstack/react-query").UseMutateFunction<void, Error, {
        connector?: SatsConnector;
    }, unknown>;
    connectAsync: import("@tanstack/react-query").UseMutateAsyncFunction<void, Error, {
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
    connect: import("@tanstack/react-query").UseMutateFunction<void, Error, {
        connector?: SatsConnector;
    }, unknown>;
    connectAsync: import("@tanstack/react-query").UseMutateAsyncFunction<void, Error, {
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
