Node.js Service heartbeat
==============================

Node.js server used to check the status of differents types of services, collect the information and expose it via a REST API

### Type of services
- HTTP Web Application 
- Hudson project (build status)
- ping
- Telnet
- TODO check database


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
cd nodejs-service-heartbeat
npm install
node fill-database.js
```
the node fill-database.js line will connect to the localhost mongodb and store some example service

### Run
```bash
node server.js
```

with this line you cand start the service check using those service and call the API to query the status


### API
- Access to the service status  http://localhost:3000/status
- Access to the service definition  http://localhost:3000/service



## Contribute
nodejs-service-hearbeat is under development, and contributors are welcome. If you have a feature request, suggestion, or bug report, please [open a new issue](http://github.com/fluxitsoft/nodejs-service-heartbeat/issues). 
To submit patches, please send a pull request. 
Once your changes get merged back in, you’ll automatically be added to the [Contributors List](http://github.com/fluxitsoft/nodejs-service-heartbeat/graphs/contributors).

## License
This project is under GNU Lesser General Public License version 3 or later (http://www.gnu.org/licenses/).






