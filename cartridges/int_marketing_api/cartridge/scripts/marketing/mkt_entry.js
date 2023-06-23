var ServiceCredential = require('dw/svc/ServiceCredential');
var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var Site = require('dw/system/Site');
var Resource = require('dw/web/Resource');

serviceConfig = {
  mockExec: function () {
    return [];
  },

  createRequest: function (service, dataContainer, token) {
    const URL = service.configuration.credential.URL + 'interaction/v1/events';

    service.URL = URL;
    service.addHeader("Content-Type", "application/json");
    service.addHeader("Authorization", "Bearer " + token)
    service.setRequestMethod("POST");

    return JSON.stringify(dataContainer)
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

module.exports = LocalServiceRegistry.createService('mkt.entry.event', serviceConfig)