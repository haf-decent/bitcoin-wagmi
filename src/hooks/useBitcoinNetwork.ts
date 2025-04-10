import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"

import { useBitcoinWagmi } from "../provider"

export function useBitcoinNetwork() {
	const { connector, network, switchNetwork } = useBitcoinWagmi()

	const { mutate, mutateAsync, ...rest } = useMutation({
		mutationKey: [ "switch-bitcoin-network" ],
		mutationFn: switchNetwork
	})

	useEffect(() => {
		if (!connector) return

		// if user initiates network switch in wallet, switch network in provider
		// potential infinite loop, but the connector's network should already be the
		// network being switched to, which shouldn't trigger another networkChanged event
		const unsub = connector.on("networkChanged", network => switchNetwork(network))
		return unsub
	}, [ connector ])

	return {
		...rest,
		network,
		switchNetwork: mutate,
		switchNetworkAsync: mutateAsync
	}
}
