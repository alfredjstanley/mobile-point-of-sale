const { taxService } = require("../../services/resource");

/**
 * Controller to handle creating a new tax.
 */
async function createTax(req, res) {
  try {
    const tax = await taxService.createTax(req.body);
    res.status(201).json(tax);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/**
 * Controller to handle fetching all taxs.
 */
async function getTaxes(req, res) {
  try {
    const taxs = await taxService.getAllTaxes();
    res.json(taxs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Controller to handle fetching a tax by ID.
 */
async function getTaxById(req, res) {
  try {
    const tax = await taxService.getTaxById(req.params.id);
    res.json(tax);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

/**
 * Controller to handle updating a tax by ID.
 */
async function updateTax(req, res) {
  try {
    const tax = await taxService.updateTax(req.params.id, req.body);
    res.json(tax);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/**
 * Controller to handle deleting a tax by ID.
 */
async function deleteTax(req, res) {
  try {
    await taxService.deleteTax(req.params.id);
    res.json({ message: "Tax deleted successfully" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

module.exports = {
  createTax,
  getTaxes,
  getTaxById,
  updateTax,
  deleteTax,
};
