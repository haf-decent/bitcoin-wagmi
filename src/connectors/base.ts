import { Psbt } from "bitcoinjs-lib"

import type { WalletNetwork } from "../types"

type Address = string

type Events = {
	accountChanged: ((account: string, accounts: string[], publicKey: string) => void)[],
	networkChanged: ((network: WalletNetwork) => void)[]
}

export abstract class SatsConnector {
	/** Unique connector id */
	abstract readonly id: string
	/** Connector name */
	abstract readonly name: string
	/** Extension or Snap homepage */
	abstract homepage: string

	/** Whether connector is usable */
	ready: boolean = false

	accounts: Address[] = []
	address: Address | undefined = ""

	publicKey: string | undefined

	network: WalletNetwork

	listeners: Events = {
		accountChanged: [],
		networkChanged: []
	}

	constructor(network: WalletNetwork) {
		this.network = network
	}

	abstract isReady(): Promise<boolean>

	abstract connect(): Promise<void>

	getAccount(): string | undefined {
		return this.address
	}

	getAccounts(): string[] {
		return this.accounts
	}

	isAuthorized(): boolean {
		const address = this.getAccount()

		return !!address
	}

	on<T extends keyof Events>(event: T, handler: Events[T][0]) {
		this.listeners[event].push(handler as any)

		return () => {
			this.listeners[event] = this.listeners[event].filter(cb => cb !== handler) as any
		}
	}

	async switchNetwork(toNetwork: WalletNetwork) {
		this.network = toNetwork
	}

	abstract signMessage(message: string): Promise<string>

	abstract sendToAddress(toAddress: string, amount: number): Promise<string>

	abstract signInput(inputIndex: number, psbt: Psbt): Promise<Psbt>

	abstract sendInscription(address: string, inscriptionId: string, feeRate?: number): Promise<string>

	disconnect() {
		this.accounts = []
		this.address = undefined
		this.publicKey = undefined
	}

	// Get bitcoinlib-js network
	getNetwork() {
		return this.network
	}

	async getPublicKey(): Promise<string> {
		if (!this.publicKey) {
			throw new Error("Something went wrong while connecting")
		}

		return this.publicKey
	}

	getSigner(): SatsConnector {
		return this
	}
}
