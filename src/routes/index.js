const express = require('express')
const guideRouter = require('./guide.router')
const usersRouter = require('./users.router')
const stocksRouter = require('./stocks.router')

function routerApi(app) {
  const router = express.Router()
  app.use('/api/v1', router)
  router.use("/guide", guideRouter)
  router.use('/users', usersRouter)
  router.use('/stocks', stocksRouter)
  /*router.use('/categories', categoriesRouter);
  router.use('/users', usersRouter);
  router.use('/orders', orderRouter);
  router.use('/customers', customersRouter);
  router.use('/auth', authRouter);
  router.use('/profile', profileRouter);*/
}

module.exports = routerApi
