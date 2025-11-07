const db = require('../../src/utils/database');
const { success, error, extractCountry } = require('../../src/utils/response');
const query = require('../../src/sql/queries');
const utility = require('../utils/utility');
const common = require('../utils/common');
const config = require('../utils/config');
const Stream = require('stream');
const ExcelJs = require('exceljs');
const AWS = require('aws-sdk');
const {template} = require('../utils/mail-templates/download-mail');
const mail = require('../utils/mailing');


const client = new AWS.SecretsManager({ region: "us-east-1" });

const queueDownloadList = [];



exports.downloadingExcelFile = async (req, res) => {
    try {
        const { fromDate, toDate, HsCode, UserId, recordIds:selectedIds, CountryCode, direction, filename, countryType, totalDownloadCost } = req.body;
        let actualUserId = UserId, recordIds = selectedIds;//, isSubUser = false,  parentuserid = 0, subUserId = 0, searchedResult={};

        let {CountryName} = req.body;
        const {tableName, statCountryName} = utility.getCurrentTableName({countryType, direction, countryname:CountryName});

        if(countryType==="MIRROR" && CountryName!=="china") {
            const extractedCountryName = extractCountry(CountryName);
            const countryKey = direction=="import" ? "CountryofDestination": "CountryofOrigin";
            if(req.body.hasOwnProperty(countryKey)) { req.body[countryKey].push(extractedCountryName); }
            else { req.body[countryKey] = [extractedCountryName]; }
        } else if(countryType==="STATISTICAL" && statCountryName!=="") {
            CountryName = statCountryName;
        }

        const userDetails = await db.query(query.get_cypher_userby_id, [UserId]);

        if (userDetails.rows.length > 0) {
            if (userDetails.rows[0].ParentUserId != null) {
                // isSubUser = true;
                // parentuserid = userDetails.rows[0].ParentUserId;
                // subUserId = userDetails.rows[0].UserId;
                actualUserId = userDetails.rows[0].ParentUserId;
            }
        }

        const dateTimeInStr = utility.getCurrentIndianTime().toString();
        const downloadingQueueRes = await db.query(query.ADD_DOWNLOADING_QUEUE, [filename, utility.getCurrentIndianTime(), "QUEUE", ]);
        const workspaceNewAddRes = await db.query(query.add_download_workspace, [CountryCode, actualUserId, direction.toUpperCase(), {}, filename, dateTimeInStr, "", "In-Progress", "", dateTimeInStr]);
        // queryObjBody["downloadWorkspaceId"] = workspaceNewAddRes.rows[0].Id; //adding workspace ID

        const queryObjBody = {
            filename,
            userId: actualUserId,
            // query,
            // status: "Queue",
            downloadWorkspaceId: workspaceNewAddRes?.rows[0]?.Id || null,
            downloadQueueId: downloadingQueueRes?.rows[0]?.download_id || null,
            userDownloadingPoints: totalDownloadCost
        };
        

        if(queueDownloadList.length===0) {
            for(let i=0; i<queueDownloadList.length; i++) {
                
            }
        } else {
            queueDownloadList.push({

            });
        }

        //AWS credentials
        const secret = await client.getSecretValue({ SecretId: `cypher-access-key` }).promise(); // Getting secret value from ASM
        const {AccessKey, Secretaccesskey} = JSON.parse(secret.SecretString); // Prasing SecretString into javascript object
        AWS.config.update({ accessKeyId: AccessKey, secretAccessKey: Secretaccesskey });

        if(totalDownloadCost>0) {
            // const datetime = new Date();                            
            // const workspaceNewAddRes = await db.query(query.add_download_workspace, [CountryCode, isSubUser ? subUserId : UserId, direction.toUpperCase(), {}, filename, datetime, "", "In-Progress", "", datetime]);
            // queryObjBody["downloadWorkspaceId"] = workspaceNewAddRes.rows[0].Id; //adding workspace ID

            if(recordIds.length===0) {
                const finalquery = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: tableName,
                    isOrderBy: false,
                    query: getquery(direction, CountryCode)
                });
                queryObjBody["query"] = { queryStr: finalquery[0], params: finalquery[1].slice(1) }; //adding query with params
                // searchedResult = await db.query(finalquery[0], finalquery[1].slice(1));
                // const loopLen = searchedResult.rows.length;
                // for(let i=0; i<loopLen; i++) recordIds.push(searchedResult.rows[i]["RecordID"]);
            } else {
                // const queryStr = `select ${getquery(direction, CountryCode)} ${tableName} where "RecordID" IN (${recordIds})`;
                // searchedResult = await db.query(queryStr);
                const queryStr = `select ${getquery(direction, CountryCode)} ${tableName} where "RecordID" = ANY($1)`;
                queryObjBody["query"] = { queryStr, params: [recordIds] }; //adding query with params
            }

            if(recordIds.length < 500000) {
                const queryParam = {
                    UserId: isSubUser ? parentuserid : UserId,
                    direction, filename, fromDate, toDate, HsCode,
                    id: workspaceNewAddRes.rows[0].Id, totalDownloadCost, recordIds
                };

                // excelCreationProcess1(searchedResult, queryParam);
                return res.status(201).json(success("Ok", "Downloading in process!", res.statusCode));
            } else {
                await db.query(query.update_download_workspace, [{}, '', 'Error', 'Exceeding Five Lacks Records!', workspaceNewAddRes.rows[0].Id]);
                return res.status(201).json(success("Ok", "Exceeding Five Lacks Records!", res.statusCode));
            }
        } else {
            return res.status(201).json(success("Ok", "Insufficient Donwloading Points!", res.statusCode));
        }
    } catch (error) {
        return res.status(201).json(success("Ok", `Error occured due to - ${error.message}`, res.statusCode));
    }
}


async function excelCreationProcess1(result, dataDetails) {
    try {
        const {UserId, direction, filename, id, fromDate, toDate, HsCode, totalDownloadCost, recordIds} = dataDetails;

        const stream = new Stream.PassThrough();
        const workbook = new ExcelJs.stream.xlsx.WorkbookWriter({
            stream: stream,
            useStyles: true,
            useSharedStrings: true,
        });

        const worksheet = workbook.addWorksheet('Data', { views: [{ state: "frozen", ySplit: 7 }], });

        worksheet.getRow(1).hidden = true;
        worksheet.mergeCells('C2:AH6');
        worksheet.getCell('A2').value = 'DIRECTION :';
        worksheet.getCell('B2').value = direction.toUpperCase();

        if(HsCode) {
            worksheet.getRow(3).getCell(1).value = 'HSCODE :';
            worksheet.getRow(3).getCell(2).value = HsCode.toString();
        } else { worksheet.getRow(3).hidden = true; }

        worksheet.getRow(4).getCell(1).value = 'FROM :';
        worksheet.getRow(4).getCell(2).value = fromDate;
        worksheet.getRow(5).getCell(1).value = 'TO :';
        worksheet.getRow(5).getCell(2).value = toDate;
        worksheet.getRow(6).getCell(1).value = 'TOTAL RECORDS :';
        worksheet.getRow(6).getCell(2).value = result.rows.length;

        const cells = ['A2', 'B2', 'A3', 'B3', 'A4', 'B4', 'A5', 'B5', 'A6', 'B6'];
        for(let i=0; i<cells.length; i++) {
            worksheet.getCell(cells[i]).style.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        }

        // Set column headers
        delete result.rows[0].RecordID;
        const headers = getheaderarray(result.rows[0]);

        worksheet.getRow(7).values = headers;
        worksheet.columns = getDataHeaders(result.rows[0]);
        worksheet.getRow(7).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'f6be00' }
        }

        worksheet.columns.forEach((col) => {
            col.alignment = { horizontal: 'left' }
            col.style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        })

        // Add autofilter on each column
        worksheet.autoFilter = 'A7:AH7';

        for(let i =0; i<result.rows.length; i++) worksheet.addRow(result.rows[i]).commit();

        worksheet.commit();
        workbook.commit();

        const params = { Bucket: 'cypher-download-files', Key: `${filename}.xlsx`, Body: stream };
        const options = {partSize: 5 * 1024 * 1024, queueSize: 2};

        s3.upload(params, options, async (err, data) => {
            if (err) {
                await db.query(query.update_download_workspace, [{}, '', 'Error', `Error: ${err.message}`, id]);
            } else {
                const mailResponse = await db.query(query.get_Name_by_userid, [UserId]);
                const { Email, FullName } = mailResponse.rows[0];
                const { downloadSubject, downloadsourceemail } = config;
                mail.sendSESEmail(Email, template.replace("{{name}}", FullName).replace("{{url}}", data.Location), downloadSubject, downloadsourceemail);

                const dat = data.Expiration.match('"([^"]+)GMT"');
                const expirydate = utility.formatDate(new Date(dat[1]));

                await db.query(query.update_download_count, [totalDownloadCost, UserId]);
                await db.query(query.update_download_workspace, [recordIds, data.Location, 'Completed', '', expirydate, id]);
            }
        });
    } catch (error) {
        await db.query(query.update_download_workspace, [{}, '', 'Error', `Error: ${error.message}`, id]);
    }
}


function getquery(direction, CountryCode) {
    if (CountryCode == 'IND') {
        return config.INDIA_COLUMNS_DOWNLOAD(direction);
    } else if(CountryCode == "WEE") {
        return config.WEEKLY_COLUMNS_DOWNLOAD(direction);
    } else {
        return config.select_all_to_download;
    }
}

function getDataHeaders(row) {
    let columns = [];
    for (const prop in row) {
        let calculatedwidth = 12;
        if (prop == 'ITEM DESCRIPTION') {
            calculatedwidth = 125;
        } else if (prop == 'VENDOR') {
            calculatedwidth = 40;
        } else if (prop == 'BUYER') {
            calculatedwidth = 50;
        } else if (prop == 'BUYER ADDRESS') {
            calculatedwidth = 100;
        } else {
            calculatedwidth = prop.length < 12 ? 14 : prop.length + 15
        }
        columns.push({
            header: prop,
            key: prop,
            width: calculatedwidth
        });
    }
    return columns;
}

