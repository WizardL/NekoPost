"use strict";

import Misato from '../src'
import supertest from 'supertest'

const request = supertest.agent(Misato.listen())

describe('GET /', function () {
	it('Start Misato web server', function(done) {
		request
			.get('/')
			.expect('Content-Type', 'text/html; charset=utf-8')
			.expect(200, done);
	});
});

