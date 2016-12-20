var DBUtil 			= require('../utils/db-util');
var express 		= require('express');
var Q 					= require('q');

var router 			= express.Router();

/* Generic functions to handle similar routes */
var getDBAbstractFn = function(req, res, transformationFn) {
	DBUtil.getDBObjectOrDefault(req.sessionID).then(function(obj){
		res.send(transformationFn(obj));
	}, function(err){
		res.status(404).send(err);
	});
};

/* GET home page. */
router.get('/', function(req, res, next) {
	var isProduction = process.env.NODE_ENV === 'production';
	var indexPath = isProduction ? 'production-index.min.ejs' : 'index.ejs';
	res.render(indexPath);
});

router.get('/templates/:templateName', function(req, res, next) {
	res.render('templates/' + req.params.templateName);
});

router.get('/server-templates/:templateName', function(req, res, next) {
	DBUtil.getDBObjectOrDefault(req.sessionID).then(function(obj){
		res.render('server-templates/' + req.params.templateName, obj[req.sessionID]);
	}, function(err){
		res.status(404).send(err);
	});
});

router.get('/getDB', function(req, res, next) {
	getDBAbstractFn(req, res, function(obj){ return obj[req.sessionID]; });
});

router.get('/getDBAll', function(req, res, next) {
	getDBAbstractFn(req, res, function(obj){ return obj; });
});

router.post('/modifyDB', function(req, res, next) {
	DBUtil.modifyDB(req.sessionID, req.body.key, req.body.value).then(function(){
		res.sendStatus(200);
	}, function(err) {
		res.status(404).send(err);
	});
});

router.post('/cleanDB', function(req, res, next) {
	DBUtil.cleanDB(req.sessionID).then(function(){
		res.sendStatus(200);
	}, function(err) {
		res.status(404).send(err);
	});
});

router.get('/cleanDBAll', function(req, res, next) {
	DBUtil.cleanDBAll().then(function(){
		res.sendStatus(200);
	}, function(err) {
		res.status(404).send(err);
	});
});

module.exports = router;
