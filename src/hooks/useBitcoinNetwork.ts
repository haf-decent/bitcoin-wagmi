import { useMutation } from "@tanstack/react-query"

import { useBitcoinWagmi } from "../provider"
import { WalletNetwork } from "../types"

export function useBitcoinNetwork() {
	const { network, setNetwork } = useBitcoinWagmi()

	const { mutate, mutateAsync, ...rest } = useMutation({
		mutationKey: [ "switch-bitcoin-network" ],
		mutationFn: async (network: WalletNetwork) => {
			setNetwork(network)
		}
	})

	return {
		...rest,
		network,
		switchNetwork: mutate,
		switchNetworkAsync: mutateAsync
	}
}
