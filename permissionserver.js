const adminEmail = require('./adminmail');

/** 
 * Check if email is present in admin permissions
 */ 
function grantPermit(emailToGrant, res) { 
    if (Object.values(adminEmail.adminObj).indexOf(emailToGrant) > -1) {
    	res.send('PERMITTED');
    }
}; 
 
module.exports = { 
    grantPermit: grantPermit 
}