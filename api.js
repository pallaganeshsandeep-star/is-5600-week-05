const path = require('path')
const Products = require('./products')
const Orders = require('./orders')
const autoCatch = require('./lib/auto-catch')

/**
 
*/
function handleRoot(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'))
}

async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}


async function getProduct(req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)
  if (!product) {
    return next()
  }

  return res.json(product)
}

async function createProduct(req, res) {
  const product = await Products.create(req.body)
  res.status(201).json(product)
}

async function editProduct(req, res, next) {
  const { id } = req.params
  const product = await Products.edit(id, req.body)

  if (!product) {
    return next()
  }

  return res.json(product)
}


async function deleteProduct(req, res, next) {
    const { id } = req.params
  const deleted = await Products.destroy(id)

  if (!deleted) {
    return next()
  }

  res.json({ success: true })
}

async function listOrders(req, res) {
  const { offset = 0, limit = 25 } = req.query
  res.json(await Orders.list({
    offset: Number(offset),
    limit: Number(limit)
  }))
}

async function getOrder(req, res, next) {
  const { id } = req.params
  const order = await Orders.get(id)

  if (!order) {
    return next()
  }

  return res.json(order)
}

async function createOrder(req, res) {
  const order = await Orders.create(req.body)
  res.status(201).json(order)
}

async function editOrder(req, res, next) {
  const { id } = req.params
  const order = await Orders.edit(id, req.body)

  if (!order) {
    return next()
  }

  return res.json(order)
}

async function deleteOrder(req, res, next) {
  const { id } = req.params
  const deleted = await Orders.destroy(id)

  if (!deleted) {
    return next()
  }

  return res.json({ success: true })
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  editProduct,
   deleteProduct,
  listOrders,
  getOrder,
  createOrder,
  editOrder,
  deleteOrder
})