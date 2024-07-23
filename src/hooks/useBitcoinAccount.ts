import { useQuery } from "@tanstack/react-query"

import { useBitcoinWagmi } from "../provider"

export function useBitcoinAccount() {
	const { connector } = useBitcoinWagmi()

	const { data: address, ...rest } = useQuery({
		queryKey: [ "account", connector ],
		queryFn: () => {
			if (!connector) return undefined

			return connector.getAccount()
		},
		enabled: !!connector
	})

	return {
		...rest,
		connector,
		address
	}
}
