const MQTT = require('async-mqtt')

// Variables
let lastLoadedContent = ''
let lastUpdateSent = 0

if (process.env.MONITOR_URL == null) handleError('Missing MONITOR_URL')
if (process.env.MONITOR_INTERVAL == null)
    handleError('Missing MONITOR_INTERVAL')
if (typeof process.env.MONITOR_INTERVAL !== 'string')
    handleError('Invalid MONITOR_INTERVAL')
if (process.env.MQTT_URI == null) handleError('Missing MQTT_URI')
if (process.env.MQTT_TOPIC == null) handleError('Missing MQTT_TOPIC')

// Main
const MONITOR_URL = process.env.MONITOR_URL
const MONITOR_INTERVAL = parseInt(process.env.MONITOR_INTERVAL)
const MQTT_URI = process.env.MQTT_URI
const MQTT_TOPIC = process.env.MQTT_TOPIC
const MQTT_INTERVAL = process.env.MQTT_INTERVAL
    ? parseInt(process.env.MQTT_INTERVAL)
    : MONITOR_INTERVAL

const client = MQTT.connect(MQTT_URI)

client.on('connect', connected)

setInterval(monitorURL, MONITOR_INTERVAL)

// Functions
async function connected() {
    console.log('Online')
}

async function monitorURL() {
    try {
        const forceUpdate = Date.now() - lastUpdateSent > MQTT_INTERVAL

        const content = await (await fetch(MONITOR_URL)).text()

        if (content !== lastLoadedContent || forceUpdate) {
            await client.publish(MQTT_TOPIC, content)

            lastLoadedContent = content

            lastUpdateSent = Date.now()
        }
    } catch (e) {
        handleError(e.stack)
    }
}

function handleError(...args) {
    console.error(...args)

    process.exit(255)
}
