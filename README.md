nodejs-service-status-example2
==============================

Node.js application example, check diferent types of remote services and expose a REST API


### Prereqs

- MongoDB
- Node.js (update version) y NPM

```bash
sudo apt-get install python-software-properties python g++ make software-properties-common
sudo add-apt-repository ppa:chris-lea/node.js 
sudo apt-get update 
sudo apt-get install nodejs npm

other option
sudo apt-get install nodejs=0.8.23-1chl1~precise1
```

### Install

```bash
git clone https://github.com/fluxitsoft/nodejs-service-status-example
cd nodejs-service-status-example
npm install
node server.js
```


### API
Access to http://localhost:3000/services
