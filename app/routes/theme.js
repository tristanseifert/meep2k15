import Ember from 'ember';
import UIInitMixin from '../mixins/uielement-initialisers';

import APIStuff from '../api/joswork';

export default Ember.Route.extend(UIInitMixin, {
	joswork: APIStuff.create(),

	model: function(params) {
		var controller = this.controllerFor('theme');
		var _this = this;

		// theme id, length of stay, max price
		var themeId = params.theme_id;
		var length = controller.get('lengthOfStay');
		var price = controller.get('maxPrice');
		var airport = controller.get('airport');

		// get some additonal data
		var theme = this.store.find('theme', themeId);

		/**
		 * This promise is resolved when we want to get a list of vcaations for
		 * a given theme.
		 *
		 * Call "resolve" with the array on success, or reject if an error.
		 */
		var promise = new Ember.RSVP.Promise(function(resolve, reject) {
			// get all the shits
			_this.joswork.getFormattedDestinations(airport, themeId, length, price, function(r) {
				// build the stuff
//				console.log(r);

				var infos = {
					name: theme.get('name'),
					results: r
				};
				console.log(infos);

				resolve(infos);
			});
		});

		return promise;
	}
});
