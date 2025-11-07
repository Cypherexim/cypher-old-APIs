const db = require('../utils/database_temp');
const { success, error } = require('../utils/response');
const common = require('../utils/common');
const config = require('../utils/config');


exports.exportCountries = {
    argentina: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);
            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_argentina", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
    },
    
    bolivia: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_bolivia", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    botswana: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_botswana", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    ghana: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_ghana", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    bangladesh: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_bangladesh", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    indonesia: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_indonesia", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },    

    nicaragua: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_nicaragua", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    }, 

    panama: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_panama", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    }, 

    tanzania: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_tanzania", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    }, 
    
    srilanka: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_srilanka", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    vietnam: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_vietnam", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },
    
    ethiopia: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_ethiopia", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },
    
    chile: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_chile", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    philip: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_philip", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    turkey: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_turkey", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    russia: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_russia", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    kenya: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_kenya", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    lesotho: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_lesotho", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    mexico: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_mexico", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    nigeria: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_nigeria", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    usa: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_usa", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    brazil: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_brazil", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    columbia: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_columbia", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    paraguay: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_paraguay", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    peru: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_peru", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    uganda: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_uganda", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },
    
    pakistan: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_pakistan", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    namibia: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_namibia", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    ecuador: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_ecuador", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },

    ivorycost: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_ivorycost", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },
    

    
    uruguay: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_uruguay", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },
    
    uzbekistan: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_uzbekistan", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },
    
    venezuela: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_venezuela", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },
    
    ukraine: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_ukraine", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },
    
    costarica: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_costarica", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },
        
    kazakhastan: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_kazakhastan", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },
            
    costademarfil: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_costademarfil", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },
      
    cameroon: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_cameroon", 
                    isOrderBy: true, 
                    query: "", searchType: "data"
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
        } catch (err) { return res.status(500).json(error(err, res.statusCode)); };
    },
};




