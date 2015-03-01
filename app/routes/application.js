import Ember from 'ember';

export default Ember.Route.extend({
	/**
	 * Perform some initialisation with the UI after it renders.
	 */
	setupController: function(controller, model){
		this._super(controller, model);
		Ember.run.schedule('afterRender', this, function () {
			// Initialise dropdowns
			Ember.$('.dropdown-button').dropdown({
				hover: false
			});
		});
	}
});