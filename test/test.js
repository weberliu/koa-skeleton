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


describe('RESOURCE TEST', _ => {
  shelljs.exec('npm run migrate reset')

  describe('Get', _ => {
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
  })
})