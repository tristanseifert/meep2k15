import Ember from 'ember';

export default Ember.ObjectController.extend({
	// Shown in the dropdown
	sortByKeys: Ember.A([
		"Cost",
		"Popularity"
	]),

	// List of airports
	airportList: Ember.A([
		"DFW",
		"AUS"
	]),

	// Query parameters
	queryParams: ['sortBy', 'maxPrice', 'lengthOfStay', 'airport'],
	sortBy: 'Popularity',
	maxPrice: 750,
	lengthOfStay: 7,
	airport: 'DFW',

	// Arranged content. This performs sorting and shit.
	arrangedContent: function() {
		var content = this.get('content');

		return content;
	}.property('content', 'sortBy')
});