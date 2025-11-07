// const Stream = require("stream");
// const ExcelJs = require('exceljs');
const { DateTime } = require("luxon");
const {extractCountry} = require("../utils/response");

const queryCondition = (params) => {
    const loopLen = params.length;
    const conditions = [], values = [0];

    for(let i=0; i<loopLen; i++) {
        const placeholderNum = i+1;

        switch (params[i].eq) {
            case '=': {                
                conditions.push(`"${params[i].name}" = $${placeholderNum}`);
                values.push(params[i].value);
                break;
            }
            case '!=': {                
                conditions.push(`"${params[i].name}" != $${placeholderNum}`);
                values.push(params[i].value);
                break;
            }
            case '>=': {
                conditions.push(`"${params[i].name}" >= $${placeholderNum}`);
                values.push(params[i].value);
                break;
            }
            case '<=': {
                conditions.push(`"${params[i].name}" <= $${placeholderNum}`);
                values.push(params[i].value);
                break;
            }
            case '%_%': {
                conditions.push(`"${params[i].name}" ILIKE $${placeholderNum}`);
                values.push(`%${params[i].value}%`);
                break;
            }
            case 'IN': {
                conditions.push(`"${params[i].name}" IN ($${placeholderNum})`);
                values.push(params[i].value);
                break;
            }
            case '= ANY': {
                conditions.push(`"${params[i].name}" = ANY($${placeholderNum})`);
                values.push(params[i].value);
                break;
            }
            case 'ANY': {
                conditions.push(`"${params[i].name}" ILIKE ANY ($${placeholderNum})`);
                values.push(params[i].value);
                break;
            }
            case 'LIKE':
            case 'SIMILAR TO': {
                if(params[i].name === "ProductDesc") {
                    conditions.push(`"${params[i].name}" ILIKE $${placeholderNum}`);                
                } else {
                    conditions.push(`"${params[i].name}" SIMILAR TO ($${placeholderNum})`);
                }
                values.push(params[i].value);
                
                break;
            }
        }
    }    

    return [conditions, values];
}

exports.getCurrentTableName = (tableDetails) => {
    const {countryType, direction, countryname} = tableDetails;
    const statisticalCountries = { Bolivia: "CUSTOM", Brazil: "CUSTOM", Mexico: "CUSTOM", Nicaragua: "CUSTOM", Turkey: "CUSTOM", Usa: "CUSTOM", Australia: "MIRROR", Canada: "MIRROR", Dominicanrepublic: "MIRROR", Egypt: "MIRROR", Elsalvador: "MIRROR", Guatemala: "MIRROR", Honduras: "MIRROR", Israel: "MIRROR", Japan: "MIRROR", Newzealand: "MIRROR", Puertorico: "MIRROR", Spain: "MIRROR", Taiwan: "MIRROR", Thailand: "MIRROR", Unitedkingdom: "MIRROR" };
    let tableName = "", statCountryName = "";

    if(countryType==="MIRROR") {
        if(countryname=="china") { tableName = `${direction}_china`; } 
        else { tableName = `${direction}_mirror`; }
    } else if(countryType=="CUSTOM") {
        tableName = `${direction.toLowerCase()}_${countryname.toLowerCase()}`;
    } else if(countryType==="STATISTICAL") {
        const countryName = countryname[0].toUpperCase() + countryname.slice(1).toLowerCase(); 
        const staticCountryType = statisticalCountries[countryName];
        tableName = `${direction}_${staticCountryType==="MIRROR" ? "mirror" : countryname.toLowerCase()}`;
        if(staticCountryType==="MIRROR") { statCountryName = extractCountry(countryName); }
    }

    return {tableName, statCountryName};
}

exports.generateFilterQuery = (params, selectQuery, tablename) => {
    let conditions=[], values = [];//, exceptionalParam = [];

    if (params.length == 0) {return false;}

    // exceptionalParam = params?.filter(param => param?.eq==="EXCEPTION");

    [conditions, values] = queryCondition(params);
    // if(exceptionalParam?.length>0) { exceptionalParam.forEach(param => conditions.push(param?.value)); }

    // let withdesc = conditions.filter(x => x.includes('ProductDesc'));
    // let withoutdesc = conditions.filter(x => !x.includes('ProductDesc'));
    const build = {
        where: conditions.length>0 ? conditions.join(' AND ') : '1',
        values: values
    };
    // let build = {
    //     where: conditions.length ?
    //         withoutdesc.join(' AND ') + (withdesc.length > 0 ? ' AND (' + withdesc.join(' OR ') + ')' : '') : '1',
    //     values: values
    // };

    const query = `SELECT ${selectQuery} ${tablename} WHERE ${build.where}`;

    return [query, build.values];
}





const getCompaniesRelatedQuery = (comapniesList, colName) => {
    try {
        let orConditions = "";

        for(let i=0; i<comapniesList?.length; i++) { orConditions += `"${colName}" ILIKE '${comapniesList[i]}' OR `; }

        orConditions = `(${orConditions.substring(0, orConditions?.length-4)})`;

        return orConditions;            
    } catch (error) { 
        console.log(error?.message);
        return ""; 
    }
}

exports.generateParams = (name, eq, value) => {
    let queryValue = value;
    // if(["Imp_Name", "Exp_Name"].includes(name)) {
    //     const commonInitialsList = findMultipleCommonInitialText(value);
    //     queryValue = commonInitialsList.length!==0 ? commonInitialsList: value;        
    // }

    // if(eq==="EXCEPTION") { queryValue = getCompaniesRelatedQuery(value, name); } //"Imp_Name", "Exp_Name"

    return {
        name: name,
        eq: eq, // %_%, %_, _%, =, >, <, !=,
        value: queryValue
    }
}

exports.formatDate = (date) => {
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('-');
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

exports.getCurrentIndianTime = () => {
    const currentTimestamp = new Date().valueOf();
    const utcTime = DateTime.fromMillis(currentTimestamp, { zone: "UTC" });
    const indianTime = utcTime.setZone("Asia/Kolkata");

    return indianTime;
}

// exports.excelFileCreator = (streamData, columnValues) => {
//     return new Promise(async(resolve, reject) => {
//         try {
//             const { direction, HsCode, fromDate, toDate } = columnValues;
//             const stream = new Stream.PassThrough();
//             const workbook = new ExcelJs.stream.xlsx.WorkbookWriter({
//                 stream: stream,
//                 useStyles: true,
//                 useSharedStrings: true,
//             });

//             const worksheet = workbook.addWorksheet('Data', { views: [{ state: "frozen", ySplit: 7 }], });
//             worksheet.getRow(1).hidden = true;
//             worksheet.mergeCells('C2:AH6');
//             worksheet.getCell('A2').value = 'DIRECTION :';
//             worksheet.getCell('B2').value = direction.toUpperCase();
//             if(HsCode){
//             worksheet.getRow(3).getCell(1).value = 'HSCODE :';
//             worksheet.getRow(3).getCell(2).value = HsCode.toString();
//             } else {worksheet.getRow(3).hidden = true;}
//             worksheet.getRow(4).getCell(1).value = 'FROM :';
//             worksheet.getRow(4).getCell(2).value = fromDate;
//             worksheet.getRow(5).getCell(1).value = 'TO :';
//             worksheet.getRow(5).getCell(2).value = toDate;
//             worksheet.getRow(6).getCell(1).value = 'TOTAL RECORDS :';
//             worksheet.getRow(6).getCell(2).value = streamData.length;
            
//             ["A2", "B2", "A3", "B3", "A4", "B4", "A5", "B5", "A6", "B6"].forEach(cell => {
//                 worksheet.getCell(cell).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
//             });

//             // Set column headers
//             delete streamData[0].RecordID;
//             const a = getheaderarray(streamData[0]);
//             worksheet.getRow(7).values = a;
//             worksheet.columns = getDataHeaders(streamData[0]);

//             worksheet.getRow(7).fill = {
//                 type: 'pattern',
//                 pattern: 'solid',
//                 fgColor: { argb: 'f6be00' }
//             }

//             worksheet.columns.forEach((col) => {
//                 col.alignment = { horizontal: 'left' }
//                 col.style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
//             });

//             // Add autofilter on each column
//             worksheet.autoFilter = 'A7:AH7';

//             for(let i =0; i< streamData.length; i++) {worksheet.addRow(streamData[i]).commit();}

//             // worksheet.commit();
//             await workbook.commit();
//             console.log("FILE HAS BEEN CREATED!");

//             return resolve(stream);
//         } catch (error) {
//             return reject(false);
//         }
//     });    
// }


const findMultipleCommonInitialText = (searchList) => {
    if([null, undefined].includes(searchList) || searchList.length===0) return [];

    const prefixes = [];
    let groupStartIndex = 0;
    searchList.sort();

    for(let i=1; i<searchList.length; i++) {
        if(searchList[i][0] !== searchList[i-1][0]) {
            const group = searchList.slice(groupStartIndex, i);
            const prefix = getCommonInitialText(group);
            prefixes.push(prefix.trim()+"%");
            groupStartIndex = i;          
        }
    }

    const lastGroup = searchList.slice(groupStartIndex);
    if(![null, undefined].includes(lastGroup) || lastGroup.length!==0) {
        const lastPrefix = getCommonInitialText(lastGroup);
        prefixes.push(lastPrefix.trim()+"%");
    }

    return prefixes;
}

const getCommonInitialText = (searchList) => {
    if(searchList.length === 0) return "";
    if(searchList.length === 1) return searchList[0];

    let commonText = "";
    const sortedSearchingList = searchList.sort();
    const firstListItem = sortedSearchingList[0];
    const lastListItem = sortedSearchingList.at(-1);
    const minLength = Math.min(firstListItem.length, lastListItem.length);

    for(let i=0; i<minLength; i++) {
        if(firstListItem[i] === lastListItem[i]) {
            commonText += firstListItem[i];
        } else break;
    }

    return commonText;
}
