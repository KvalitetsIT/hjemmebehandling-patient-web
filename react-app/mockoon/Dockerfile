FROM node:14-alpine

RUN npm install -g @mockoon/cli@2.0.0
COPY . .

# Do not run as root.
RUN adduser --shell /bin/sh --disabled-password --gecos "" mockoon
RUN chown -R mockoon ./env.json
USER mockoon

EXPOSE 3030

ENTRYPOINT ["mockoon-cli", "start", "--hostname", "0.0.0.0", "--daemon-off", "--data", "env.json", "--container"]

# Usage: docker run -p <host_port>:<container_port> mockoon-test