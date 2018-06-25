const request = require('request');
const skebbyUser = require('./skebby_auth');

var BASEURL = 'https://api.skebby.it/API/v1.0/REST/';

var MESSAGE_HIGH_QUALITY = "GP";
var MESSAGE_MEDIUM_QUALITY = "TI";
var MESSAGE_LOW_QUALITY = "SI";

/**
 * Authenticates the user given it's username and password.  Callback
 * is called when completed. If error is false, then an authentication
 * object is passed to the callback as second parameter.
 */
function login(username, password, callback) {
    request({
        url: BASEURL + 'login?username=' + username + '&password=' + password,
        method: 'GET',
        callback: function (error, responseMeta, response) {
            if (!error && responseMeta.statusCode == 200) {
                var auth = response.split(';');
                callback(error, {
                    user_key : auth[0],
                    session_key : auth[1]
                });
            }
            else {
                callback(error);
            }
        }
    });
}

/**
 * Sends an SMS message
 */
function sendSMS(auth, sendsms, callback) {
    request({
        url: BASEURL + 'sms',
        method: 'POST',
        headers: { 'user_key' : auth.user_key, 'Session_key' : auth.session_key },
        json: true,
        body:  sendsms,

        callback: function (error, responseMeta, response) {
            if (!error && responseMeta.statusCode == 201) {
                callback(response.result !== 'OK', response);
            }
            else {
                callback(false);
            }
        }
    });
};

function getSMSHistory(auth, dateFirst, dateLast, pageSize, callback) {
    request({
        url: 'https://api.skebby.it/API/v1.0/REST/smshistory?from=' + dateFirst + '&to=' + dateLast + '&pageSize=' + pageSize,
        method: 'GET',
        headers: { 'user_key' : auth.user_key, 'Session_key' : auth.session_key },

        callback: function (error, responseMeta, response) {
            if (!error && responseMeta.statusCode == 200) {
                let jsonResponse = JSON.parse(response);
                callback(jsonResponse.result !== 'OK', jsonResponse);
            }
            else {
                console.log('An error occurred..');
            }
        }
    });
}

module.exports = {
    log: function() {
        login(skebbyUser.user, skebbyUser.password, function(error, auth) {
            if(!error) {
                console.log(auth);
            } else {
                console.log(error);
            }
        })
    },
    send: function(smsData, res) {
        login(skebbyUser.user, skebbyUser.password,
          function(error, auth) {
              if (!error) {
                  sendSMS(auth, smsData,
                          function(error, data) {
                              if (error) {
                                  console.log("An error occurred");
                              }
                              else {
                                  if(data == undefined) {
                                    res.send('NO');
                                    console.log("Your data doesn't look right")
                                  } else {
                                    res.send(smsData.recipient);
                                    console.log("Sms sent!")
                                  }
                              }
                          });
              }
        else {
                  console.log("Unable to login");
              }
          });
    },
    getHistory: function(starting, ending, size, res) {
        login(skebbyUser.user, skebbyUser.password,
            function(error, auth) {
                if(!error) {
                    getSMSHistory(auth, starting, ending, size, 
                        function(error, data) {
                            if (error) {
                                //console.log(error)
                            } else {
                                //console.log(data);
                                res.send(data);
                            }
                        }
                    )
                } else {
                    console.log("Unable to login");
                }
            }
        )
    }
}