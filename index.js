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
        var params = {
            "service_key": options.key,
            "incident_key": incident.key,
            "event_type": "trigger",
            "description": incident.description,
            "client": incident.client || "Sample Monitoring Service",
            "client_url": "https://" + options.domain + ".service.com",
            // "details": {
            //     "ping time": "1500ms",
            //     "load avg": 0.75
            // },
            // "contexts": [{
            //     "type": "link",
            //     "href": "http://acme.pagerduty.com"
            // }, {
            //     "type": "link",
            //     "href": "http://acme.pagerduty.com",
            //     "text": "View the incident on PagerDuty"
            // }, {
            //     "type": "image",
            //     "src": "https://chart.googleapis.com/chart?chs=600x400&chd=t:6,2,9,5,2,5,7,4,8,2,1&cht=lc&chds=a&chxt=y&chm=D,0033FF,0,0,5,1"
            // }, {
            //     "type": "image",
            //     "src": "https://chart.googleapis.com/chart?chs=600x400&chd=t:6,2,9,5,2,5,7,4,8,2,1&cht=lc&chds=a&chxt=y&chm=D,0033FF,0,0,5,1",
            //     "href": "https://google.com"
            // }]
        };
        var postData = JSON.stringify(params);
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
        if (incident.details) {
            params.details = incident.details;
        }
        if (incident.contexts) {
            params.contexts = incident.contexts;
        }
        var req = http.request(requestOptions, function(res) {
            res.setEncoding('utf8');
            var data = '';
            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function() {});
        });
        req.on('error', function(e) {
            callback(false, {});
        });
        req.write(postData);
        req.end();
        return this;
    };
}
plugins.alarms.register('pagerduty', function(config, handler, method, data) {
    if (data instanceof Array) {
        data.forEach(function(item) {
            (new PagerDuty(config)).trigger({
                key: item.alarm_id,
                client: 'ClusterControl Alarm: ' + item.alarm_name,
                description: item.message,
                details: item
            })
        })
    }
});