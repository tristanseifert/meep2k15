import Ember from 'ember';
import UIInitMixin from '../mixins/uielement-initialisers';

export default Ember.Route.extend(UIInitMixin, {
	model: function() {
		return this.store.find('theme');
	}
});
