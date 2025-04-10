import React, {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState
} from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import type { WalletNetwork } from "./types"
import {
	BitgetConnector,
	OkxConnector,
	SatsConnector,
	UnisatConnector,
	XverseConnector
} from "./connectors"

type Events = {
	networkChanged: ((toNetwork: WalletNetwork) => void)[]
}

type BitcoinConfigData = {
	connectors: SatsConnector[],
	connector?: SatsConnector,
	setConnector: Dispatch<SetStateAction<SatsConnector | undefined>>,
	network: WalletNetwork,
	switchNetwork: (toNetwork: WalletNetwork) => Promise<void>,
	on: <T extends keyof Events>(event: T, handler: Events[T][0]) => (() => void)
}

const defaultState: BitcoinConfigData = {
	connectors: [],
	connector: undefined,
	setConnector: () => {},
	network: "mainnet",
	switchNetwork: async () => {},
	on: () => () => {}
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
	const connectorsRef = useRef(connectors)
	connectorsRef.current = connectors

	const [connector, setConnector] = useState<BitcoinConfigData["connector"]>()

	const [network, setNetwork] = useState<BitcoinConfigData["network"]>(initialNetwork)

	useEffect(() => {
		// set connectors in useEffect to avoid SSR window/hydration errors
		setConnectors([
			new XverseConnector(initialNetwork),
			new UnisatConnector(initialNetwork),
			new OkxConnector(initialNetwork),
			new BitgetConnector(initialNetwork)
		])
	}, [])

	const listeners = useRef<Events>({
		networkChanged: []
	})
	const on: BitcoinConfigData["on"] = useCallback((event, handler) => {
		listeners.current[event].push(handler)

		return () => {
			listeners.current[event] = listeners.current[event].filter(cb => cb !== handler)
		}
	}, [])

	const switchNetwork = useCallback(async (toNetwork: WalletNetwork) => {
		setNetwork(toNetwork)
		await Promise.allSettled(
			connectorsRef.current.map(connector => (
				connector.network !== toNetwork && connector.switchNetwork(toNetwork)
			))
		)
		listeners.current.networkChanged.forEach(cb => cb(toNetwork))
	}, [])

	return (
		<QueryClientProvider client={queryClient}>
			<BitcoinWagmiContext.Provider value={{
				connectors,
				connector,
				setConnector,
				network,
				switchNetwork,
				on
			}}>
				{children}
			</BitcoinWagmiContext.Provider>
		</QueryClientProvider>
	)
}
