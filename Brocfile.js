/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

// MaterialiseCSS JS and friends
app.import('bower_components/materialize/dist/js/materialize.js');

// MaterializeCSS Fonts
app.import("bower_components/materialize/dist/font/material-design-icons/Material-Design-Icons.woff", {
	destDir: "assets/fonts/material-design-icons"
});

app.import("bower_components/materialize/dist/font/roboto/Roboto-Bold.ttf", {
	destDir: "assets/fonts/roboto"
});
app.import("bower_components/materialize/dist/font/roboto/Roboto-Light.ttf", {
	destDir: "assets/fonts/roboto"
});
app.import("bower_components/materialize/dist/font/roboto/Roboto-Medium.ttf", {
	destDir: "assets/fonts/roboto"
});
app.import("bower_components/materialize/dist/font/roboto/Roboto-Regular.ttf", {
	destDir: "assets/fonts/roboto"
});
app.import("bower_components/materialize/dist/font/roboto/Roboto-Thin.ttf", {
	destDir: "assets/fonts/roboto"
});

// moment
app.import('bower_components/moment/moment.js');

module.exports = app.toTree();
