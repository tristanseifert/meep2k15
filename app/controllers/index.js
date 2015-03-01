import Ember from 'ember';

export default Ember.ArrayController.extend({
	actions: {
		random: function() {
			var content = this.get('content').content;
			var cnt = content.length;

			// randomisour !!!
			var index = Math.round(Math.random() * (cnt - 0) + 0);

			// get the random theme
			var theme = content[index];
			console.log(theme);

			// transition
			this.transitionTo('theme', theme);
		}
	}
});
