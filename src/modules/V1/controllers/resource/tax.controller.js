const { responseHandler } = require("../../../../handlers");
const { taxService } = require("../../services/resource");
const { TaxDTO } = require("../../dtos/resource");

/**
 * Controller to handle creating a new tax.
 */
async function createTax(req, res, next) {
  try {
    const tax = await taxService.createTax(req.body);
    responseHandler.sendCreatedResponse(res, tax, TaxDTO);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to handle fetching all taxs.
 */
async function getTaxes(req, res, next) {
  try {
    const taxs = await taxService.getAllTaxes();
    responseHandler.sendSuccessResponse(res, taxs, TaxDTO);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to handle fetching a tax by ID.
 */
async function getTaxById(req, res, next) {
  try {
    const tax = await taxService.getTaxById(req.params.id);
    responseHandler.sendSuccessResponse(res, tax, TaxDTO);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to handle updating a tax by ID.
 */
async function updateTax(req, res, next) {
  try {
    const tax = await taxService.updateTax(req.params.id, req.body);
    responseHandler.sendSuccessResponse(res, tax, TaxDTO);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to handle deleting a tax by ID.
 */
async function deleteTax(req, res, next) {
  try {
    await taxService.deleteTax(req.params.id);
    responseHandler.sendNoContentResponse(res);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTax,
  getTaxes,
  getTaxById,
  updateTax,
  deleteTax,
};
