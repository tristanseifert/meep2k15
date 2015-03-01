import Ember from 'ember';
import UIInitMixin from '../mixins/uielement-initialisers';

export default Ember.Route.extend(UIInitMixin, {
	model: function(params) {
		var themeId = params.theme_id;
		var theme = this.store.find('theme', themeId);

		var controller = this.controllerFor('theme');

		// theme id, length of stay, max price
		var length = controller.get('lengthOfStay');
		var price = controller.get('maxPrice');

		/**
		 * This promise is resolved when we want to get a list of vcaations for
		 * a given theme.
		 *
		 * Call "resolve" with the array on success, or reject if an error.
		 */
		var promise = new Ember.RSVP.Promise(function(resolve, reject) {
			// put them API calls here pls

			// build the stuff
			var infos = {
				name: theme.get('name')
			};
			console.log(infos);

			resolve(infos);
		});

		return promise;
	}
});
