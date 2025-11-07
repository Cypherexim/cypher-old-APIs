const { requestCounter, requestDuration, openConnections } = require("../metrics/prometheus");

let openConnection = 0;

exports.prometheusMiddleware = (req, res, next) => {
    const end = requestDuration.startTimer();

    openConnection++;
    openConnections.set({ instance: req.hostname }, openConnection); // Update gauge

    res.on("finish", () => {
        const labels = {
            method: req.method,
            route: req.route?.path || req.path,
            status: res.statusCode
        };


        openConnection--;
        openConnections.set({ instance: req.hostname }, openConnection); // Update gauge again

        requestCounter.labels(labels.method, labels.route, labels.status).inc();
        end(labels);
    });

    next();
}


