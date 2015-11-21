/**
 * System HTTPS library
 * @type {http}
 */
var http = require('https');
/**
 * Pagerduty class
 * @param {Object} options
 */
function PagerDuty(options) {
    options = options || {};
    if (!options.key) {
        throw new Error('Service key not provided for Pagerduty');
    }
    /**
     * Trigger a Pagerduty incident
     * @param {Object} incident
     * @return {Pagerduty}
     */
    this.trigger = function(incident) {
        /**
         * Incident parameters
         * @type {Object}
         */
        var params = {
            "service_key": options.key,
            "incident_key": incident.client + '/' + incident.id,
            "event_type": "trigger",
            "description": incident.description,
            "client": incident.name || "ClusterControl",
            "client_url": incident.url || "http://www.severalnines.com"
        };
        if (incident.details) {
            params.details = incident.details;
        }
        if (incident.contexts) {
            params.contexts = incident.contexts;
        }
        /**
         * Convers JSON to String
         * @type {String}
         */
        var postData = JSON.stringify(params);
        /**
         * Http request options
         * @type {Object}
         */
        var requestOptions = {
            hostname: 'events.pagerduty.com',
            port: 443,
            path: '/generic/2010-04-15/create_event.json',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };
        /**
         * Retquest object
         * @type {Object}
         */
        var requestObject = http.request(requestOptions, function(response) {
            response.setEncoding('utf8');
            var data = '';
            response.on('data', function(chunk) {
                data += chunk;
            });
            response.on('end', function() {});
        });
        requestObject.on('error', function() {});
        requestObject.write(postData);
        requestObject.end();
        return this;
    };
}
/**
 * Start listening for adviser object
 */
plugins.advisers.register('pagerduty', function(config, data) {
    if (data instanceof Array) {
        data.forEach(function(item) {
            try {
                (new PagerDuty(config)).trigger({
                    id: item.alarm_id,
                    name: 'ClusterControl: ' + item.alarm_name,
                    client: item.client,
                    description: item.alarm_description,
                    details: item.details,
                    contexts: item.contexts
                });
            } catch (error) {
                logger.warning('PageDuty: ' + error.message);
            }
        })
    }
});