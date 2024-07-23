import { useMutation } from "@tanstack/react-query"

import { SatsConnector } from "../connectors"
import { useBitcoinWagmi } from "../provider"

export function useBitcoinConnect() {
	const { connectors, setConnector } = useBitcoinWagmi()

	const { mutate, mutateAsync, ...rest } = useMutation({
		mutationKey: [ "connect" ],
		mutationFn: async ({ connector }: { connector?: SatsConnector }) => {
			if (!connector) {
				throw new Error("Invalid connector")
			}

			if (connector.name !== "MetaMask" && !(await connector.isReady())) {
				window.open(connector.homepage, "_blank", "noopener")

				throw new Error("Wallet is not installed")
			}

			return connector.connect()
		},
		onSuccess: (_, { connector }) => {
			setConnector(connector)
		}
	})

	return {
		...rest,
		connectors,
		connect: mutate,
		connectAsync: mutateAsync
	}
}
