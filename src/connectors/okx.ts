import { Psbt } from "bitcoinjs-lib"

import type { WalletNetwork } from "../types"

import { SatsConnector } from "./base"

type OkxWalletKey = "bitcoin" | "bitcoinTestnet" | "bitcoinSignet"

const getOkxWalletKey = (network: WalletNetwork): OkxWalletKey => {
	switch(network) {
		case "signet": return "bitcoinSignet"
		case "testnet": return "bitcoinTestnet"
		case "mainnet":
		default: return "bitcoin"
	}
}

type OkxNetwork = "livenet" | "testnet" | "signet"

const getWalletNetwork = (network: OkxNetwork) => {
	switch(network) {
		case "livenet": return "mainnet"
		default: return network
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
	switchNetwork: (network: OkxNetwork) => Promise<void>,
	getNetwork: () => Promise<OkxNetwork>,
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
		okxwallet: {
			bitcoin: Okx,
			bitcoinTestnet: Pick<Okx, "connect" | "getAccounts" | "signMessage" | "signPsbt">,
			bitcoinSignet: Pick<Okx, "connect" | "getAccounts" | "signMessage" | "signPsbt">
		}
	}
}

export class OkxConnector extends SatsConnector {
	id = "okx"
	name = "OKX"
	homepage = "https://okx.com/"
	key: "bitcoin" | "bitcoinTestnet" | "bitcoinSignet"

	constructor(network: WalletNetwork) {
		super(network)
		this.key = getOkxWalletKey(this.network)

		this.changeAccount = this.changeAccount.bind(this)
	}

	async connect(): Promise<void> {
		this.key = getOkxWalletKey(this.network)

		const { address, publicKey } = await window.okxwallet[this.key].connect()
		const accounts = await window.okxwallet[this.key].getAccounts?.() || [ address ]

		this.accounts = accounts
		this.address = address
		this.publicKey = publicKey

		window.okxwallet.bitcoin.on("accountChanged", this.changeAccount)
	}

	async switchNetwork(toNetwork: WalletNetwork): Promise<void> {
		await super.switchNetwork(toNetwork)
		this.key = getOkxWalletKey(this.network)
		if (!this.address) return

		const { address, publicKey } = await window.okxwallet[this.key].connect()
		const accounts = await window.okxwallet[this.key].getAccounts?.() || [ address ]

		this.accounts = accounts
		this.address = address
		this.publicKey = publicKey
	}

	disconnect() {
		super.disconnect()

		window.okxwallet.bitcoin.removeListener("accountChanged", this.changeAccount)
	}

	async changeAccount(account: { address: string, publicKey: string }) {
		this.address = account.address
		this.publicKey = account.publicKey
		this.accounts = await window.okxwallet[this.key].getAccounts?.() || [ account.address ]
		this.listeners.accountChanged.forEach(cb => cb(
			this.address || "",
			this.accounts,
			this.publicKey || ""
		))
		const network = await window.okxwallet.bitcoin.getNetwork()
		const mappedNetwork = getWalletNetwork(network)
		if (mappedNetwork !== this.network) {
			this.network = mappedNetwork
			this.listeners.networkChanged.forEach(cb => cb(mappedNetwork))
			this.key = getOkxWalletKey(mappedNetwork)
		}
	}

	async isReady() {
		this.ready = typeof window.okxwallet?.bitcoin !== "undefined"

		return this.ready
	}

	async signMessage(message: string) {
		return window.okxwallet[this.key].signMessage(message)
	}

	async sendToAddress(toAddress: string, amount: number): Promise<string> {
		if (this.key !== "bitcoin") {
			throw new Error(`sendToAddress on ${this.key} not implemented`)
		}

		return window.okxwallet.bitcoin.sendBitcoin(toAddress, amount)
	}

	async signInput(inputIndex: number, psbt: Psbt) {
		const publicKey = await this.getPublicKey()

		const psbtHex = await window.okxwallet[this.key].signPsbt(psbt.toHex(), {
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
		if (this.key !== "bitcoin") {
			throw new Error(`sendInscription on ${this.key} not implemented`)
		}

		const { txid } = await window.okxwallet.bitcoin.sendInscription(
			address,
			inscriptionId,
			feeRate ? { feeRate }: undefined
		)
		return txid
	}
}
