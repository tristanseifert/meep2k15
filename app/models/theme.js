import DS from 'ember-data';

var Theme = DS.Model.extend({
	title: DS.attr('string')
});

Theme.reopenClass({
	FIXTURES: [
		{
			title: "potato spheres",
			id: "potato"
		},
		{
			title: "watermelon oranges",
			id: "watermelon"
		},
		{
			title: "meepers #258241",
			id: "meep"
		},
	]
});

export default Theme;
