import { useQuery } from "@tanstack/react-query"

import { useBitcoinWagmi } from "../provider"

export function useBitcoinAccount() {
	const { connector } = useBitcoinWagmi()

	const {
		data: [ address, addresses ],
		...rest
	} = useQuery<[ string | undefined, string[] ]>({
		queryKey: [ "account", connector ],
		queryFn: () => {
			if (!connector) return [ undefined, [] ]

			return [
				connector.getAccount(),
				connector.getAccounts()
			]
		},
		enabled: !!connector,
		initialData: [ undefined, [] ]
	})

	return {
		...rest,
		connector,
		address,
		addresses
	}
}
