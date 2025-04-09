const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  addProduct,
  modifyProduct,
  getProduct,
  removeProduct,
} = require("../controllers/products");

router.route("/").get(getAllProducts).post(addProduct);
router.route("/:id").get(getProduct).patch(modifyProduct).delete(removeProduct);

module.exports = router;
