import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return this.store.find('theme');
	},
	
	/**
	 * Perform some initialisation with the UI after it renders.
	 */
	setupController: function(controller, model){
		this._super(controller, model);
			console.log('lol yes');

		Ember.run.schedule('afterRender', this, function () {
			// Initialise dropdowns
			Ember.$('.dropdown-button').dropdown({
				hover: false
			});

			console.log('lol no');
		});
	}
});
