exports.unionCompanyGenerator = (args) => {
    return new Promise((resolve, reject) => {
        try {
            const { partialQuery, companyColName, companyList, searchType } = args;
            const unionSections = [];

            const addOn = ["sidefilter","analysis"].includes(searchType.split("-")[0]) ? ` GROUP BY ${searchType.split("-")[1]}`: "";

            for(let i=0; i<companyList?.length; i++) {
                const company = companyList[i]?.replaceAll("'", "''");
                const sections = `(${partialQuery} AND "${companyColName}" ILIKE '${company}%' ${addOn})`;
                unionSections.push(sections);
            }

            const unionOrientedQuery = unionSections?.join(" UNION ALL ");

            resolve(unionOrientedQuery);
        } catch (error) {
            reject(error);
        }
    });
}

exports.unionBothCompanyGenerator = (args) => {
    return new Promise((resolve, reject) => {
        try {
            const { partialQuery, companyColNames, companyList, direction, searchType } = args;
            const queryOptions = {
                importColName: companyColNames[0],
                exportColName: companyColNames[1],
                importersList: companyList[0],
                exportersList: companyList[1]
            };

            const unionSections = [];
            const loopLen = direction==="export" ? queryOptions?.exportersList.length: queryOptions?.importersList?.length;

            const addOn = ["sidefilter","analysis"].includes(searchType.split("-")[0]) ? ` GROUP BY ${searchType.split("-")[1]}`: "";

            const singleQuoteReplacer = (company) => company?.replaceAll("'", "''");

            for(let i=0; i<loopLen; i++) {
                const sections = direction==="export" 
                ? `(${partialQuery} AND "${queryOptions?.exportColName}" ILIKE '${singleQuoteReplacer(queryOptions?.exportersList[i])}%' AND "${queryOptions?.importColName}" IN (${queryOptions?.importersList?.map(txt => `'${singleQuoteReplacer(txt)}'`)?.toString()}) ${addOn})`
                : `(${partialQuery} AND "${queryOptions?.importColName}" ILIKE '${singleQuoteReplacer(queryOptions?.importersList[i])}%' AND "${queryOptions?.exportColName}" IN (${queryOptions?.exportersList?.map(txt => `'${singleQuoteReplacer(txt)}'`)?.toString()}) ${addOn})`
                
                unionSections.push(sections);
            }

            const unionOrientedQuery = unionSections?.join(" UNION ALL ");

            resolve(unionOrientedQuery);
        } catch (error) {
            reject(error);
        }
    });
}


exports.counterOrientedQueryGen = (args) => {
    return new Promise((resolve, reject) => {
        try {        
            let { importers, exporters, partialQuery } = args;
            let importQuery = `"Imp_Name" SIMILAR TO '(`, exportQuery = `"Exp_Name" SIMILAR TO '(`;
        
            if(importers?.length>0 && exporters?.length>0) {
                for(let i=0; i<importers?.length; i++) { importQuery += importers[i]+"|"; }
                for(let j=0; j<exporters?.length; j++) { exportQuery += exporters[j]+"|"; }
                
                partialQuery += ` AND ${importQuery?.substring(0, importQuery?.length-1)+")'"} AND ${exportQuery?.substring(0, exportQuery?.length-1)+")'"}`;
                resolve(partialQuery);
            } else {
                if(importers?.length>0) {
                    for(let i=0; i<importers?.length; i++) { importQuery += importers[i]+"|"; }
                    partialQuery += ` AND ${importQuery?.substring(0, importQuery?.length-1)+")'"}`;
                    resolve(partialQuery);
                } else if(exporters?.length>0) {
                    for(let j=0; j<exporters?.length; j++) { exportQuery += exporters[j]+"|"; }
                    partialQuery += ` AND ${exportQuery?.substring(0, exportQuery?.length-1)+")'"}`;
                    resolve(partialQuery);
                }
            }
        } catch (error) { reject(error); }
    });
}

exports.setWithGroupQuerySidefilter = (columnName, query) => {
    const colName = columnName.includes('"') ? columnName: `"${columnName}"`;
    const initialStatement = 'WITH "GroupDataTable" AS (';
    const finalStatement = `) select distinct ${colName}, sum(valueinusd) as valueinusd from "GroupDataTable" group by ${colName}`;

    return initialStatement + query + finalStatement;
}

exports.setWithGroupQueryAnalysis = (columnName, query) => {
    const colName = columnName.includes('"') ? columnName: `"${columnName}"`;
    const initialStatement = 'WITH "GroupDataTable" AS (';
    const finalStatement = `) select distinct ${colName}, sum(valueinusd) as ValueInUSD, sum(Quantity) as Quantity, sum(UnitPriceFC) as UnitPriceFC  from "GroupDataTable" group by ${colName}`;

    return initialStatement + query + finalStatement;
}

exports.setWithGroupQueryCounters = (columnName, query) => {
    const colName = columnName.includes('"') ? columnName: `"${columnName}"`;
    const initialStatement = 'WITH "GroupDataTable" AS (';
    const finalStatement = `) select distinct ${colName}, sum(valueinusd) as ValueInUSD, sum(Quantity) as Quantity, sum(UnitPriceFC) as UnitPriceFC  from "GroupDataTable" group by ${colName}`;

    return initialStatement + query + finalStatement;
}

