import { Psbt } from "bitcoinjs-lib"

import type { WalletNetwork } from "../types"

import { SatsConnector } from "./base"

type BitgetNetwork = "livenet" | "testnet" | "signet"

const getBigetNetwork = (network: WalletNetwork): BitgetNetwork => {
	switch(network) {
		case "mainnet": return "livenet"
		default: return network
	}
}

const getWalletNetwork = (network: BitgetNetwork) => {
	switch(network) {
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

type Bitget = {
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
	switchNetwork: (network: BitgetNetwork) => Promise<void>,
	getNetwork: () => Promise<BitgetNetwork>,
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
		bitkeep: {
			unisat: Bitget
		}
	}
}

export class BitgetConnector extends SatsConnector {
	id = "bitget"
	name = "Bitget"
	homepage = "https://web3.bitget.com/"

	constructor(network: WalletNetwork) {
		super(network)

		this.changeAccount = this.changeAccount.bind(this)
	}

	async connect(): Promise<void> {
		const network = await window.bitkeep.unisat.getNetwork()
		const mappedNetwork = getWalletNetwork(network)

		if (mappedNetwork !== this.network) {
			const expectedNetwork = getBigetNetwork(this.network)
			await window.bitkeep.unisat.switchNetwork(expectedNetwork)
		}

		const [accounts, publickKey] = await Promise.all([
			window.bitkeep.unisat.requestAccounts(),
			window.bitkeep.unisat.getPublicKey()
		])

		this.accounts = accounts
		this.address = accounts[0]
		this.publicKey = publickKey

		window.bitkeep.unisat.on("accountsChanged", this.changeAccount)
	}

	async switchNetwork(toNetwork: WalletNetwork): Promise<void> {
		await super.switchNetwork(toNetwork)
		if (!this.address) return
		
		const network = await window.bitkeep.unisat.getNetwork()
		const mappedNetwork = getWalletNetwork(network)

		if (mappedNetwork !== this.network) {
			const expectedNetwork = getBigetNetwork(this.network)
			await window.bitkeep.unisat.switchNetwork(expectedNetwork)
		}

		const [accounts, publickKey] = await Promise.all([
			window.bitkeep.unisat.requestAccounts(),
			window.bitkeep.unisat.getPublicKey()
		])

		this.accounts = accounts
		this.address = accounts[0]
		this.publicKey = publickKey
	}

	disconnect() {
		super.disconnect()

		window.bitkeep.unisat.removeListener("accountsChanged", this.changeAccount)
	}

	async changeAccount(accounts: string[]) {
		this.accounts = accounts
		this.address = accounts[0]
		this.publicKey = await window.bitkeep.unisat.getPublicKey()
		this.listeners.accountChanged.forEach(cb => cb(
			this.address || "",
			this.accounts,
			this.publicKey || ""
		))
		const network = await window.bitkeep.unisat.getNetwork()
		const mappedNetwork = getWalletNetwork(network)
		if (mappedNetwork !== this.network) {
			this.network = mappedNetwork
			this.listeners.networkChanged.forEach(cb => cb(mappedNetwork))
		}
	}

	async isReady() {
		this.ready = typeof window.bitkeep?.unisat !== "undefined"

		return this.ready
	}

	async signMessage(message: string) {
		return window.bitkeep.unisat.signMessage(message)
	}

	async sendToAddress(toAddress: string, amount: number): Promise<string> {
		return window.bitkeep.unisat.sendBitcoin(toAddress, amount)
	}

	async signInput(inputIndex: number, psbt: Psbt) {
		const publicKey = await this.getPublicKey()

		const psbtHex = await window.bitkeep.unisat.signPsbt(psbt.toHex(), {
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
		const { txid } = await window.bitkeep.unisat.sendInscription(
			address,
			inscriptionId,
			feeRate ? { feeRate }: undefined
		)
		return txid
	}
}
