const db = require('./database_temp');
const queries = require('../sql/queries');
const utility = require('../utils/utility');
const config = require('../utils/config');
const { unionCompanyGenerator, unionBothCompanyGenerator, counterOrientedQueryGen } = require("./unionQueryGen");

exports.deductSearches = async (UserId, IsWorkspaceSearch) => {
    const planDetails = await db.query(queries.get_Plan_By_UserId, [UserId]);

    if (!IsWorkspaceSearch) {
        if (planDetails.rows.length>0 && planDetails.rows[0] != null) {
            if (planDetails.rows[0].Searches > 0 || planDetails.rows[0].Searches == 'Unlimited') {
                const latestSearchCount = Number(planDetails.rows[0].Searches) - 1;
                await db.query(queries.update_Plan_transaction, [latestSearchCount, UserId]);
                return true;
            } else { return false; }
        } else { return false; }
    } else { return true; }
}

exports.getDatabaseQuery = async (args) => {
    return new Promise(async(resolve, reject) => {
        const {body, tablename, isOrderBy, query, searchType=""} = args;
        const {fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
            CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin, PortofDestination,
            Mode, LoadingPort, NotifyPartyName, Currency, page=0, itemperpage=0 } = body;
    
        const params = [];
        // const searchFinalType = searchType.includes("-") ? searchType.split("-")[0]: searchType;
        // const isUnionAllow = ["data","analysis","sidefilter"].includes(searchFinalType);
        const [direction, country] = tablename.split("_");
        const selectQuery = query==="" ? config.selectQueryForTotalRecords(direction, country) : query;
        const doesExist = (colName) => !(["", null, undefined].includes(colName));
        
        if (doesExist(ProductDesc)) {
            //const desc = ProductDesc[0].split(" ");
            if (ProductDesc.length > 0) {
                ProductDesc.forEach(element => {
                    if (doesExist(element)) { params.push(utility.generateParams("ProductDesc", "SIMILAR TO", `%${element}%`)); }//`%(${element})%`)); }  //"%(" + element + ")%"
                });
            }
        }
                
        if (doesExist(fromDate)) { params.push(utility.generateParams("Date", ">=", fromDate)); }
        if (doesExist(toDate)) { params.push(utility.generateParams("Date", "<=", toDate)); }
        if (doesExist(HsCode)) { params.push(utility.generateParams("HsCode", "LIKE", `(${HsCode.join("|")})%`)); } //'(300|500)%'     '(300|500)%'    //, "(" + HsCode.join("|") + ")%"
        
        if(country.toLowerCase()==="india" && !doesExist(HsCode)) { params.push(utility.generateParams("HsCode", "NOT SIMILAR", `(${[88, 93].join("|")})%`)); }
        
        if (doesExist(CountryofOrigin)) { params.push(utility.generateParams("CountryofOrigin", "ANY", CountryofOrigin)) }
        if (doesExist(CountryofDestination)) { params.push(utility.generateParams("CountryofDestination", "ANY", CountryofDestination)) }
        if (doesExist(Month)) { params.push(utility.generateParams("Month", "ANY", Month)) }
        if (doesExist(Year)) { params.push(utility.generateParams("Year", "= ANY", Year)) }
        if (doesExist(uqc)) { params.push(utility.generateParams("uqc", "ANY", uqc)) }
        if (doesExist(Quantity)) { params.push(utility.generateParams("Quantity", "<=", Quantity)) }
        if (doesExist(Currency)) { params.push(utility.generateParams("Currency", "ANY", Currency)) }
        if (doesExist(PortofOrigin)) { params.push(utility.generateParams("PortofOrigin", "ANY", PortofOrigin)) }
        if (doesExist(PortofDestination)) { params.push(utility.generateParams("PortofDestination", "ANY", PortofDestination)) }
        if (doesExist(Mode)) { params.push(utility.generateParams("Mode", "ANY", Mode)) }
        if (doesExist(LoadingPort)) { params.push(utility.generateParams("LoadingPort", "ANY", LoadingPort)) }
        if (doesExist(NotifyPartyName)) { params.push(utility.generateParams("NotifyPartyName", "ANY", NotifyPartyName)) }   
        if (doesExist(Imp_Name)) { params.push(utility.generateParams("Imp_Name", "ANY", Imp_Name)); } //multi push
        if (doesExist(Exp_Name)) { params.push(utility.generateParams("Exp_Name", "ANY", Exp_Name)); } //multi push

        let querytoexecute = utility.generateFilterQuery(params, selectQuery, tablename);                
        
        // if(isUnionAllow) {
        //     if(doesExist(Imp_Name) && doesExist(Exp_Name)) {
        //         querytoexecute[0] = await unionBothCompanyGenerator({
        //             partialQuery: querytoexecute[0], 
        //             companyColNames: ["Imp_Name", "Exp_Name"], 
        //             companyList: [Imp_Name, Exp_Name], 
        //             direction: direction,
        //             searchType
        //         });
        //     } else if(doesExist(Imp_Name) || doesExist(Exp_Name)) {
        //         const isImporterExist = doesExist(Imp_Name);
        //         const columnName = isImporterExist ? "Imp_Name": "Exp_Name";
        //         const companiesList = columnName==="Imp_Name" ? Imp_Name: Exp_Name;

        //         querytoexecute[0] = await unionCompanyGenerator({
        //             partialQuery: querytoexecute[0],
        //             companyColName: columnName,
        //             companyList: companiesList,
        //             searchType: searchType
        //         });
        //     } else {
        //         const addOn = ["sidefilter","analysis"].includes(searchType.split("-")[0]) ? ` GROUP BY ${searchType.split("-")[1]}`: "";
        //         querytoexecute[0] += addOn;
        //         // if(["sidefilter","analysis"].includes(searchType.split("-")[0])) console.log(querytoexecute);
        //     }
        // }



        //  else {
        //     querytoexecute[0] = await counterOrientedQueryGen({ 
        //         importers: Imp_Name, 
        //         exporters: Exp_Name, 
        //         partialQuery: querytoexecute[0]
        //     });
        // }

        const finalQuery = querytoexecute[0] + (isOrderBy ? ` ORDER BY "Date" DESC LIMIT ${Number(itemperpage)} OFFSET ${(Number(page) - 1) * Number(itemperpage)}` : "");

        return resolve([finalQuery, querytoexecute[1]]);
    });
}




exports.getExportData = async (fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
    CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
    PortofDestination,
    Mode, LoadingPort,
    NotifyPartyName, Currency, page, itemperpage, selectQuery, tablename, isOrderBy) => {
    let params = []
    let desc = [];
    // params.push(utility.generateParams("ProductDesc", "SIMILAR TO","%(" + ProductDesc + ")%" ))
    if (ProductDesc != '' && ProductDesc != undefined) {
        desc = ProductDesc[0].split(" ");
    }
    if (fromDate != '' && fromDate != undefined) {
        params.push(utility.generateParams("Date", ">=", fromDate))
    }
    if (toDate != '' && toDate != undefined) {
        params.push(utility.generateParams("Date", "<=", toDate))
    }
    if (HsCode != '' && HsCode != undefined) {
        params.push(utility.generateParams("HsCode", "SIMILAR TO", "(" + HsCode.join("|") + ")%")) //'(300|500)%'     '(300|500)%'
    }
    if (desc.length > 0) {
        desc.forEach(element => {
            if (element != '' && element != undefined) {
                params.push(utility.generateParams("ProductDesc", "SIMILAR TO", "%(" + element + ")%"))
            }
        });
    }
    if (Imp_Name != '' && Imp_Name != undefined) {
        params.push(utility.generateParams("Imp_Name", "ANY", Imp_Name))
    }
    if (Exp_Name != '' && Exp_Name != undefined) {
        params.push(utility.generateParams("Exp_Name", "ANY", Exp_Name))
    }
    if (CountryofOrigin != '' && CountryofOrigin != undefined) {
        params.push(utility.generateParams("CountryofOrigin", "ANY", CountryofOrigin))
    }
    if (CountryofDestination != '' && CountryofDestination != undefined) {
        params.push(utility.generateParams("CountryofDestination", "ANY", CountryofDestination))
    }
    if (Month != '' && Month != undefined) {
        params.push(utility.generateParams("Month", "ANY", Month))
    }
    if (Year != '' && Year != undefined) {
        params.push(utility.generateParams("Year", "ANY", Year))
    }
    if (uqc != '' && uqc != undefined) {
        params.push(utility.generateParams("uqc", "ANY", uqc))
    }
    if (Quantity != '' && Quantity != undefined) {
        params.push(utility.generateParams("Quantity", "<=", Quantity))
    }
    if (Currency != '' && Currency != undefined) {
        params.push(utility.generateParams("Currency", "ANY", Currency))
    }
    if (PortofOrigin != '' && PortofOrigin != undefined) {
        params.push(utility.generateParams("PortofOrigin", "ANY", PortofOrigin))
    }
    if (PortofDestination != '' && PortofDestination != undefined) {
        params.push(utility.generateParams("PortofDestination", "ANY", PortofDestination))
    }
    if (Mode != '' && Mode != undefined) {
        params.push(utility.generateParams("Mode", "ANY", Mode))
    }
    if (LoadingPort != '' && LoadingPort != undefined) {
        params.push(utility.generateParams("LoadingPort", "ANY", LoadingPort))
    }
    if (NotifyPartyName != '' && NotifyPartyName != undefined) {
        params.push(utility.generateParams("NotifyPartyName", "ANY", NotifyPartyName))
    }

    const querytoexecute = utility.generateFilterQuery(params, selectQuery, tablename);
    const finalQuery = querytoexecute[0] + (isOrderBy ? ' ORDER BY "Date" DESC LIMIT ' + parseInt(itemperpage) + ' OFFSET ' + (parseInt(page) - 1) * parseInt(itemperpage) : '')

    return [finalQuery, querytoexecute[1]];
}


exports.getavailableFieldlist1 = async (tablename) => {
    const fieldList = ["Imp_Name", "Exp_Name","ValueInUSD"];
    let countryCount;
    if (tablename.toLowerCase().includes('import')) {
        countryCount = 'COUNT(distinct  "CountryofOrigin") as TotalCountry';
    } else {
        countryCount = 'COUNT(distinct  "CountryofDestination") as TotalCountry';
    }
    const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tablename, fieldList]);
    if (availablefield.rows.length > 0) {
        // var fields = [];
        var querystring ='';
        // availablefield.rows.forEach(x => {
        //     fields.push('"' + x.column_name.toString() + '"');
        // })
        // if (fields.length == 1) {
        //     querystring = 'COUNT(distinct  ' + fields[0] + ') as ' + fields[0].replace(/"|'/g, '') + 'Count';
        // } else {
        //     querystring = 'COUNT(distinct  ' + fields[0] + ') as ' + fields[0].replace(/"|'/g, '') + 'Count , COUNT(distinct  ' + fields[1] + ') as ' + fields[1].replace(/"|'/g, '') + 'Count';
        // }

        availablefield.rows.forEach(x => {
            if(x.column_name.toString() =='ValueInUSD' && !querystring.includes('ValueInUSD')){
                querystring += ', ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as ValueInUSD' 
            } else {
                querystring += ', COUNT(distinct  "' + x.column_name.toString() + '") as ' +x.column_name.toString().replace(/"|'/g, '') + 'Count'
            }
        });
        const query = 'DISTINCT COUNT(*) OVER() as unique_count '+ querystring + ' , COUNT(distinct  "HsCode") as TotalHsCode , COUNT(*) as total_records , ' + countryCount + ' FROM';
        return [query];
    } else return "";
}

exports.getavailableFieldlist = async (tablename, countryType="") => {    
    const startTime = Date.now();
    const fieldList = {
        totalValueCount: 'ValueInUSD', 
        buyerCount: 'Imp_Name', 
        supplierCount: 'Exp_Name',
        hscodeCount: 'HsCode',
        countryCount: tablename.toLowerCase().includes('import') ? 'CountryofOrigin' : 'CountryofDestination'
    };
    if(countryType == "STATISTICAL") {
        delete fieldList?.buyerCount;
        delete fieldList?.supplierCount;
    }
    const keyFinder = (value) => Object.keys(fieldList).filter(key => fieldList[key] === value)[0];

    const {rows, rowCount} = await db.query(`SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)`, [tablename, Object.values(fieldList)]);

    if (rowCount > 0) {
        const uniqueCountQueries = [];

        for(let i=0; i<rowCount; i++) {
            const colName = rows[i].column_name;

            if(colName.toString()==='ValueInUSD') {
                uniqueCountQueries.push(`ROUND(SUM("ValueInUSD")::numeric, 2) as ${keyFinder(`${colName.toString()}`)}`);
            } else {
                uniqueCountQueries.push(`COUNT(distinct "${colName.toString()}") as ${keyFinder(`${colName.toString()}`)}`);
            }

            // if(colName.toString() =='ValueInUSD' && !querystring.includes('ValueInUSD')) {
            //     querystring += ', ROUND(SUM(CAST("ValueInUSD" as DOUBLE PRECISION))::numeric,2) as valueinusd' ;
            // } else {
            //     querystring += `, COUNT(distinct "${colName.toString()}") as ${colName.toString().replace(/"|'/g, '')}_count`;                
            // }
        }

        const query = `${uniqueCountQueries.toString()}, COUNT(*) as totalRecordsCount FROM`;
        
        const endTime = Date.now();
        console.log("Total time taken ==>>", (endTime-startTime)); 

        return [query];
    } else return "";
}








// params.push(utility.generateParams("ProductDesc", "SIMILAR TO","%(" + ProductDesc + ")%" ))
    // if (ProductDesc != '' && ProductDesc != undefined) {
    // if (fromDate != '' && fromDate != undefined) {
    // if (toDate != '' && toDate != undefined) {
    // if (Imp_Name != '' && Imp_Name != undefined) {
    // if (Exp_Name != '' && Exp_Name != undefined) {
    // if (CountryofOrigin != '' && CountryofOrigin != undefined) {
    // if (CountryofDestination != '' && CountryofDestination != undefined) {
    // if (Month != '' && Month != undefined) {
    // if (Year != '' && Year != undefined) {
    // if (uqc != '' && uqc != undefined) {
    // if (Quantity != '' && Quantity != undefined) {
    // if (Currency != '' && Currency != undefined) {
    // if (PortofOrigin != '' && PortofOrigin != undefined) {
    // if (PortofDestination != '' && PortofDestination != undefined) {
    // if (Mode != '' && Mode != undefined) {
    // if (LoadingPort != '' && LoadingPort != undefined) {
    // if (NotifyPartyName != '' && NotifyPartyName != undefined) {