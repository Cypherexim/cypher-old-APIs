const db = require('../utils/database_temp');
const { success, error, extractCountry } = require('../../src/utils/response');
const common = require('../utils/common');
const utility = require('../utils/utility');
const queries = require("../sql/queries");
const { setWithGroupQueryAnalysis } = require('../utils/unionQueryGen');


exports.getAnalysisData = async (req, res) => {
    try {
        const { direction, fieldName='HsCode', countryType } = req.body;
        let {countryname} = req.body;

//////////////////////////////////////////////////
        const {tableName, statCountryName} = utility.getCurrentTableName({countryType, direction, countryname});
        const Requestedfield = [fieldName];

        if(countryType==="MIRROR" && countryname!=="china") {
            const extractedCountryName = extractCountry(countryname);
            const countryKey = direction=="import" ? "CountryofDestination": "CountryofOrigin";
            if(req.body.hasOwnProperty(countryKey)) { req.body[countryKey].push(extractedCountryName); } 
            else { req.body[countryKey] = [extractedCountryName]; }
        } else if(countryType==="STATISTICAL" && statCountryName!=="") {
            countryname = statCountryName;
        }
//////////////////////////////////////////////////
        
        // if(countryType==="MIRROR") {
        //     const countryKey = direction=="import" ? "CountryofDestination": "CountryofOrigin";
        //     if(req.body.hasOwnProperty(countryKey)) { req.body[countryKey].push(countryname.toUpperCase()); } 
        //     else { req.body[countryKey] = [countryname.toUpperCase()]; }
        // }
        // const tableName = `${direction.toLowerCase()}_${countryType==="CUSTOM" ? countryname.toLowerCase(): "mirror"}`;
        
        // const tableName = `${direction.toLowerCase()}_${countryname.toLowerCase()}`;
        
        const requestedfieldavailable = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tableName, Requestedfield]);//direction.toLowerCase() + '_' + countryname.toLowerCase()
        
        if (requestedfieldavailable.rows.length > 0) {
            const fieldList = ["Quantity", "ValueInUSD", "UnitPriceUSD", "UnitPriceFC", "Asset_Value_USD"];
            const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tableName, fieldList]);
            
            if (availablefield.rows.length > 0) {
                let fields = [];
                const colLen = availablefield.rows.length;

                for(let i=0; i<colLen; i++) {
                    const item = availablefield.rows[i];
                    if (item.column_name.toString() != "UnitPriceUSD" && item.column_name.toString() != "UnitPriceFC") {
                        fields.push(`ROUND(SUM("${item.column_name.toString()}")::numeric,2) as ${item.column_name.toString()}`);
                    } else {
                        fields.push(`ROUND(AVG("${item.column_name.toString()}")::numeric,2) as ${item.column_name.toString()}`);
                    }
                }

                // availablefield.rows.forEach(x => {
                //     if (x.column_name.toString() != "UnitPriceUSD" && x.column_name.toString() != "UnitPriceFC") {
                //         fields.push(`ROUND(SUM("${x.column_name.toString()}")::numeric,2) as ${x.column_name.toString()}`);
                //         // fields.push('ROUND(SUM("' + x.column_name.toString() + '")::numeric,2) as ' + x.column_name.toString());
                //     } else {
                //         fields.push(`ROUND(AVG("${x.column_name.toString()}")::numeric,2) as ${x.column_name.toString()}`);
                //         // fields.push('ROUND(AVG("' + x.column_name.toString() + '")::numeric,2) as ' + x.column_name.toString());
                //     }
                // })
                // const query = `"${fieldName}", ${fields.toString()} FROM `;//'"' + fieldName + '", ' + fields.join(",") + ' FROM '; // +  + ' GROUP BY "HsCode"';                
                
                // console.log("exportDataFunction =", {
                //     body: req.body,
                //     tablename: tableName,
                //     isOrderBy: false,
                //     query: `"${fieldName}", ${fields.toString()} FROM `
                // });
                const finalqueryRes = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: tableName,
                    isOrderBy: false,
                    query: `"${fieldName}", ${fields.toString()} FROM `,
                    searchType: `analysis-"${fieldName}"`
                }); 
                const withoutGroup = finalqueryRes[0];//`${finalqueryRes[0]} GROUP BY "${fieldName}"`;
                const finalQuery = setWithGroupQueryAnalysis(fieldName, withoutGroup);
console.log(finalQuery)
                db.query(finalQuery, finalqueryRes[1].slice(1), (err, result) => {
                    if (!err) {
                        fields = null;
                        return res.status(200).json(success("Ok", result.rows, res.statusCode));
                    } else {
                        // console.log(finalquery[0] + ' GROUP BY "' + fieldName + '"', finalquery[1].slice(1));
                        return res.status(200).json(success("Ok", err.message, res.statusCode));
                    }
                });
            } else {
                return res.status(200).json(success("Ok", "Seems either of column Quantity/ValueInUSD/UnitPriceUSD not available in table.", res.statusCode));
            }
        } else {
            return res.status(200).json(success("Ok", "Seems column " + fieldName + " not available in table so can't produce analysis.", res.statusCode));
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getWhatsTrending = async (req, res) => {
    const { country, direction, year } = req.query;

    const fromDate = year + '-01-01';
    const toDate = year + '-02-02';

    db.query('SELECT ROUND(SUM("ValueInUSD")::numeric,2) as LastYearTrend FROM ' + direction.toLowerCase() + '_' + country.toLowerCase() + ' where "Date" >= $1  AND "Date" <= $2', [fromDate, toDate], (err, result) => {
        if (!err) {
            return res.status(200).json(success("Ok", result.rows, res.statusCode));
        } else {
            return res.status(200).json(success("Ok", err.message, res.statusCode));
        }
    });
}

exports.topcountriesByValue = async (req, res) => {
    const { country, direction, fromDate, toDate } = req.query;
    var query = '';
    if (direction.toLowerCase() == 'export') {
        query = `Select ROUND(SUM("ValueInUSD")::numeric,2) as total,"CountryofDestination" from ` + direction.toLowerCase() + '_' + country.toLowerCase() +
            ` WHERE "Date" BETWEEN $1 AND $2 group by "CountryofDestination" ORDER BY total DESC LIMIT 10`;
    } else {
        query = `Select ROUND(SUM("ValueInUSD")::numeric,2) as total,"CountryofOrigin" from ` + direction.toLowerCase() + '_' + country.toLowerCase() +
            ` WHERE "Date" BETWEEN $1 AND $2 group by "CountryofOrigin" ORDER BY total DESC LIMIT 10`;
    }
    db.query(query, [fromDate, toDate], (err, result) => {
        if (!err) {
            return res.status(200).json(success("Ok", result.rows, res.statusCode));
        } else {
            return res.status(200).json(success("Ok", err.message, res.statusCode));
        }
    });
}

exports.getmonthwisepercentagegrowth = async (req, res) => {
    const { country, direction, fromDate, toDate } = req.query;
    var query = `WITH monthly_totals AS (
        SELECT
        (CASE 
         when "Month" = 'JAN' then 1 
         when "Month" = 'FEB' then 2 
         when "Month" = 'MAR' then 3
         when "Month" = 'APR' then 4
         when "Month" = 'MAY' then 5
         when "Month" = 'JUN' then 6
         when "Month" = 'JUL' then 7
         when "Month" = 'AUG' then 8
         when "Month" = 'SEP' then 9
         when "Month" = 'OCT' then 10
         when "Month" = 'NOV' then 11
         when "Month" = 'DEC' then 12
         ELSE 0 END ) as "Months","Year",ROUND(sum("ValueInUSD")::numeric,2) as current_sale, "Month"
                from `+ direction.toLowerCase() + '_' + country.toLowerCase() + ` WHERE "Date" BETWEEN $1 AND $2  
                group by "Year","Months","Month"
                order by "Year","Months"
        )
        SELECT "Months","Month","Year","current_sale", lag("current_sale", 1) over (order by "Year","Months") as previous_month_sale,
                ROUND(100 * ("current_sale" - lag("current_sale", 1) over (order by "Year","Months")) / lag("current_sale", 1) over 
                (order by "Year","Months")::numeric, 2) as growth FROM monthly_totals group by "Year","Months","Month","current_sale"`;
    
    db.query(query, [fromDate, toDate], (err, result) => {
        if (!err) {
            return res.status(200).json(success("Ok", result.rows, res.statusCode));
        } else {
            return res.status(200).json(success("Ok", err.message, res.statusCode));
        }
    });
}

exports.gettopthreeproductbycompany = async (req, res) => {
    const { country, direction, fromDate, toDate } = req.query;
    var query = '';
    // var finalresult = {companyname: '', hscodes: []};
    if(direction.toLowerCase()=='import'){
        query = `WITH TopImporters AS (
            SELECT "Imp_Name"
            FROM ` + direction.toLowerCase() + '_' + country.toLowerCase() + `  
            WHERE "Date" BETWEEN $1 AND $2
            GROUP BY "Imp_Name"
            ORDER BY ROUND(SUM("ValueInUSD")::numeric, 2) DESC
            LIMIT 5
         ),
         RankedImporters AS (
            SELECT
               "HsCode",
               "Imp_Name",
               ROUND(SUM("ValueInUSD")::numeric, 2) AS valuehs,
               ROW_NUMBER() OVER (PARTITION BY "Imp_Name" ORDER BY SUM("ValueInUSD") DESC) AS rn
            FROM ` + direction.toLowerCase() + '_' + country.toLowerCase() + ` 
            WHERE "Date" BETWEEN $1 AND $2 AND "Imp_Name" IN (SELECT "Imp_Name" FROM TopImporters)
            GROUP BY "Imp_Name", "HsCode"
         )
         SELECT "HsCode", "Imp_Name", valuehs
         FROM RankedImporters
         WHERE rn <= 3
         ORDER BY "Imp_Name", valuehs DESC
         LIMIT 15;`;
    } else {
        query = `WITH TopExporters AS (
            SELECT "Exp_Name"
            FROM ` + direction.toLowerCase() + '_' + country.toLowerCase() + `
            WHERE "Date" BETWEEN $1 AND $2
            GROUP BY "Exp_Name"
            ORDER BY ROUND(SUM("ValueInUSD")::numeric, 2) DESC
            LIMIT 5
         ),
         RankedExporters AS (
            SELECT
               "HsCode",
               "Exp_Name",
               ROUND(SUM("ValueInUSD")::numeric, 2) AS valuehs,
               ROW_NUMBER() OVER (PARTITION BY "Exp_Name" ORDER BY SUM("ValueInUSD") DESC) AS rn
            FROM ` + direction.toLowerCase() + '_' + country.toLowerCase() + ` 
            WHERE "Date" BETWEEN $1 AND $2 AND "Exp_Name" IN (SELECT "Exp_Name" FROM TopExporters)
            GROUP BY "Exp_Name", "HsCode"
         )
         SELECT "HsCode", "Exp_Name", valuehs
         FROM RankedExporters
         WHERE rn <= 3
         ORDER BY "Exp_Name", valuehs DESC
         LIMIT 15;`
    }
    
    db.query(query, [fromDate, toDate], (err, result) => {
        if (!err) {
            return res.status(200).json(success("Ok", result.rows, res.statusCode));
        } else {
            return res.status(200).json(success("Ok", err.message, res.statusCode));
        }
    });
}



//////////////////////////////////////////////////////////////////////////////////////
exports.getWhatstrandingTotalValues = (req, res) => {
    const sql = queries.getWhatstrandingTotalVal;

    try {
        db.query(sql, [req.query.year], (err, result) => {
            if (!err) { return res.status(200).json(success("Ok", result.rows, res.statusCode)); } 
            else { return res.status(200).json(success("Ok", err.message, res.statusCode)); }
        });
    } catch (error) { return res.status(200).json(success("Ok", error.message, res.statusCode)); }
}



exports.getWhatstrandingAnalysis = (req, res) => {
    const {year, direction, tableType} = req.query;
    const columns = tableType=="month" ? ["month","current_value","growth"] : tableType=="company" ? ["hscode","company","value"] : ["country","value"];
    const sql = `select ${columns.toLocaleString()} from whatstranding_${tableType}wise where year=${year} and direction='${direction}' and active=true order by id`;

    try {
        db.query(sql, (err, result) => {
            if (!err) { return res.status(200).json(success("Ok", result.rows, res.statusCode)); } 
            else { return res.status(200).json(success("Ok", err.message, res.statusCode)); }
        });   
    } catch (error) { return res.status(200).json(success("Ok", error.message, res.statusCode)); }
}

exports.getWhatsTrendingCommodity = (req, res) => {
    const {year, direction} = req.query;
    try {
        db.query(queries.getWhatstrandingCommodity, [direction, year, Number(year)+2], (err, result) => {
            if (!err) { return res.status(200).json(success("Ok", result.rows, res.statusCode)); } 
            else { return res.status(200).json(success("Ok", err.message, res.statusCode)); }
        });
    } catch (error) { return res.status(200).json(success("Ok", error.message, res.statusCode)); }
}

exports.getWhatsTrandingMap = (req, res) => {
    try {
        const sqlQuery = queries.GET_WHATSTRANDING_MAP;
        
        db.query(sqlQuery, (err, result) => {
            if(err) {res.status(500).json(error(err.message, res.statusCode));}
            else {res.status(200).json(success("OK", result.rows, res.statusCode));}
        });
    } catch (err) {
        res.status(500).json(error(err, res.statusCode));
    }
}
