const db = require('../utils/database_temp');
const { success, error, countryMappingViaType } = require('../../src/utils/response');
const query = require('../../src/sql/queries');


exports.getCountries = async (req, res) => {
    //db.connect();
    try {
        db.query(query.getCountry, (err, results) => {
            if (!err) {
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

exports.getCountrieswithoutdate = async (req, res) => {
    try {
        db.query(query.getCountryWithoutDate, [req.query.type], (err, results) => {
            if (!err) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(200).json(error("Ok", error.message, res.statusCode));
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getAllCountrycodes = (req, res) => {
    try {
        db.query(query.GET_COUNTRY_CODES_LIST, (err, results) => {
            if(!err) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else { return res.status(500).json(error(err.message, res.statusCode)); }
        });
    } catch (error) {
        return res.status(500).json(error(error, res.statusCode));
    }
}

exports.addCountry = async (req, res) => {
    const { countryName, countryType, imp, exp } = req.body;
    const [country_name, country_code] = countryName.split("~");
    // const countryCode3 = countryName.substring(0, 3).toLocaleUpperCase();
    // const countryCode4 = countryName.substring(0, 4).toLocaleUpperCase();
    
    try {
        const country = await db.query(query.GET_COUNTRY_BY_CODE_NAME, [countryType, country_code]); //checking whether countryCode is exist or not
        // if(country.rows.length>0) {
        //     const filteredRes = country.rows.filter(item => (item?.Countrycode==cod || item?.Countrycode==countryCode4));
        //     countryCode = filteredRes.length>0 ? (filteredRes[0]["Countrycode"].length==3? countryCode4: countryCode3) : countryCode3;
        // } else { countryCode = countryCode3; }
        if(country.rows.length > 0) {
            return res.status(200).json(error("Country Already Exists!", [], res.statusCode));
        } else {
            db.query(query.addCountry, [country_code, country_name, imp, exp, countryType], (error, results) => { //adding country here when country is not exist
                if (!error) {
                    db.query(query.addDownloadCost, [country_code, countryType], async(err, results) => { //adding downloading cost accordingly
                        if (!err) { 
                            await db.query(query.insert_sidefilter_Access, [false, false, false, false, false, false, false, false, false, false, false, false, country_code, "IMPORT", false, false, false, false, countryType, imp]);// adding country's side filters when it is not available since country is inexisting
                            await db.query(query.insert_sidefilter_Access, [false, false, false, false, false, false, false, false, false, false, false, false, country_code, "EXPORT", false, false, false, false, countryType, exp]);// adding country's side filters when it is not available since country is inexisting
                            await db.query(query.ADD_COUNTRY_DURATION, [country_code, "import", countryType]); //adding country import start and latest dates.
                            await db.query(query.ADD_COUNTRY_DURATION, [country_code, "export", countryType]); //adding country export start and latest dates.
                            return res.status(200).json(success("Ok", results.rows, res.statusCode)); 
                        } else { return res.status(500).json(error(err.message, res.statusCode)); }
                    });
                } else { return res.status(500).json(error(error.message, res.statusCode)); }
            });
        }
    } catch (err) { return res.status(500).json(error(err, res.statusCode)); }
}

exports.updateCountry = async (req, res) => {
    const { countryCode, imp, exp } = req.body;
    try {
        db.query(query.update_country, [imp, exp, countryCode], (error, results) => {
            if (!error) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.addDataHistory = async (req, res) => {
    const { countryName, direction, latestDate, countryCode, countryType } = req.body;
    try {
        const values = await db.query(query.getLatestDate, [countryType, direction, countryCode]);
        if (values.rows.length > 0) {
            db.query(query.updateDataHistory, [latestDate, countryType, countryCode, direction], (error, results) => {
                if (!error) {
                    return res.status(200).json(success("Ok", results.command + " Successful.", res.statusCode));
                } else {
                    return res.status(500).json(success("Ok", "Internal server error !", res.statusCode));
                }
            });
        } else {
            db.query(query.addDataHistory, [countryName, direction, latestDate, countryCode], (error, results) => {
                if (!error) {
                    return res.status(200).json(success("Ok", results.command + " Successful.", res.statusCode));
                } else {
                    return res.status(500).json(success("Ok", "Internal server error !", res.statusCode));
                }
            })
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getlatestDate = async (req, res) => {
    try {
        const { direction, countryType, countryName, countryCode } = req.query;
        let CountryType = "";
        if(["STATISTICAL","MIRROR"].includes(countryType)) {
            if(countryType==="STATISTICAL" && countryMappingViaType.hasOwnProperty(countryName)) {
                CountryType = !countryMappingViaType[countryName]["isCustom"] ? "MIRROR" : "CUSTOM";
            } else {CountryType = "MIRROR";}
        } else {CountryType = "CUSTOM";}

        db.query(query.getLatestDate, [CountryType, direction, countryCode], (error, results) => {
            if (!error) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(200).json(success("Ok", error.message, res.statusCode));
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}


exports.getGlobalCountriesList = async (req, res) => {
    try {
        db.query(query.GET_GLOBAL_COUNTRIES_BY_TYPE(req.query.type), (err, result) => {
            if(err) {res.status(500).json(error(err.message, res.statusCode));}
            else {res.status(200).json(success("OK", result.rows, res.statusCode));}
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getAllGlobeCountries = async (req, res) => {
    try {
        db.query(query.GET_ALL_GLOBE_COUNTRIES, (err, result) => {
            if(err) {res.status(500).json(error(err.message, res.statusCode));}
            else {res.status(200).json(success("OK", result.rows, res.statusCode));}
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getAllCountriesDates = async (req, res) => {
    try {
        db.query(query.GET_COUNTRIES_DATES, (err, result) => {
            if(err) {res.status(500).json(error(err.message, res.statusCode));}
            else {res.status(200).json(success("OK", result.rows, res.statusCode));}
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

