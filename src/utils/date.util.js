const getDateRangeFromRequest = (req) => {
  const today = new Date().toISOString().slice(0, 10);
  const fromDate = req.query.fromDate || today;
  const toDate = req.query.toDate || today;
  return { fromDate, toDate };
};

module.exports = { getDateRangeFromRequest };
