import DS from 'ember-data';

var Theme = DS.Model.extend({
	title: DS.attr('string')
});

Theme.reopenClass({
	FIXTURES: [
		{
			title: "Theme Park",
			id: "THEME-PARK"
		},
		{
			title: "Skiing",
			id: "SKIING"
		},
		{
			title: "Shopping",
			id: "SHOPPING"
		},
		{
			title: "Romantic",
			id: "ROMANTIC"
		},
		{
			title: "Outdoors",
			id: "OUTDOORS"
		},
		{
			title: "National Parks",
			id: "NATIONAL-PARKS"
		},
		{
			title: "Mountains",
			id: "MOUNTAINS"
		},
		{
			title: "Historic",
			id: "HISTORIC"
		},
		{
			title: "Gambling",
			id: "GAMBLING"
		},
		{
			title: "Disney",
			id: "DISNEY"
		},
		{
			title: "Beach",
			id: "BEACH"
		},
	]
});

export default Theme;