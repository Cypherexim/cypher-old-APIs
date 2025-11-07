const db = require('../utils/database_temp');
const { success, error } = require('../utils/response');
const common = require('../utils/common');
const config = require('../utils/config');

exports.importCountries = {
    argentina: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "import_argentina", 
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

    bolivia: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "import_bolivia", 
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

    burundi: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "import_burundi", 
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
                    tablename: "import_botswana", 
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
                    tablename: "import_ghana", 
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
                    tablename: "import_cameroon", 
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
                    tablename: "import_bangladesh", 
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
                    tablename: "import_indonesia", 
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
                    tablename: "import_vietnam", 
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
                    tablename: "import_nicaragua", 
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
                    tablename: "import_panama", 
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
                    tablename: "import_tanzania", 
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
                    tablename: "import_srilanka", 
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
                    tablename: "import_ethiopia", 
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
                    tablename: "import_chile", 
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
                    tablename: "import_philip", 
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
                    tablename: "import_turkey", 
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
                    tablename: "import_russia", 
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
                    tablename: "import_kenya", 
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
                    tablename: "import_lesotho", 
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
                    tablename: "import_mexico", 
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
                    tablename: "import_nigeria", 
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
                    tablename: "import_usa", 
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
                    tablename: "import_brazil", 
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
                    tablename: "import_columbia", 
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
                    tablename: "import_ivorycost", 
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
                    tablename: "import_ecuador", 
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
                    tablename: "import_namibia", 
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
                    tablename: "import_peru", 
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

    southsudan: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "import_southsudan", 
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
                    tablename: "import_uruguay", 
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
                    tablename: "import_uzbekistan", 
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
                    tablename: "import_venezuela", 
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
                    tablename: "import_ukraine", 
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
                    tablename: "import_costarica", 
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
                    tablename: "import_kazakhastan", 
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
                    tablename: "import_pakistan", 
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
                    tablename: "import_costademarfil", 
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
                    tablename: "import_paraguay", 
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
    
    rwanda: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);

            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "import_rwanda", 
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
                    tablename: "import_uganda", 
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

