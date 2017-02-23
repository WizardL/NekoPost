"use strict";

import Misato from '../backend'
import supertest from 'supertest'

const request = supertest.agent(Misato.listen())

describe('GET /', function () {
	it('Start Misato web server', function(done) {
		request
			.get('/')
			.expect('Content-Type', 'text/plain; charset=utf-8')
			.expect(404, done);
	});
});

