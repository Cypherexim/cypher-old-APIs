const express = require('express');
const routes = require('./src/routes/routes');
const cors = require('cors');

const app = express();

const { prometheusMiddleware } = require("./src/middlewares/prometheus");
const { reqResSizeSpeed } = require("./src/middlewares/requestResponseSpeed");
const { httpResSizeByte } = require("./src/middlewares/responseSizeByteCounter");
const { httpReqSizeByte } = require("./src/middlewares/requestSizeByteCounter");
const { register } = require("./src/metrics/prometheus");
const { antiXSSPolicy } = require("./src/middlewares/general");

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });
app.use(cors({
  origin: ["https://cypherexim.com", "https://app.cypherexim.com", "https://eximine.com", "http://localhost:4200"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-Access-Token', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true
}));

app.use(express.urlencoded({extended: true, limit: '10mb'}))
app.use(express.json({limit: '10mb'}));

app.use([
  antiXSSPolicy,
  prometheusMiddleware,
  reqResSizeSpeed,
  httpResSizeByte,
  httpReqSizeByte
]);

app.get("/", (req, res) => res.send("<h1>Hello Cypher</h1>"));
app.use('/api', routes);

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

app.listen(8080);
