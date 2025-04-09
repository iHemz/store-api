const Product = require("../models/product");

const operationsMap = {
  ">": "$gt",
  ">=": "$gte",
  "=": "$eq",
  "<": "$lt",
  "<=": "$lte",
};

const getAllProducts = async (req, res) => {
  const {
    featured,
    name,
    company,
    sort = "createdAt",
    fields,
    page = "1",
    limit = "10",
    filters,
  } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true";
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (filters) {
    const regex = /\b(<|>|>=|=|<=)\b/g;
    let _filters = filters.replace(
      regex,
      (match) => `-${operationsMap[match]}-`,
    );
    const options = ["price", "rating"];
    _filters = _filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        const queryField = { [operator]: Number(value) };
        queryObject[field] = { ...queryObject?.field, ...queryField };
      }
    });
  }

  const sortList = sort.split(",").join(" ");
  let result = Product.find(queryObject).sort(sortList);
  if (fields) {
    fieldList = fields.split(",").join(" ");
    result = result.select(fieldList);
  }

  const _page = Number(page);
  const _limit = Number(limit);
  const skip = (_page - 1) * _limit;

  result = result.limit(_limit).skip(skip);

  const products = await result;
  res.status(200).json({ products, no_of_items: products.length });
};

const addProduct = async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({ product });
};

const modifyProduct = async (req, res, next) => {
  const { id: productID } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productID }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({ product });
};

const getProduct = async (req, res, next) => {
  const { id: productID } = req.params;
  const product = await Product.findById(productID);
  res.status(200).json({ product });
};

const removeProduct = async (req, res, next) => {
  const productID = req.params.id;
  const product = await Product.findOneAndDelete({ _id: productID });
  res
    .status(201)
    .json({ msg: `Removed ${product.name} from products.`, deleted: true });
};

module.exports = {
  getAllProducts,
  addProduct,
  modifyProduct,
  getProduct,
  removeProduct,
};
