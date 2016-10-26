var fs = require('fs');
var path = require('path');
var readline = require('readline');
var child_process = require('child_process');

// creating path to database
var fileFolderPath = path.join(__dirname, '..', 'database/fasta');
var blastPath = path.join(__dirname, '..', 'ncbi-blast-2.5.0+/bin/makeblastdb.exe');

var blastPathOut = path.join(__dirname, '..', 'ncbi-blast-2.5.0+/bin/dbtemp1');
var blastPathResult = path.join(__dirname, '..', 'ncbi-blast-2.5.0+/bin/tempresult');
var blast = path.join(__dirname, '..', 'ncbi-blast-2.5.0+/bin/blastp.exe');
var query = path.join(__dirname, '..', 'database/fasta/query.txt');

exports.execCMD = function(especiesName){
	var fullName = especiesName + "_fasta";
	var blastPathIn = path.join(__dirname, '..', 'ncbi-blast-2.5.0+/bin/', fullName);

	child_process.execFile(blastPath, ['-in', blastPathIn, '-dbtype', 'prot', '-out', blastPathOut], function(error, stdout, stderr){
		console.log(stdout);
		console.log(stderr);
	});

};

//blastp.exe -query query.txt -db dbtemp -evalue 0.05 -max_target_seqs 20 -outfmt 6 -out tempresult

/*exports.execCMD2 = function(){
	console.log("entro");
	child_process.execFile(blast, ['-query', query, '-db', blastPathOut, '-evalue', '0.05', '-max_target_seqs', '20', '-outfmt',  '6', '-out', blastPathResult], function(error, stdout, stderr){
		console.log(stdout);
		console.log(stderr);
	});

};*/


exports.readFile = function(Name, interactions){
	var fileName;
	var files = [];
	var genes = [];
	var filePath2 = path.join(__dirname, '..', 'database/fasta', "query.txt");

	genes = createArrayGenes(interactions);
	
	files = fs.readdirSync(fileFolderPath);

	files.forEach(function(file){
		if(file.startsWith(Name))
		{
			fileName = file;
		}

		 });

	var filePath = path.join(__dirname, '..', 'database/fasta', fileName);
	

	var lineReader = readline.createInterface({
		input: fs.createReadStream(filePath)
	});

	var wstream = fs.createWriteStream(filePath2);

	wstream.on('finish', function () {
	  console.log('file has been written');
	  execCMD2();
	});

	var flag =  false;
	lineReader.on('line', function (line) {
		if(line.startsWith('>'))
		{
			flag = false;
			for (var i = 0; i < genes.length; i++) {
				if(genes[i] == line.substr(1, line.length -1)){
					flag = true;
				}
			}
		}
		if(flag)
		{
			wstream.write(line);
			wstream.write('\n');
		}
	});

	lineReader.on('close', () => {
  		 wstream.end();
		});
	

	return files;

}

function execCMD2(){
	child_process.execFile(blast, ['-query', query, '-db', blastPathOut, '-evalue', '0.05', '-max_target_seqs', '20', '-outfmt',  '6', '-out', blastPathResult], function(error, stdout, stderr){
		console.log(stdout);
		console.log(stderr);
	});
};

/*utility functions*/

function createArrayGenes(interactions){
	var genes = [];

	for (var i = 0; i < interactions.length; i++) {
		if (i == 0)
		{
			genes.push(interactions[i][0]);
		}
		genes.push(interactions[i][1]);
		
	}

	return genes;

}


function parseFile(data, fileName){
	var aux2;

	var dataInJson = {
			fileName:[]

		};

		var aux = data.split("\s");
		//console.log(aux);

}



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


