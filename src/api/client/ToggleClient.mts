import { BaseClient, CapsLockState } from "./BaseClient.mts"

export class ToggleClient extends BaseClient {
	static connect(): Promise<ToggleClient> {
		return this.createClient(new this(), "wss://globalcapslock.com/ws")
	}

	protected override onUnknownMessage(): void {
		// Silently ignore
	}

	sendState(state: CapsLockState): void {
		this.globalCapsLock = state
		this.ws?.send(state.toString())
	}

	sendToggle(): void {
		this.sendState(1 - this.globalCapsLock as CapsLockState)
	}
}
