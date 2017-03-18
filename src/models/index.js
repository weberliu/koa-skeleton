'use strict';

import fs        from 'fs'
import path      from 'path'
import Sequelize from 'sequelize'
import logger    from 'debug'
import config    from '../../database/config.json'

const basename  = path.basename(module.filename);
const env       = process.env.NODE_ENV || 'development';
const debug     = logger('Models')
const options   = { ...config[env], logging: debug, }

let models    = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(options.env[options.use_env_variable], options);
} else {
  var sequelize = new Sequelize(options.database, options.username, options.password, options);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    models[model.name] = model;
  });

Object.keys(models).forEach(function(modelName) {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
})

module.exports = {
  sequelize, models,
}