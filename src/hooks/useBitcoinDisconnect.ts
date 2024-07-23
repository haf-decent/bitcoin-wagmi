import { useMutation } from "@tanstack/react-query"

import { useBitcoinWagmi } from "../provider"

export function useBitcoinDisconnect() {
	const { setConnector } = useBitcoinWagmi()

	const { mutate, mutateAsync, ...rest } = useMutation({
		mutationKey: [ "disconnect" ],
		mutationFn: async () => {
			setConnector(undefined)
		}
	})

	return {
		...rest,
		disconnect: mutate,
		disconnectAsync: mutateAsync
	}
}
