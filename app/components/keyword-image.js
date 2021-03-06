import Ember from 'ember';

/**
 * This view will find an image that matches either a string of keywords, or an
 * array thereof. It will load an image that is 1024x768 in size.
 */
export default Ember.Component.extend({
	tagName: 'img',
	attributeBindings: ['src'],
	//classNames: ['materialboxed'],

	src: function() {
		// assume keywords are a string
		var keywordList = this.get('keywords');

		// get the URL
		var src = "http://loremflickr.com/640/480/" + keywordList + ",skyline/all";
		//console.log(src);

		// set as src
		//this.set('src', src);
		return src + "?t=" + Math.random();
	}.property('keywords'),

	// do some shit
	/*plsFocus: function() {
		Ember.$(this).materialbox();
	}.on('didInsertElement')*/
});
