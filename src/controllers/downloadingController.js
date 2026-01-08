const db = require('../utils/database_temp');
const { success, error, extractCountry } = require('../../src/utils/response');
const utility = require('../utils/utility');
const common = require('../utils/common');


exports.generateDownloadLink = async(req, res) => {
    try {
        const { fromDate, toDate, HsCode="", UserId, recordIds:selectedIds, CountryCode, direction, filename, countryType, totalDownloadCost } = req.body;
        let isSubUser = false, subUserId = 0, recordIds = selectedIds, CountryName = req?.body?.CountryName;

        const {tableName, statCountryName} = utility.getCurrentTableName({countryType, direction, countryname:CountryName});

        if(countryType==="MIRROR" && CountryName!=="china") {
            const extractedCountryName = extractCountry(CountryName);
            const countryKey = direction=="import" ? "CountryofDestination": "CountryofOrigin";
            if(req.body.hasOwnProperty(countryKey)) { req.body[countryKey].push(extractedCountryName); }
            else { req.body[countryKey] = [extractedCountryName]; }
        } else if(countryType==="STATISTICAL" && statCountryName!=="") { CountryName = statCountryName; }

        const userDetails = await db.query(`SELECT "ParentUserId" FROM public."Cypher" where "UserId"=$1`, [UserId]);
        if (userDetails.rows.length > 0) {
            if (![null, 0, 1].includes(userDetails.rows[0].ParentUserId)) {
                isSubUser = true;
                subUserId = UserId;
                UserId = userDetails.rows[0].ParentUserId;
            }
        }

        if(totalDownloadCost>0) {
            const apiBody = {
                userId: UserId,
                fromDate, toDate,
                direction, filename,
                country: CountryName,
                hscode: HsCode
            }

            if(recordIds.length===0) {
                const finalquery = await common.getDatabaseQuery({
                    body: req.body,
                    tablename: tableName,
                    isOrderBy: false,
                    query: ""
                });

                apiBody.queryFilter = btoa(finalquery[0]?.split("WHERE")[1]);
                apiBody.queryFilterParamArr = finalquery[1].slice(1);
            } else {
                apiBody.queryFilter = btoa(`"RecordID" IN (${recordIds})`);
                apiBody.queryFilterParamArr = [];
            }

            const downloadingUrl = "https://download.micro.eximine.com/excel-download";
            const response = await fetch(downloadingUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(apiBody)
            });

            if(!response.ok) { throw(new Error(`HTTP error! status: ${response.status}`)); }

            const microserviceRes = await response.json();

            if(!microserviceRes?.error) {
                const datetime = utility?.getCurrentIndianTime().toSQL();
                const expirydate = new Date(Date.now() + (60*60*24*7)*1000);
                const sqlQuery = `INSERT INTO public.userdownloadtransaction ("countrycode", "userId", direction, "data_query", workspacename, datetime, "filePath", "status", "errorlog", "expirydate", "queue_id") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING "Id"`;
                
                const downloadWorkspaceRes = await db.query(sqlQuery, [CountryCode, isSubUser ? subUserId : UserId, direction.toUpperCase(), {}, filename, datetime, "", microserviceRes?.result[0]?.status, "", expirydate, microserviceRes?.result[0]?.queueId]); //In-Progress
                await db.query(`UPDATE downloading_queue SET download_id=$1 WHERE id=$2 AND queue_id=$3`, [downloadWorkspaceRes?.rows[0]?.Id, microserviceRes?.result[0]?.recordId, microserviceRes?.result[0]?.queueId]);
                await db.query(`UPDATE public.userplantransaction SET "Downloads" = $1 WHERE "UserId"= $2`, [totalDownloadCost, UserId]);
            }

            return !microserviceRes?.error 
                        ? res.status(200).json(success("OK", microserviceRes?.result, 200))
                        : res.status(500).json(error(microserviceRes?.message, 500));
        } else {
            return res.status(201).json(success("Ok", "Insufficient Donwloading Points!", res.statusCode));
        }
    } catch (err) {
        return res.status(200).json(error(err?.message, 500));
    }
}



