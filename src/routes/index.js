import Router from 'koa-sequelize-resource'

import {sequelize} from '../models/'
import Home from '../controllers/home'

const router = Router(sequelize.models)
// console.log(sequelize.models)

router
  .get('/', Home)
  .crud('/user', resources => resources.user)

export default router
