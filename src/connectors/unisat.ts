import { Psbt } from "bitcoinjs-lib"

import { WalletNetwork } from "../types"

import { SatsConnector } from "./base"

type UnisatNetwork = "livenet" | "testnet" | "signet"

const getUnisatNetwork = (network: WalletNetwork): UnisatNetwork => {
	switch (network) {
		case "mainnet": return "livenet"
		default: return network
	}
}

const getWalletNetwork = (network: UnisatNetwork): WalletNetwork => {
	switch (network) {
		case "livenet": return "mainnet"
		default: return network
	}
}

type AccountsChangedEvent = (
	event: "accountsChanged",
	handler: (accounts: Array<string>) => void
) => void

type Inscription = {
	inscriptionId: string,
	inscriptionNumber: string,
	address: string,
	outputValue: string,
	content: string,
	contentLength: string,
	contentType: string,
	preview: string,
	timestamp: number,
	offset: number,
	genesisTransaction: string,
	location: string
}

type getInscriptionsResult = { total: number, list: Inscription[] }

type SendInscriptionsResult = { txid: string }

type Balance = { confirmed: number, unconfirmed: number, total: number }

type Unisat = {
	requestAccounts: () => Promise<string[]>,
	getAccounts: () => Promise<string[]>,
	on: AccountsChangedEvent,
	removeListener: AccountsChangedEvent,
	getInscriptions: (cursor: number, size: number) => Promise<getInscriptionsResult>,
	sendInscription: (
		address: string,
		inscriptionId: string,
		options?: { feeRate: number }
	) => Promise<SendInscriptionsResult>,
	switchNetwork: (network: UnisatNetwork) => Promise<void>,
	getNetwork: () => Promise<UnisatNetwork>,
	getPublicKey: () => Promise<string>,
	getBalance: () => Promise<Balance>,
	signMessage: (message: string) => Promise<string>,
	sendBitcoin: (
		address: string,
		atomicAmount: number,
		options?: { feeRate: number }
	) => Promise<string>,
	signPsbt: (
		psbtHex: string,
		options?: {
			autoFinalized?: boolean,
			toSignInputs: {
				index: number,
				address?: string,
				publicKey?: string,
				sighashTypes?: number[],
				disableTweakSigner?: boolean
			}[]
		}
	) => Promise<string>
}

declare global {
	interface Window {
		unisat: Unisat
	}
}

export class UnisatConnector extends SatsConnector {
	id = "unisat"
	name = "Unisat"
	homepage = "https://unisat.io/"

	constructor(network: WalletNetwork) {
		super(network)

		this.changeAccount = this.changeAccount.bind(this)
	}

	async connect(): Promise<void> {
		const network = await window.unisat.getNetwork()
		const mappedNetwork = getWalletNetwork(network)

		if (mappedNetwork !== this.network) {
			const expectedNetwork = getUnisatNetwork(this.network)

			await window.unisat.switchNetwork(expectedNetwork)
		}

		const [accounts, publickKey] = await Promise.all([
			window.unisat.requestAccounts(),
			window.unisat.getPublicKey()
		])

		this.accounts = accounts
		this.address = accounts[0]
		this.publicKey = publickKey

		window.unisat.on("accountsChanged", this.changeAccount)
	}

	async switchNetwork(toNetwork: WalletNetwork): Promise<void> {
		await super.switchNetwork(toNetwork)
		if (!this.address) return

		const network = await window.unisat.getNetwork()
		const mappedNetwork = getWalletNetwork(network)

		if (mappedNetwork !== this.network) {
			const expectedNetwork = getUnisatNetwork(this.network)

			await window.unisat.switchNetwork(expectedNetwork)
		}

		const [accounts, publickKey] = await Promise.all([
			window.unisat.requestAccounts(),
			window.unisat.getPublicKey()
		])

		this.accounts = accounts
		this.address = accounts[0]
		this.publicKey = publickKey
	}

	disconnect() {
		super.disconnect()

		window.unisat.removeListener("accountsChanged", this.changeAccount)
	}

	async changeAccount(accounts: string[]) {
		this.accounts = accounts
		this.address = accounts[0]
		this.publicKey = await window.unisat.getPublicKey()
		this.listeners.accountChanged.forEach(cb => cb(
			this.address || "",
			this.accounts,
			this.publicKey || ""
		))
		const network = await window.unisat.getNetwork()
		const mappedNetwork = getWalletNetwork(network)
		if (mappedNetwork !== this.network) {
			this.network = mappedNetwork
			this.listeners.networkChanged.forEach(cb => cb(mappedNetwork))
		}
	}

	async isReady() {
		this.ready = typeof window.unisat !== "undefined"

		return this.ready
	}

	async signMessage(message: string) {
		return window.unisat.signMessage(message)
	}

	async sendToAddress(toAddress: string, amount: number): Promise<string> {
		return window.unisat.sendBitcoin(toAddress, amount)
	}

	async signInput(inputIndex: number, psbt: Psbt) {
		const publicKey = await this.getPublicKey()

		const psbtHex = await window.unisat.signPsbt(psbt.toHex(), {
			autoFinalized: false,
			toSignInputs: [
				{
					index: inputIndex,
					publicKey,
					disableTweakSigner: true
				}
			]
		})

		return Psbt.fromHex(psbtHex)
	}

	async sendInscription(address: string, inscriptionId: string, feeRate?: number) {
		const { txid } = await window.unisat.sendInscription(
			address,
			inscriptionId,
			feeRate ? { feeRate }: undefined
		)
		return txid
	}
}
