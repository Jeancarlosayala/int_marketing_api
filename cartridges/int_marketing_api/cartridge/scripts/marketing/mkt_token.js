var ServiceCredential = require('dw/svc/ServiceCredential');
var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var Resource = require('dw/web/Resource');

serviceConfig = {
  mockExec: function () {
    return [];
  },

  createRequest: function (service) {
    const URL = service.configuration.credential.URL + 'v2/token';
    const { client_id_mkt, secret_mkt } = Site.getCurrent().getPreferences().custom

    service.URL = URL;
    service.addHeader("Content-Type", "application/json");
    service.setRequestMethod("POST");
    var requestData = {
      "grant_type": "client_credentials",
      "client_id": client_id_mkt,
      "client_secret": secret_mkt
  };

    return JSON.stringify(requestData);
  },

  parseResponse: function (service, response) {
    var responseObject = {};
    try {
      if (response.statusCode === 200 || response.statusCode === 201 || response.statusCode === 204) {
        responseObject = JSON.parse(response.text);
      }
    } catch (error) {
      throw new Error('Service error with Status Code: ' + service.statusCode);
    }
    return JSON.parse(response.text);
  },
}

module.exports = LocalServiceRegistry.createService('mkt.token', serviceConfig)