import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"

import { useBitcoinWagmi } from "../provider"

export function useBitcoinAccount() {
	const { connector, on } = useBitcoinWagmi()

	const {
		data: [ address, addresses ],
		refetch,
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

	useEffect(() => {
		if (!connector) return

		const unsubs = [
			connector.on("accountChanged", () => refetch()),
			connector.on("networkChanged", () => refetch())
		]
		return () => unsubs.forEach(fn => fn())
	}, [ connector, refetch ])

	useEffect(() => {
		const unsub = on("networkChanged", () => refetch())

		return unsub
	}, [ refetch ])

	return {
		...rest,
		refetch,
		connector,
		address,
		addresses
	}
}
