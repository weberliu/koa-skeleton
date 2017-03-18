import Sequelize from 'sequelize'
import Router from 'koa-sequelize-resource'

import {sequelize, models} from '../models/'
import Home from '../controllers/home'

const router = Router(sequelize.models)
// console.log(sequelize.models)

router
  .get('/', Home)
  .crud('/user', resources => resources.user)


export default router