import React, { type Dispatch, type ReactNode, type SetStateAction } from "react";
import { QueryClient } from "@tanstack/react-query";
import type { WalletNetwork } from "./types";
import { SatsConnector } from "./connectors";
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
export declare const useBitcoinWagmi: () => BitcoinConfigData;
type Props = {
    children: ReactNode;
    initialNetwork?: WalletNetwork;
    queryClient?: QueryClient;
};
export declare function BitcoinWagmiProvider({ children, initialNetwork, queryClient }: Props): React.JSX.Element;
export {};
