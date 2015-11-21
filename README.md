## @Severalnines/@PagerDuty integration plugin

[severalnines.com](http://www.severalnines.com/) | [pagerduty.com](http://www.pagerduty.com/)

This plugin allows you to simply integrate Severalnines ClusterControl and PagerDuty.

### Incomming parameters
#### config
```json
{
	"key":"somePageDutyKey"
}
```
#### data
More information on the ```details``` and the ```contexts``` can be found [here](https://developer.pagerduty.com/documentation/integration/events/trigger).
```json
{
	"alarm_id":123,
	"alarm_name":"Short alarm name",
	"alarm_description":"Long description (1024 chars max)",
	"details": {
		"some":"details",
		"go":"here",
		"a":"b",
		"c":"d"
	},
	"contexts":[
		{
			"type": "link",
			"href": "http://acme.pagerduty.com"
		},
		{
			"type": "link",
			"href": "http://acme.pagerduty.com",
			"text": "View the incident on PagerDuty"
		},
		{
			"type": "image",
			"src": "https://chart.googleapis.com/chart?chs=600x400&chd=t:6,2,9,5,2,5,7,4,8,2,1&cht=lc&chds=a&chxt=y&chm=D,0033FF,0,0,5,1"
		},
		{
			"type": "image",
			"src": "https://chart.googleapis.com/chart?chs=600x400&chd=t:6,2,9,5,2,5,7,4,8,2,1&cht=lc&chds=a&chxt=y&chm=D,0033FF,0,0,5,1",
			"href": "https://google.com"
		}
	]
}
```