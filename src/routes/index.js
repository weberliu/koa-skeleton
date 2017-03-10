import Sequelize from 'sequelize'
import RestQL from 'koa-restql'
import Router from 'koa-router'
// import indexCtrl from '../controllers/indexCtrl'

// const router = Router()

// router.get('/', indexCtrl)

// export default router


import {models} from '../models/'
import RestRouter from './restrouter'

const user = new RestRouter(models.User)
// const restql = new RestQL(models)

// export default restql

const router = Router()

router.get('/user', user.readAll())
router.get('/user/:id', user.readOne())
router.post('/user', user.create())
router.patch('/user/:id', user.update())
router.delete('/user/:id', user.destroy())

export default router