const RP = require('request-promise')
const MQTT = require('async-mqtt')

// Functions
const handleError = async (msg) => {
  console.log(msg)
  process.exit()
}

const connected = async () => {
  console.log('Online')
}

const monitorURL = async () => {
  try {
    let forceUpdate = ((Date.now() - lastUpdateSent) > MQTT_INTERVAL)
    let content = await RP(MONITOR_URL)
    if (content !== lastLoadedContent || forceUpdate) {
      await client.publish(MQTT_TOPIC, content)
      lastLoadedContent = content
      lastUpdateSent = Date.now()
    }
  } catch (e) {
    handleError(e.stack)
  }
}

// Main
const MONITOR_URL = process.env.MONITOR_URL || handleError('Missing MONITOR_URL')
const MONITOR_INTERVAL = parseInt(process.env.MONITOR_INTERVAL) || handleError('Missing MONITOR_INTERVAL')
const MQTT_URI = process.env.MQTT_URI || handleError('Missing MQTT_URI')
const MQTT_TOPIC = process.env.MQTT_TOPIC || handleError('Missing MQTT_TOPIC')
const MQTT_INTERVAL = process.env.MQTT_INTERVAL ? parseInt(process.env.MQTT_INTERVAL) : MONITOR_INTERVAL

var lastLoadedContent = ''
var lastUpdateSent = 0

const client = MQTT.connect(MQTT_URI)

client.on('connect', connected)

setInterval(monitorURL, MONITOR_INTERVAL)
