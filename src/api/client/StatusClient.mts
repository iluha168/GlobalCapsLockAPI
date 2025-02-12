import { BaseClient } from "./BaseClient.mts"

export class UserCountEvent extends Event {
	static eventType = "uce"
	count: number

	constructor(count: number) {
		super(UserCountEvent.eventType)
		this.count = count
	}
}

export class StatusClient extends BaseClient {
	static connect(): Promise<StatusClient> {
		return this.createClient(new this(), "wss://globalcapslock.com/status")
	}

	protected override onUnknownMessage(message: string): void {
		const count = message.match(/^c (?<count>\d+)$/)?.groups?.count
		if (count == null) {
			return // Silently ignore
		}
		this.eventTarget.dispatchEvent(new UserCountEvent(+count))
	}

	addUserCountListener(
		listener: (event: UserCountEvent) => void,
		options?: boolean | AddEventListenerOptions,
	): void {
		this.eventTarget.addEventListener(
			UserCountEvent.eventType,
			// @ts-ignore The fired event is always a UserCountEvent
			listener,
			options,
		)
	}
}
