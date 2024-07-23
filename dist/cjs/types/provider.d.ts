import React, { type Dispatch, type ReactNode, type SetStateAction } from "react";
import { QueryClient } from "@tanstack/react-query";
import type { BitcoinNetwork } from "@gobob/types";
import { SatsConnector } from "./connectors";
type BitcoinConfigData = {
    connectors: SatsConnector[];
    connector?: SatsConnector;
    setConnector: Dispatch<SetStateAction<SatsConnector | undefined>>;
};
export declare const useBitcoinWagmi: () => BitcoinConfigData;
type BitcoinWagmiConfigProps = {
    children: ReactNode;
    network?: BitcoinNetwork;
    queryClient?: QueryClient;
};
export declare function BitcoinWagmiConfig({ children, network, queryClient }: BitcoinWagmiConfigProps): React.JSX.Element;
export {};
