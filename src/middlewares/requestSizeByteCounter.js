const { httpRequestSizeBytes } = require("../metrics/prometheus");

exports.httpReqSizeByte = (req, res, next) => {
  let size = 0;

  req.on('data', chunk => {
    size += chunk.length;
  });

  req.on('end', () => {
    httpRequestSizeBytes.inc({ method: req.method, route: req.route?.path || req.path }, size);
  });

  next();
}
