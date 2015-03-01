import Ember from 'ember';
import UIElementInitialisersMixin from '../../../mixins/uielement-initialisers';
import { module, test } from 'qunit';

module('UIElementInitialisersMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var UIElementInitialisersObject = Ember.Object.extend(UIElementInitialisersMixin);
  var subject = UIElementInitialisersObject.create();
  assert.ok(subject);
});
