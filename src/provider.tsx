import React, {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	createContext,
	useContext,
	useEffect,
	useState
} from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import type { WalletNetwork } from "./types"
import {
	BitgetConnector,
	LeatherConnector,
	OkxConnector,
	SatsConnector,
	UnisatConnector,
	XverseConnector
} from "./connectors"

type BitcoinConfigData = {
	connectors: SatsConnector[],
	connector?: SatsConnector,
	setConnector: Dispatch<SetStateAction<SatsConnector | undefined>>,
	network: WalletNetwork,
	setNetwork: Dispatch<SetStateAction<WalletNetwork>>
}

const defaultState: BitcoinConfigData = {
	connectors: [],
	connector: undefined,
	setConnector: () => {},
	network: "mainnet",
	setNetwork: () => {}
}
const BitcoinWagmiContext = createContext<BitcoinConfigData>(defaultState)

export const useBitcoinWagmi = (): BitcoinConfigData => {
	const context = useContext(BitcoinWagmiContext)

	if (context === undefined) {
		throw new Error("useBitcoinWagmi must be used within a BitcoinWagmiConfig!")
	}

	return context
}

type Props = {
	children: ReactNode,
	initialNetwork?: WalletNetwork,
	queryClient?: QueryClient
}

export function BitcoinWagmiProvider({
	children,
	initialNetwork = "mainnet",
	queryClient = new QueryClient()
}: Props) {
	const [connectors, setConnectors] = useState<BitcoinConfigData["connectors"]>([])
	const [connector, setConnector] = useState<BitcoinConfigData["connector"]>()

	const [network, setNetwork] = useState<BitcoinConfigData["network"]>(initialNetwork)

	useEffect(() => {
		// set connectors in useEffect to avoid SSR window/hydration errors
		setConnectors([
			new XverseConnector(initialNetwork),
			new UnisatConnector(initialNetwork),
			new OkxConnector(initialNetwork),
			new LeatherConnector(initialNetwork),
			new BitgetConnector(initialNetwork)
		])
	}, [])

	useEffect(() => {
		connectors.forEach(connector => (
			connector.network !== network && connector.switchNetwork(network)
		))
	}, [connectors, network])

	return (
		<QueryClientProvider client={queryClient}>
			<BitcoinWagmiContext.Provider value={{
				connectors,
				connector,
				setConnector,
				network,
				setNetwork
			}}>
				{children}
			</BitcoinWagmiContext.Provider>
		</QueryClientProvider>
	)
}
