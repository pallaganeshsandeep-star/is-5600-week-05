const { mongoose } = require('./db')
const Products = require('./products')

const orderItemSchema = new mongoose.Schema({
  product: {
    type: String,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  }
}, { _id: false })

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: String,
  items: {
    type: [orderItemSchema],
    default: []
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
}, {
  timestamps: true,
  toJSON: { virtual: true },
  toObject: { virtual: true }
})

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

function normalize(order) {
  if (!order) {
    return null
  }

  if (order._id) {
    order.id = order.id || order._id
    delete order._id
  }

  return order
}

async function list(options = {}) {
  const { offset = 0, limit = 25 } = options
  const orders = await Order.find()
    .skip(Number(offset))
    .limit(Number(limit))
    .populate('items.product')
    .lean({ virtual: true })
    .exec()

  return orders.map(normalize)
}

async function get(id) {
  const order = await Order.findById(id)
    .populate('items.product')
    .lean({ virtual: true })
    .exec()

  return normalize(order)
}

async function create(orderData) {
  const order = new Order(orderData)
  await order.save()
  return order.toObject({ virtual: true })
}

async function edit(id, changes) {
  const update = { ...changes }
  delete update.id
  delete update._id

  const order = await Order.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true
  })
    .populate('items.product')
    .lean({ virtual: true })
    .exec()

  return normalize(order)
}

async function destroy(id) {
  const result = await Order.deleteOne({ _id: id }).exec()
  return result.deletedCount === 1
}

module.exports = {
  list,
  get,
  create,
  edit,
  destroy
}