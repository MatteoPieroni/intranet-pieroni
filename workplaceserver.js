const BASEURL = 'https://graph.facebook.com/community'; 
const graph = require('fbgraph');
const fbAuth = require('./fb_auth')
const access_token = fbAuth.access_token; 
const app_secret = fbAuth.app_secret; 
 
graph.setAccessToken(access_token); 
graph.setAppSecret(app_secret) 
/** 
 * Sends an SMS message 
 */ 
function getGroups(res) { 
    graph.get("community/groups", function(err, data) { 
        if(!err && data) { 
            res.send(data); 
        } else { 
            res.send(err); 
        } 
    }) 
}; 
 
module.exports = { 
    getGroups: getGroups 
}