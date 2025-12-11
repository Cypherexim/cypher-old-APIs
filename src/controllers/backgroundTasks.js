const { EventEmitter } = require("events");
const { getCurrentIndianTime } = require("../utils/utility");

const backgroundTaskEvent = new EventEmitter();

backgroundTaskEvent.on("set-totheorder-data", async(db, data) => {
    try {
        const { recordId, userId, tableName, country, direction } = data;

        const fetchingShipmentQuery = `select * from ${tableName} where "RecordID"=$1`;
        const shipmentRes = await db.query(fetchingShipmentQuery, [recordId]);
        const jsonShipment = JSON.stringify(shipmentRes.rows[0]);
        
        const viewTime = getCurrentIndianTime().toSQL();

        const query = `INSERT INTO "User_Favorite_Shipments" (favorite_shipment, user_id, transaction_time, record_id, country, direction) VALUES($1, $2, $3, $4, $5, $6) RETURNING shipment_id`;
        
        const insertionRes = await db.query(query, [jsonShipment, userId, viewTime, recordId, country.toLowerCase(), direction.toLowerCase()]);
        const shipmentId = insertionRes.rows[0]["shipment_id"];

        const userRes = await db.query(`SELECT * FROM "User_Favorites_Map" WHERE user_id=$1`, [userId]);

        if(userRes?.rows?.length>0) {
            const sqlQuery = `UPDATE "User_Favorites_Map" SET "to_the_order_ids" = 
                                CASE
                                    WHEN "to_the_order_ids" IS NULL OR array_length("to_the_order_ids", 1) = 0 
                                    THEN $1::BIGINT[]
                                    ELSE "to_the_order_ids" || $1::BIGINT[]
                                END
                              WHERE user_id = $2`;
            
            db.query(sqlQuery, [[shipmentId], userId]);
        } else {
            const sqlQuery = `INSERT INTO "User_Favorites_Map" (user_id, to_the_order_ids) VALUES($1, $2::BIGINT[])`;
            db.query(sqlQuery, [userId, [shipmentId]]);            
        }
    } catch (error) { console.error(error); }
});

// backgroundTaskEvent.on("add-old-favorite-shipment-temp", async(db, data) => {
//     const { userId, timestamp, dataObject } = data;
    
//     for(let i=0; i<dataObject?.length; i++) {
//         const { jsonShipment, recordId, country, direction } = dataObject[i];
//         const insertionQuery = `INSERT INTO "User_Favorite_Shipments" (favorite_shipment, user_id, transaction_time, record_id, direction, country) VALUES($1, $2, $3, $4, $5, $6) RETURNING shipment_id`;        
//         const response = await db.query(insertionQuery, [jsonShipment, userId, timestamp, recordId, direction, country]);
//         const shipmentId = response.rows[0]["shipment_id"];

//         const userRes = await db.query(`SELECT * FROM "User_Favorites_Map" WHERE user_id=$1`, [userId]);
        
//         if(userRes?.rows?.length>0) {
//             const sqlQuery = `UPDATE "User_Favorites_Map" SET "shipment_ids" = 
//                                 CASE
//                                     WHEN "shipment_ids" IS NULL OR array_length("shipment_ids", 1) = 0 
//                                     THEN $1::BIGINT[]
//                                     ELSE "shipment_ids" || $1::BIGINT[]
//                                 END
//                               WHERE user_id = $2`;
//             await db.query(sqlQuery, [[shipmentId], userId]);
//         } else {
//             const sqlQuery = `INSERT INTO "User_Favorites_Map" (user_id, shipment_ids) VALUES($1, $2::BIGINT[])`;
//             await db.query(sqlQuery, [userId, [shipmentId]]);
//         }
//     }
// });

backgroundTaskEvent.on("add-new-favorite-shipment", async(db, data) => {
    try {
        const { jsonShipment, userId, timestamp, recordId, direction, country } = data;

        const insertionQuery = `INSERT INTO "User_Favorite_Shipments" (favorite_shipment, user_id, transaction_time, record_id, direction, country) VALUES($1, $2, $3, $4, $5, $6) RETURNING shipment_id`;        
        const response = await db.query(insertionQuery, [jsonShipment, userId, timestamp, recordId, direction.toLowerCase(), country.toLowerCase()]);
        const shipmentId = response.rows[0]["shipment_id"];

        const userRes = await db.query(`SELECT * FROM "User_Favorites_Map" WHERE user_id=$1`, [userId]);
        
        if(userRes?.rows?.length>0) {
            const sqlQuery = `UPDATE "User_Favorites_Map" SET "shipment_ids" = 
                                CASE
                                    WHEN "shipment_ids" IS NULL OR array_length("shipment_ids", 1) = 0 
                                    THEN $1::BIGINT[]
                                    ELSE "shipment_ids" || $1::BIGINT[]
                                END
                              WHERE user_id = $2`;
            db.query(sqlQuery, [[shipmentId], userId]);
        } else {
            const sqlQuery = `INSERT INTO "User_Favorites_Map" (user_id, shipment_ids) VALUES($1, $2::BIGINT[])`;
            db.query(sqlQuery, [userId, [shipmentId]]);
        }
    } catch (error) { console.error(error); }
});

backgroundTaskEvent.on("delete-favorite-shipment", async(db, data) => {
    const { userId, favoriteId } = data; //isItToTheOrder=false

    // const colName = isItToTheOrder ? "to_the_order_ids": "shipment_ids";
    const fetchExistingRecords = `SELECT "shipment_ids" FROM "User_Favorites_Map" WHERE user_id=$1 AND active=true`;
    
    const response = await db.query(fetchExistingRecords, [userId]);
    
    if(response?.rows?.length>0) {
        const shipmentIds = response?.rows[0]["shipment_ids"];
        shipmentIds.splice(shipmentIds.indexOf(favoriteId), 1);
        
        const updateShipmentIds = `UPDATE "User_Favorites_Map" SET "shipment_ids"=$1 WHERE user_id=$2 AND active=true`;
        
        db.query(updateShipmentIds, [shipmentIds, userId]);
    }
});


backgroundTaskEvent.on("update-user-point", (db, data) => {
    try {
        const { userPointType, userId } = data;
        const sqlQuery = `update "userplantransaction" set "${userPointType}"="${userPointType}"-1 where "UserId"=$1`;
        db.query(sqlQuery, [userId]);
    } catch (error) { console.error(error); }
});


module.exports = {
    backgroundTaskEvent
}

