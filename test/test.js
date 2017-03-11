import _ from 'lodash'
import request from 'supertest'
import fs from 'fs'
import path from 'path'
import shelljs from 'shelljs'

import 'should'
import app from '../src'

describe('HTTP APP TEST', () => {
  describe('Koa GET /', () => {
    it('should 200', (done) => {
      request(app.listen())
        .get('/')
        .set('Accept', 'application/text')
        .expect('Content-Type', /text/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw new Error(err)
          }
          // console.log(res.text)
          res.text.should.equal("<!DOCTYPE html>\n<html>\n  <head>\n    <title>Hello Koa2</title>\n    <link rel='stylesheet' href='/static/stylesheets/style.css' />\n  </head>\n  <body>\n    <h1>Hello Koa2</h1>\n    <p>EJS Welcome to Koa2</p>\n  </body>\n</html>\n")
          done()
        })
    })
  })

  describe('Koa Static, GET /static/stylesheets/style.css', () => {
    it('should 200', (done) => {
      const styleCssContent = fs.readFileSync(path.join(__dirname, '../public/static/stylesheets/style.css'), 'utf-8')
      request(app.listen())
        .get('/static/stylesheets/style.css')
        .set('Accept', 'application/text')
        .expect('Content-Type', /text/)
        .end((err, res) => {
          if (err) {
            throw new Error(err)
          }
          // console.log(res)
          res.status.should.equal(200)
          // console.log(res.text)
          res.text.should.equal(styleCssContent)
          done()
        })
    })
  })

  describe('GET /pathNotMatchAny', () => {
    it('should 404', (done) => {
      request(app.listen())
        .get('/pathNotMatchAny')
        .set('Accept', 'application/text')
        .expect('Content-Type', /text/)
        .end((err, res) => {
          if (err) {
            throw new Error(err)
          }
          // console.log(res)
          res.status.should.equal(404)
          done()
        })
    })
  })
})


describe('RESOURCE TEST', () => {
  shelljs.exec('npm run migrate reset')

  describe('Get collection', () => {
    it('should 200', done => {
      request(app.listen())
        .get('/user')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw new Error(err)
          res.body.length.should.be.aboveOrEqual(1)
          done()
        })
    })

    it('should 200 and is object', done => {
      request(app.listen())
        .get('/user/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw new Error(err)
          _.isObject(res.body).should.equal(true)
          done()
        })
    })

    it('should 404', done => {
      request(app.listen())
        .get('/user/0')
        .expect(404, done)
    })
  })

  describe('Create', () => {
    it('should 201', done => {
      request(app.listen())
        .post('/user')
        .type('form')
        .send({
          name: 'whoami',
          email: 'whoami@who.com',
          password: '1233',
          phoneNumber: '13300000000',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201, done)
    })

    it('should 409', done => {
      request(app.listen())
        .post('/user')
        .type('form')
        .send({
          name: 'demo',
          email: 'whoami@who.com',
          password: '1233',
          phoneNumber: '13300000000',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(409, done)
    })
  })

  describe('Update', () => {
    it('should 201', done => {
      request(app.listen())
        .patch('/user/1')
        .type('form')
        .send({ name: 'tester', })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    })

    it('should 409', done => {
      request(app.listen())
        .patch('/user/1')
        .type('form')
        .send({ name: 'whoami', })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(409, done)
    })

    it('should 404', done => {
      request(app.listen())
        .patch('/user/0')
        .type('form')
        .send({ name: 'whoami', })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404, done)
    })
  })

  describe('Destroy', () => {
    it('should 404', done => {
      request(app.listen())
        .delete('/user/0')
        .expect(404, done)
    })

    it('should 204', done => {
      request(app.listen())
        .delete('/user/1')
        .expect(204, done)
    })
  })
})