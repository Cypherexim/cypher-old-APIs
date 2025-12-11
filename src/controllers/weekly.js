const db = require('../utils/database_temp');
const { success, error } = require('../../src/utils/response');
const common = require('../utils/common');
const queries = require("../sql/queries");

exports.weeklyApis = {
    getExportWeeklyData: async(req, res) => {
        const sqlQuery = `"RecordID", "Date", "HsCode", "Exp_Name", "Imp_Name", "CountryofDestination", "ProductDesc", "Quantity", 
        "uqc", "Mode", "Currency", "FOB", "PortofOrigin", "PortofDestination", "Item_NO", "Invoice_NO", "UnitPriceFC", 
        "Drawback", "port_code" from`;

        try {
            // const result = { counters: {}, data: {} };
            // const {direction, countryname} = req.body;
            // const tableName = `${direction.toLowerCase()}_${countryname}_data`;

            const tableName = "export_weekly";
            
            const counterquery = await common.getDatabaseQuery({
                body: req.body,
                tablename: tableName,
                isOrderBy: true,
                query: "",
                searchType: "data"
            });
            
            db.query(counterquery[0], counterquery[1].slice(1), (err, results) => {
                if(err) {return res.status(500).json(error(err.message, res.statusCode));}
                else {
                    // result.data = results.rows;
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                }
            })            
        } catch (err) {return res.status(500).json(error(err.message, res.statusCode));}
    },

    getImportWeeklyData: async(req, res) => {
        const sqlQuery = `"RecordID", "Date", "HsCode", "Exp_Name", "Imp_Name", "CountryofOrigin", "ProductDesc", "Quantity", 
        "uqc", "Currency", "PortofOrigin", "PortofDestination", "Invoice_NO", "UnitPriceFC", "port_code", "Mode" from`;

        try {
            const tableName = "import_weekly";
            
            const counterquery = await common.getDatabaseQuery({
                body: req.body,
                tablename: tableName,
                isOrderBy: true,
                query: "",
                searchType: "data"
            });
            
            db.query(counterquery[0], counterquery[1].slice(1), (err, results) => {
                if(err) {return res.status(500).json(error(err.message, res.statusCode));}
                else {
                    // result.data = results.rows;
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                }
            })            
        } catch (err) {return res.status(500).json(error(err.message, res.statusCode));}
    },


}



