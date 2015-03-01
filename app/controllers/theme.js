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

	// list of lengths to stay plox
	stayLengths: Ember.A([
		2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
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