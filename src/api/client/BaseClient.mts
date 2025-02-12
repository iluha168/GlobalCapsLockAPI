export type CapsLockState = 0 | 1

class GlobalCapsLockEvent extends Event {
	static eventType = "gcle"
	state: CapsLockState

	constructor(state: `${CapsLockState}`) {
		super(GlobalCapsLockEvent.eventType)
		this.state = +state as CapsLockState
	}
}

export abstract class BaseClient {
	ws: WebSocket | null = null
	globalCapsLock: CapsLockState = 0
	protected eventTarget: EventTarget = new EventTarget()

	protected constructor() {}

	protected static async createClient<C extends BaseClient>(
		client: C,
		url: string,
	): Promise<C> {
		client.ws = new WebSocket(url)

		const { promise, resolve, reject } = Promise.withResolvers()
		client.ws.addEventListener("open", resolve, { once: true })
		client.ws.addEventListener("error", reject, { once: true })
		client.ws.addEventListener("message", BaseClient.prototype.onMessage.bind(client))

		await promise
		return client
	}

	addCapsLockListener(
		listener: (event: CapsLockState) => void,
		options?: boolean | AddEventListenerOptions,
	): void {
		this.eventTarget.addEventListener(
			GlobalCapsLockEvent.eventType,
			(e) => listener((e as GlobalCapsLockEvent).state),
			options,
		)
	}

	private onMessage({ data }: MessageEvent): void {
		switch (data) {
			case "0":
			case "1":
				this.globalCapsLock = data
				this.eventTarget.dispatchEvent(new GlobalCapsLockEvent(data))
				break
			default:
				this.onUnknownMessage(data)
				break
		}
	}

	protected abstract onUnknownMessage(message: string): void
}
