'use strict';

/**
 * @namespace EmailSubscribe
 */

var server = require('server');
server.extend(module.superModule)

var Site = require('dw/system/Site');

const mkt_entry = require("~/cartridge/scripts/marketing/mkt_entry.js");
const mkt_token = require("~/cartridge/scripts/marketing/mkt_token.js");

/**
 * Checks if the email value entered is correct format
 * @param {string} email - email string to check if valid
 * @returns {boolean} Whether email is valid
 */
function validateEmail(email) {
    var regex = /^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$/;
    return regex.test(email);
}

/**
 * EmailSubscribe-Subscribe : The EmailSubscribe-Subscribe enpoint allows the shopper to submit their eamil address to be added to a mailing list. OOB SFRA does not have a mailing list feature however this endpoint call a hook would allow for a customer to easily allow for custiomization
 * @name Base/EmailSubscribe-Subscribe
 * @function
 * @memberof EmailSubscribe
 * @param {httpparameter} - emailId - Input field, The shopper's email address
 * @param {category} - sensitive
 * @param {returns} - json
 * @param {serverfunction} - post
 */
server.replace('Subscribe', function (req, res, next) {
    var Resource = require('dw/web/Resource');
    var hooksHelper = require('*/cartridge/scripts/helpers/hooks');

    const { mktNewsletterKey } = Site.getCurrent().getPreferences().custom

    var email = req.form.emailId;
    var isValidEmailid;

    if (email) {
        isValidEmailid = validateEmail(email);
        var token = mkt_token.call();

        if (isValidEmailid) {
            hooksHelper('app.mailingList.subscribe', 'subscribe', [email], function () { });

            if (token.ok) {
                var entryData = {}
                entryData.ContactKey = email;
                entryData.EventDefinitionKey = mktNewsletterKey
                entryData.Data = {
                    "Email": email,
                    "Nombre": "",
                    "Contact ID": email
                }

                var response = mkt_entry.call(entryData, token.object.access_token)

                res.json({
                    success: true,
                    msg: Resource.msg('subscribe.email.success', 'homePage', null)
                });
            }
        } else {
            res.json({
                error: true,
                msg: Resource.msg('subscribe.email.invalid', 'homePage', null)
            });
        }
    } else {
        res.json({
            error: true,
            msg: Resource.msg('subscribe.email.invalid', 'homePage', null)
        });
    }

    next();
});


module.exports = server.exports();
