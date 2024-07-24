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
import type { BitcoinNetwork } from "@gobob/types"

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
  setConnector: Dispatch<SetStateAction<SatsConnector | undefined>>
}

const BitcoinWagmiContext = createContext<BitcoinConfigData>({
  connectors: [],
  connector: undefined,
  setConnector: () => {}
})

export const useBitcoinWagmi = (): BitcoinConfigData => {
  const context = useContext(BitcoinWagmiContext)

  if (context === undefined) {
    throw new Error("useBitcoinWagmi must be used within a BitcoinWagmiConfig!")
  }

  return context
}

type Props = {
  children: ReactNode
  network?: BitcoinNetwork
  queryClient?: QueryClient
}

export function BitcoinWagmiProvider({
  children,
  network = "mainnet",
  queryClient = new QueryClient()
}: Props) {
  const [connectors, setConnectors] = useState<SatsConnector[]>([])
  const [connector, setConnector] = useState<SatsConnector>()

  useEffect(() => {
		setConnectors([
			new XverseConnector(network),
			new UnisatConnector(network),
			new OkxConnector(network),
			new LeatherConnector(network),
			new BitgetConnector(network)
		])
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <BitcoinWagmiContext.Provider value={{
				connectors,
				connector,
				setConnector
			}}>
        {children}
      </BitcoinWagmiContext.Provider>
    </QueryClientProvider>
  )
}
