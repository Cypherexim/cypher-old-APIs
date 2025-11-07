const db = require('../utils/database_temp');
const { success, error, countryMappingViaType } = require('../utils/response');
const common = require('../utils/common');
const tableColumns = require("../utils/columns");



const countryDetailExtractor = (routerHandle) => {
    const countryName = routerHandle.toLowerCase().replace(/get|exports|imports/gi, "");
    return {...countryMappingViaType[countryName], name: countryName} || null;
}

exports.exportStatisticalHandler = async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const pathName = `${req.route.path}`.replace("/","");
            const countryDetail = countryDetailExtractor(pathName);
            const result = {counters:{}, data:{}};
            const tableName = (countryDetail && countryDetail.isCustom) ? `export_${countryDetail?.name}`: "export_mirror";

            const availableColQuery = `SELECT column_name FROM information_schema.columns WHERE table_name='${tableName}' AND column_name IN (${tableColumns["export"]["statistical"].toString()})`;

            ///////////////////////////////////
            let availableColumnsQuery = "";
            const apiResponse = await db.query(availableColQuery);
            const responseColsLen = apiResponse?.rows?.length;
            responseColsLen>0 ? apiResponse.rows.forEach((col, i) => {
                availableColumnsQuery += `, "${col["column_name"]}"`;
                if((responseColsLen-1)==i) {
                    availableColumnsQuery = `${availableColumnsQuery.substring(1)} from`
                }
            }) : "";
            ///////////////////////////////////

            if(countryDetail && !countryDetail.isCustom) {
                req.body["CountryofOrigin"] = [countryDetail?.mirrorCountryName]; //exporting country
            }
            
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);
            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: tableName,
                    isOrderBy: true, 
                    query: availableColumnsQuery,
                    countryType: "STATISTICAL",
                    searchType: "data"
                });

                db.query(query[0], query[1].slice(1), (err, results) => {
                    if(err) {return res.status(500).json(error(err.message, res.statusCode));}
                    else {
                        result.data = results.rows;    
                        return res.status(200).json(success("Ok", result, res.statusCode));
                    }
                });
            } else {
                return res.status(200).json(error("You don't have enough search credit please contact admin to recharge !"));
            }
    
        } catch (err) {
            return res.status(500).json(error(err, res.statusCode));
        };
    }

exports.importStatisticalHandler = async(req, res) => {
    try {
        const { UserId, IsWorkspaceSearch = false } = req.body;
        const pathName = `${req.route.path}`.replace("/","");
        const countryDetail = countryDetailExtractor(pathName);
        const result = {counters:{}, data:{}};
        const tableName = (countryDetail && countryDetail.isCustom) ? `import_${countryDetail?.name}`: "export_mirror";

        const availableColQuery = `SELECT column_name FROM information_schema.columns WHERE table_name='${tableName}' AND column_name IN (${tableColumns["import"]["statistical"].toString()})`;
        
        ///////////////////////////////////
        let availableColumnsQuery = "";
        const apiResponse = await db.query(availableColQuery);
        const responseColsLen = apiResponse?.rows?.length;
        responseColsLen>0 ? apiResponse.rows.forEach((col, i) => {
            availableColumnsQuery += `, "${col["column_name"]}"`;
            if((responseColsLen-1)==i) {
                availableColumnsQuery = `${availableColumnsQuery.substring(1)} from`
            }
        }) : "";
        ///////////////////////////////////

        if(countryDetail && !countryDetail.isCustom) {
            req.body["CountryofDestination"] = [countryDetail?.mirrorCountryName]; //exporting country
        }
                
        
        const check = await common.deductSearches(UserId, IsWorkspaceSearch);
        if (check) {
            const query = await common.getDatabaseQuery({
                body: req.body,
                tablename: (countryDetail && countryDetail.isCustom) ? `import_${countryDetail?.name}`: "export_mirror",
                isOrderBy: true, 
                query: availableColumnsQuery,
                countryType: "STATISTICAL", 
                searchType: "data"
            });

            db.query(query[0], query[1].slice(1), (err, results) => {
                if(err) {return res.status(500).json(error(err.message, res.statusCode));}
                else {
                    result.data = results.rows;    
                    return res.status(200).json(success("Ok", result, res.statusCode));
                }
            });
        } else {
            return res.status(200).json(error("You don't have enough search credit please contact admin to recharge !"));
        }

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
