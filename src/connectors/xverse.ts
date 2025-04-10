import { Psbt } from "bitcoinjs-lib"
import {
	AddressPurpose,
	BitcoinNetworkType,
	createInscription,
	getAddress,
	sendBtcTransaction,
	signTransaction,
	signMessage as signMessageXverse
} from "sats-connect"

import type { WalletNetwork } from "../types"

import { SatsConnector } from "./base"

const getXverseNetwork = (network: WalletNetwork): BitcoinNetworkType => {
	switch(network) {
		case "signet": return BitcoinNetworkType.Signet
		case "testnet": return BitcoinNetworkType.Testnet
		case "mainnet":
		default:
			return BitcoinNetworkType.Mainnet
	}
}

// const getWalletNetwork = (network: BitcoinNetworkType): WalletNetwork => {
// 	switch(network) {
// 		case BitcoinNetworkType.Signet: return "signet"
// 		case BitcoinNetworkType.Testnet: return "testnet"
// 		case BitcoinNetworkType.Mainnet:
// 		default:
// 			return "mainnet"
// 	}
// }

declare global {
	interface Window {
		/* @ts-ignore */
		XverseProviders: any
	}
}

export class XverseConnector extends SatsConnector {
	id = "xverse"
	name = "Xverse"
	homepage = "https://www.xverse.app/"

	// Needed for sendBtcTransaction function
	paymentAddress: string | undefined

	constructor(network: WalletNetwork) {
		super(network)
	}

	async connect(): Promise<void> {
		this.disconnect()

		return new Promise((resolve, reject) => {
			getAddress({
				payload: {
					purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
					message: "Address for receiving Ordinals and payments",
					network: {
						type: getXverseNetwork(this.network)
					}
				},
				onFinish: res => {
					const { address, publicKey } = res.addresses.find(address => (
						address.purpose === AddressPurpose.Ordinals
					)) as {
						address: string
						publicKey: string
						purpose: string
					}
					const { address: paymentAddress } = res.addresses.find(address => (
						address.purpose === AddressPurpose.Payment
					)) as {
						address: string
						publicKey: string
						purpose: string
					}

					this.accounts = res.addresses.map(a => a.address)
					this.address = address
					this.paymentAddress = paymentAddress
					this.publicKey = publicKey

					this.listeners.accountChanged.forEach(cb => cb(
						this.address || "",
						this.accounts,
						this.publicKey || ""
					))

					resolve()
				},
				onCancel: () => {
					reject(new Error("User rejected connect"))
				}
			})
		})
	}

	async switchNetwork(toNetwork: WalletNetwork): Promise<void> {
		await super.switchNetwork(toNetwork)
		if (!this.address) return

		return this.connect()
	}

	async isReady() {
		this.ready = !!window.XverseProviders

		return this.ready
	}

	async signMessage(message: string): Promise<string> {
		return new Promise(async (resolve, reject) => {
			if (!this.address || !this.paymentAddress) {
				return reject(new Error("Something went wrong while connecting"))
			}
			await signMessageXverse({
				payload: {
					network: {
						type: getXverseNetwork(this.network)
					},
					address: this.address,
					message
				},
				onFinish: (signature) => {
					resolve(signature)
				},
				onCancel: () => {
					reject(new Error("Sign Message canceled"))
				}
			})
		})
	}

	async sendToAddress(toAddress: string, amount: number): Promise<string> {
		return new Promise(async (resolve, reject) => {
			if (!this.address || !this.paymentAddress) {
				return reject(new Error("Something went wrong while connecting"))
			}

			await sendBtcTransaction({
				payload: {
					network: {
						type: getXverseNetwork(this.network)
					},
					recipients: [{ address: toAddress, amountSats: BigInt(amount) }],
					senderAddress: this.paymentAddress
				},
				onFinish: (response) => {
					resolve(response)
				},
				onCancel: () => {
					reject(new Error("Send BTC Transaction canceled"))
				}
			})
		})
	}

	async inscribe(contentType: "text" | "image", content: string): Promise<string> {
		return new Promise(async (resolve, reject) => {
			await createInscription({
				payload: {
					network: {
						type: getXverseNetwork(this.network)
					},
					content,
					contentType: contentType === "text" ? "text/plaincharset=utf-8" : "image/jpeg",
					payloadType: contentType === "text" ? "PLAIN_TEXT" : "BASE_64"
				},
				onFinish: (response) => {
					resolve(response.txId)
				},
				onCancel: () => reject(new Error("Canceled"))
			})
		})
	}

	async signInput(inputIndex: number, psbt: Psbt): Promise<Psbt> {
		return new Promise(async (resolve, reject) => {
			if (!this.address) {
				return reject(new Error("Something went wrong while connecting"))
			}

			await signTransaction({
				payload: {
					network: {
						type: getXverseNetwork(this.network)
					},
					message: "Sign Transaction",
					psbtBase64: psbt.toBase64(),
					broadcast: false,
					inputsToSign: [
						{
							address: this.address,
							signingIndexes: [inputIndex]
						}
					]
				},
				onFinish: (response) => {
					resolve(Psbt.fromBase64(response.psbtBase64))
				},
				onCancel: () => reject(new Error("Canceled"))
			})
		})
	}

	async sendInscription(): Promise<string> {
		throw new Error(`sendInscription not implemented`)
	}
}
