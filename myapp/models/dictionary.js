//var express = require('express');
var fs = require('fs');
var path = require('path');

// creating path to database
var fileFolderPath = path.join(__dirname, '..', 'database/dictionary');

exports.getAllSpecies = function(){
	var files = [];
	finalFiles = [];
	files = fs.readdirSync(fileFolderPath);

	files.forEach(function(file){

		// In case that we hava a txt extension
		if(file.endsWith('txt'))
		{
			var name;
			name = file.substring(0, file.length-4);
			//console.log(name);
			finalFiles.push(name);
			// In case we have word ending with dictionary word
		}else{
			var name2;
			name2 = file.substring(0, file.length-11);
			//console.log(name2);
			finalFiles.push(name2);
		}
		 });
		
	return finalFiles;
};


exports.readFile = function(fileName){

	//TODO
	//Receive interactome as parameter, to show on client too
	var addExtension = fileName + ".txt";
	var data;
	var filePath = path.join(__dirname, '..', 'database/dictionary', addExtension);
	data = fs.readFileSync(filePath, 'utf8');

	var parsedFile = parseFile(data, fileName);
	return parsedFile;	

}

function parseFile(data, fileName){
	var aux2;

	var dataInJson = {
			fileName:[]

		};

	// removing whitspaces
		var aux = data.split("\r\n");

		aux.forEach(function(item){
			aux2 = item.split("\t");
			aux2.forEach(function(part,index,theArray){
				theArray[index] = part.trim();
			});
			//var gene = toObject(aux2);
			dataInJson.fileName.push(aux2);
		});
		// remove duplicate elements
		b = uniqBy(dataInJson.fileName, JSON.stringify)
		//console.log(b);
		dataInJson.fileName = b;
		
		return dataInJson;

}

/*function constructJson(jsonKey, jsonValue){
   var jsonObj = {"key1": jsonValue};
   jsonObj[jsonKey] = "2";
   return jsonObj;
}*/

function toObject(array){
	var gene = {};
	for (var i = 0; i < array.length; i++) { // from 1 to 10
    	gene["name" + i] = array[i];
	}
	return gene;
}

function uniqBy(a, key) {
    var seen = {};
    return a.filter(function(item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
}


