const cuid = require('cuid')
const { mongoose } = require('./db')

const productSchema = new mongoose.Schema({
  _id: {
    type: String
  },
  tags: [{ title: String }]
}, {
  strict: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id
      delete ret._id
      return ret
    }
  },
  toObject: {
    virtuals: true
  }
})
const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

function normalize(product) {
  if (!product) {
    return null
  }

  if (typeof product.toObject === 'function') {
    return product.toObject({ virtuals: true })
  }

  if (product._id) {
    product.id = product.id || product._id
    delete product._id
  }

  return product
}
  async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const filter = tag ? { 'tags.title': tag } : {}
   const results = await Product.find(filter)
    .skip(Number(offset))
    .limit(Number(limit))
    .lean({ virtuals: true })
    .exec()
      return results.map(normalize)
}

async function get(id) {
const product = await Product.findById(id)
    .lean({ virtuals: true })
    .exec()
  return normalize(product)
}

async function create(data) {
  const product = new Product({
    _id: data.id || data._id || cuid(),
    ...data
  })

  await product.save()
  return normalize(product)
}

async function edit(id, changes) {
  const update = { ...changes }
  delete update.id
  delete update._id

  const product = await Product.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true
  })
    .lean({ virtuals: true })
    .exec()

  return normalize(product)
}

 async function destroy(id) {
  const result = await Product.deleteOne({ _id: id }).exec()
  return result.deletedCount === 1
 }
module.exports = {
  list,
   get,
  create,
  edit,
  destroy
}