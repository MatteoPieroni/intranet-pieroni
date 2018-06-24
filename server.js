const express = require('express');
const app = express();
const path = require('path');
const skebby = require('./skebbyserver');
const fb = require('./workplaceserver');
const perm = require('./permissionserver');
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies

app.use('/', express.static(__dirname +  '/'));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

const hostname = 'localhost';
const port = 3000;

const server = app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);  
});

app.post('/smsapi/send', function(req, res) {
  var smsData = {
      "returnCredits": true,
      "recipient": [
          req.body.num
      ],
      "message": req.body.messaggio,
      "message_type": "GP",
      "sender" : "pieroni srl"
  };

  skebby.send(smsData, res);
});
app.post('/smsapi/gethistory', function(req, res) {
	skebby.getHistory(req.body.dateFirst, req.body.dateLast, 50, res);
});
app.post('/fbapi/getgroups', function(req, res) {
  fb.getGroups(res);
});
app.post('/permissionsapi', function(req, res) {
  perm.grantPermit(req.body.email, res);
});
