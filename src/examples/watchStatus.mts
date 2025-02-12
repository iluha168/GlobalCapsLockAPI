import { StatusClient } from "../api/mod.mts"

const client = await StatusClient.connect()

let userCount = 0
const renderStatus = () => {
	console.log(client.globalCapsLock ? "CAPS LOCK IS ON!" : "CAPS LOCK IS OFF", "Users connected:", userCount)
}

client.addUserCountListener((count) => {
	userCount = count
	renderStatus()
})

client.addCapsLockListener(renderStatus)
