import Ember from 'ember';

export default Ember.Mixin.create({
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

			Ember.$('select').material_select();
		});
	}
});
