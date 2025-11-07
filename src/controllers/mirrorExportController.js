const db = require('../utils/database_temp');
const { success, error, extractCountry } = require('../utils/response');
const common = require('../utils/common');
// const config = require('../utils/config');

// function extractCountry(tableName) {
//     const country = {
//         getAfghanistanExports: "AFGHANISTAN",
//         getArgentinaExports: "ARGENTINA",
//         getAlgeriaExports: "ALGERIA",
//         getAngolaExports: "ANGOLA",
//         getArmeniaExports: "ARMENIA",
//         getAustraliaExports: "AUSTRALIA",
//         getAustriaExports: "AUSTRIA",
//         getAzerbaijanExports: "AZERBAIJAN",
//         getBahrainExports: "BAHRAIN",
//         getBarbadosExports: "BARBADOS",
//         getBelarusExports: "BELARUS",
//         getBelgiumExports: "BELGIUM",
//         getBeninExports: "BENIN",
//         getBermudaExports: "BERMUDA",
//         getBhutanExports: "BHUTAN",
//         getBrazilExports: "BRAZIL",
//         getBulgariaExports: "BULGARIA",
//         getBurundiExports: "BURUNDI",
//         getCambodiaExports: "CAMBODIA",
//         getCanadaExports: "CANADA",
//         getChadExports: "CHAD",
//         getChinaExports: "CHINA",
//         getCroatiaExports: "CROATIA",
//         getCyprusExports: "CYPRUS",
//         getCzechiaExports: "CZECHIA",
//         getDenmarkExports: "DENMARK",
//         getDemocraticrepubliccongoExports: "DEMOCRATIC REPUBLIC CONGO",
//         getDominicanrepublicExports: "DOMINICAN REPUBLIC",
//         getEgyptExports: "EGYPT",
//         getElsalvadorExports: "EL SALVADOR",
//         getEstoniaExports: "ESTONIA",
//         getFinlandExports: "FINLAND",
//         getFranceExports: "FRANCE",
//         getGabonExports: "GABON",
//         getGeorgiaExports: "GEORGIA",
//         getGermanyExports: "GERMANY",
//         getGreeceExports: "GREECE",
//         getGuatemalaExports: "GUATEMALA",
//         getGuineaExports: "GUINEA",
//         getHondurasExports: "HONDURAS",
//         getHongkongExports: "HONG KONG",
//         getHungaryExports: "HUNGARY",
//         getIranExports: "IRAN",
//         getEthiopiaExports: "ETHIOPIA",
//         getIraqExports: "IRAQ",
//         getIrelandExports: "IRELAND",
//         getIsraelExports: "ISRAEL",
//         getItalyExports: "ITALY",
//         getJamaicaExports: "JAMAICA",
//         getJapanExports: "JAPAN",
//         getJordanExports: "JORDAN",
//         getKenyaExports: "KENYA",
//         getKuwaitExports: "KUWAIT",
//         getKyrgyzstanExports: "KYRGYZSTAN",
//         getLatviaExports: "LATVIA",
//         getLithuaniaExports: "LITHUANIA",
//         getLuxembourgExports: "LUXEMBOURG",
//         getLibyaExports: "LIBYA",
//         getMaldivesExports: "MALDIVES",
//         getMauritiusExports: "MAURITIUS",
//         getMoldovaExports: "MOLDOVA",
//         getMoroccoExports: "MOROCCO",
//         getMozambiqueExports: "MOZAMBIQUE",
//         getNepalExports: "NEPAL",
//         getNetherlandsExports: "NETHERLANDS",
//         getNewzealandExports: "NEW ZEALAND",
//         getNigerExports: "NIGER",
//         getNigeriaExports: "NIGERIA",
//         getNorwayExports: "NORWAY",
//         getOmanExports: "OMAN",
//         getPalestineExports: "PALESTINE",
//         getPapuanewguineaExports: "PAPUA NEW GUINEA",
//         getPolandExports: "POLAND",
//         getPortugalExports: "PORTUGAL",
//         getQatarExports: "QATAR",
//         getRomaniaExports: "ROMANIA",
//         getSaudiarabiaExports: "SAUDI ARABIA",
//         getSenegalExports: "SENEGAL",
//         getSerbiaExports: "SERBIA",
//         getSeychellesExports: "SEYCHELLES",
//         getSlovakiaExports: "SLOVAKIA",
//         getSloveniaExports: "SLOVENIA",
//         getSingaporeExports: "SINGAPORE",
//         getSomaliaExports: "SOMALIA",
//         getSouthafricaExports: "SOUTHA FRICA",
//         getSouthkoreaExports: "SOUTH KOREA",
//         getSpainExports: "SPAIN",
//         getSwedenExports: "SWEDEN",
//         getSwitzerlandExports: "SWITZERLAND",
//         getTaiwanExports: "TAIWAN",
//         getTajikistanExports: "TAJIKISTAN",
//         getThailandExports: "THAILAND",
//         getTogoExports: "TOGO",
//         getTrinidadandtobagoExports: "TRINIDAD AND TOBAGO",
//         getTunisiaExports: "TUNISIA",
//         getTurkmenistanExports: "TURKMENISTAN",
//         getUnitedarabemiratesExports: "UNITED ARAB EMIRATES",
//         getUnitedkingdomExports: "UNITED KINGDOM",
//         getUnitedstatesofamericaExports: "UNITED STATES OF AMERICA",
//         getYemenExports: "YEMEN",
//         getSudanExports: "SUDAN",
//         getSyriaExports: "SYRIA",
//     };

//     return country[tableName];
// }

exports.exportMirrorCountries = {
    exportMirrorRequestHandle: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};
            req.body["CountryofOrigin"] = [extractCountry(req.route.path)]; //importing country
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);
            if (check) {                
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_mirror",
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
    
    exportChinaRequestHandle: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            // const pathName = `${req.route.path}`.replace("/","");
            const result = {counters:{}, data:{}};
            // req.body["CountryofOrigin"] = [extractCountry(pathName)];
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);
            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "export_china",
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
    }
}

