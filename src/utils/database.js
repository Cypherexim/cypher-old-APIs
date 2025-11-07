const Pool = require('pg').Pool;

// Development - Cypher
// const pool = new Pool({
//     user:'cypher',
//     host: '18.214.151.123',
//     database:'cypher',
//     password: 'cypher123',
//     port:5432
// })

// Production - Exim
// const pool = new Pool({
//     user:'apiuser',
//     host: '18.214.151.123',
//     database:'exim_portal_db',
//     password: 'api123',
//     port:5432,
//     // keepAlive: true,
//     // keepAliveInitialDelayMillis: 10000,
//     idleTimeoutMillis: 0,
//     connectionTimeoutMillis: 0
// })

const pool = new Pool({
    user:'apiuser',
    host: '18.214.151.123',
    database:'exim_portal_db',
    password: 'api123',
    port:5432,

    min: 2,
    max: 50,
    idleTimeoutMillis: 1000*30, 
    connectionTimeoutMillis: 1000*15,
    statement_timeout: 1000*90,
    query_timeout: 1000*90


    // min: 1,
    // max: 100,
    // createTimeoutMillis: 8000,
    // acquireTimeoutMillis: 8000,
    // idleTimeoutMillis: 8000,
    // reapIntervalMillis: 1000,
    // createRetryIntervalMillis: 100,
    // acquireConnectionTimeout: 10000
});

pool.on("error", (err) => {
    console.info(err);
    if (err.message.includes('in recovery mode')) {
        console.error('Database is in recovery mode. Retrying in 5 seconds...');
    } else {
        console.error('DB Error:', err);
    }
});

pool.connect().then(res => {
    console.log("DB is connected!");
}).catch(err => console.log(err));


module.exports = pool;

