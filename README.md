Node.js Service heartbeat
==============================

Node.js server used to check the status of differents types of services, collect the information and expose it via a REST API

### Type of services
- HTTP Web Application 
- Hudson project (build status)
- TODO ping and ip
- TODO check database
-

### Prereqs

- MongoDB
- Node.js (update version) y NPM

```bash
sudo apt-get install python-software-properties python g++ make software-properties-common
sudo add-apt-repository ppa:chris-lea/node.js 
sudo apt-get update 
sudo apt-get install nodejs npm

```

### Install

```bash
git clone https://github.com/fluxitsoft/nodejs-service-heartbeat
cd nodejs-service-status-example
npm install
node server.js
```


### API
- Access to the service status  http://localhost:3000/status
- Access to the service definition  http://localhost:3000/service
