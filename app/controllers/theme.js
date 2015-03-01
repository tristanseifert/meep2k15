import Ember from 'ember';

export default Ember.Controller.extend({
	// Shown in the dropdown
	sortByKeys: Ember.A([
		{
			title: "Cost",
			id: "cost"
		}, {
			title: "Popularity",
			id: "popularity"
		}
	]),

	// Query parameters
	//queryParams: ['sortBy'],
	sortBy: 'popularity'

	// Arranged content. This performs sorting and shit.
	
});