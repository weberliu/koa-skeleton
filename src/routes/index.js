import Sequelize from 'sequelize'
import Router from 'koa-router'

import {models} from '../models/'
import RestRouter from './restrouter'
import Home from '../controllers/home'

const router = Router()

router.get('/', Home)


const user = new RestRouter(models.User)


router.get('/user', user.readAll())
router.get('/user/:id', user.readOne())
router.post('/user', user.create())
router.patch('/user/:id', user.update())
router.delete('/user/:id', user.destroy())

export default router