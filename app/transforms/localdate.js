import DS from 'ember-data';

/**
 * This transform converts between JS Date objects, and dates in the localtime
 * format (such as "2015-02-28T05:58:00") that is used for date/time pickers.
 */
export default DS.Transform.extend({
	/**
	 * Converts a string, in the "YYYY-MM-DDTHH:mm:ss" format, to a JS date.
	 */
	deserialize: function(serialized) {
		var m, date;

		// convert the string to a date, in a pedantic manner
		m = moment(serialized, 'YYYY-MM-DDTHH:mm:ss', true);
		date = m.toDate();

		if(m.isValid()) {
			return date;
		} else {
			//console.warn('Date did not match format, using native parsing: ' + serialized);
			return new Date(serialized);
		}
	},

	/**
	 * Converts a JS date object to a string, using the "YYYY-MM-DDTHH:mm:ss"
	 * format.
	 */
	serialize: function(deserialized) {
		var m, str;

		if(deserialized instanceof Date) {
			// it's a Date: create object and format it simply
			m = moment(deserialized);
			str = m.format('YYYY-MM-DDTHH:mm:ss');

			return str;
		} else {
			// it is a string instead
			m = moment(deserialized, 'YYYY-MM-DDTHH:mm:ss');
			str = m.format('YYYY-MM-DDTHH:mm:ss');

			return str;
		}
	}
});
