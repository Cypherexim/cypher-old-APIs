const db = require('../utils/database_temp');
const { success, error, extractCountry } = require('../../src/utils/response');
const query = require('../../src/sql/queries');
const common = require('../utils/common');
const utility = require('../utils/utility');
const { setWithGroupQuerySidefilter } = require('../utils/unionQueryGen');


const extractValue = (arr, prop) => {    
    const extractedValue = arr.map(item => item[prop]); // extract value from property
    return extractedValue;
}

// exports.sidefilter = {
//     firstSideFilter: async (req, res) => {
//         try {
//             const { CountryCode, CountryName, Direction } = req.body;
//             const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
//             const fieldList = ["ValueInUSD"], output = {};
//             let selectQuery = "Distinct ", valuefield = "", group = '"HsCode"', count = 'COUNT("HsCode") as count';
            
//             const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tableName, fieldList]);
//             if (availablefield.rows.length > 0) {
//                 valuefield = 'ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD,';
//             }
//             const access = await db.query(query.get_first_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);            
    
//             if (access.rows.length > 0) {
//                 const keys = Object.keys(access.rows[0]);
//                 const obj = access.rows[0];
                
//                 if (!Object.values(access.rows[0]).includes(true)) {
//                     for (let i = 0; i < keys.length; i++) {
//                         if (!obj[keys[i]]) { output[keys[i]] = []; }
//                     }
//                     return res.status(200).json(success("Ok", output, res.statusCode));
//                 } else {
//                     for (let i = 0; i < keys.length; i++) {
//                         if (obj[keys[i]]) { selectQuery += `"${keys[i]}", `; }
//                     }
//                     const partialQuery = `${selectQuery.replace(/,\s*$/, "")}, ${valuefield + count}`;
//                     const query = await common.getDatabaseQuery({
//                         body: req.body, 
//                         tablename: tableName, 
//                         isOrderBy: false, 
//                         query: `${partialQuery} FROM `
//                     });

//                     const finalQuery = `${query[0]} Group By ${selectQuery.replace('Distinct ', "").replace(/,\s*$/, "")}, ${group}`;
//                     console.log("first Sidefilter==",finalQuery)
//                     db.query(finalQuery, query[1].slice(1), (err, results) => {
//                         if (!err) {
//                             return res.status(200).json(success("Ok", results.rows, res.statusCode));
//                         } else {
//                             return res.status(500).json(error(err.message, res.statusCode));
//                         }
//                     });
//                 }
//             }
//         } catch (err) {
//             return res.status(500).json(error(err, res.statusCode));
//         };
//     },

//     secondSideFilter: async (req, res) => {
//         try {
//             const { CountryCode, CountryName, Direction } = req.body;
//             const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
//             const fieldList = ["ValueInUSD"], output = {};
//             let selectQuery = "Distinct ", valuefield = "", group = '', count = '';
            
//             const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tableName, fieldList]);
//             if (availablefield.rows.length > 0) {
//                 valuefield = 'ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD,';
//             }
//             const access = await db.query(query.get_second_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
    
//             if (Direction.toLowerCase() == 'import') {
//                 group = '"CountryofOrigin"';
//                 count = 'COUNT("CountryofOrigin") as count';
//             } else if (Direction.toLowerCase() == 'export') {
//                 group = '"CountryofDestination"';
//                 count = 'COUNT("CountryofDestination") as count';
//             }

//             if (access.rows.length > 0) {
//                 const keys = Object.keys(access.rows[0]);
//                 const obj = access.rows[0];
                
//                 if (!Object.values(access.rows[0]).includes(true)) {
//                     for (let i = 0; i < keys.length; i++) {
//                         if (!obj[keys[i]]) { output[keys[i]] = []; }
//                     }
//                     return res.status(200).json(success("Ok", output, res.statusCode));
//                 } else {                    
//                     for (let i = 0; i < keys.length; i++) {
//                         if (obj[keys[i]]) { selectQuery += `"${keys[i]}", `; }
//                     }
//                     const partialQuery = `${selectQuery.replace(/,\s*$/, "")}, ${valuefield + count}`;
//                     const query = await common.getDatabaseQuery({
//                         body: req.body, 
//                         tablename: tableName, 
//                         isOrderBy: false, 
//                         query: `${partialQuery} FROM `
//                     });

//                     const finalQuery = `${query[0]} Group By ${selectQuery.replace('Distinct ', "").replace(/,\s*$/, "")}, ${group}`;
//                     console.log("second Sidefilter==",finalQuery)
//                     db.query(finalQuery, query[1].slice(1), (err, results) => {
//                         if (!err) {
//                             return res.status(200).json(success("Ok", results.rows, res.statusCode));
//                         } else {
//                             return res.status(500).json(error(err.message, res.statusCode));
//                         }
//                     });
//                 }
//             }
//         } catch (err) {
//             return res.status(500).json(error(err, res.statusCode));
//         };
//     },

//     thirdSideFilter: async (req, res) => {
//         try {
//             const { CountryCode, CountryName, Direction } = req.body;            
//             const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
//             let selectQuery = "Distinct ";
//             const output = {};

//             const access = await db.query(query.get_third_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
            
//             if (access.rows.length > 0) {
//                 const keys = Object.keys(access.rows[0]);
//                 const obj = access.rows[0];
//                 if (!Object.values(access.rows[0]).includes(true)) {
//                     for (let i = 0; i < keys.length; i++) {
//                         if (!obj[keys[i]]) { output[keys[i]] = []; }
//                     }
//                     return res.status(200).json(success("Ok", output, res.statusCode));
//                 } else {
//                     for (let i = 0; i < keys.length; i++) {
//                         if (obj[keys[i]]) { selectQuery += `"${keys[i]}", `; }
//                     }

//                     const query = await common.getDatabaseQuery({
//                         body: req.body, 
//                         tablename: tableName, 
//                         isOrderBy: false, 
//                         query: `${selectQuery.replace(/,\s*$/, "")} FROM `
//                     });
//                     console.log("third Sidefilter==",query)
//                     db.query(query[0], query[1].slice(1), (err, results) => {
//                         if (!err) {
//                             for (let i = 0; i < keys.length; i++) {
//                                 if (obj[keys[i]] == true) {
//                                     output[keys[i]] = [...new Set(extractValue(results.rows, keys[i]))];
//                                 }
//                             }
//                             return res.status(200).json(success("Ok", output, res.statusCode));
//                         } else {
//                             return res.status(500).json(error(err.message, res.statusCode));
//                         }
//                     });
//                 }
//             }
//         } catch (err) {
//             return res.status(500).json(error(err, res.statusCode));
//         }
//     },

//     fourthSideFilter: async (req, res) => {
//         try {
//             const { CountryCode, CountryName, Direction } = req.body;
//             const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
//             const access = await db.query(query.get_fourth_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
//             let selectQuery = "Distinct ";
//             const output = {};

//             if (access.rows.length > 0) {
//                 const keys = Object.keys(access.rows[0]);
//                 const obj = access.rows[0];
//                 if (!Object.values(access.rows[0]).includes(true)) {
//                     for (let i = 0; i < keys.length; i++) {
//                         if (!obj[keys[i]]) { output[keys[i]] = []; }
//                     }
//                     return res.status(200).json(success("Ok", output, res.statusCode));
//                 } else {
//                     for (let i = 0; i < keys.length; i++) {
//                         if (obj[keys[i]]) { selectQuery += `"${keys[i]}", `; }
//                     }

//                     const query = await common.getDatabaseQuery({
//                         body: req.body, 
//                         tablename: tableName, 
//                         isOrderBy: false, 
//                         query: `${selectQuery.replace(/,\s*$/, "")} FROM `
//                     });
//                     console.log("fourth Sidefilter==",query)
//                     db.query(query[0], query[1].slice(1), (err, results) => {
//                         if (!err) {
//                             for (let i = 0; i < keys.length; i++) {
//                                 if (obj[keys[i]]) {
//                                     output[keys[i]] = [...new Set(extractValue(results.rows, keys[i]))];
//                                 }
//                             }
                            
//                             return res.status(200).json(success("Ok", output, res.statusCode));
//                         } else {
//                             return res.status(500).json(error(err.message, res.statusCode));
//                         }
//                     })
//                 }
//             }
//         } catch (err) {
//             return res.status(500).json(error(err, res.statusCode));
//         };
//     },

//     fifthSideFilter: async (req, res) => {
//         try {
//             const { CountryCode, CountryName, Direction } = req.body;
//             const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
//             const access = await db.query(query.get_fifth_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
//             let selectQuery = "Distinct ";
//             const output = {};

//             if (access.rows.length > 0) {
//                 const keys = Object.keys(access.rows[0]);
//                 const obj = access.rows[0];
//                 if (!Object.values(access.rows[0]).includes(true)) {
//                     for (let i = 0; i < keys.length; i++) {
//                         if (!obj[keys[i]]) { output[keys[i]] = []; }
//                     }
//                     return res.status(200).json(success("Ok", output, res.statusCode));
//                 } else {
//                     for (let i = 0; i < keys.length; i++) {
//                         if (obj[keys[i]]) { selectQuery += `"${keys[i]}", `; }
//                     }

//                     const query = await common.getDatabaseQuery({
//                         body: req.body, 
//                         tablename: tableName, 
//                         isOrderBy: false, 
//                         query: `${selectQuery.replace(/,\s*$/, "")} FROM `
//                     });
//                     console.log("fifth Sidefilter==",query)
//                     db.query(query[0], query[1].slice(1), (err, results) => {
//                         if (!err) {
//                             for (let i = 0; i < keys.length; i++) {
//                                 if (obj[keys[i]]) {
//                                     output[keys[i]] = [...new Set(extractValue(results.rows, keys[i]))];
//                                 }
//                             }
//                             return res.status(200).json(success("Ok", output, res.statusCode));
//                         } else {
//                             return res.status(500).json(error(err.message, res.statusCode));
//                         }
//                     });
//                 }
//             }
//         } catch (err) {
//             return res.status(500).json(error(err, res.statusCode));
//         };
//     },

//     importSideFilter: async (req, res) => {
//         try {
//             const { CountryCode, CountryName, Direction } = req.body;
//             const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
//             const fieldList = ["ValueInUSD"], output = {};
//             let selectQuery = "Distinct ", valuefield = "", group = '"Imp_Name"', count = 'COUNT("Imp_Name") as count';

//             const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tableName, fieldList]);
//             if (availablefield.rows.length > 0) {
//                 valuefield = ' ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD ,';
//             }
//             const access = await db.query(query.get_Import_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
           
//             if (access.rows.length > 0) {
//                 const keys = Object.keys(access.rows[0]);
//                 const obj = access.rows[0];
//                 if (!Object.values(access.rows[0]).includes(true)) {
//                     for (let i = 0; i < keys.length; i++) {
//                         if (!obj[keys[i]]) { output[keys[i]] = []; }
//                     }
//                     return res.status(200).json(success("Ok", output, res.statusCode));
//                 } else {
//                     for (let i = 0; i < keys.length; i++) {
//                         if (obj[keys[i]]) { selectQuery += `"${keys[i]}", `; }
//                     }
                    
//                     const partialQuery = `${selectQuery.replace(/,\s*$/, "")}, ${valuefield + count}`;
//                     const query = await common.getDatabaseQuery({
//                         body: req.body, 
//                         tablename: tableName, 
//                         isOrderBy: false, 
//                         query: `${partialQuery} FROM `
//                     });
//                     const finalQuery = `${query[0]} Group By ${selectQuery.replace('Distinct ', "").replace(/,\s*$/, "")}, ${group}`;
//                     console.log("import Sidefilter==",finalQuery)
//                     db.query(finalQuery, query[1].slice(1), (err, results) => {
//                         if (!err) {
//                             return res.status(200).json(success("Ok", results.rows, res.statusCode));
//                         } else {
//                             return res.status(500).json(error(err.message, res.statusCode));
//                         }
//                     })
//                 }
//             }
//         } catch (err) {
//             return res.status(500).json(error(err, res.statusCode));
//         };
//     },

//     exportSideFilter: async (req, res) => {
//         try {
//             const { CountryCode, CountryName, Direction } = req.body;
//             const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
//             const fieldList = ["ValueInUSD"], output = {};
//             let selectQuery = "Distinct ", valuefield = "", group = '"Exp_Name"', count = 'COUNT("Exp_Name") as count';

//             const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tableName, fieldList]);
//             if (availablefield.rows.length > 0) {
//                 valuefield = ' ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD ,';
//             }
//             const access = await db.query(query.get_Export_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
            
//             if (access.rows.length > 0) {
//                 const keys = Object.keys(access.rows[0]);
//                 const obj = access.rows[0];
//                 if (!Object.values(access.rows[0]).includes(true)) {
//                     for (let i = 0; i < keys.length; i++) {
//                         if (!obj[keys[i]]) { output[keys[i]] = []; }
//                     }
//                     return res.status(200).json(success("Ok", output, res.statusCode));
//                 } else {
//                     for (let i = 0; i < keys.length; i++) {
//                         if (obj[keys[i]]) { selectQuery += `"${keys[i]}", `; }
//                     }

//                     const partialQuery = `${selectQuery.replace(/,\s*$/, "")}, ${valuefield + count}`;
//                     const query = await common.getDatabaseQuery({
//                         body: req.body, 
//                         tablename: tableName, 
//                         isOrderBy: false, 
//                         query: `${partialQuery} FROM `
//                     });
//                     const finalQuery = `${query[0]} Group By ${selectQuery.replace('Distinct ', "").replace(/,\s*$/, "")}, ${group}`;
//                     console.log("export Sidefilter==",finalQuery)
//                     db.query(finalQuery, query[1].slice(1), (err, results) => {
//                         if (!err) {
//                             return res.status(200).json(success("Ok", results.rows, res.statusCode));
//                         } else {
//                             return res.status(500).json(error(err.message, res.statusCode));
//                         }
//                     })
//                 }
//             }
//         } catch (err) {
//             return res.status(500).json(error(err, res.statusCode));
//         };
//     }
// }

// exports.indiaSideFilter = {
//     filterWithoutValue: async (req, res) => {
//         try {
//             const { CountryCode, CountryName, Direction } = req.body;
//             const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
//             const access = await db.query(query.get_fifth_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
//             let selectQuery = "Distinct ";
//             const output = {};

//             if (access.rows.length > 0) {
//                 const keys = Object.keys(access.rows[0]);
//                 const obj = access.rows[0];
//                 if (!Object.values(access.rows[0]).includes(true)) {
//                     for (let i = 0; i < keys.length; i++) {
//                         if (!obj[keys[i]]) { output[keys[i]] = []; }
//                     }
//                     return res.status(200).json(success("Ok", output, res.statusCode));
//                 } else {
//                     for (let i = 0; i < keys.length; i++) {
//                         if (obj[keys[i]]) { selectQuery += `"${keys[i]}", `; }
//                     }

//                     const query = await common.getDatabaseQuery({
//                         body: req.body, 
//                         tablename: tableName, 
//                         isOrderBy: false, 
//                         query: `${selectQuery.replace(/,\s*$/, "")} FROM `
//                     });
//                     console.log("fifth Sidefilter==",query)
//                     db.query(query[0], query[1].slice(1), (err, results) => {
//                         if (!err) {
//                             for (let i = 0; i < keys.length; i++) {
//                                 if (obj[keys[i]]) {
//                                     output[keys[i]] = [...new Set(extractValue(results.rows, keys[i]))];
//                                 }
//                             }
//                             return res.status(200).json(success("Ok", output, res.statusCode));
//                         } else {
//                             return res.status(500).json(error(err.message, res.statusCode));
//                         }
//                     });
//                 }
//             }
//         } catch (err) {
//             return res.status(500).json(error(err, res.statusCode));
//         };
//     },

//     filterWithValue: async (req, res) => {
        
//     }
// }



const getPreRequiredDataForFurtherFetching = (params) => {
    return new Promise((resolve, reject) => {
        try {
            const {countryType, Direction, countryname, statCountryName, body} = params;
            let countryName = "";

            if(countryType==="MIRROR" && countryname!=="china") {
                const extractedCountryName = extractCountry(countryname);
                const countryKey = Direction=="import" ? "CountryofDestination": "CountryofOrigin";

                if(body.hasOwnProperty(countryKey)) {body[countryKey].push(extractedCountryName);}
                else {body[countryKey] = [extractedCountryName];}
            } else if(countryType==="STATISTICAL" && statCountryName!=="") {
                countryName = statCountryName;
            }

            resolve({countryName});
        } catch (error) { reject(error); }        
    });
} 


exports.allCountriesSideFilters = {
    ////////////////////////INDIA + ALL OTHERS////////////////////////
    getHsCodeSidefilter: async (req, res) => {
        try {
            const { CountryCode, CountryName, Direction, countryType } = req.body;
            const {tableName, statCountryName} = utility.getCurrentTableName({countryType, direction: Direction, countryname:CountryName});
            await getPreRequiredDataForFurtherFetching({countryType, Direction, countryname: CountryName, statCountryName, body: req?.body || {}});            

            // if(countryType==="MIRROR") {
            //     const extractedCountryName = extractCountry(CountryName);
            //     const countryKey = Direction=="import" ? "CountryofDestination": "CountryofOrigin";
            //     if(req.body.hasOwnProperty(countryKey)) { req.body[countryKey].push(extractedCountryName); } 
            //     else { req.body[countryKey] = [extractedCountryName]; }
            // }                        
            // const tableName = `${Direction.toLowerCase()}_${countryType==="CUSTOM" ? CountryName.toLowerCase(): "mirror"}`;            
            
            const fieldList = ["ValueInUSD"], output = {};
            const isIndiaCountry = ["IND", "WEE"].includes(CountryCode);
            let selectQuery = "Distinct ", valuefield = "", group = '"HsCode"';
            
            const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tableName, fieldList]);
            if (availablefield.rows.length > 0 && isIndiaCountry) {
                valuefield = 'ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD ';
            }
            const access = await db.query(query.get_first_sidefilter_Access, [CountryCode, Direction.toUpperCase(), countryType]);            
    
            if (access.rows.length > 0) {
                const keys = Object.keys(access.rows[0]);
                const obj = access.rows[0];
                
                if (!Object.values(access.rows[0]).includes(true)) {
                    for (let i = 0; i < keys.length; i++) {
                        if (!obj[keys[i]]) { output[keys[i]] = []; }
                    }
                    return res.status(200).json(success("Ok", output, res.statusCode));
                } else {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]]) { selectQuery += `"${keys[i]}"${keys.length>0 ? ", ": ""}`; }
                    }
                    const partialQuery = `${selectQuery.replace(/,\s*$/, "")}${valuefield!="" ? ", "+valuefield: ""}`;
                    const query = await common.getDatabaseQuery({
                        body: req.body, 
                        tablename: tableName,
                        isOrderBy: false, 
                        query: `${partialQuery} FROM `,
                        searchType: `sidefilter-${group}`
                    });

                    const withoutGroup = `${query[0]}`//`${query[0]} Group By ${selectQuery.replace('Distinct ', "").replace(/,\s*$/, "")}, ${group}`;
                    const finalQuery = setWithGroupQuerySidefilter(group, withoutGroup);

                    db.query(finalQuery, query[1].slice(1), (err, results) => {
                        if (!err) {
                            return res.status(200).json(success("Ok", results.rows, res.statusCode));
                        } else {
                            return res.status(500).json(error(err.message, res.statusCode));
                        }
                    });
                }
            }
        } catch (err) {
            return res.status(500).json(error(err, res.statusCode));
        };
    },

    getExporterSidefilter: async (req, res) => {
        try {
            const { CountryCode, CountryName, Direction, countryType, isSideFilter, limit } = req.body;
            const {tableName, statCountryName} = utility.getCurrentTableName({countryType, direction: Direction, countryname:CountryName});
            await getPreRequiredDataForFurtherFetching({countryType, Direction, countryname:CountryName, statCountryName, body: req?.body || {}});


            // if(countryType==="MIRROR") {
            //     const extractedCountryName = extractCountry(CountryName);
            //     const countryKey = Direction=="import" ? "CountryofDestination": "CountryofOrigin";
            //     if(req.body.hasOwnProperty(countryKey)) { req.body[countryKey].push(extractedCountryName); } 
            //     else { req.body[countryKey] = [extractedCountryName]; }
            // }
            // const tableName = `${Direction.toLowerCase()}_${countryType==="CUSTOM" ? CountryName.toLowerCase(): "mirror"}`;

            // const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
            const fieldList = ["ValueInUSD"],  output = {};
            let valuefield = '', selectQuery = 'Distinct ', group = '';
            const isIndiaCountry = ["IND", "WEE"].includes(CountryCode);
            const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tableName, fieldList]);
            
            if (availablefield.rows.length > 0 && isIndiaCountry) {
                valuefield = ' ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD';
            }
            const access = await db.query(query.get_Export_sidefilter_Access, [CountryCode, Direction.toUpperCase(), countryType]);        
            group = '"Exp_Name"';
            // count = isIndiaCountry ? 'COUNT("Exp_Name") as count': "";
    
            if (access.rows.length > 0) {
                const keys = Object.keys(access.rows[0]);
                const obj = access.rows[0];
                if (!Object.values(access.rows[0]).includes(true)) {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] == false) { output[keys[i]] = []; }
                    }
                    return res.status(200).json(success("Ok", output, res.statusCode));
                } else {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] === true) {
                            selectQuery += '"' + keys[i] + '", '
                        }
                    }
                    const finalQuery = `${selectQuery.replace(/,\s*$/, "")}${valuefield!='' ? `,${valuefield}`: ''}`;
                    const partialQuery = await common.getDatabaseQuery({
                        body: req.body,
                        tablename: tableName,
                        isOrderBy: false,
                        query: `${finalQuery} FROM `,
                        searchType: `sidefilter-${group}`
                    });
                    const withoutGroup = `${partialQuery[0]}${isSideFilter ? ` limit ${limit}`: ""}`; //`${partialQuery[0]} GROUP BY ${selectQuery.replace("Distinct ", "").replace(/,\s*$/, "")}${isSideFilter ? ` limit ${limit}`: ""}`;
                    const querySql = setWithGroupQuerySidefilter(group, withoutGroup);
                    
                    db.query(querySql, partialQuery[1].slice(1), (err, results) => {
                        if (!err) {
                            return res.status(200).json(success("Ok", results.rows, res.statusCode));
                        } else {
                            return res.status(500).json(error(err.message, res.statusCode));
                        }
                    });
                }
            }
        } catch (err) {
            return res.status(500).json(error(err, res.statusCode));
        };
    },

    getImporterSidefilter: async (req, res) => {
        try {
            const { CountryCode, CountryName, Direction, countryType, isSideFilter, limit } = req.body;
            const {tableName, statCountryName} = utility.getCurrentTableName({countryType, direction: Direction, countryname:CountryName});
            await getPreRequiredDataForFurtherFetching({countryType, Direction, countryname:CountryName, statCountryName, body: req?.body || {}});            

            // const { CountryCode, CountryName, Direction, isSideFilter, limit, countryType } = req.body;
            // if(countryType==="MIRROR") {
            //     const extractedCountryName = extractCountry(CountryName);
            //     const countryKey = Direction=="import" ? "CountryofDestination": "CountryofOrigin";
            //     if(req.body.hasOwnProperty(countryKey)) { req.body[countryKey].push(extractedCountryName); } 
            //     else { req.body[countryKey] = [extractedCountryName]; }
            // }
            // const tableName = `${Direction.toLowerCase()}_${countryType==="CUSTOM" ? CountryName.toLowerCase(): "mirror"}`;

            const fieldList = ["ValueInUSD"], output = {};
            let valuefield = '',selectQuery = 'Distinct ', group = '';
            // const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
            const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tableName, fieldList]);
            const isIndiaCountry = ["IND", "WEE"].includes(CountryCode);
    
            if (availablefield.rows.length > 0 && isIndiaCountry) {
                valuefield = ' ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD';
            }
            const access = await db.query(query.get_Import_sidefilter_Access, [CountryCode, Direction.toUpperCase(), countryType]);
            
            group = '"Imp_Name"';
            // count = isIndiaCountry ? 'COUNT("Imp_Name") as count': '';
    
            if (access.rows.length > 0) {
                const keys = Object.keys(access.rows[0]);
                const obj = access.rows[0];
                
                if (!Object.values(access.rows[0]).includes(true)) {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] == false) {
                            output[keys[i]] = [];
                        }
                    }
                    return res.status(200).json(success("Ok", output, res.statusCode));
                } else {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] === true) {
                            selectQuery += '"' + keys[i] + '", '
                        }
                    }
                    
                    const finalQuery = `${selectQuery.replace(/,\s*$/, "")}${valuefield!='' ? `,${valuefield}`: ''}`;
                    const partialQuery = await common.getDatabaseQuery({
                        body: req.body,
                        tablename: tableName,
                        isOrderBy: false,
                        query: `${finalQuery} FROM `,
                        searchType: `sidefilter-${group}`
                    });
                    const withoutGroup = `${partialQuery[0]}${isSideFilter ? ` limit ${limit}`: ""}`; //`${partialQuery[0]} GROUP BY ${selectQuery.replace("Distinct ", "").replace(/,\s*$/, "")}, ${group}${isSideFilter ? ` limit ${limit}`: ""}`;                        
                    const querySql = setWithGroupQuerySidefilter(group, withoutGroup);
                    
                    db.query(querySql, partialQuery[1].slice(1), (err, results) => {
                        if (!err) {
                            return res.status(200).json(success("Ok", results.rows, res.statusCode));
                        } else {
                            return res.status(500).json(error(err.message, res.statusCode));
                        }
                    });
                }
            }
        } catch (err) {
            return res.status(500).json(error(err, res.statusCode));
        };
    },

    getCountrySidefilter: async (req, res) => {
        try {
            const { CountryCode, CountryName, Direction, countryType, isSideFilter, limit } = req.body;
            const {tableName, statCountryName} = utility.getCurrentTableName({countryType, direction: Direction, countryname:CountryName});
            await getPreRequiredDataForFurtherFetching({countryType, Direction, countryname:CountryName, statCountryName, body: req?.body || {}});            

            // const { CountryCode, CountryName, Direction, isSideFilter, limit, countryType } = req.body;
            // if(countryType==="MIRROR") {
            //     const extractedCountryName = extractCountry(CountryName);
            //     const countryKey = Direction=="import" ? "CountryofDestination": "CountryofOrigin";
            //     if(req.body.hasOwnProperty(countryKey)) { req.body[countryKey].push(extractedCountryName); } 
            //     else { req.body[countryKey] = [extractedCountryName]; }
            // }
            // const tableName = `${Direction.toLowerCase()}_${countryType==="CUSTOM" ? CountryName.toLowerCase(): "mirror"}`;
            
            const fieldList = ["ValueInUSD"], output = {};
            let valuefield = '', selectQuery = 'Distinct ', count = '', group = '';
            const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tableName, fieldList]);
            const access = await db.query(query.get_second_sidefilter_Access, [CountryCode, Direction.toUpperCase(), countryType]);
            const isIndiaCountry = ["IND", "WEE"].includes(CountryCode);
    
            if (availablefield.rows.length > 0 && isIndiaCountry) {
                valuefield = ' ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD';
            }
            
            if (Direction.toLowerCase() == 'import') {
                group = '"CountryofOrigin"';
                // count = isIndiaCountry ? 'COUNT("CountryofOrigin") as count': '';
            } else if (Direction.toLowerCase() == 'export') {
                group = '"CountryofDestination"';
                // count = isIndiaCountry ? 'COUNT("CountryofDestination") as count': '';
            }
            if (access.rows.length > 0) {
                const keys = Object.keys(access.rows[0]);
                const obj = access.rows[0];
                
                if (!Object.values(access.rows[0]).includes(true)) {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] == false) {
                            output[keys[i]] = [];
                        }
                    }
                    return res.status(200).json(success("Ok", output, res.statusCode));
                } else {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]]) {
                            selectQuery += '"' + keys[i] + '", '
                        }
                    }
                    
                    let finalQuery = `${selectQuery.replace(/,\s*$/, "")}${valuefield!='' || count!='' ? `,${valuefield + count}`: ''}`;//selectQuery + ',' + valuefield + count;
                    // const tableName = Direction.toLowerCase() + '_' + CountryName.toLowerCase();
                    const partialQuery = await common.getDatabaseQuery({
                        body: req.body,
                        tablename: tableName,
                        isOrderBy: false,
                        query: `${finalQuery} FROM `,
                        searchType: `sidefilter-${group}`
                    });

                    const withoutGroup = `${partialQuery[0]}${isSideFilter ? ` limit ${limit}`: ""}`; //`${partialQuery[0]} group by ${selectQuery.replace('Distinct ', "").replace(/,\s*$/, "")}${isSideFilter ? ` limit ${limit}`: ""}`;
                    const query = setWithGroupQuerySidefilter(group, withoutGroup);

                    db.query(query, partialQuery[1].slice(1), (err, results) => {
                        if (!err) {
                            return res.status(200).json(success("Ok", results.rows, res.statusCode));
                        } else {
                            return res.status(500).json(error(err.message, res.statusCode));
                        }
                    });
                }
            }
        } catch (err) {
            return res.status(500).json(error(err, res.statusCode));
        };
    },

    getPortOfOriginSidefilter: async (req, res) => {
        try {
            const { CountryCode, CountryName, countryType, Direction, isSideFilter, limit } = req.body;            
            
            const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
            const fieldList = ["ValueInUSD"],  output = {};
            let valuefield = '', selectQuery = 'Distinct ', group = '';
            const isIndiaCountry = ["IND", "WEE"].includes(CountryCode);
            const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tableName, fieldList]);
            
            if (availablefield.rows.length > 0 && isIndiaCountry) {
                valuefield = ' ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD';
            }
            const access = await db.query(query.GET_PORT_OF_ORIGIN_ACCESS, [CountryCode, Direction.toUpperCase(), countryType]);        
            group = '"PortofOrigin"';
            // count = isIndiaCountry ? 'COUNT("Exp_Name") as count': "";
    
            if (access.rows.length > 0) {
                const keys = Object.keys(access.rows[0]);
                const obj = access.rows[0];
                if (!Object.values(access.rows[0]).includes(true)) {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] == false) { output[keys[i]] = []; }
                    }
                    return res.status(200).json(success("Ok", output, res.statusCode));
                } else {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] === true) {
                            selectQuery += '"' + keys[i] + '", '
                        }
                    }
                    const finalQuery = `${selectQuery.replace(/,\s*$/, "")}${valuefield!='' ? `,${valuefield}`: ''}`;
                    const partialQuery = await common.getDatabaseQuery({
                        body: req.body,
                        tablename: tableName,
                        isOrderBy: false,
                        query: `${finalQuery} FROM `,
                        searchType: `sidefilter-${group}`
                    });
                    const withoutGroup = `${partialQuery[0]}${isSideFilter ? ` limit ${limit}`: ""}`;//`${partialQuery[0]} GROUP BY ${selectQuery.replace("Distinct ", "").replace(/,\s*$/, "")}${isSideFilter ? ` limit ${limit}`: ""}`;
                    const querySql = setWithGroupQuerySidefilter(group, withoutGroup);

                    db.query(querySql, partialQuery[1].slice(1), (err, results) => {
                        if (!err) {
                            return res.status(200).json(success("Ok", results.rows, res.statusCode));
                        } else {
                            return res.status(500).json(error(err.message, res.statusCode));
                        }
                    });
                }
            }
        } catch (err) {
            return res.status(500).json(error(err, res.statusCode));
        };
    },

    getPortOfDestinationSidefilter: async (req, res) => {
        try {
            const { CountryCode, CountryName, Direction, isSideFilter, limit, countryType } = req.body;
            
            const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
            const fieldList = ["ValueInUSD"],  output = {};
            let valuefield = '', selectQuery = 'Distinct ', group = '';
            const isIndiaCountry = ["IND", "WEE"].includes(CountryCode);
            const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tableName, fieldList]);
            
            if (availablefield.rows.length > 0 && isIndiaCountry) {
                valuefield = ' ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD';
            }
            const access = await db.query(query.GET_PORT_OF_DESTINATION_ACCESS, [CountryCode, Direction.toUpperCase(), countryType]);        
            group = '"PortofDestination"';
            // count = isIndiaCountry ? 'COUNT("Exp_Name") as count': "";
    
            if (access.rows.length > 0) {
                const keys = Object?.keys(access.rows[0]);
                const obj = access.rows[0];
                if (!Object.values(access.rows[0]).includes(true)) {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] == false) { output[keys[i]] = []; }
                    }
                    return res.status(200).json(success("Ok", output, res.statusCode));
                } else {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] === true) {
                            selectQuery += '"' + keys[i] + '", '
                        }
                    }
                    const finalQuery = `${selectQuery.replace(/,\s*$/, "")}${valuefield!='' ? `,${valuefield}`: ''}`;
                    const partialQuery = await common.getDatabaseQuery({
                        body: req.body,
                        tablename: tableName,
                        isOrderBy: false,
                        query: `${finalQuery} FROM `,
                        searchType: `sidefilter-${group}`
                    });
                    const withoutGroup = `${partialQuery[0]}${isSideFilter ? ` limit ${limit}`: ""}`;//`${partialQuery[0]} GROUP BY ${selectQuery.replace("Distinct ", "").replace(/,\s*$/, "")}${isSideFilter ? ` limit ${limit}`: ""}`;
                    const querySql = setWithGroupQuerySidefilter(group, withoutGroup);

                    db.query(querySql, partialQuery[1].slice(1), (err, results) => {
                        if (!err) {
                            return res.status(200).json(success("Ok", results.rows, res.statusCode));
                        } else {
                            return res.status(500).json(error(err.message, res.statusCode));
                        }
                    });
                }
            }
        } catch (err) {
            return res.status(500).json(error(err, res.statusCode));
        };
    },

    getModeSidefilter: async (req, res) => {
        try {
            const { CountryCode, CountryName, Direction, isSideFilter, limit, countryType } = req.body;
            
            const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
            const fieldList = ["ValueInUSD"],  output = {};
            let valuefield = '', selectQuery = 'Distinct ', group = '';
            const isIndiaCountry = ["IND", "WEE"].includes(CountryCode);
            const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tableName, fieldList]);
            
            if (availablefield.rows.length > 0 && isIndiaCountry) {
                valuefield = ' ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD';
            }
            const access = await db.query(query.GET_MODE_ACCESS, [CountryCode, Direction.toUpperCase(), countryType]);        
            group = '"Mode"';
            // count = isIndiaCountry ? 'COUNT("Exp_Name") as count': "";
    
            if (access.rows.length > 0) {
                const keys = Object.keys(access.rows[0]);
                const obj = access.rows[0];
                if (!Object.values(access.rows[0]).includes(true)) {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] == false) { output[keys[i]] = []; }
                    }
                    return res.status(200).json(success("Ok", output, res.statusCode));
                } else {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] === true) {
                            selectQuery += '"' + keys[i] + '", '
                        }
                    }
                    const finalQuery = `${selectQuery.replace(/,\s*$/, "")}${valuefield!='' ? `,${valuefield}`: ''}`;
                    const partialQuery = await common.getDatabaseQuery({
                        body: req.body,
                        tablename: tableName,
                        isOrderBy: false,
                        query: `${finalQuery} FROM `,
                        searchType: `sidefilter-${group}`
                    });
                    const withoutGroup = `${partialQuery[0]}${isSideFilter ? ` limit ${limit}`: ""}`;//`${partialQuery[0]} GROUP BY ${selectQuery.replace("Distinct ", "").replace(/,\s*$/, "")}${isSideFilter ? ` limit ${limit}`: ""}`;
                    const querySql = setWithGroupQuerySidefilter(group, withoutGroup);

                    db.query(querySql, partialQuery[1].slice(1), (err, results) => {
                        if (!err) {
                            return res.status(200).json(success("Ok", results.rows, res.statusCode));
                        } else {
                            return res.status(500).json(error(err.message, res.statusCode));
                        }
                    });
                }
            }
        } catch (err) {
            return res.status(500).json(error(err, res.statusCode));
        };
    },

    getUqcSidefilter: async (req, res) => {
        try {
            const { CountryCode, CountryName, Direction, countryType, isSideFilter, limit } = req.body;
            const {tableName, statCountryName} = utility.getCurrentTableName({countryType, direction: Direction, countryname:CountryName});
            await getPreRequiredDataForFurtherFetching({countryType, Direction, countryname:CountryName, statCountryName, body: req?.body || {}});            

            // const { CountryCode, CountryName, Direction, isSideFilter, limit, countryType } = req.body;
            // if(countryType==="MIRROR") {
            //     const extractedCountryName = extractCountry(CountryName);
            //     const countryKey = Direction=="import" ? "CountryofDestination": "CountryofOrigin";
            //     if(req.body.hasOwnProperty(countryKey)) { req.body[countryKey].push(extractedCountryName); } 
            //     else { req.body[countryKey] = [extractedCountryName]; }
            // }
            // const tableName = `${Direction.toLowerCase()}_${countryType==="CUSTOM" ? CountryName.toLowerCase(): "mirror"}`;
            
            // const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
            const fieldList = ["ValueInUSD"],  output = {};
            let valuefield = '', selectQuery = 'Distinct ', group = '';
            const isIndiaCountry = ["IND", "WEE"].includes(CountryCode);
            const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tableName, fieldList]);
            
            if (availablefield.rows.length > 0 && isIndiaCountry) {
                valuefield = ' ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD';
            }
            const access = await db.query(query.GET_UQC_ACCESS, [CountryCode, Direction.toUpperCase(), countryType]);        
            group = '"uqc"';
            // count = isIndiaCountry ? 'COUNT("Exp_Name") as count': "";
    
            if (access.rows.length > 0) {
                const keys = Object.keys(access.rows[0]);
                const obj = access.rows[0];
                if (!Object.values(access.rows[0]).includes(true)) {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] == false) { output[keys[i]] = []; }
                    }
                    return res.status(200).json(success("Ok", output, res.statusCode));
                } else {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] === true) {
                            selectQuery += '"' + keys[i] + '", '
                        }
                    }
                    const finalQuery = `${selectQuery.replace(/,\s*$/, "")}${valuefield!='' ? `,${valuefield}`: ''}`;
                    const partialQuery = await common.getDatabaseQuery({
                        body: req.body,
                        tablename: tableName,
                        isOrderBy: false,
                        query: `${finalQuery} FROM `,
                        searchType: `sidefilter-${group}`
                    });
                    const withoutGroup = `${partialQuery[0]}${isSideFilter ? ` limit ${limit}`: ""}`;//`${partialQuery[0]} GROUP BY ${selectQuery.replace("Distinct ", "").replace(/,\s*$/, "")}${isSideFilter ? ` limit ${limit}`: ""}`;
                    const querySql = setWithGroupQuerySidefilter(group, withoutGroup);

                    db.query(querySql, partialQuery[1].slice(1), (err, results) => {
                        if (!err) {
                            return res.status(200).json(success("Ok", results.rows, res.statusCode));
                        } else {
                            return res.status(500).json(error(err.message, res.statusCode));
                        }
                    });
                }
            }
        } catch (err) {
            return res.status(500).json(error(err, res.statusCode));
        };
    },

    getCurrencySidefilter: async (req, res) => {
        try {
            const { CountryCode, CountryName, Direction, countryType, isSideFilter, limit } = req.body;
            const {tableName, statCountryName} = utility.getCurrentTableName({countryType, direction: Direction, countryname:CountryName});
            await getPreRequiredDataForFurtherFetching({countryType, Direction, countryname:CountryName, statCountryName, body: req?.body || {}});            

            // const { CountryCode, CountryName, Direction, isSideFilter, limit, countryType } = req.body;
            // if(countryType==="MIRROR") {
            //     const extractedCountryName = extractCountry(CountryName);
            //     const countryKey = Direction=="import" ? "CountryofDestination": "CountryofOrigin";
            //     if(req.body.hasOwnProperty(countryKey)) { req.body[countryKey].push(extractedCountryName); } 
            //     else { req.body[countryKey] = [extractedCountryName]; }
            // }
            // const tableName = `${Direction.toLowerCase()}_${countryType==="CUSTOM" ? CountryName.toLowerCase(): "mirror"}`;
            
            // const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
            const fieldList = ["ValueInUSD"],  output = {};
            let valuefield = '', selectQuery = 'Distinct ', group = '';
            const isIndiaCountry = ["IND", "WEE"].includes(CountryCode);
            const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tableName, fieldList]);
            
            if (availablefield.rows.length > 0 && isIndiaCountry) {
                valuefield = ' ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD';
            }
            const access = await db.query(query.GET_CURRENCY_ACCESS, [CountryCode, Direction.toUpperCase(), countryType]);        
            group = '"Currency"';
            // count = isIndiaCountry ? 'COUNT("Exp_Name") as count': "";
    
            if (access.rows.length > 0) {
                const keys = Object.keys(access.rows[0]);
                const obj = access.rows[0];
                if (!Object.values(access.rows[0]).includes(true)) {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] == false) { output[keys[i]] = []; }
                    }
                    return res.status(200).json(success("Ok", output, res.statusCode));
                } else {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] === true) {
                            selectQuery += '"' + keys[i] + '", '
                        }
                    }
                    const finalQuery = `${selectQuery.replace(/,\s*$/, "")}${valuefield!='' ? `,${valuefield}`: ''}`;
                    const partialQuery = await common.getDatabaseQuery({
                        body: req.body,
                        tablename: tableName,
                        isOrderBy: false,
                        query: `${finalQuery} FROM `,
                        searchType: `sidefilter-${group}`
                    });
                    const withoutGroup = `${partialQuery[0]}${isSideFilter ? ` limit ${limit}`: ""}`;//`${partialQuery[0]} GROUP BY ${selectQuery.replace("Distinct ", "").replace(/,\s*$/, "")}${isSideFilter ? ` limit ${limit}`: ""}`;
                    const querySql = setWithGroupQuerySidefilter(group, withoutGroup);

                    db.query(querySql, partialQuery[1].slice(1), (err, results) => {
                        if (!err) {
                            return res.status(200).json(success("Ok", results.rows, res.statusCode));
                        } else {
                            return res.status(500).json(error(err.message, res.statusCode));
                        }
                    });
                }
            }
        } catch (err) {
            return res.status(500).json(error(err, res.statusCode));
        };
    },

    getMonthSidefilter: async (req, res) => {
        try {
            const { CountryCode, CountryName, Direction, isSideFilter, limit, countryType } = req.body;
            const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
            const fieldList = ["ValueInUSD"],  output = {};
            let valuefield = '', selectQuery = 'Distinct ', group = '';
            const isIndiaCountry = ["IND", "WEE"].includes(CountryCode);
            const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tableName, fieldList]);
            
            if (availablefield.rows.length > 0 && isIndiaCountry) {
                valuefield = ' ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD';
            }
            const access = await db.query(query.GET_MONTH_ACCESS, [CountryCode, Direction.toUpperCase(), countryType]);        
            group = '"Month"';
            // count = isIndiaCountry ? 'COUNT("Exp_Name") as count': "";
    
            if (access.rows.length > 0) {
                const keys = Object.keys(access.rows[0]);
                const obj = access.rows[0];
                if (!Object.values(access.rows[0]).includes(true)) {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] == false) { output[keys[i]] = []; }
                    }
                    return res.status(200).json(success("Ok", output, res.statusCode));
                } else {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] === true) {
                            selectQuery += '"' + keys[i] + '", '
                        }
                    }
                    const finalQuery = `${selectQuery.replace(/,\s*$/, "")}${valuefield!='' ? `,${valuefield}`: ''}`;
                    const partialQuery = await common.getDatabaseQuery({
                        body: req.body,
                        tablename: tableName,
                        isOrderBy: false,
                        query: `${finalQuery} FROM `,
                        searchType: `sidefilter-${group}`
                    });
                    const withoutGroup = `${partialQuery[0]}${isSideFilter ? ` limit ${limit}`: ""}`;//`${partialQuery[0]} GROUP BY ${selectQuery.replace("Distinct ", "").replace(/,\s*$/, "")}${isSideFilter ? ` limit ${limit}`: ""}`;
                    const querySql = setWithGroupQuerySidefilter(group, withoutGroup);
                    
                    db.query(querySql, partialQuery[1].slice(1), (err, results) => {
                        if (!err) {
                            return res.status(200).json(success("Ok", results.rows, res.statusCode));
                        } else {
                            return res.status(500).json(error(err.message, res.statusCode));
                        }
                    });
                }
            }
        } catch (err) {
            return res.status(500).json(error(err, res.statusCode));
        };
    },

    getYearSidefilter: async (req, res) => {
        try {
            const { CountryCode, CountryName, Direction, isSideFilter, limit, countryType } = req.body;
            const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
            const fieldList = ["ValueInUSD"],  output = {};
            let valuefield = '', selectQuery = 'Distinct ', group = '';
            const isIndiaCountry = ["IND", "WEE"].includes(CountryCode);
            const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tableName, fieldList]);
            
            if (availablefield.rows.length > 0 && isIndiaCountry) {
                valuefield = ' ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD';
            }
            const access = await db.query(query.GET_YEAR_ACCESS, [CountryCode, Direction.toUpperCase(), countryType]);        
            group = '"Year"';
    
            if (access.rows.length > 0) {
                const keys = Object.keys(access.rows[0]);
                const obj = access.rows[0];
                if (!Object.values(access.rows[0]).includes(true)) {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] == false) { output[keys[i]] = []; }
                    }
                    return res.status(200).json(success("Ok", output, res.statusCode));
                } else {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] === true) {
                            selectQuery += '"' + keys[i] + '", '
                        }
                    }
                    const finalQuery = `${selectQuery.replace(/,\s*$/, "")}${valuefield!='' ? `,${valuefield}`: ''}`;
                    const partialQuery = await common.getDatabaseQuery({
                        body: req.body,
                        tablename: tableName,
                        isOrderBy: false,
                        query: `${finalQuery} FROM `,
                        searchType: `sidefilter-${group}`
                    });
                    const withoutGroup = `${partialQuery[0]}${isSideFilter ? ` limit ${limit}`: ""}`;//`${partialQuery[0]} GROUP BY ${selectQuery.replace("Distinct ", "").replace(/,\s*$/, "")}${isSideFilter ? ` limit ${limit}`: ""}`;
                    const querySql = setWithGroupQuerySidefilter(group, withoutGroup);

                    db.query(querySql, partialQuery[1].slice(1), (err, results) => {
                        if (!err) {
                            return res.status(200).json(success("Ok", results.rows, res.statusCode));
                        } else {
                            return res.status(500).json(error(err.message, res.statusCode));
                        }
                    });
                }
            }
        } catch (err) {
            return res.status(500).json(error(err, res.statusCode));
        };
    },

    getQuantitySidefilter: async (req, res) => {
        try {
            const { CountryCode, CountryName, Direction, countryType } = req.body;
            const {tableName, statCountryName} = utility.getCurrentTableName({countryType, direction: Direction, countryname:CountryName});
            await getPreRequiredDataForFurtherFetching({countryType, Direction, countryname: CountryName, statCountryName, body: req?.body || {}});            

            // const { CountryCode, CountryName, Direction, countryType } = req.body;
            // if(countryType==="MIRROR") {
            //     const extractedCountryName = extractCountry(CountryName);
            //     const countryKey = Direction=="import" ? "CountryofDestination": "CountryofOrigin";
            //     if(req.body.hasOwnProperty(countryKey)) { req.body[countryKey].push(extractedCountryName); } 
            //     else { req.body[countryKey] = [extractedCountryName]; }
            // }
            // const tableName = `${Direction.toLowerCase()}_${countryType==="CUSTOM" ? CountryName.toLowerCase(): "mirror"}`;
            
            // const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
            const output = {};
            let valuefield = '', selectQuery = 'Distinct ', group = '';
            
            const access = await db.query(query.GET_QUANTITY_ACCESS, [CountryCode, Direction.toUpperCase(), countryType]);        
            group = '"Quantity"';
    
            if (access.rows.length > 0) {
                const keys = Object.keys(access.rows[0]);
                const obj = access.rows[0];
                if (!Object.values(access.rows[0]).includes(true)) {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] == false) { output[keys[i]] = []; }
                    }
                    return res.status(200).json(success("Ok", output, res.statusCode));
                } else {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] === true) {
                            selectQuery += '"' + keys[i] + '", '
                        }
                    }
                    const finalQuery = `${selectQuery.replace(/,\s*$/, "")}${valuefield!='' ? `,${valuefield}`: ''}`;
                    const partialQuery = await common.getDatabaseQuery({
                        body: req.body,
                        tablename: tableName,
                        isOrderBy: false,
                        query: `${finalQuery} FROM `,
                        searchType: `sidefilter-${group}`
                    });
                    const querySql = `${partialQuery[0]} GROUP BY ${selectQuery.replace("Distinct ", "").replace(/,\s*$/, "")}`;
                    
                    db.query(querySql, partialQuery[1].slice(1), (err, results) => {
                        if (!err) {
                            return res.status(200).json(success("Ok", results.rows, res.statusCode));
                        } else {
                            return res.status(500).json(error(err.message, res.statusCode));
                        }
                    });
                }
            }
        } catch (err) {
            return res.status(500).json(error(err, res.statusCode));
        };
    },

    getLoadingPortSidefilter: async (req, res) => {
        try {
            const { CountryCode, CountryName, Direction, isSideFilter, limit, countryType } = req.body;
            const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
            const fieldList = ["ValueInUSD"],  output = {};
            let valuefield = '', selectQuery = 'Distinct ', group = '';
            const isIndiaCountry = ["IND", "WEE"].includes(CountryCode);
            const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tableName, fieldList]);
            
            if (availablefield.rows.length > 0 && isIndiaCountry) {
                valuefield = ' ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD';
            }
            const access = await db.query(query.GET_LOADING_PORT_ACCESS, [CountryCode, Direction.toUpperCase(), countryType]);        
            group = '"LoadingPort"';
    
            if (access.rows.length > 0) {
                const keys = Object.keys(access.rows[0]);
                const obj = access.rows[0];
                if (!Object.values(access.rows[0]).includes(true)) {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] == false) { output[keys[i]] = []; }
                    }
                    return res.status(200).json(success("Ok", output, res.statusCode));
                } else {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] === true) {
                            selectQuery += '"' + keys[i] + '", '
                        }
                    }
                    const finalQuery = `${selectQuery.replace(/,\s*$/, "")}${valuefield!='' ? `,${valuefield}`: ''}`;
                    const partialQuery = await common.getDatabaseQuery({
                        body: req.body,
                        tablename: tableName,
                        isOrderBy: false,
                        query: `${finalQuery} FROM `,
                        searchType: `sidefilter-${group}`
                    });
                    const withoutGroup = `${partialQuery[0]}${isSideFilter ? ` limit ${limit}`: ""}`;//`${partialQuery[0]} GROUP BY ${selectQuery.replace("Distinct ", "").replace(/,\s*$/, "")}${isSideFilter ? ` limit ${limit}`: ""}`;
                    const querySql = setWithGroupQuerySidefilter(group, withoutGroup);

                    db.query(querySql, partialQuery[1].slice(1), (err, results) => {
                        if (!err) {
                            return res.status(200).json(success("Ok", results.rows, res.statusCode));
                        } else {
                            return res.status(500).json(error(err.message, res.statusCode));
                        }
                    });
                }
            }
        } catch (err) {
            return res.status(500).json(error(err, res.statusCode));
        };
    },

    getNotifyPartyNameSidefilter: async (req, res) => {
        try {
            const { CountryCode, CountryName, Direction, isSideFilter, limit, countryType } = req.body;
            const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
            const fieldList = ["ValueInUSD"],  output = {};
            let valuefield = '', selectQuery = 'Distinct ', group = '';
            const isIndiaCountry = ["IND", "WEE"].includes(CountryCode);
            const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tableName, fieldList]);
            
            if (availablefield.rows.length > 0 && isIndiaCountry) {
                valuefield = ' ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD';
            }
            const access = await db.query(query.GET_NOTIFY_PARTY_ACCESS, [CountryCode, Direction.toUpperCase(), countryType]);        
            group = '"NotifyPartyName"';
    
            if (access.rows.length > 0) {
                const keys = Object.keys(access.rows[0]);
                const obj = access.rows[0];
                if (!Object.values(access.rows[0]).includes(true)) {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] == false) { output[keys[i]] = []; }
                    }
                    return res.status(200).json(success("Ok", output, res.statusCode));
                } else {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] === true) {
                            selectQuery += '"' + keys[i] + '", '
                        }
                    }
                    const finalQuery = `${selectQuery.replace(/,\s*$/, "")}${valuefield!='' ? `,${valuefield}`: ''}`;
                    const partialQuery = await common.getDatabaseQuery({
                        body: req.body,
                        tablename: tableName,
                        isOrderBy: false,
                        query: `${finalQuery} FROM `,
                        searchType: `sidefilter-${group}`
                    });
                    const withoutGroup = `${partialQuery[0]}${isSideFilter ? ` limit ${limit}`: ""}`;//`${partialQuery[0]} GROUP BY ${selectQuery.replace("Distinct ", "").replace(/,\s*$/, "")}${isSideFilter ? ` limit ${limit}`: ""}`;
                    const querySql = setWithGroupQuerySidefilter(group, withoutGroup);

                    db.query(querySql, partialQuery[1].slice(1), (err, results) => {
                        if (!err) {
                            return res.status(200).json(success("Ok", results.rows, res.statusCode));
                        } else {
                            return res.status(500).json(error(err.message, res.statusCode));
                        }
                    });
                }
            }
        } catch (err) {
            return res.status(500).json(error(err, res.statusCode));
        };
    }
    //////////////////////////////////////////////////////////
}
// 7300652134


