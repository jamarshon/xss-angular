var express = require('express');
var fs 		= require('fs');
var Q 		= require('q');

var DB_PATH 		= './db/db.json';
var DEFAULT_DB_PATH = './db/db-default.json';
var router 			= express.Router();

var databaseOperationFn = function(dataBasePath, dbOperationCallback, res) {
	fs.readFile(dataBasePath, 'utf8', function(err, data){
		if(err){
			res.status(404).send(err);
		} else {
			var obj = JSON.parse(data);
			dbOperationCallback(obj).then(function(modifiedObj){
				if(modifiedObj) {
					var objToSave = JSON.stringify(modifiedObj, null, 4);
					fs.writeFile(dataBasePath, objToSave, function(err){
					  if (err) {
					  	res.status(404).send(err);
					  } else {
					  	res.sendStatus(200);
					  }
					});
				}
			});
		}
	});
};

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/templates/:templateName', function(req, res, next) {
	res.render('templates/' + req.params.templateName);
});

router.get('/serverTemplates/:templateName', function(req, res, next) {
	databaseOperationFn(DB_PATH, function(obj){
		var deferred = Q.defer();
		res.render('serverTemplates/' + req.params.templateName, obj.db);
		deferred.resolve(null);
		return deferred.promise;
	}, res);
});

router.get('/getDB', function(req, res, next) {
	databaseOperationFn(DB_PATH, function(obj){
		var deferred = Q.defer();
		res.send(obj.db);
		deferred.resolve(null);
		return deferred.promise;
	}, res);
});

router.post('/modifyDB', function(req, res, next) {
	databaseOperationFn(DB_PATH, function(obj){
		var deferred = Q.defer();
		obj.db[req.body.key] = req.body.value;
		deferred.resolve(obj);
		return deferred.promise;
	}, res);
});

router.post('/cleanDB', function(req, res, next) {
	databaseOperationFn(DB_PATH, function(obj){
		var deferred = Q.defer();

		databaseOperationFn(DEFAULT_DB_PATH, function(defaultObj){
			var defaultDBDeferred = Q.defer();
			deferred.resolve(defaultObj);
			defaultDBDeferred.resolve(null);
			return defaultDBDeferred.promise;
		}, res);

		return deferred.promise;
	}, res);
});

module.exports = router;
