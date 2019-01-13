const http = require('http');
const express = require('express');
const views = require('./routes/views');

const app = express();

app.use('/static', express.static('public'));

app.use('/', views);

app.use(function (req, res, next) {
	const err = new Error("Not found");
	err.status = 404;
	next(err);
});

app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.send({
		status: err.status,
		message: err.message,
	});
});

const port = 3000;

const server = http.Server(app);
server.listen(port, function () {
    console.log('server listening on port ' + port);
});