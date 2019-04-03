# url-to-mqtt

Monitor a URL and post its content to an MQTT topic

## Run

### Docker

```
docker run \
  -it \
  --rm \
  --name url-to-mqtt \
  -e MONITOR_URL=https://www.random.org/integers/?num=1&min=1&max=123456789&col=1&base=10&format=plain&rnd=new \
  -e MONITOR_INTERVAL=10000 \
  -e MQTT_URI=tcp://test.mosquitto.org:1883/ \
  -e MQTT_TOPIC=/randomnumbers \
  tyisi/url-to-mqtt
```

### Docker Compose

```
services:
  url-to-mqtt:
    image: tyisi/url-to-mqtt
    environment:
      - MONITOR_URL=https://www.random.org/integers/?num=1&min=1&max=123456789&col=1&base=10&format=plain&rnd=new
      - MONITOR_INTERVAL=10000
      - MQTT_URI=tcp://test.mosquitto.org:1883/
      - MQTT_TOPIC=/randomnumbers
```

## Variables

### MONITOR_URL

The URL to be monitored

### MONITOR_INTERVAL

Monitoring interval in milliseconds

### MQTT_URI

This is a URI supported by [async-mqtt](https://github.com/mqttjs/async-mqtt)

### MQTT_TOPIC

An MQTT topic
