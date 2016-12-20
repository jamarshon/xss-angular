var fs 	= require('fs');
var Q 	= require('q');

var DBUtil = {};

DBUtil.DB_PATH 					= './db/db.json';
DBUtil.DEFAULT_DB_PATH 	= './db/db-default.json';

DBUtil._readDB = function(dataBasePath) {
	var deferred = Q.defer();
	fs.readFile(dataBasePath, 'utf8', function(err, data){
		if(err){
			deferred.reject(err);
		} else {
			var obj = JSON.parse(data);
			deferred.resolve(obj);
		}
	});
	return deferred.promise;
};

DBUtil._writeDB = function(modifiedObj, dataBasePath) {
	var deferred = Q.defer();
	var objToSave = JSON.stringify(modifiedObj, null, 4);
	fs.writeFile(dataBasePath, objToSave, function(err){
	  if (err) {
	  	deferred.reject(err);
	  } else {
	  	deferred.resolve();
	  }
	});
	return deferred.promise;
};

DBUtil._dbOperation = function(dbOpFn, saveModifiedObj, successFn, errorFn) {
	DBUtil._readDB(DBUtil.DB_PATH).then(function(obj) {
		dbOpFn(obj);
		if(saveModifiedObj) {
			DBUtil._writeDB(obj, DBUtil.DB_PATH).then(function(){
				successFn(obj);
			}, function(err){
				errorFn(err);
			});
		} else {
			successFn(obj);
		}
	}, function(err){
		errorFn(err);
	});
};


DBUtil.getDBObjectOrDefault = function(sessionID) {
	var deferred = Q.defer();
	DBUtil._dbOperation(
		function(obj) {
			// if the object db does not exist, use the default one and save it
			if(typeof obj[sessionID] === 'undefined') {
				obj[sessionID] = DBUtil.DEFAULT_DB_OBJ;
			}
		}, 
		true, 
		function(obj){
			deferred.resolve(obj);
		}, 
		function(err){
			deferred.reject(err);
		});

	return deferred.promise;
};

DBUtil.modifyDB = function(sessionID, key, value) {
	var deferred = Q.defer();
	DBUtil._dbOperation(
		function(obj) {
			obj[sessionID][key] = value;
		}, 
		true, 
		function(obj){
			deferred.resolve();
		}, 
		function(err){
			deferred.reject(err);
		});

	return deferred.promise;
};

DBUtil.cleanDB = function(sessionID) {
	var deferred = Q.defer();
	DBUtil._dbOperation(
		function(obj) {
			delete obj[sessionID];
		}, 
		true, 
		function(obj){
			deferred.resolve();
		}, 
		function(err){
			deferred.reject(err);
		});

	return deferred.promise;
};

DBUtil.cleanDBAll = function() {
	var deferred = Q.defer();
	DBUtil._dbOperation(
		function(obj) {
			for(var sessionID in obj) {
				delete obj[sessionID];
			}
		}, 
		true, 
		function(obj){
			deferred.resolve();
		}, 
		function(err){
			deferred.reject(err);
		});

	return deferred.promise;
};

DBUtil._readDB(DBUtil.DEFAULT_DB_PATH).then(function(obj){
	DBUtil.DEFAULT_DB_OBJ = obj.db;
	console.log('Instantiated');
}, function(){
	DBUtil.DEFAULT_DB_OBJ = {};
});

module.exports = DBUtil;