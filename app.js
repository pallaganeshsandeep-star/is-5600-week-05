const express = require('express')
const path = require('path')
const fs = require('fs').promises
const api = require('./api')
const middleware = require('./middleware')
const bodyParser = require('body-parser')
const Products = require('./products')

const port = process.env.PORT || 3000
const app = express()
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(middleware.cors)
app.get('/', api.handleRoot)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', api.createProduct)
app.put('/products/:id', api.editProduct)
app.delete('/products/:id', api.deleteProduct)

app.get('/orders', api.listOrders)
app.get('/orders/:id', api.getOrder)
app.post('/orders', api.createOrder)
app.put('/orders/:id', api.editOrder)
app.delete('/orders/:id', api.deleteOrder)

app.use(middleware.notFound)
app.use(middleware.handleError)

async function seedProducts() {
  const existing = await Products.list({ offset: 0, limit: 1 })
  if (existing.length > 0) {
    return
  }

  const dataPath = path.join(__dirname, 'data', 'full-products.json')
  const data = JSON.parse(await fs.readFile(dataPath, 'utf8'))
  for (const product of data) {
    await Products.create(product)
  }
  console.log(`Seeded ${data.length} products into MongoDB`)
}

seedProducts().catch(err => {
  console.error('Product seed failed:', err)
})

app.listen(port, () => console.log(`Server listening on port ${port}`))