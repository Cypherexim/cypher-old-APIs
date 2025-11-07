const express = require('express');
const router = express.Router();
const { countryBodyValidator } = require('../middlewares/validator');
const { exportStatisticalHandler, importStatisticalHandler } = require('../controllers/StatisticalController');

/////export APIs
router.post("/getBoliviaExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getBrazilExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getMexicoExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getNicaraguaExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getTurkeyExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getUsaExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getAustraliaExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getCanadaExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getDominicanrepublicExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getEgyptExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getElsalvadorExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getGuatemalaExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getHondurasExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getIsraelExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getJapanExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getNewzealandExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getPuertoricoExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getSpainExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getTaiwanExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getThailandExports", countryBodyValidator, exportStatisticalHandler);
router.post("/getUnitedkingdomExports", countryBodyValidator, exportStatisticalHandler);


/////import APIs
router.post("/getBoliviaImports", countryBodyValidator, importStatisticalHandler);
router.post("/getBrazilImports", countryBodyValidator, importStatisticalHandler);
router.post("/getMexicoImports", countryBodyValidator, importStatisticalHandler);
router.post("/getNicaraguaImports", countryBodyValidator, importStatisticalHandler);
router.post("/getTurkeyImports", countryBodyValidator, importStatisticalHandler);
router.post("/getUsaImports", countryBodyValidator, importStatisticalHandler);
router.post("/getAustraliaImports", countryBodyValidator, importStatisticalHandler);
router.post("/getCanadaImports", countryBodyValidator, importStatisticalHandler);
router.post("/getDominicanrepublicImports", countryBodyValidator, importStatisticalHandler);
router.post("/getEgyptImports", countryBodyValidator, importStatisticalHandler);
router.post("/getElsalvadorImports", countryBodyValidator, importStatisticalHandler);
router.post("/getGuatemalaImports", countryBodyValidator, importStatisticalHandler);
router.post("/getHondurasImports", countryBodyValidator, importStatisticalHandler);
router.post("/getIsraelImports", countryBodyValidator, importStatisticalHandler);
router.post("/getJapanImports", countryBodyValidator, importStatisticalHandler);
router.post("/getNewzealandImports", countryBodyValidator, importStatisticalHandler);
router.post("/getPuertoricoImports", countryBodyValidator, importStatisticalHandler);
router.post("/getSpainImports", countryBodyValidator, importStatisticalHandler);
router.post("/getTaiwanImports", countryBodyValidator, importStatisticalHandler);
router.post("/getThailandImports", countryBodyValidator, importStatisticalHandler);
router.post("/getUnitedkingdomImports", countryBodyValidator, importStatisticalHandler);

module.exports = router;
