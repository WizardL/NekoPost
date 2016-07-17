"use strict";

var request = require('supertest');
var assert = require('assert');

var Misato = require('../index.js');

describe('GET /', function () {
	it('Start Misato web server', function(done) {
		request(global.Misato.app)
			.get('/')
			.expect('Content-Type', /html/)
			.expect(200, done);
	});
});

