const db = require('../utils/database_temp');
const { validationResult } = require('express-validator');
const { success, error, validation, extractCountry } = require('../../src/utils/response');
const query = require('../../src/sql/queries');
const utility = require('../utils/utility');
const common = require('../utils/common');
const {sendAlertMailToAllUsers} = require("../controllers/accountController");

// to get import data
exports.getimport = async (req, res) => {
    //db.connect();
    try {
        db.query(query.get_import_by_recordId, [2955314], (error, results) => {
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}

// to get import data
// exports.getimports = async (req, res) => {
//     try {
//         db.query(query.get_import, (error, results) => {
//             return res.status(200).json(success("Ok", results.rows, res.statusCode));
//         })
//     } catch (err) {
//         return res.status(500).json(error(err, res.statusCode));
//     };
//     //db.end;
// }

// to get import data
exports.getimports = async (req, res) => {
    //db.connect();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            err = [];
            errors.errors.forEach(element => {
                err.push({ field: element.param, message: element.msg });
            });
            return res.status(422).json(validation(err));
        }
        const { fromDate, toDate, HSCODE, HSCodeDesc, Importer_Name, EXPORTER_NAME } = req.body;
        db.query(query.get_import_search, [fromDate, toDate, `%${HSCODE}%`, `%${HSCodeDesc}%`, `%${Importer_Name}%`, `%${EXPORTER_NAME}%`], (error, results) => {
            if (!error) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(200).json(success("Ok", error.message, res.statusCode));
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}

// to get import with search data
exports.getimportwithsearch = async (req, res) => {
    //db.connect();
    try {
        const { fromDate, toDate, HSCODE, HSCodeDesc, Importer_Name, EXPORTER_NAME } = req.query;
        let params = []

        if (fromDate != '' && fromDate != undefined) {
            params.push(utility.generateParams("Date", ">=", fromDate))
        }
        if (toDate != '' && toDate != undefined) {
            params.push(utility.generateParams("Date", "<=", toDate))
        }
        if (HSCODE != '' && HSCODE != undefined) {
            params.push(utility.generateParams("HSCODE", "%_%", HSCODE))
        }
        if (HSCodeDesc != '' && HSCodeDesc != undefined) {
            params.push(utility.generateParams("HSCodeDesc", "%_%", HSCodeDesc))
        }
        if (Importer_Name != '' && Importer_Name != undefined) {
            params.push(utility.generateParams("Importer_Name", "%_%", Importer_Name))
        }
        if (EXPORTER_NAME != '' && EXPORTER_NAME != undefined) {
            params.push(utility.generateParams("EXPORTER_NAME", "%_%", EXPORTER_NAME))
        }

        const querytoexecute = utility.generateFilterQuery(params, 'import_india');

        await db.query(querytoexecute[0], querytoexecute[1], (error, results) => {
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}

// to get export data
exports.getexporttwithsearch = async (req, res) => {
    //db.connect();
    try {
        const { fromDate, toDate, HSCODE, HSCodeDesc, Importer_Name, EXPORTER_NAME } = req.query;
        let params = []

        if (fromDate != '' && fromDate != undefined) {
            params.push(utility.generateParams("Date", ">=", fromDate))
        }
        if (toDate != '' && toDate != undefined) {
            params.push(utility.generateParams("Date", "<=", toDate))
        }
        if (HSCODE != '' && HSCODE != undefined) {
            params.push(utility.generateParams("HSCODE", "%_%", HSCODE))
        }
        if (HSCodeDesc != '' && HSCodeDesc != undefined) {
            params.push(utility.generateParams("HSCodeDesc", "%_%", HSCodeDesc))
        }
        if (Importer_Name != '' && Importer_Name != undefined) {
            params.push(utility.generateParams("Imp_Name", "%_%", Importer_Name))
        }
        if (EXPORTER_NAME != '' && EXPORTER_NAME != undefined) {
            params.push(utility.generateParams("Exp_Name", "%_%", EXPORTER_NAME))
        }

        const querytoexecute = utility.generateFilterQuery(params, 'export_india');

        await db.query(querytoexecute[0], querytoexecute[1], (error, results) => {
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}

// to get HSCODE list
exports.getHscode = async (req, res) => {

    //db.connect();
    try {
        const { digit } = req.query;
        if (digit == null) {
            db.query(query.get_hscode_export, (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    return res.status(200).json(error(err.message, "No Record found", res.statusCode));
                }
            })
        } else {
            db.query(query.get_hscode_export_digit, [digit], (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    return res.status(200).json(error(err.message, "No Record found", res.statusCode));
                }
            })
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}



exports.getLocatorCompaniesList = (req, res) => {
    try {//tableName,
        const { country, direction, locatorType, word, countryType } = req.body;

        const getLocatorQuery = (colName, tableName, whereCond) => `WITH early_matches AS ( SELECT "${colName}", "RecordID" as id FROM "${tableName}" WHERE ${whereCond} LIMIT 500 ) SELECT DISTINCT on ("${colName}") "${colName}", id FROM early_matches ORDER BY "${colName}" LIMIT 10`;
        const getQueryByWord = (word, colName, tableName) => `SELECT DISTINCT ON ("${colName}") "${colName}", "RecordID" as id FROM "${tableName}" WHERE "${colName}" ILIKE '${word}%' ORDER BY "${colName}" LIMIT 10`;

        const {tableName} = utility.getCurrentTableName({countryType, direction, countryname: country.toLowerCase()});
        
        const isInitial = req.query.initial=='true';
        const colName = locatorType==="Buyer" ? "Imp_Name": "Exp_Name";
        
        const locatorCond = `LOWER("${colName}") like '${isInitial ? "a": word.toLowerCase()}%'`;
        const countryCond = !(["CUSTOM","CHINA"].includes(countryType)) ? `${direction=="import"? '"CountryofDestination"': '"CountryofOrigin"'}='${country.toUpperCase()}' `: "";
        const whereCond = !(["CUSTOM","CHINA"].includes(countryType)) ? `${countryCond}ORDER BY "${colName}", CASE WHEN ${locatorCond} THEN 0 ELSE 1 END` : locatorCond;
        
        // const sqlQuery = query.GET_LOCATOR_LIST({
        //     name: tableName,
        //     locatorColName: colName
        // }, whereCond);
        // console.log(sqlQuery);

        const sqlQuery = isInitial ? getLocatorQuery(colName, tableName, whereCond): getQueryByWord(word, colName, tableName);

        db.query(sqlQuery, (err, results) => {
            if (!err) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                // return res.status(200).json(error(err.message, "Records not found !", res.statusCode));
                console.log(err.message);
                return res.status(200).json(success("Ok", [], res.statusCode));
            }
        });
    } catch (err) { return res.status(200).json(success("Ok", [], res.statusCode)); };
}






exports.getcommonimportlist = async (req, res) => {
    try {
        const { countryname, text } = req.query;
        if (text == null) {
            const qury = 'SELECT * FROM ' + countryname.toLowerCase() + '_companies order by "Imp_Name" limit 500';
            db.query(qury, (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    return res.status(200).json(error(err.message, "Records not found !", res.statusCode));
                }
            })
        } else {
            const qury = 'SELECT * FROM ' + countryname.toLowerCase() + '_companies WHERE "Imp_Name" like $1 order by "Imp_Name" limit 500';
            db.query(qury, [text + '%'], (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    return res.status(200).json(error(err.message, "Records not found !", res.statusCode));
                }
            })
        }

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getcommonexportlist = async (req, res) => {
    try {
        const { countryname, text } = req.query;
        if (text == null) {
            const qury = 'SELECT * FROM ' + countryname.toLowerCase() + '_participate_companies order by "Exp_Name" limit 500';
            db.query(qury, (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    console.log(err)
                    return res.status(200).json(error("Ok", "Records not found !", res.statusCode));
                }
            })
        } else {
            const qury = 'SELECT * FROM ' + countryname.toLowerCase() + '_participate_companies WHERE "Exp_Name" like $1 order by "Exp_Name" limit 500';
            db.query(qury, [text + '%'], (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    console.log(err)
                    return res.status(200).json(error("Ok", "Records not found !", res.statusCode));
                }
            })
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getSideFilterAccess = async (req, res) => {
    try {
        const { Country, Direction, Type } = req.query;
        db.query(query.GET_SIDEFILTER_ACCESS, [Country, Direction.toUpperCase(), Type], (err, results) => {
            if (!err) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(500).json(error(err, res.statusCode));
            }
        })

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getAllSideFilterAccess = async (req, res) => {
    try {
        db.query(query.get_all_sidefilter_Access(req.query.type), (err, results) => {
            if (!err) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(500).json(error(err, res.statusCode));
            }
        })

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getImportExportList = async (req, res) => {
    try {
        const { Country, type, fromDate, toDate, text = null } = req.query;
        const fieldList = ["Imp_Name", "Exp_Name"];
        const result = {};
        const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [type.toLowerCase() + '_' + Country.toLowerCase(), fieldList]);
        if (availablefield.rows.length == 1) {
            if (text != null) {
                const query = 'SELECT DISTINCT "' + availablefield.rows[0].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' WHERE "Date" >= $1 AND "Date" <= $2 AND "' + availablefield.rows[0].column_name.toString() + '" LIKE $3';
                db.query(query, [fromDate, toDate, text + '%'], (error, results) => {
                    if (!error) {
                        result[availablefield.rows[0].column_name] = results.rows;
                        return res.status(200).json(success("Ok", result, res.statusCode));
                    } else {
                        return res.status(200).json(success("Ok", error.message, res.statusCode));
                    }
                })

            } else {
                const query = 'SELECT DISTINCT "' + availablefield.rows[0].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' WHERE "Date" >= $1 AND "Date" <= $2 limit 500';
                db.query(query, [fromDate, toDate], (error, results) => {
                    if (!error) {
                        result[availablefield.rows[0].column_name] = results.rows;
                        return res.status(200).json(success("Ok", result, res.statusCode));
                    } else {
                        return res.status(200).json(success("Ok", error.message, res.statusCode));
                    }
                })
            }
        } else if (availablefield.rows.length == 2) {
            if (text != null) {
                const query = 'SELECT DISTINCT "' + availablefield.rows[0].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' WHERE "Date" >= $1 AND "Date" <= $2 AND "' + availablefield.rows[0].column_name.toString() + '" LIKE $3';
                db.query(query, [fromDate, toDate, text + '%'], (error, results) => {
                    if (!error) {
                        result[availablefield.rows[0].column_name] = results.rows;
                        const query1 = 'SELECT DISTINCT "' + availablefield.rows[1].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' WHERE "Date" >= $1 AND "Date" <= $2 AND "' + availablefield.rows[1].column_name.toString() + '" LIKE $3';
                        db.query(query1, [fromDate, toDate, text + '%'], (error, results) => {
                            if (!error) {
                                result[availablefield.rows[1].column_name] = results.rows;
                                return res.status(200).json(success("Ok", result, res.statusCode));
                            } else {
                                return res.status(200).json(success("Ok", error.message, res.statusCode));
                            }
                        })
                    } else {
                        return res.status(200).json(success("Ok", error.message, res.statusCode));
                    }
                })
            } else {
                const query = 'SELECT DISTINCT "' + availablefield.rows[0].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' WHERE "Date" >= $1 AND "Date" <= $2 limit 500';
                db.query(query, [fromDate, toDate], (error, results) => {
                    if (!error) {
                        result[availablefield.rows[0].column_name] = results.rows;
                        const query1 = 'SELECT DISTINCT "' + availablefield.rows[1].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' WHERE "Date" >= $1 AND "Date" <= $2 limit 500';
                        db.query(query1, [fromDate, toDate], (error, results) => {
                            if (!error) {
                                result[availablefield.rows[1].column_name] = results.rows;
                                return res.status(200).json(success("Ok", result, res.statusCode));
                            } else {
                                return res.status(200).json(success("Ok", error.message, res.statusCode));
                            }
                        })
                    } else {
                        return res.status(200).json(success("Ok", error.message, res.statusCode));
                    }
                })
            }
        }

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getImportList = async (req, res) => {
    try {
        const { Country, type, fromDate, toDate, text = null } = req.query;
        const fieldList = ["Imp_Name"];
        const result = {};
        const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [type.toLowerCase() + '_' + Country.toLowerCase(), fieldList]);
        if (availablefield.rows.length == 1) {
            if (text != null) {
                const query = 'SELECT DISTINCT "' + availablefield.rows[0].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' WHERE "' + availablefield.rows[0].column_name.toString() + '" LIKE $3';
                db.query(query, [text + '%'], (error, results) => {
                    if (!error) {
                        result[availablefield.rows[0].column_name] = results.rows;
                        return res.status(200).json(success("Ok", result, res.statusCode));
                    } else {
                        return res.status(200).json(success("Ok", error.message, res.statusCode));
                    }
                })

            } else {
                const query = 'SELECT DISTINCT "' + availablefield.rows[0].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' limit 1000';
                db.query(query, (error, results) => {
                    if (!error) {
                        result[availablefield.rows[0].column_name] = results.rows;
                        return res.status(200).json(success("Ok", result, res.statusCode));
                    } else {
                        return res.status(200).json(success("Ok", error.message, res.statusCode));
                    }
                })
            }
        } else {
            return res.status(200).json(success("Ok", "Import Name field not found for this country", res.statusCode));
        }

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getExportList = async (req, res) => {
    try {
        const { Country, type, fromDate, toDate, text = null } = req.query;
        const fieldList = ["Exp_Name"];
        const result = {};
        const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [type.toLowerCase() + '_' + Country.toLowerCase(), fieldList]);
        if (availablefield.rows.length == 1) {
            if (text != null) {
                const query = 'SELECT DISTINCT "' + availablefield.rows[0].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' WHERE "' + availablefield.rows[0].column_name.toString() + '" LIKE $3';
                db.query(query, [text + '%'], (error, results) => {
                    if (!error) {
                        result[availablefield.rows[0].column_name] = results.rows;
                        return res.status(200).json(success("Ok", result, res.statusCode));
                    } else {
                        return res.status(200).json(success("Ok", error.message, res.statusCode));
                    }
                })

            } else {
                const query = 'SELECT DISTINCT "' + availablefield.rows[0].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' limit 1000';
                db.query(query, (error, results) => {
                    if (!error) {
                        result[availablefield.rows[0].column_name] = results.rows;
                        return res.status(200).json(success("Ok", result, res.statusCode));
                    } else {
                        return res.status(200).json(success("Ok", error.message, res.statusCode));
                    }
                })
            }
        } else {
            return res.status(200).json(success("Ok", "Export Name field not found for this country", res.statusCode));
        }

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}


// exports.getimporterexportindia = async (req, res) => {
//     try {
//         const { text = null } = req.query;
//         if (text == null) {
//             db.query(query.getimporter_export_india, (err, results) => {
//                 if (!err) {
//                     return res.status(200).json(success("Ok", results.rows, res.statusCode));
//                 } else {
//                     return res.status(500).json(error(err, res.statusCode));
//                 }
//             })
//         } else {
//             db.query(query.getimporter_export_india_search, [text + '%'], (err, results) => {
//                 if (!err) {
//                     return res.status(200).json(success("Ok", results.rows, res.statusCode));
//                 } else {
//                     return res.status(500).json(error(err, res.statusCode));
//                 }
//             })
//         }

//     } catch (err) {
//         return res.status(500).json(error(err, res.statusCode));
//     };
// }
// exports.getimporterimportindia = async (req, res) => {
//     try {
//         const { text = null } = req.query;
//         if (text == null) {
//             db.query(query.getimporter_import_india, (err, results) => {
//                 if (!err) {
//                     return res.status(200).json(success("Ok", results.rows, res.statusCode));
//                 } else {
//                     return res.status(500).json(error(err, res.statusCode));
//                 }
//             })
//         } else {
//             db.query(query.getimporter_import_india_search, [text + '%'], (err, results) => {
//                 if (!err) {
//                     return res.status(200).json(success("Ok", results.rows, res.statusCode));
//                 } else {
//                     return res.status(500).json(error(err, res.statusCode));
//                 }
//             })
//         }

//     } catch (err) {
//         return res.status(500).json(error(err, res.statusCode));
//     };

// }
// exports.getexporterexportindia = async (req, res) => {
//     try {
//         const { text = null } = req.query;
//         if (text == null) {
//             db.query(query.getexporter_export_india, (err, results) => {
//                 if (!err) {
//                     return res.status(200).json(success("Ok", results.rows, res.statusCode));
//                 } else {
//                     return res.status(500).json(error(err, res.statusCode));
//                 }
//             })
//         } else {
//             db.query(query.getexporter_export_india_search, [text + '%'], (err, results) => {
//                 if (!err) {
//                     return res.status(200).json(success("Ok", results.rows, res.statusCode));
//                 } else {
//                     return res.status(500).json(error(err, res.statusCode));
//                 }
//             })
//         }
//     } catch (err) {
//         return res.status(500).json(error(err, res.statusCode));
//     };
// }
// exports.getexporterimportindia = async (req, res) => {
//     try {
//         const { text = null } = req.query;
//         if (text == null) {
//             db.query(query.getexporter_import_india, (err, results) => {
//                 if (!err) {
//                     return res.status(200).json(success("Ok", results.rows, res.statusCode));
//                 } else {
//                     return res.status(500).json(error(err, res.statusCode));
//                 }
//             })
//         } else {
//             db.query(query.getexporter_import_india_search, [text + '%'], (err, results) => {
//                 if (!err) {
//                     return res.status(200).json(success("Ok", results.rows, res.statusCode));
//                 } else {
//                     return res.status(500).json(error(err, res.statusCode));
//                 }
//             })
//         }
//     } catch (err) {
//         return res.status(500).json(error(err, res.statusCode));
//     };
// }

exports.addupdateAccessSideFilter = async (req, res) => {
    try {
        const { HsCode, ProductDesc, Exp_Name, Imp_Name, CountryofDestination, CountryofOrigin, PortofOrigin,
            Mode, uqc, Quantity, Month, Year, Country, PortofDestination, LoadingPort, Currency,
            NotifyPartyName, Direction, Id, CountryType } = req.body;

        const access = await db.query(query.GET_SIDEFILTER_ACCESS, [Country, Direction.toUpperCase(), CountryType]);
        if (access.rows.length > 0) {
            const params = [Id, HsCode, ProductDesc, Exp_Name, Imp_Name, CountryofDestination, CountryofOrigin, PortofOrigin, Mode, uqc, Quantity, Month, Year, PortofDestination, LoadingPort, Currency, NotifyPartyName, CountryType];
            db.query(query.update_sidefilter_Access, params, (err, result) => {
                return res.status(201).json(success("Ok", `${result.command} Successful.`, res.statusCode));
            });
        } 
        // else {
        //     const params = [HsCode, ProductDesc, Exp_Name, Imp_Name, CountryofDestination, CountryofOrigin, PortofOrigin, Mode, uqc, Quantity, Month, Year, Country, Direction.toUpperCase(), PortofDestination, LoadingPort, Currency, NotifyPartyName];
        //     db.query(query.insert_sidefilter_Access, params, (err, result) => {
        //         return res.status(201).json(success("Ok", `${result.command} Successful.`, res.statusCode));
        //     });
        // }

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getWorkspace = async (req, res) => {
    try {
        const { UserId } = req.query;
        db.query(query.get_workspace, [UserId], (error, results) => {
            if (!error) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(500).json(success("Error", error.message, res.statusCode));
            }
        })

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.addWorkspace = async (req, res) => {
    try {
        const { UserId, Searchbar, Sidefilter, foldername, customanalysis="" } = req.body;
        db.query(query.add_workspace, [UserId, Searchbar, Sidefilter, foldername, customanalysis], (err, result) => {
            if (!err) {
                return res.status(201).json(success("Ok", {Id: result.rows[0].Id}, res.statusCode));
            } else {
                return res.status(500).json(error(err.message, res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.updateWorkspace = async (req, res) => {
    try {
        const { Id, customanalysis } = req.body;
        db.query(query.update_workspace, [customanalysis,Id], (err, result) => {
            if (!err) {
                return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.deleteWorkspace = async (req, res) => {
    try {
        const { id } = req.query;
        db.query(query.delete_Workspace, [id], (err, result) => {
            if (!err) {
                return res.status(201).json(success("Ok", "workspace deleted Successfully.", res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getDownloadCost = async (req, res) => {
    try {
        const { countryCode, countryType } = req.query;
        db.query(query.get_download_cost, [countryCode, countryType], (err, result) => {
            if (!err) {
                return res.status(200).json(success("Ok", result.rows, res.statusCode));
            } else {
                return res.status(200).json(success("Ok", err.message, res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getTotalRecord = async (req, res) => {
    try {
        const { countryname, direction } = req.query;
        db.query('select COUNT(*) from ' + direction + '_' + countryname, (err, result) => {
            return res.status(200).json(success("Ok", result.rows, res.statusCode));
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getListofSidefilterdata = async (req, res) => {
    try {
        const { fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
            CountryofDestination, Month, Year, Currency, uqc, Quantity, PortofOrigin,
            PortofDestination, Mode, LoadingPort, NotifyPartyName, CountryCode, CountryName, Direction } = req.body;
        const access = await db.query(query.GET_SIDEFILTER_ACCESS, [CountryCode, Direction.toUpperCase()]);
        var selectQuery = 'Distinct ';
        var output = {};
        if (access.rows.length > 0) {
            const keys = Object.keys(access.rows[0]);
            const obj = access.rows[0];
            for (let i = 0; i < keys.length; i++) {
                if (obj[keys[i]] === true) {
                    selectQuery += '"' + keys[i] + '", '
                }
            }

            const query = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                PortofDestination,
                Mode, LoadingPort,
                NotifyPartyName, Currency, 0, 0, selectQuery.replace(/,\s*$/, "") + ' FROM ', Direction.toLowerCase() + '_' + CountryName.toLowerCase(), false);

            db.query(query[0], query[1].slice(1), (err, results) => {
                if (!err) {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] == true) {
                            output[keys[i]] = [...new Set(extractValue(results.rows, keys[i]))];
                        }
                    }
                    // output.HSCODE = extractValue(results.rows,'HsCode');
                    // console.log(output);
                    return res.status(200).json(success("Ok", output, res.statusCode));
                } else {
                    return res.status(500).json(error(err.message, res.statusCode));
                }
            })
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}


exports.getfirstListofSidefilterdata = async (req, res) => {
    try {
        let valuefield = "", selectQuery = "";
        const { CountryCode, CountryName, Direction } = req.body;
        const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
        const isIndiaCountry = ["IND", "WEE"].includes(CountryCode);
        const availablefield = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY('{ValueInUSD}')", [tableName]);
        
        if (availablefield.rows.length > 0 && isIndiaCountry) { valuefield = 'ROUND(SUM("ValueInUSD")::numeric, 2) AS ValueInUSD,'; }

        const access = await db.query(query.get_first_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
        const output = {};
        
        const count = isIndiaCountry ? 'COUNT("HsCode") as count': '';

        if (access.rows.length > 0) {
            const keys = Object.keys(access.rows[0]);
            const obj = access.rows[0];
            Object.values(access.rows[0]).every(item => item === false)
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
                        selectQuery += `"${keys[i]}", `;
                    }
                }
                const finalQuery = `${selectQuery.replace(/,\s*$/, "")}${valuefield!='' || count!='' ? `,${valuefield + count}`: ''}`;
                
                const partialQuery = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: tableName,
                    isOrderBy: false,
                    query: `${finalQuery} FROM `
                });
                
                const querySql = `${partialQuery[0]} GROUP BY ${selectQuery.replace("Distinct ", "").replace(/,\s*$/, "")}`;
                console.log("first filter",querySql);
                db.query(querySql, partialQuery[1].slice(1), (err, results) => {
                    if (!err) {
                        // for (let i = 0; i < keys.length; i++) {
                        //     if (obj[keys[i]] == true) {
                        //         output[keys[i]] = [...new Set(extractValue(results.rows, keys[i]))];
                        //     }
                        // }
                        // output.HsCode = extractValue(results.rows,'HsCode');
                        // console.log(output);
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
exports.getsecondListofSidefilterdata = async (req, res) => {
    try {
        const { CountryCode, CountryName, Direction } = req.body;
        const fieldList = ["ValueInUSD"], output = {};
        let valuefield = '', selectQuery = 'Distinct ', count = '', group = '';
        const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [Direction.toLowerCase() + '_' + CountryName.toLowerCase(), fieldList]);
        const access = await db.query(query.get_second_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
        const isIndiaCountry = ["IND", "WEE"].includes(CountryCode);

        if (availablefield.rows.length > 0 && isIndiaCountry) {
            valuefield = ' ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD ,';
        }
        
        if (Direction.toLowerCase() == 'import') {
            group = '"CountryofOrigin"';
            count = isIndiaCountry ? 'COUNT("CountryofOrigin") as count': '';
        } else if (Direction.toLowerCase() == 'export') {
            group = '"CountryofDestination"';
            count = isIndiaCountry ? 'COUNT("CountryofDestination") as count': '';
        }
        if (access.rows.length > 0) {
            const keys = Object.keys(access.rows[0]);
            const obj = access.rows[0];
            //Object.values(access.rows[0]).every(item => item === false)
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
                const tableName = Direction.toLowerCase() + '_' + CountryName.toLowerCase();
                const partialQuery = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: tableName,
                    isOrderBy: false,
                    query: `${finalQuery} FROM `
                })
                // const query1 = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                //     CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                //     PortofDestination,
                //     Mode, LoadingPort,
                //     NotifyPartyName, Currency, 0, 0, finalQuery + ' FROM ', Direction.toLowerCase() + '_' + CountryName.toLowerCase(), false);
                const query = `${partialQuery[0]} group by ${selectQuery.replace('Distinct ', "").replace(/,\s*$/, "")}`;//partialQuery[0] + ' Group By ' + selectQuery.replace('Distinct ', "").replace(/,\s*$/, "") + ',' + group //,${group}
                
                db.query(query, partialQuery[1].slice(1), (err, results) => {
                    if (!err) {
                        return res.status(200).json(success("Ok", results.rows, res.statusCode));
                    } else {
                        return res.status(500).json(error(err.message, res.statusCode));
                    }
                })
            }
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getthirdListofSidefilterdata = async (req, res) => {
    try {
        const { CountryCode, CountryName, Direction } = req.body;
        const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`; 
        const access = await db.query(query.get_third_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
        let selectQuery = 'Distinct ';
        const output = {};
        if (access.rows.length > 0) {
            const keys = Object.keys(access.rows[0]);
            const obj = access.rows[0];
            if (Object.values(access.rows[0])
                .every(item => item === false)) {
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

                // const finalQuery = `${selectQuery.replace(/,\s*$/, "")}, ${valuefield + count}`;
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: tableName,
                    isOrderBy: false,
                    query: selectQuery.replace(/,\s*$/, "") + ' FROM '
                });
                // const query = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                //     CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                //     PortofDestination,
                //     Mode, LoadingPort,
                //     NotifyPartyName, Currency, 0, 0, selectQuery.replace(/,\s*$/, "") + ' FROM ', Direction.toLowerCase() + '_' + CountryName.toLowerCase(), false);

                db.query(query[0], query[1].slice(1), (err, results) => {
                    if (!err) {
                        for (let i = 0; i < keys.length; i++) {
                            if (obj[keys[i]] == true) {
                                output[keys[i]] = [...new Set(extractValue(results.rows, keys[i]))];
                            }
                        }
                        // output.HSCODE = extractValue(results.rows,'HsCode');
                        // console.log(output);
                        return res.status(200).json(success("Ok", output, res.statusCode));
                    } else {
                        return res.status(500).json(error(err.message, res.statusCode));
                    }
                })
            }
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getfourthListofSidefilterdata = async (req, res) => {
    try {
        const { CountryCode, CountryName, Direction } = req.body;
        const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
        const access = await db.query(query.get_fourth_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
        let selectQuery = 'Distinct ';
        const output = {};
        if (access.rows.length > 0) {
            const keys = Object.keys(access.rows[0]);
            const obj = access.rows[0];
            if (Object.values(access.rows[0])
                .every(item => item === false)) {
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

                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: tableName,
                    isOrderBy: false,
                    query: selectQuery.replace(/,\s*$/, "") + ' FROM '
                });
                // const query = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                //     CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                //     PortofDestination,
                //     Mode, LoadingPort,
                //     NotifyPartyName, Currency, 0, 0, selectQuery.replace(/,\s*$/, "") + ' FROM ', Direction.toLowerCase() + '_' + CountryName.toLowerCase(), false);

                db.query(query[0], query[1].slice(1), (err, results) => {
                    if (!err) {
                        for (let i = 0; i < keys.length; i++) {
                            if (obj[keys[i]] == true) {
                                output[keys[i]] = [...new Set(extractValue(results.rows, keys[i]))];
                            }
                        }
                        // output.HSCODE = extractValue(results.rows,'HsCode');
                        // console.log(output);
                        return res.status(200).json(success("Ok", output, res.statusCode));
                    } else {
                        return res.status(500).json(error(err.message, res.statusCode));
                    }
                })
            }
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getfifthListofSidefilterdata = async (req, res) => {
    try {
        const { CountryCode, CountryName, Direction } = req.body;
        const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
        const access = await db.query(query.get_fifth_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
        let selectQuery = 'Distinct ';
        const output = {};
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

                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: tableName,
                    isOrderBy: false,
                    query: selectQuery.replace(/,\s*$/, "") + ' FROM '
                });
                // const query = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                //     CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                //     PortofDestination,
                //     Mode, LoadingPort,
                //     NotifyPartyName, Currency, 0, 0, selectQuery.replace(/,\s*$/, "") + ' FROM ', Direction.toLowerCase() + '_' + CountryName.toLowerCase(), false);
                console.log("fifth filter", query[0]);
                db.query(query[0], query[1].slice(1), (err, results) => {
                    if (!err) {
                        for (let i = 0; i < keys.length; i++) {
                            if (obj[keys[i]] == true) {
                                output[keys[i]] = [...new Set(extractValue(results.rows, keys[i]))];
                            }
                        }
                        // output.HSCODE = extractValue(results.rows,'HsCode');
                        // console.log(output);
                        return res.status(200).json(success("Ok", output, res.statusCode));
                    } else {
                        return res.status(500).json(error(err.message, res.statusCode));
                    }
                })
            }
        }
    } catch (err) {
        
        console.log(err)
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getImportListofSidefilterdata = async (req, res) => {
    try {
        const { CountryCode, CountryName, Direction } = req.body;
        const fieldList = ["ValueInUSD"], output = {};
        let valuefield = '',selectQuery = 'Distinct ', group = '', count = '';
        const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
        const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [Direction.toLowerCase() + '_' + CountryName.toLowerCase(), fieldList]);
        const isIndiaCountry = ["IND", "WEE"].includes(CountryCode);

        if (availablefield.rows.length > 0 && isIndiaCountry) {
            valuefield = ' ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD ,';
        }
        const access = await db.query(query.get_Import_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
        
        group = '"Imp_Name"';
        count = isIndiaCountry ? 'COUNT("Imp_Name") as count': '';

        if (access.rows.length > 0) {
            const keys = Object.keys(access.rows[0]);
            const obj = access.rows[0];
            // Object.values(access.rows[0]).every(item => item === false)
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
                
                const finalQuery = `${selectQuery.replace(/,\s*$/, "")}${valuefield!='' || count!='' ? `,${valuefield + count}`: ''}`;
                const partialQuery = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: tableName,
                    isOrderBy: false,
                    query: `${finalQuery} FROM `
                });
                const querySql = `${partialQuery[0]} GROUP BY ${selectQuery.replace("Distinct ", "").replace(/,\s*$/, "")}, ${group}`;

                // const query = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                //     CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                //     PortofDestination,
                //     Mode, LoadingPort,
                //     NotifyPartyName, Currency, 0, 0, finalQuery + ' FROM ', Direction.toLowerCase() + '_' + CountryName.toLowerCase(), false);
                console.log("import filter", querySql);
                
                db.query(querySql, partialQuery[1].slice(1), (err, results) => {
                    if (!err) {
                        // for (let i = 0; i < keys.length; i++) {
                        //     if (obj[keys[i]] == true) {
                        //         output[keys[i]] = [...new Set(extractValue(results.rows, keys[i]))];
                        //     }
                        // }
                        // output.HSCODE = extractValue(results.rows,'HsCode');
                        // console.log(output);
                        return res.status(200).json(success("Ok", results.rows, res.statusCode));
                    } else {
                        return res.status(500).json(error(err.message, res.statusCode));
                    }
                })
            }
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getExportListofSidefilterdata = async (req, res) => {
    try {
        const { CountryCode, CountryName, Direction } = req.body;
        const tableName = `${Direction.toLowerCase()}_${CountryName.toLowerCase()}`;
        const fieldList = ["ValueInUSD"],  output = {};
        let valuefield = '', selectQuery = 'Distinct ', count = '', group = '';
        const isIndiaCountry = ["IND", "WEE"].includes(CountryCode);
        const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [Direction.toLowerCase() + '_' + CountryName.toLowerCase(), fieldList]);
        
        if (availablefield.rows.length > 0 && isIndiaCountry) {
            valuefield = ' ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD ,';
        }
        const access = await db.query(query.get_Export_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);        
        group = '"Exp_Name"';
        count = isIndiaCountry ? 'COUNT("Exp_Name") as count': "";

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
                const finalQuery = `${selectQuery.replace(/,\s*$/, "")}${valuefield!='' || count!='' ? `,${valuefield + count}`: ''}`;
                const partialQuery = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: tableName,
                    isOrderBy: false,
                    query: `${finalQuery} FROM `
                });
                const querySql = `${partialQuery[0]} GROUP BY ${selectQuery.replace("Distinct ", "").replace(/,\s*$/, "")}`;//, ${group}
                // const query = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                //     CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                //     PortofDestination,
                //     Mode, LoadingPort,
                //     NotifyPartyName, Currency, 0, 0, finalQuery + ' FROM ', Direction.toLowerCase() + '_' + CountryName.toLowerCase(), false);
                console.log("export filter", querySql);
                db.query(querySql, partialQuery[1].slice(1), (err, results) => {
                    if (!err) {
                        // for (let i = 0; i < keys.length; i++) {
                        //     if (obj[keys[i]] == true) {
                        //         output[keys[i]] = [...new Set(extractValue(results.rows, keys[i]))];
                        //     }
                        // }
                        // output.HSCODE = extractValue(results.rows,'HsCode');
                        // console.log(output);
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
exports.addnotification = async (req, res) => {
    try {
        const { message } = req.body;
        const date = new Date(); //utility.formatDate(new Date());
        db.query(query.add_notification, [message, date], (err, result) => {
            if (!err) {
                return res.status(200).json(success("Ok", "Insert Successfully !", res.statusCode));
            } else {
                return res.status(200).json(error(err.message, res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getnotification = async (req, res) => {
    const { Id } = req.query;
    
    try {
        const finalQuery = [null, undefined].includes(Id) ? query.get_notification_all : query.get_notification(Id);
        
        db.query(finalQuery, (err, result) => {
            if (err) { res.status(200).json(error(err.message, res.statusCode)); }
            else { res.status(200).json(success("Ok", result.rows, res.statusCode)); }
        });
    } catch (err) { res.status(500).json(error(err, res.statusCode)); };
}

exports.getcounts = async (req, res) => {
    try {
        const {direction, countryType} = req.body;
        let {countryname} = req.body;
        const result = { counters: {} };
        const {tableName, statCountryName} = utility.getCurrentTableName({countryType, direction, countryname}); // countryType=="CUSTOM" ? `${direction.toLowerCase()}_${countryname.toLowerCase()}`: countryname=="china" ? `${direction}_china`: `${direction}_mirror`;
        
        if(countryType==="MIRROR" && countryname!=="china") {
            const extractedCountryName = extractCountry(countryname);
            const countryKey = direction=="import" ? "CountryofDestination": "CountryofOrigin";
            if(req.body.hasOwnProperty(countryKey)) { req.body[countryKey].push(extractedCountryName); } 
            else { req.body[countryKey] = [extractedCountryName]; }
        } else if(countryType==="STATISTICAL" && statCountryName!=="") {
            countryname = statCountryName;
        }

        const counterquery = await common.getDatabaseQuery({
            body: req.body,
            tablename: tableName,
            isOrderBy: false,
            searchType: "count",
            query: await common.getavailableFieldlist(tableName, countryType)
        });

        console.log(counterquery[0]);
        
        db.query(counterquery[0], counterquery[1].slice(1), (err, results) => {
            if (!err) {
                result.counters = results.rows[0];
                return res.status(200).json(success("Ok", result, res.statusCode));
            } else {
                console.log(err, counterquery[0])
                return res.status(500).json(error(err, res.statusCode));
            }
        });
    } catch (ex) {
        return res.status(500).json(error("Internal server error", res.statusCode));
    }
}


exports.getAlertMessage = async (req, res) => {
    try {
        const { Id } = req.query;
        db.query(query.get_alert_message, [Id], (err, result) => {
            if (!err) {
                return res.status(200).json(success("Ok", result.rows, res.statusCode));
            } else {
                return res.status(200).json(error(err.message, res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getallcountries = async (req, res) => {
    try {
        db.query(query.get_all_countries, (err, result) => {
            if (!err) {
                return res.status(200).json(success("Ok", result.rows, res.statusCode));
            } else {
                return res.status(200).json(error(err.message, res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.updateAlertMessage = async (req, res) => {
    try {
        const { id, startDate, endDate, message, showPopup, showBanner } = req.body;
        const queryParams = [message, startDate, endDate, showPopup, showBanner, id];
        const {marquee} = JSON.parse(message);
        
        db.query(query.update_alert_message, queryParams, async(err, result) => {
            if (!err) {
                // if(showBanner) {
                //     const mailsRes = await db.query(query.GET_ACTIVE_MAILS);
                //     await sendAlertMailToAllUsers(marquee, mailsRes.rows);
                // }
                
                return res.status(200).json(success("update successful", res.statusCode));
            } else {
                return res.status(200).json(error(err.message, res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.stopAlertMsg = (req, res) => {
    try {
        db.query(query.OFF_ALERT_MSG, (err, result) => {
            if (!err) {
                return res.status(200).json(success("Alerts are stopped", [], res.statusCode));
            } else {
                return res.status(200).json(error(err.message, res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.updateUserPreference = async (req, res) => {
    try {
        const { Email, userPreference } = req.body;
        db.query(query.update_userPreferences, [Email, userPreference], (err, result) => {
            if (!err) {
                return res.status(200).json(success("Ok", result.rows, res.statusCode));
            } else {
                return res.status(200).json(error(err.message, res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getLatestUserPref = (req, res) => {
    try {
        db.query(query.fetch_userPreferences, [req.query.email], (err, result) => {
            if(err) {return res.status(200).json(error(err.message, res.statusCode));}
            else {
                console.log(JSON.parse(result.rows[0]["userPreference"]))
                return res.status(200).json(success("Ok", result.rows[0], res.statusCode));}
        });        
    } catch (error) {
        return res.status(500).json(error(error, res.statusCode));
    } 
}

exports.getProductDesc = async (req, res) => {
    try {
        const { product } = req.query;
        db.query('SELECT * FROM public."Products" WHERE "Product" LIKE $1', [product + '%'], (err, result) => {
            if (!err) {
                return res.status(200).json(success("Ok", result.rows, res.statusCode));
            } else {
                return res.status(500).json(error(err, res.statusCode));
            }
        });
    } catch (er) {
        return res.status(500).json(error(er, res.statusCode));
    };
}

// exports.getexportlistbyAlphabet = async (req, res) => {
//     try {
//         const { alphabet, countryname, direction, columnname } = req.body;
//         const fieldList = ["Imp_Name", "Exp_Name"];
//         const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [direction.toLowerCase() + '_' + countryname.toLowerCase(), fieldList]);
//         if (availablefield.rows.length > 0) {
//             if (columnname == 'Imp_Name') {
//                 if (direction.toLowerCase() == 'import') {
//                     db.query(query.getimporter_import_india_search, [alphabet + '%'], (err, result) => {
//                         return res.status(200).json(success("Ok", result.rows, res.statusCode));
//                     });
//                 } else {
//                     db.query(query.getimporter_export_india_search, [alphabet + '%'], (err, result) => {
//                         return res.status(200).json(success("Ok", result.rows, res.statusCode));
//                     });
//                 }

//             } else if (columnname == 'Exp_Name') {
//                 if (direction.toLowerCase() == 'import') {
//                     db.query(query.getexporter_import_india_search, [alphabet + '%'], (err, result) => {
//                         return res.status(200).json(success("Ok", result.rows, res.statusCode));
//                     });
//                 } else {
//                     db.query(query.getexporter_export_india_search, [alphabet + '%'], (err, result) => {
//                         return res.status(200).json(success("Ok", result.rows, res.statusCode));
//                     });
//                 }
//             } else {
//                 return res.status(200).json(success("Ok", "Field not available", res.statusCode));
//             }
//         } else {
//             return res.status(200).json(success("Ok", "This Field not available", res.statusCode));
//         }
//     } catch (err) {
//         return res.status(500).json(error(err, res.statusCode));
//     };
// }

exports.adduserlog = async (req, res) => {
    try {
        const { UserId, IP, Location, Searchcount, Searchhistory } = req.body;
        const datetime = utility.formatDate(new Date());
        const log = await db.query(query.get_userlog, [UserId, datetime]);
        if (log.rows.length > 0) {
            db.query(query.update_userlog, [Searchcount, UserId, datetime], (err, result) => {
                if (!err) {
                    return res.status(200).json(success("Ok", result.rows, res.statusCode));
                } else {
                    return res.status(200).json(error(err.message, res.statusCode));
                }
            });
        } else {
            db.query(query.insert_userlog, [UserId, IP, Location, Searchcount, Searchhistory, datetime], (err, result) => {
                if (!err) {
                    return res.status(200).json(success("Ok", result.rows, res.statusCode));
                } else {
                    return res.status(200).json(error(err.message, res.statusCode));
                }
            });
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getUserlogs = async (req, res) => {
    try {
        const offset = (req?.query?.page-1) * 100;

        db.query(query.get_all_userlog, [offset], (err, result) => {
            if (!err) {
                return res.status(200).json(success("Ok", result.rows, res.statusCode));
            } else {
                return res.status(200).json(error(err.message, res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.adduseractionlog = async (req, res) => {
    try {
        const { UserId, LogType, Log } = req.body;
        const date = utility.formatDate(new Date());
        db.query(query.add_user_action_log, [UserId, LogType, Log, date], (err, result) => {
            if (!err) {
                return res.status(200).json(success("Ok", "Insert Successfully !", res.statusCode));
            } else {
                return res.status(200).json(error(err.message, res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getUserActionlogs = async (req, res) => {
    try {
        const { LogType, page } = req.query;
        const offset = (page-1) * 100;

        db.query(query.get_user_action_log, [`${LogType}%`, offset], (err, result) => {
            if (!err) {
                return res.status(200).json(success("Ok", result.rows, res.statusCode));
            } else {
                return res.status(200).json(error(err.message, res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.adduserActivitylog = async (req, res) => {
    try {
        const { UserId, IP, Email, date } = req.body;
        // const date = new Date();
        db.query(query.add_user_Activity_log, [UserId, date, IP, Email], (err, result) => {
            if (!err) {
                return res.status(200).json(success("Ok", "Insert Successfully !", res.statusCode));
            } else {
                return res.status(200).json(error(err.message, res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getUserActivitylogs = async (req, res) => {
    try {
        const { UserId, page } = req.query;
        const offset = (page-1) * 100;

        if (UserId) {
            db.query(query.get_user_Activitylist, [UserId, offset], (err, result) => {
                if (!err) {
                    return res.status(200).json(success("Ok", result.rows, res.statusCode));
                } else {
                    return res.status(200).json(error(err.message, res.statusCode));
                }
            });
        } else {
            db.query(query.get_user_ActivityAlllist, [offset], (err, result) => {
                if (!err) {
                    return res.status(200).json(success("Ok", result.rows, res.statusCode));
                } else {
                    return res.status(200).json(error(err.message, res.statusCode));
                }
            });
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
function extractValue(arr, prop) {
    // extract value from property
    let extractedValue = arr.map(item => item[prop]);
    return extractedValue;
}


