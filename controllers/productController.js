const Product = require('../models/Product');

// @desc    Get all products with filters, sorting, pagination
exports.getProducts = async (req, res) => {
  const { page = 1, limit = 12, sort = 'createdAt', order = 'desc', search = '', filters = '{}' } = req.query;

  const queryFilters = JSON.parse(filters);
  const keyword = search
    ? { name: { $regex: search, $options: 'i' } }
    : {};

  let filterConditions = { ...keyword };

  if (queryFilters.categories?.length) {
    filterConditions.category = { $in: queryFilters.categories };
  }

  if (queryFilters.brands?.length) {
    filterConditions.brand = { $in: queryFilters.brands };
  }

  if (queryFilters.sizes?.length) {
    filterConditions.sizes = { $in: queryFilters.sizes };
  }

  if (queryFilters.priceRange) {
    const { min, max } = queryFilters.priceRange;
    if (min !== null && max !== null) {
      filterConditions.currentPrice = { $gte: min, $lte: max };
    }
  }

  const total = await Product.countDocuments(filterConditions);
  const products = await Product.find(filterConditions)
    .sort({ [sort]: order === 'desc' ? -1 : 1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json({
    products,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
    }
  });
};

// @desc    Create new product
exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
};

// @desc    Update a product
exports.updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Product not found' });
  res.json(updated);
};

// @desc    Delete a product
exports.deleteProduct = async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
};

// @desc    Get filter options for sidebar
exports.getFilterOptions = async (req, res) => {
  const categories = await Product.distinct('category');
  const brands = await Product.distinct('brand');
  const sizes = await Product.distinct('sizes');
  res.json({ categories, brands, sizes });
};
