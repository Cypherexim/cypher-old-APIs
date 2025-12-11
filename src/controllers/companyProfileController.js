const db = require('../utils/database_temp');
const { success, error, extractCountry } = require('../../src/utils/response');
const utility = require('../utils/utility');
const config = require('../utils/config');
const queries = require('../sql/queries');


// exports.getcompanyprofile_temp = async (req, res) => {
//     //db.connect();
//     try {        
//         const { countryname, companyname, direction, resultfor } = req.body;
//         let query = '';
//         let selectedfields = '';
//         const dateto = utility.formatDate(new Date());
//         if (resultfor.toLowerCase() == 'buyer') {
//             const fieldList = ["Exp_Name", "Imp_Name", "HsCode", "Quantity", "ValueInUSD", "Exp_Address", "CountryofDestination",
//                 "Exp_City", "Exp_PIN", "Exp_Phone", "Exp_Email"];
//             const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [direction.toLowerCase() + '_' + countryname.toLowerCase(), fieldList]);
//             availablefield.rows.forEach(x => {
//                 selectedfields += '"' + x.column_name + '",';
//             })
//             query = 'SELECT ' + selectedfields.replace(/,\s*$/, "") + ' FROM ' + direction.toLowerCase() + '_' + countryname.toLowerCase() + ' where "Imp_Name" = $1 AND "Date" >= $2 AND "Date" <= $3';
//         } else {
//             const fieldList = ["Exp_Name", "Imp_Name", "HsCode", "Quantity", "ValueInUSD","CountryofOrigin", "Importer_Address", "Importer_City", "Importer_PIN", "Importer_Phone", "Importer_Email"];
//             const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [direction.toLowerCase() + '_' + countryname.toLowerCase(), fieldList]);
//             availablefield.rows.forEach(x => {
//                 selectedfields += '"' + x.column_name + '",';
//             })
//             query = 'SELECT ' + selectedfields.replace(/,\s*$/, "") + ' FROM ' + direction.toLowerCase() + '_' + countryname.toLowerCase() + ' where "Exp_Name" = $1 AND "Date" >= $2 AND "Date" <= $3';
//         }
//         db.query(query, [companyname, config.companyProfileStartDate, dateto], (err, results) => {
//             if (!err) {
//                 return res.status(200).json(success("Ok", results.rows, res.statusCode));
//             } else {
//                 return res.status(200).json(error(err.message, "No Record found !", res.statusCode));
//             }
//         })
//     } catch (err) {
//         return res.status(500).json(error(err, res.statusCode));
//     };
//     //db.end;
// }

exports.getCompanyProfileForFields = async(req, res) => {
    try {
        const { date, countryname, companyname, direction, sameCompanyCountry, countryType } = req?.body;

        let selectedfields = "";
        const dateTo = utility.formatDate(new Date(date));
        const dateFrom = config.companyProfileStartDate(date);
        
        const fieldList = ["'HsCode'", "'ValueInUSD'"];
        sameCompanyCountry
        ? fieldList.push(...(direction==="import" ? ["'Exp_Name'", "'CountryofOrigin'"]: ["'Imp_Name'", "'CountryofDestination'"]))
        : fieldList.push(...(direction==="import" ? ["'Imp_Name'", "'CountryofDestination'"]: ["'Exp_Name'", "'CountryofOrigin'"]));
        // if(sameCompanyCountry) {
        // } else {
        // }
        // fieldList.push(...(direction==="import" ? ["'Exp_Name'", "'CountryofOrigin'"]: ["'Imp_Name'", "'CountryofDestination'"]));

        ///////////////////////////////////////////////////////
        const {tableName} = utility.getCurrentTableName({countryType, direction, countryname});
        const countryKey = direction==="import" ? "CountryofDestination": "CountryofOrigin";
        if(countryType==="MIRROR" && countryname!=="china") {
            const extractedCountryName = extractCountry(countryname);
            if(req.body.hasOwnProperty(countryKey)) { req.body[countryKey].push(extractedCountryName); } 
            else { req.body[countryKey] = [extractedCountryName]; }
        }
        ///////////////////////////////////////////////////////

        const companyColName = sameCompanyCountry ? direction.toLowerCase()=="import" ? "Imp_Name" : "Exp_Name" : 
                                direction.toLowerCase()=="import" ? "Exp_Name" : "Imp_Name";
                                
        const availablefield = await db.query(`SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name in (${fieldList.toString()})`, [tableName]);
        availablefield.rows.forEach(row => { selectedfields += `"${row?.column_name}",`; });

        const inCaseOfMirrorCountry = countryType==='MIRROR' ? `"${countryKey}" ilike '${req.body[countryKey]}' AND`: "";
        let query = `SELECT ${selectedfields.replace(/,\s*$/, "")} FROM ${tableName} where "Date" >= $1 AND "Date" <= $2 AND ${inCaseOfMirrorCountry} "${companyColName}" like '%${companyname}%'`;
        if(!sameCompanyCountry) {
            query = query.replace("FROM", `, '${countryname.toUpperCase()}' as "${direction==="import"? "CountryofDestination": "CountryofOrigin"}" FROM`)
        }

        db.query(query, [dateFrom, dateTo], (err, results) => {
            if (!err) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(200).json(error(err.message, res.statusCode));
            }
        });
    } catch (err) { return res.status(500).json(error(err?.message, res?.statusCode)); }
}

exports.getCompanyProfileOfShipments = async(req, res) => {
    try {
        const { date, countryname, companyname, direction, sameCompanyCountry, countryType, page } = req.body;
        
        let selectedfields = "";
        const limit = 100, offset = (page-1) * limit;
        const dateTo = utility.formatDate(new Date(date));
        const dateFrom = config.companyProfileStartDate(date);
        
        const fieldList = ["'Exp_Name'", "'Imp_Name'", "'HsCode'", "'Quantity'", "'ValueInUSD'", "'CountryofDestination'",  "'CountryofOrigin'"]; //.concat(sameCompanyCountry ? ["'Exp_Address'", "'Exp_City'", "'Exp_PIN'", "'Exp_Phone'", "'Exp_Email'", "'Importer_Address'", "'Importer_City'", "'Importer_PIN'", "'Importer_Phone'", "'Importer_Email'"].toLocaleString() : []);

        // const tableName = `${direction.toLowerCase()}_${countryname.toLowerCase()}`;
        const {tableName} = utility.getCurrentTableName({countryType, direction, countryname});
        const countryKey = direction=="import" ? "CountryofDestination": "CountryofOrigin";
        if(countryType==="MIRROR" && countryname!=="china") {
            const extractedCountryName = extractCountry(countryname);            
            if(req.body.hasOwnProperty(countryKey)) { req.body[countryKey].push(extractedCountryName); } 
            else { req.body[countryKey] = [extractedCountryName]; }
        }
        ///////////////////////////////////////////////////////

        const companyColName = sameCompanyCountry ? direction.toLowerCase()=="import" ? "Imp_Name" : "Exp_Name" : 
                                direction.toLowerCase()=="import" ? "Exp_Name" : "Imp_Name";
                                
        const availablefield = await db.query(`SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name in (${fieldList.toString()})`, [tableName]);
        availablefield.rows.forEach(x => { selectedfields += '"' + x.column_name + '",'; });

        const inCaseOfMirrorCountry = countryType==='MIRROR' ? `"${countryKey}" ilike '${req.body[countryKey]}' AND`: "";
        let query = `SELECT ${selectedfields.replace(/,\s*$/, "")} FROM ${tableName} where "Date" >= $1 AND "Date" <= $2 AND ${inCaseOfMirrorCountry} "${companyColName}" like '%${companyname}%' OFFSET ${offset} LIMIT ${limit}`;
        if(!sameCompanyCountry) {
            query = query.replaceAll("FROM", `, '${countryname.toUpperCase()}' as "${direction==="import"? "CountryofDestination": "CountryofOrigin"}" FROM`)
        }


        db.query(query, [dateFrom, dateTo], (err, results) => {
            if (!err) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(200).json(error(err.message, res.statusCode));
            }
        });
    } catch (err) { return res.status(500).json(error(err?.message, res.statusCode)); };
}

exports.getCompanyProfileTotalCounts = async(req, res) => {
    try {
        const { date, countryname, companyname, direction, sameCompanyCountry, countryType } = req.body;        
        const dateTo = utility.formatDate(new Date(date));
        const dateFrom = config.companyProfileStartDate(date);
        
        const fieldList = ["'RecordID'", "'HsCode'", "'ValueInUSD'", "'Quantity'"];
        sameCompanyCountry
        ? fieldList.push(...(direction==="import" ? ["'Exp_Name'", "'CountryofOrigin'"]: ["'Imp_Name'", "'CountryofDestination'"]))
        : fieldList.push(...(direction==="import" ? ["'Imp_Name'", "'CountryofDestination'"]: ["'Exp_Name'", "'CountryofOrigin'"]));



        const {tableName} = utility.getCurrentTableName({countryType, direction, countryname});
        const countryKey = direction=="import" ? "CountryofDestination": "CountryofOrigin";
        if(countryType==="MIRROR" && countryname!=="china") {
            const extractedCountryName = extractCountry(countryname);
            if(req.body.hasOwnProperty(countryKey)) { req.body[countryKey].push(extractedCountryName); }
            else { req.body[countryKey] = [extractedCountryName]; }
        }
        ///////////////////////////////////////////////////////

        const companyColName = sameCompanyCountry ? direction.toLowerCase()=="import" ? "Imp_Name" : "Exp_Name" : 
                                direction.toLowerCase()=="import" ? "Exp_Name" : "Imp_Name";
                                
        const availablefield = await db.query(`SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name in (${fieldList.toString()})`, [tableName]);
        const allColNamesInArray = availablefield?.rows?.map(rowObj => rowObj?.column_name);
        const selectedfields = getQueryOnCounts(allColNamesInArray);

        const inCaseOfMirrorCountry = countryType==='MIRROR' ? `"${countryKey}" ilike '${req.body[countryKey]}' AND`: "";
        const query = `SELECT ${selectedfields} FROM ${tableName} where "Date" >= $1 AND "Date" <= $2 AND ${inCaseOfMirrorCountry} "${companyColName}" like '%${companyname}%'`;

        db.query(query, [dateFrom, dateTo], (err, results) => {
            if (!err) {
                const result = results?.rows;
                if(!sameCompanyCountry) {
                    const updatedResult = [{...result[0], [countryKey]: result[0]["total"]==="0" ? "0": "1"}];
                    return res.status(200).json(success("Ok", updatedResult, res.statusCode));
                }

                return res.status(200).json(success("Ok", result, res.statusCode));
            } else {
                return res.status(200).json(error(err.message, res.statusCode));
            }
        });
    } catch (err) { return res.status(500).json(error(err?.message, res.statusCode)); };
}

const getQueryOnCounts = (colNames) => {
    let sqlQuery = "";

    for(let i=0; i<colNames.length; i++) {
        if(["HsCode", "Exp_Name", "CountryofOrigin", "Imp_Name", "CountryofDestination"].includes(colNames[i])) {
            sqlQuery += `COUNT(DISTINCT "${colNames[i]}") AS "${colNames[i]}", `;
        } else if(["Quantity", "ValueInUSD"].includes(colNames[i])) {   
            sqlQuery += `SUM("${colNames[i]}") AS "${colNames[i]}", `;
        } else {
            sqlQuery += `COUNT("${colNames[i]}") as Total, `;
        }
    }

    return sqlQuery.substring(0, (sqlQuery.length-2));
}


exports.getcompanyprofile = async (req, res) => {
    try {
        const { date, countryname, companyname, direction, sameCompanyCountry, countryType, page } = req.body;
        
        let selectedfields = "";
        // const limit = 100, offset = (page-1) * limit;
        const dateTo = utility.formatDate(new Date(date));
        const dateFrom = config.companyProfileStartDate(date);
        
        const fieldList = ["'Exp_Name'", "'Imp_Name'", "'HsCode'", "'Quantity'", "'ValueInUSD'", "'CountryofDestination'",  "'CountryofOrigin'"].concat(sameCompanyCountry ? ["'Exp_Address'", "'Exp_City'", "'Exp_PIN'", "'Exp_Phone'", "'Exp_Email'", "'Importer_Address'", "'Importer_City'", "'Importer_PIN'", "'Importer_Phone'", "'Importer_Email'"].toLocaleString() : []);

        // const tableName = `${direction.toLowerCase()}_${countryname.toLowerCase()}`;
        const {tableName} = utility.getCurrentTableName({countryType, direction, countryname});
        const countryKey = direction=="import" ? "CountryofDestination": "CountryofOrigin";
        if(countryType==="MIRROR" && countryname!=="china") {
            const extractedCountryName = extractCountry(countryname);            
            if(req.body.hasOwnProperty(countryKey)) { req.body[countryKey].push(extractedCountryName); } 
            else { req.body[countryKey] = [extractedCountryName]; }
        }
        ///////////////////////////////////////////////////////

        const companyColName = sameCompanyCountry ? direction.toLowerCase()=="import" ? "Imp_Name" : "Exp_Name" : 
                                direction.toLowerCase()=="import" ? "Exp_Name" : "Imp_Name";
                                
        const availablefield = await db.query(`SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name in (${fieldList.toString()})`, [tableName]);
        availablefield.rows.forEach(x => { selectedfields += '"' + x.column_name + '",'; });

        const inCaseOfMirrorCountry = countryType==='MIRROR' ? `"${countryKey}" ilike '${req.body[countryKey]}' AND`: "";
        const query = `SELECT ${selectedfields.replace(/,\s*$/, "")} FROM ${tableName} where "Date" >= $1 AND "Date" <= $2 AND ${inCaseOfMirrorCountry} "${companyColName}" like '%${companyname}%'`;
console.log(query, dateFrom, dateTo);

        db.query(query, [dateFrom, dateTo], (err, results) => {
            if (!err) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(200).json(error(err.message, "No Record found!", res.statusCode));
            }
        });
    } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
}


exports.getCompanyInfoDetails = (req, res) => {
    const {company} = req.body;
    const sqlQuery = queries.GET_COMPANY_INFO_DATA(company);
    
    try {
        db.query(sqlQuery, (err, result) => {
            if(err) {res.status(500).json(error(err.message, res.statusCode));}
            else {res.status(200).json(success("OK", result.rows, res.statusCode));}
        });
    } catch (err) {
        res.status(500).json(error(err, res.statusCode));
    }
}

exports.getCompanyListBykeword = (req, res) => {
    const {keyword} = req.query;

    try {
        db.query(queries.GET_COMPANY_LIST, [`${keyword}%`], (err, result) => {
            if(err) {res.status(500).json(error(err.message, res.statusCode));}
            else {res.status(200).json(success("OK", result.rows, res.statusCode));}
        });
    } catch (err) {
        res.status(500).json(error(err, res.statusCode));
    }
}


exports.transferCompanyDetails = (req, res) => {
    const { company, userId, dateTime } = req.body;

    try {
        db.query(queries.SEND_COMPANY_REQUEST, [company, dateTime, userId], (err, result) => {
            if(err) {res.status(500).json(error(err.message, res.statusCode));}
            else {res.status(200).json(success(`${result.command} Successful.`, [], res.statusCode));}
        });
    } catch (err) {
        res.status(500).json(error(err, res.statusCode));
    }
}

exports.getRequestedCompanies = (req, res) => {
    try {
        db.query(queries.GET_REQUESTED_COMPANIES, (err, result) => {
            if(err) {res.status(500).json(error(err.message, res.statusCode));}
            else {res.status(200).json(success("OK", result.rows, res.statusCode));}
        });
    } catch (err) {
        res.status(500).json(error(err, res.statusCode));
    }
}

// exports.getRequestedCompanies = (req, res) => {
//     const {} = req.body;
//     try {
//         db.query(queries.GET_REQUESTED_COMPANIES, (err, result) => {
//             if(err) {res.status(500).json(error(err.message, res.statusCode));}
//             else {res.status(200).json(success("OK", result.rows, res.statusCode));}
//         });
//     } catch (err) {
//         res.status(500).json(error(err, res.statusCode));
//     }
// }

exports.setNewCompanyDetails = (req, res) => {
    const {iec, companyName, personName, contact, email, location, address} = req.body;
    try {
        db.query(queries.SEND_NEW_COMPANY, [iec, companyName, personName, contact, email, location, address], (err, result) => {
            if(err) {res.status(500).json(error(err.message, res.statusCode));}
            else {res.status(200).json(success(`${result.command} Successful.`, [], res.statusCode));}
        });
    } catch (err) {
        res.status(500).json(error(err, res.statusCode));
    }
}

exports.getFavoriteCompanies = (req, res) => {
    try {
        const sqlQuery = queries.GET_FAVORITE_COMPANIES(req.body.ids);
        db.query(sqlQuery, (err, result) => {
            if(err) {res.status(500).json(error(err.message, res.statusCode));}
            else {res.status(200).json(success("OK", result.rows, res.statusCode));}
        });
    } catch (err) {
        res.status(500).json(error(err, res.statusCode));
    }
}

exports.getLinkedInCompanies = (req, res) => {
    try {
        const {companyName} = req.body;
        const sqlQuery = queries.GET_LINKEDIN_COMPANIES;
        const queryParam = [companyName];//[`%${companyName}%`];
        
        db.query(sqlQuery, queryParam, (err, result) => {
            if(err) {res.status(500).json(error(err.message, res.statusCode));}
            else {
                const resultLen = result.rows.length;
                if(resultLen > 1) {
                    const regex = new RegExp(`\\b${companyName}\\b`, "i");
                    
                    for(let i=0; i<resultLen; i++) {
                        const isOk = regex.test(result.rows[i]["company_name"]);
                        if(isOk) {
                            const resultRow = [result.rows[i]];
                            res.status(200).json(success("OK", resultRow, res.statusCode));
                            return;
                        }
                    }

                    res.status(200).json(success("OK", result.rows, res.statusCode));
                    return;
                }

                res.status(200).json(success("OK", result.rows, res.statusCode));
            }
        });
    } catch (err) {
        res.status(500).json(error(err, res.statusCode));
    }
}

exports.getLinkedInEmployees = (req, res) => {
    try {
        const {companyName} = req.body;
        const sqlQuery = queries.GET_LINKEDIN_EMPLOYEES;
        const queryParam = [`%${companyName}%`];
        
        db.query(sqlQuery, queryParam, (err, result) => {
            if(err) {res.status(500).json(error(err.message, res.statusCode));}
            else {res.status(200).json(success("OK", result.rows, res.statusCode));}
        });
    } catch (err) {
        res.status(500).json(error(err, res.statusCode));
    }
}

exports.getCommodityCountList = (req, res) => {
    try {
        const sqlQuery = queries.GET_COMMODITY_COMPANY_COUNTS;
        
        db.query(sqlQuery, (err, result) => {
            if(err) {res.status(500).json(error(err.message, res.statusCode));}
            else {res.status(200).json(success("OK", result.rows, res.statusCode));}
        });
    } catch (err) {
        res.status(500).json(error(err, res.statusCode));
    }
}

exports.addNewFeedback = (req, res) => {
    try {
        const {userId, feedback, time} = req.body;
        const sqlQuery = queries.ADD_COMMODITY_FEEDBACK;
        
        db.query(sqlQuery, [userId, feedback, time], (err, result) => {
            if(err) {res.status(500).json(error(err.message, res.statusCode));}
            else {res.status(200).json(success("Inserted Successfully", result.rows, res.statusCode));}
        });
    } catch (err) {
        res.status(500).json(error(err, res.statusCode));
    }
}

exports.getFeedbacks = (req, res) => {
    try {
        const sqlQuery = queries.GET_COMMODITY_FEEDBACK;
        
        db.query(sqlQuery, (err, result) => {
            if(err) {res.status(500).json(error(err.message, res.statusCode));}
            else {res.status(200).json(success("OK", result.rows, res.statusCode));}
        });
    } catch (err) {
        res.status(500).json(error(err, res.statusCode));
    }
}

exports.getTopFiveCompanies = (req, res) => {
    try {
        const sqlQuery = queries.GET_TOP_FIVE_COMPANIES;
        
        db.query(sqlQuery, (err, result) => {
            if(err) {res.status(500).json(error(err.message, res.statusCode));}
            else {res.status(200).json(success("OK", result.rows, res.statusCode));}
        });
    } catch (err) {
        res.status(500).json(error(err, res.statusCode));
    }
}

exports.getTopTenCompanies = (req, res) => {
    try {
        const sqlQuery = queries.GET_OTHER_TEN_COMPANIES;
        
        db.query(sqlQuery, (err, result) => {
            if(err) {res.status(500).json(error(err.message, res.statusCode));}
            else {res.status(200).json(success("OK", result.rows, res.statusCode));}
        });
    } catch (err) {
        res.status(500).json(error(err, res.statusCode));
    }
}



const { backgroundTaskEvent } = require("../controllers/backgroundTasks");
exports.getCompanyRevealed = (req, res) => {
    try {
        const { recordId, direction, country, userId, givenCompanyName } = req?.body;
        const tableName = `${direction.toLowerCase()}_${country.toLowerCase()}`;
        const sqlQuery = `select "Updated_Imp_Name" from ${tableName} where "RecordID"=$1`;

        db.query(sqlQuery, [recordId], (err, result) => {
            if(err) {res.status(500).json(error(err.message, res.statusCode));}
            else {
                res.status(200).json(success("OK", result?.rows, res?.statusCode));
                backgroundTaskEvent.emit("set-totheorder-data", db, { recordId, userId, tableName, country, direction });
                if(givenCompanyName!=="N/A" && givenCompanyName !== result?.rows[0]["Updated_Imp_Name"]) {
                    backgroundTaskEvent.emit("update-user-point", db, { userId, userPointType: "UpdateCompanyNamePoints" });                
                }
            }
        });
    } catch (err) {
        res.status(500).json(error(err, res.statusCode));
    }
}

exports.getToTheOrderPoint = async(req, res) => {
    try {
        const sqlQuery = `select "UpdateCompanyNamePoints" from "userplantransaction" where "UserId"=${req?.query?.userId}`;
        
        db.query(sqlQuery, (err, result) => {
            if(err) { res.status(500).json(error(err?.message, res?.statusCode)); }
            else { res.status(200).json(success("OK", result.rows, res.statusCode)); }
        });
    } catch (err) { return res.status(500).json(error(err, res.statusCode)); }
}

// exports.getFavoriteShipment = (req, res) => {
//     try {
//         const { userId, isToTheOrder } = req?.query;
//         const colName = isToTheOrder ? "to_the_order_ids": "shipment_ids";
//         const sqlQuery = `select "${colName}" from "User_Favorites_Map" where user_id=$1 and active=true`

//         db.query(sqlQuery, [userId], (err, result) => {
//             if(err) {res.status(500).json(error(err.message, res.statusCode));}
//             else { res.status(200).json(success("OK", result.rows, res.statusCode)); }
//         });
//     } catch (err) {
//         res.status(500).json(error(err, res.statusCode));
//     }
// }



exports.testingAPI = async(req, res) => {
    try {
        const { int_main } = require('../utils/excelGenerator');
        int_main();
        res.status(200).json(success("FILE CREATED!", [], res.statusCode));
        // const {dateFrom, dateTo, hsCode, direction} = req.body;
        // const sqlQuery = `select * from "${direction}_india" where "Date">='${dateFrom}' and "Date"<='${dateTo}' and "HsCode" like '${hsCode}%'`;
        
        // db.query(sqlQuery, async(err, result) => {
        //     if(err) {res.status(500).json(error(err.message, res.statusCode));}
        //     else {
        //         const { excelDownloadInitProcess } = require('../utils/excelGenerator');
        //         const fileBase64Str =  await excelDownloadInitProcess(result.rows, req.body);
        //         res.status(200).json(success("FILE CREATED!", [{fileBase: fileBase64Str}], res.statusCode));
        //     }
        // });
    } catch (err) {
        res.status(500).json(error(err, res.statusCode));
    }
}

// exports.testingAPI = async(req, res) => {
//     const countries = [{country: "ARGENTINA",	type: "CUSTOM"},
//     {country: "BOLIVIA",	type: "CUSTOM"},
//     {country: "BOTSWANA",	type: "CUSTOM"},
//     {country: "BURUNDI",	type: "CUSTOM"},
//     {country: "CAMEROON",	type: "CUSTOM"},
//     {country: "CHILE",	type: "CUSTOM"},
//     {country: "COLUMBIA",	type: "CUSTOM"},
//     {country: "COLUMBIA", type: "BILL OF LADINGS"},
//     {country: "COSTA RICA",	type: "CUSTOM"},
//     {country: "ECUADOR",	type: "CUSTOM"},
//     {country: "GHANA",	type: "CUSTOM"},
//     {country: "IVORY COAST", type: "CUSTOM"},
//     {country: "KAZAKHASTAN", type: "CUSTOM"},
//     {country: "KENYA",	type: "CUSTOM"},
//     {country: "LESOTHO",	type: "CUSTOM"},
//     {country: "MEXICO",	type: "CUSTOM"},
//     {country: "NAMIBIA",	type: "CUSTOM"},
//     {country: "NICARAGUA",	type: "CUSTOM"},
//     {country: "PAKISTAN",	type: "CUSTOM"},
//     {country: "PANAMA",	type: "CUSTOM"},
//     {country: "PANAMA", type: "BILL OF LADINGS"},
//     {country: "PARAGUAY",	type: "CUSTOM"},
//     {country: "PERU",	type: "CUSTOM"},
//     {country: "RUSSIA RAILWAY",	type: "TRANSHIPMENT"},
//     {country: "RWANDA",	type: "CUSTOM"},
//     {country: "SOUTH SUDAN",	type: "CUSTOM"},
//     {country: "SRI LANKA",	type: "CUSTOM"},
//     {country: "TANZANIA",	type: "TRANSHIPMENT"},
//     {country: "UGANDA",	type: "CUSTOM"},
//     {country: "UKRAINE",	type: "CUSTOM"},
//     {country: "URUGUAY",	type: "CUSTOM"},
//     {country: "UZBEKISTAN",	type: "CUSTOM"},
//     {country: "VENEZUELA",	type: "CUSTOM"},
//     {country: "BRAZIL", type: "BILL OF LADINGS"},
//     {country: "URUGUAY", type: "BILL OF LADINGS"},
//     {country: "MOLDOVA",	type: "CUSTOM"},
//     {country: "RUSSIA",	type: "CUSTOM"},
//     {country: "TURKEY",	type: "CUSTOM"},
//     {country: "USA", type: "BILL OF LADINGS"},
//     {country: "BANGLADESH",	type: "CUSTOM"},
//     {country: "PHILLIPINES",	type: "CUSTOM"},
//     {country: "VIETNAM",	type: "CUSTOM"},
//     {country: "AUSTRALIA",	type: "STATISTICAL"},
//     {country: "CANADA",	type: "STATISTICAL"},
//     {country: "EL SALVADOR",	type: "STATISTICAL"},
//     {country: "ESPANA",	type: "STATISTICAL"},
//     {country: "GUATEMALA",	type: "STATISTICAL"},
//     {country: "HONDURAS",	type: "STATISTICAL"},
//     {country: "INDONESIA",	type: "STATISTICAL"},
//     {country: "ISRAEL",	type: "STATISTICAL"},
//     {country: "JAPAN",	type: "STATISTICAL"},
//     {country: "TAIWAN",	type: "STATISTICAL"},
//     {country: "TURKEY",	type: "STATISTICAL"},
//     {country: "UNITED KINGDOM",	type: "STATISTICAL"},
//     {country: "USA",	type: "STATISTICAL"},
//     {country: "EGYPT",	type: "STATISTICAL"},
//     {country: "EUROPE UNION",	type: "STATISTICAL"},
//     {country: "NICARAGUA",	type: "STATISTICAL"},
//     {country: "PUERTO RICO",	type: "STATISTICAL"},
//     {country: "BRAZIL",	type: "STATISTICAL"},
//     {country: "DOMINICAN REPUBLIC",	type: "STATISTICAL"},
//     {country: "BOLIVIA",	type: "STATISTICAL"},
//     {country: "MEXICO",	type: "STATISTICAL"},
//     {country: "NEW ZEALAND",	type: "STATISTICAL"},
//     {country: "SAUDI ARABIA",	type: "STATISTICAL"},
//     {country: "THAILAND",	type: "STATISTICAL"}];

//     try {
//         let counter = 0;
//         const loopLen = countries.length;
//         for(let i=0; i<loopLen; i++) {
//             const countryCode = countries[i]["country"].substring(0,3);
//             const countryName = (countries[i]["country"][0] + countries[i]["country"].substring(1, countries[i]["country"].length).toLowerCase()).replaceAll(" ", "");
//             const sql = `select exists(select 1 from "Country" where "Countrycode"='${countryCode}' and data_type='${countries[i]["type"]}')`;
//             const sql2 = `insert into "Country" ("Countrycode", "CountryName", "Import", "Export", data_type) values('${countryCode}', '${countryName}', false, false, '${countries[i]["type"]}')`;

//             const {rows} = await db.query(sql);
//             const flag = rows[0]["exists"];
//             if(!flag) { 
//                 await db.query(sql2); 
//                 console.log(`${countryCode}-${countryName}------${countries[i]["type"]} ====> ${flag} ${counter}`);
//             }
//             if(i == loopLen-1) {res.status(200).json({msg: "SUCCESSFULLY INSERTED!"});}
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }


