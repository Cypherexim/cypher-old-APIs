const db = require('../utils/database_temp');
const { success, error } = require('../utils/response');
const common = require('../utils/common');
const config = require('../utils/config');

exports.indiaCountry = {
    import: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch=false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);
    
            if(check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: config.import_india,
                    isOrderBy: true,
                    query: "",
                    searchType: "data"
                });
                
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
    },

    export: async(req, res) => {
        try {
            console.log(req.path)
            const { UserId, IsWorkspaceSearch=false } = req.body;
            const result = { counters: {}, data: {} };
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);
            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body, 
                    tablename: config.export_india,
                    isOrderBy: true,
                    query: "",
                    searchType: "data"
                });                
                
                db.query(query[0], query[1].slice(1), (err, results) => {
                    if (!err) {
                        result.data = results.rows;
                        return res.status(200).json(success("Ok", result, res.statusCode));
                    } else {
                        return res.status(500).json(error(err.message, res.statusCode));
                    }
                });
            } else {
                return res.status(200).json(error("You don't have enough search credit please contact admin to recharge !"));
            }
        } catch (err) {
            return res.status(500).json(error(err, res.statusCode));
        };
    }
}

