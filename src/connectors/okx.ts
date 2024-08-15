import { Psbt } from "bitcoinjs-lib"

import type { WalletNetwork } from "../types"

import { SatsConnector } from "./base"

const getLibNetwork = (network: Network): WalletNetwork => {
	switch (network) {
		case "livenet":
			return "mainnet"
		case "testnet":
			return "testnet"
	}
}

const getOkxNetwork = (network: WalletNetwork): Network => {
	switch (network) {
		default:
		case "mainnet":
			return "livenet"
		case "testnet":
			return "testnet"
	}
}

type OkxWalletEvents = {
	accountChanged: (account: { address: string, publicKey: string }) => void,
	accountsChanged: (addresses: string[]) => void
}
type OkxWalletEventListener = <T extends keyof OkxWalletEvents>(
	event: T,
	handler: OkxWalletEvents[T]
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

type Network = "livenet" | "testnet"

type Okx = {
	connect: () => Promise<{ address: string, publicKey: string }>,
	requestAccounts: () => Promise<string[]>,
	getAccounts: () => Promise<string[]>,
	on: OkxWalletEventListener,
	removeListener: OkxWalletEventListener,
	getInscriptions: (cursor: number, size: number) => Promise<getInscriptionsResult>,
	sendInscription: (
		address: string,
		inscriptionId: string,
		options?: { feeRate: number }
	) => Promise<SendInscriptionsResult>,
	switchNetwork: (network: "livenet" | "testnet") => Promise<void>,
	getNetwork: () => Promise<Network>,
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
		okxwallet: { bitcoin: Okx }
	}
}

export class OkxConnector extends SatsConnector {
	id = "okx"
	name = "OKX"
	homepage = "https://okx.com/"

	constructor(network: WalletNetwork) {
		super(network)
	}

	async connect(): Promise<void> {
		const network = await window.okxwallet.bitcoin.getNetwork()
		const mappedNetwork = getLibNetwork(network)

		if (mappedNetwork !== this.network) {
			const expectedNetwork = getOkxNetwork(this.network)

			await window.okxwallet.bitcoin.switchNetwork(expectedNetwork)
		}

		const { address, publicKey } = await window.okxwallet.bitcoin.connect()
		const accounts = await window.okxwallet.bitcoin.getAccounts()

		this.accounts = accounts
		this.address = address
		this.publicKey = publicKey

		window.okxwallet.bitcoin.on("accountChanged", this.changeAccount)
	}

	async switchNetwork(toNetwork: WalletNetwork): Promise<void> {
		super.switchNetwork(toNetwork)
		if (!this.address) return

		const network = await window.okxwallet.bitcoin.getNetwork()
		const mappedNetwork = getLibNetwork(network)

		if (mappedNetwork !== this.network) {
			const expectedNetwork = getOkxNetwork(this.network)

			await window.okxwallet.bitcoin.switchNetwork(expectedNetwork)
		}
	}

	disconnect() {
		super.disconnect()

		window.okxwallet.bitcoin.removeListener("accountChanged", this.changeAccount)
	}

	async changeAccount(account: { address: string, publicKey: string }) {
		this.address = account.address
		this.publicKey = account.publicKey
		this.accounts = await window.okxwallet.bitcoin.getAccounts()
	}

	async isReady() {
		this.ready = typeof window.okxwallet?.bitcoin !== "undefined"

		return this.ready
	}

	async signMessage(message: string) {
		return window.okxwallet.bitcoin.signMessage(message)
	}

	async sendToAddress(toAddress: string, amount: number): Promise<string> {
		return window.okxwallet.bitcoin.sendBitcoin(toAddress, amount)
	}

	async signInput(inputIndex: number, psbt: Psbt) {
		const publicKey = await this.getPublicKey()

		const psbtHex = await window.okxwallet.bitcoin.signPsbt(psbt.toHex(), {
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
		const { txid } = await window.okxwallet.bitcoin.sendInscription(
			address,
			inscriptionId,
			feeRate ? { feeRate }: undefined
		)
		return txid
	}
}
