import _ from 'lodash'
import request from 'supertest'
import shelljs from 'shelljs'

import 'should'
import app from '../src'

describe('RESOURCE TEST', () => {
  before(function () {
    this.timeout(10000)
    shelljs.exec('npm run migrate reset')
  })

  describe('Get collection', () => {
    it('should 200', done => {
      request(app.listen())
        .get('/users')
        .set('Accept', 'application/json')
        .expect('content-type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw new Error(err)
          res.body.items.length.should.be.aboveOrEqual(1)
          done()
        })
    })

    it('should 200 and is object', done => {
      request(app.listen())
        .get('/users/1')
        .set('Accept', 'application/json')
        .expect('content-type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw new Error(err)
          _.isObject(res.body).should.equal(true)
          done()
        })
    })

    it('should 204', done => {
      request(app.listen())
        .get('/users/10')
        .expect(204, done)
    })
  })

  describe('Create', () => {
    it('should 201', done => {
      request(app.listen())
        .post('/users')
        .type('form')
        .send({
          name: 'whoami',
          email: 'whoami@who.com',
          password: '1233',
          phoneNumber: '13300000000'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201, done)
    })

    it('should 409', done => {
      request(app.listen())
        .post('/users')
        .type('form')
        .send({
          name: 'demo',
          email: 'whoami@who.com',
          password: '1233',
          phoneNumber: '13300000000'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(409, done)
    })
  })

  describe('Update', () => {
    it('should 201', done => {
      request(app.listen())
        .patch('/users/1')
        .type('form')
        .send({ name: 'tester' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    })

    it('should 409', done => {
      request(app.listen())
        .patch('/users/1')
        .type('form')
        .send({ name: 'whoami' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(409, done)
    })

    it('should 204', done => {
      request(app.listen())
        .patch('/users/0')
        .type('form')
        .send({ name: 'whoami' })
        .expect(204, done)
    })
  })

  describe('Destroy', () => {
    it('should 204', done => {
      request(app.listen())
        .delete('/users/0')
        .expect(204, done)
    })

    it('should 204', done => {
      request(app.listen())
        .delete('/users/1')
        .expect(204, done)
    })
  })
})
