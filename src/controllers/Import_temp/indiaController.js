const db = require('../../utils/database');
const { success, error } = require('../../utils/response');
const common = require('../../utils/common');
const config = require('../../utils/config');



exports.getIndiaImport = async(req, res) => {
    try {
        const { UserId, IsWorkspaceSearch=false } = req.body;
        const result = {counters:{}, data:{}};
        const check = await common.deductSearches(UserId, IsWorkspaceSearch);

        if(check) {
            const query = await common.getDatabaseQuery({
                body: req.body,
                tablename: config.import_india,
                isOrderBy: true,
                query: ""
            });//req.body, config.import_india, true
            
            db.query(query[0], query[1].slice(1), (err, results) => {
                if(!err) {
                    result.data = results.rows;
                    return res.status(200).json(success("Ok", result, res.statusCode));
                } else {
                    return res.status(500).json(error(err.message, res.statusCode));
                }
            });
        } else {
            return res.status(200).json(error("You don't have enough search credit please contact admin to recharge!"));
        }
    } catch (err) { return res.status(500).json(error(err, res.statusCode)); }
}


// exports.getWeekly_dataImport = async(req, res) => {
//     try {
//         const { UserId, IsWorkspaceSearch=false } = req.body;
//         const result = {counters:{}, data:{}};
//         const check = await common.deductSearches(UserId, IsWorkspaceSearch);

//         if(check) {
//             const query = await common.getDatabaseQuery({
//                 body: req.body,
//                 tablename: config.import_india,
//                 isOrderBy: true,
//                 query: ""
//             });//req.body, config.import_india, true
//             console.log("QUEWRY",query);
//             db.query(query[0], query[1].slice(1), (err, results) => {
//                 if(!err) {
//                     result.data = results.rows;
//                     return res.status(200).json(success("Ok", result, res.statusCode));
//                 } else {
//                     return res.status(500).json(error(err.message, res.statusCode));
//                 }
//             });
//         } else {
//             return res.status(200).json(error("You don't have enough search credit please contact admin to recharge!"));
//         }
//     } catch (err) { return res.status(500).json(error(err, res.statusCode)); }
// }



// to get import with search data
// exports.getindiaImport = async (req, res) => {
//     try {
//         debugger
//         console.log("India Import");
//         const { UserId, IsWorkspaceSearch=false } = req.body;
//         const result = {counters:{}, data:{}};
//         const check = await common.deductSearches(UserId, IsWorkspaceSearch);

//         if (check) {
//             console.log("first", req.body)
//             const query = await common.getExportData(req.body, config.import_india, true);
//             // const counterquery = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
//             //     CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
//             //     PortofDestination,
//             //     Mode, LoadingPort,
//             //     NotifyPartyName, Currency, page, itemperpage, await common.getavailableFieldlist(config.import_india), config.import_india, false);
            
//             db.query(query[0], query[1].slice(1), (err, results) => {
//                 if(!err){
//                 result.data = results.rows;
//                 return res.status(200).json(success("Ok", result, res.statusCode));
//                 // db.query(counterquery[0], counterquery[1].slice(1), (err, results) => {
                    
//                 //     if (!err) {
//                 //         result.counters = results.rows[0];
//                 //     } else {
//                 //         return res.status(500).json(error("Internal server error", res.statusCode));
//                 //     }
//                 // })
//                 } else {
//                     return res.status(500).json(error(err.message, res.statusCode));
//                 }
//             })
            
//         } else {
//             return res.status(200).json(error("You don't have enough search credit please contact admin to recharge !"));
//         }

//     } catch (err) {
//         return res.status(500).json(error(err, res.statusCode));
//     };
// }




