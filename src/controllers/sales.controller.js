const SaleFilterDto = require("../dtos/saleFilter.dto");
const SaleService = require("../services/sales.service");

const saleService = new SaleService()

const getSales = async (req, res) => {
  try {
    const query = req.query;

    const result = await saleService.getCountrySalesByDate(new SaleFilterDto(query))
    res.status(200).json(result)



  } catch (error) {
    console.error(error)
    return res.status(400).json({
      status: "error",
    });
  }
};

module.exports = {
  getSales,
};
