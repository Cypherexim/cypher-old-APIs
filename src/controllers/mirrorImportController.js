const db = require('../utils/database_temp');
const { success, error, extractCountry } = require('../utils/response');
const common = require('../utils/common');
// const config = require('../utils/config');


// function extractCountry(tableName) {
//     const country = {
//         getAfghanistanImports: "AFGHANISTAN",
//         getArgentinaImports: "ARGENTINA",
//         getAlgeriaImports: "ALGERIA",
//         getAngolaImports: "ANGOLA",
//         getArmeniaImports: "ARMENIA",
//         getAustraliaImports: "AUSTRALIA",
//         getAustriaImports: "AUSTRIA",
//         getAzerbaijanImports: "AZERBAIJAN",
//         getBahrainImports: "BAHRAIN",
//         getBarbadosImports: "BARBADOS",
//         getBelarusImports: "BELARUS",
//         getBelgiumImports: "BELGIUM",
//         getBeninImports: "BENIN",
//         getBermudaImports: "BERMUDA",
//         getBhutanImports: "BHUTAN",
//         getBrazilImports: "BRAZIL",
//         getBulgariaImports: "BULGARIA",
//         getBurundiImports: "BURUNDI",
//         getCambodiaImports: "CAMBODIA",
//         getCanadaImports: "CANADA",
//         getChadImports: "CHAD",
//         getChinaImports: "CHINA",
//         getCroatiaImports: "CROATIA",
//         getCyprusImports: "CYPRUS",
//         getCzechiaImports: "CZECHIA",
//         getDenmarkImports: "DENMARK",
//         getDemocraticrepubliccongoImports: "DEMOCRATIC REPUBLIC CONGO",
//         getDominicanrepublicImports: "DOMINICAN REPUBLIC",
//         getEgyptImports: "EGYPT",
//         getElsalvadorImports: "EL SALVADOR",
//         getEstoniaImports: "ESTONIA",
//         getFinlandImports: "FINLAND",
//         getFranceImports: "FRANCE",
//         getGabonImports: "GABON",
//         getGeorgiaImports: "GEORGIA",
//         getGermanyImports: "GERMANY",
//         getGreeceImports: "GREECE",
//         getGuatemalaImports: "GUATEMALA",
//         getGuineaImports: "GUINEA",
//         getHondurasImports: "HONDURAS",
//         getHongkongImports: "HONG KONG",
//         getHungaryImports: "HUNGARY",
//         getIranImports: "IRAN",
//         getEthiopiaImports: "ETHIOPIA",
//         getIraqImports: "IRAQ",
//         getIrelandImports: "IRELAND",
//         getIsraelImports: "ISRAEL",
//         getItalyImports: "ITALY",
//         getJamaicaImports: "JAMAICA",
//         getJapanImports: "JAPAN",
//         getJordanImports: "JORDAN",
//         getKenyaImports: "KENYA",
//         getKuwaitImports: "KUWAIT",
//         getKyrgyzstanImports: "KYRGYZSTAN",
//         getLatviaImports: "LATVIA",
//         getLithuaniaImports: "LITHUANIA",
//         getLuxembourgImports: "LUXEMBOURG",
//         getLibyaImports: "LIBYA",
//         getMaldivesImports: "MALDIVES",
//         getMauritiusImports: "MAURITIUS",
//         getMoldovaImports: "MOLDOVA",
//         getMoroccoImports: "MOROCCO",
//         getMozambiqueImports: "MOZAMBIQUE",
//         getNepalImports: "NEPAL",
//         getNetherlandsImports: "NETHERLANDS",
//         getNewzealandImports: "NEWZEALAND",
//         getNigerImports: "NIGER",
//         getNigeriaImports: "NIGERIA",
//         getNorwayImports: "NORWAY",
//         getOmanImports: "OMAN",
//         getPalestineImports: "PALESTINE",
//         getPapuanewguineaImports: "PAPUA NEW GUINEA",
//         getPolandImports: "POLAND",
//         getPortugalImports: "PORTUGAL",
//         getQatarImports: "QATAR",
//         getRomaniaImports: "ROMANIA",
//         getSaudiarabiaImports: "SAUDI ARABIA",
//         getSenegalImports: "SENEGAL",
//         getSerbiaImports: "SERBIA",
//         getSeychellesImports: "SEYCHELLES",
//         getSlovakiaImports: "SLOVAKIA",
//         getSloveniaImports: "SLOVENIA",
//         getSingaporeImports: "SINGAPORE",
//         getSomaliaImports: "SOMALIA",
//         getSouthafricaImports: "SOUTHA FRICA",
//         getSouthkoreaImports: "SOUTH KOREA",
//         getSpainImports: "SPAIN",
//         getSwedenImports: "SWEDEN",
//         getSwitzerlandImports: "SWITZERLAND",
//         getTaiwanImports: "TAIWAN",
//         getTajikistanImports: "TAJIKISTAN",
//         getThailandImports: "THAILAND",
//         getTogoImports: "TOGO",
//         getTrinidadandtobagoImports: "TRINIDAD AND TOBAGO",
//         getTunisiaImports: "TUNISIA",
//         getTurkmenistanImports: "TURKMENISTAN",
//         getUnitedarabemiratesImports: "UNITED ARAB EMIRATES",
//         getUnitedkingdomImports: "UNITED KINGDOM",
//         getUnitedstatesofamericaImports: "UNITED STATES OF AMERICA",
//         getYemenImports: "YEMEN",
//         getSudanImports: "SUDAN",
//         getSyriaImports: "SYRIA",
//     };

//     return country[tableName];
// }

exports.importMirrorCountries = {
    importMirrorRequestHandle: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            const result = {counters:{}, data:{}};

            req.body["CountryofDestination"] = [extractCountry(req.route.path)]; //exporting country
            
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);
            
            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "import_mirror",
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

    importChinaRequestHandle: async(req, res) => {
        try {
            const { UserId, IsWorkspaceSearch = false } = req.body;
            // const pathName = `${req.route.path}`.replace("/","");
            const result = {counters:{}, data:{}};
            // req.body["CountryofOrigin"] = [extractCountry(pathName)];
            const check = await common.deductSearches(UserId, IsWorkspaceSearch);
            if (check) {
                const query = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: "import_china",
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

