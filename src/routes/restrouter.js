'use strict';

import _ from 'lodash'

const debug = require('debug')('koa-sequelize-resource')

function handleError(err, ctx) {
  const e = _.cloneDeep(err)

  delete e.name
  delete e.parent
  delete e.original
  delete e.sql

  e.code = err.original.code

  switch(e.code) {
    case 'ER_NO_DEFAULT_FOR_FIELD':
      ctx.throw(400, e)
      break
    case 'ER_DUP_ENTRY':
      ctx.throw(409, e)
      break
    default:
      ctx.throw(500, e)
  }
}

export default class Rest
{
  constructor(model, options) {
    debug(model);
    this.model = model;
    this.options = {idColumn: 'id', ...options}
  }

  async _getEntity(ctx, include) {
    // Fetch the entity
    return this.model.findOne({
      where: { [this.options.idColumn]: ctx.params[this.options.idColumn] },
      include
    });
  }

  getEntity(include) {
    let rest = this

    return async (ctx, next) => {
      this.instance = await rest._getEntity(ctx, include)
      debug(`Loaded ${rest.model.name} ${this.instance}`)

      await next();
    };
  }

  create() {
    let rest = this;

    return async (ctx, next) => {
      this.instance = await rest.model.create(ctx.request.body)
                        .catch(err => handleError(err, ctx))

      debug(`Created ${rest.model.name} ${this.instance}`);

      await next()

      ctx.status = 201;
      ctx.body = this.instance;
    };
  }

  readOne() {
    let rest = this;

    return async (ctx, next) => {
      this.instance = await rest._getEntity(ctx, [{ all: true }]);

      if (this.instance === null) ctx.throw(404)

      await next()

      ctx.status = 200;
      ctx.body = this.instance;
    };
  }

  readAll(options) {
    let rest = this;

    return async (ctx, next) => {
      this.instances = await rest.model.findAll(_.merge(ctx.state.where, options));

      await next()

      ctx.status = 200;
      ctx.body = this.instances
    };
  }

  update(options) {
    let rest = this;

    return async (ctx, next) => {
      this.instance = await rest._getEntity(ctx, [])

      if (this.instance === null) ctx.throw(404)

      this.instance = await this.instance.update(ctx.request.body, options)
                        .catch(err => handleError(err, ctx))
      
      debug(`Updated ${rest.model.name} ${this.instance}`);

      await next()

      ctx.status = 200;
      ctx.body = this.instance;
    };
  }

  destroy() {
    let rest = this;

    return async (ctx, next) => {
      this.instance = await rest._getEntity(ctx, [])

      if (this.instance === null) ctx.throw(404)

      await this.instance.destroy()

      debug(`Deleted ${rest.model.name} ${this.instance}`);

      await next()

      ctx.status = 204;
    };
  }
}
