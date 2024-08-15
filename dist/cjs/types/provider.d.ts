import React, { type Dispatch, type ReactNode, type SetStateAction } from "react";
import { QueryClient } from "@tanstack/react-query";
import type { WalletNetwork } from "./types";
import { SatsConnector } from "./connectors";
type BitcoinConfigData = {
    connectors: SatsConnector[];
    connector?: SatsConnector;
    setConnector: Dispatch<SetStateAction<SatsConnector | undefined>>;
    network: WalletNetwork;
    setNetwork: Dispatch<SetStateAction<WalletNetwork>>;
};
export declare const useBitcoinWagmi: () => BitcoinConfigData;
type Props = {
    children: ReactNode;
    initialNetwork?: WalletNetwork;
    queryClient?: QueryClient;
};
export declare function BitcoinWagmiProvider({ children, initialNetwork, queryClient }: Props): React.JSX.Element;
export {};
