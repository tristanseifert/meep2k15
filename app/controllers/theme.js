import Ember from 'ember';

export default Ember.ObjectController.extend({
	// Shown in the dropdown
	sortByKeys: Ember.A([
		"Cost",
		"Popularity"
	]),

	// Query parameters
	queryParams: ['sortBy', 'maxPrice'],
	sortBy: 'Popularity',
	maxPrice: 750,

	// Arranged content. This performs sorting and shit.
	arrangedContent: function() {
		var content = this.get('content');

		return content;
	}.property('content', 'sortBy')
});