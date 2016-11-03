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

/*exports.execCMD = function(especiesName){
	var fullName = especiesName + "_fasta";
	var blastPathIn = path.join(__dirname, '..', 'ncbi-blast-2.5.0+/bin/', fullName);

	child_process.execFile(blastPath, ['-in', blastPathIn, '-dbtype', 'prot', '-out', blastPathOut], function(error, stdout, stderr){
		console.log(stdout);
		console.log(stderr);
	});

};*/

exports.execCMD = function(especiesName){
	var fullName = especiesName + "_fasta";
	var blastPathIn = path.join(__dirname, '..', 'ncbi-blast-2.5.0+/bin/', fullName);

	//child_process.execFileSync(blastPath, ['-in', blastPathIn, '-dbtype', 'prot', '-out', blastPathOut]);
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


exports.createFilePath = function(Name){
	var fileName;
	var files = [];
	var genes = [];
	//var filePath2 = path.join(__dirname, '..', 'database/fasta', "query.txt");

	//genes = createArrayGenes(interactions);
	
	files = fs.readdirSync(fileFolderPath);

	files.forEach(function(file){
		if(file.startsWith(Name))
		{
			fileName = file;
		}

		 });

	var filePath = path.join(__dirname, '..', 'database/fasta', fileName);
	
	//results = createQuery(filePath, genes);
	//console.log(results);

	return filePath;

}



exports.createQuery = function(filePath, genes, interactions1, interactome2, cb){

	var lineReader = readline.createInterface({
		input: fs.createReadStream(filePath)
	});

	var wstream = fs.createWriteStream(query);

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

	wstream.on('finish', function () {
	  console.log('file has been written');

	  function callback(arrayMatrix){
	  	// create an associative array of genes
	  	var array = interaction1TmpResult (interactions1, arrayMatrix);
	  	var interactions2 = createInteractions2(array, interactome2);
	  	// create array with [mainGene, sinonimo, interage, sinonimo, codigo ]
	  	// missing the code 1, this menas that exists an interaction that doesn't exist in spcecies1
	  	var halfArray = compareInt2(interactome2, array);
	  	// complete the array with code1
	  	var finalArray = compareFinal(interactions2, halfArray);
	  	console.log(finalArray);
	  	//interaction1TmpResult (interactions2, arrayMatrix);
	  	cb(arrayMatrix);
	  } 
	  execCMD2(callback);
	});

};

function createInteractions2(array, interactome2)
{
	var interactions2 = [];
	for (var i = 1; i < array[0].length; i++) {
		for (var j = 0; j < interactome2.length; j++) {
			if(array[0][i] == interactome2[j][0] || array[0][i] == interactome2[j][1])
			{
				interactions2.push(interactome2[j]);
			}
		}
	}
	console.log(interactions2);
	return interactions2;
}


function compareFinal(interactions2, halfArray)
{
	found = false;

	for (var i = 0; i < interactions2.length; i++) {
		array = [];
		for (var j = 0; j < halfArray.length; j++) {
			if((interactions2[i][0] == halfArray[j][1] && interactions2[i][1] == halfArray[j][3]) || 
				interactions2[i][1] == halfArray[j][1] && interactions2[i][0] == halfArray[j][3])
			{
				found = true;
				break;
			}

		}
		if(found == false)
		{
			array.push(interactions2[i][0]);
			array.push(interactions2[i][1]);
			array.push("1");
			halfArray.push(array);

		}
		
		found = false;
	}

	return halfArray;
}

function compareInt2(interactome2, array)
{
	// TODO verificar para genes que não existem na base de dados devolvida pelo blast
	
	var bigArray = [];
	found = false;
	console.log(array);
	console.log(interactome2);
	for (var i = 1; i < array[0].length; i++) {
		for (var j = 1; j < array.length; j++) {
			for (var k = 1; k < array[j].length; k++) {
				var smallArray = [];
				for (var m = 0; m < interactome2.length; m++) {
					if((array[0][i] == interactome2[m][0] && array[j][k] == interactome2[m][1]) ||
						(array[0][i] == interactome2[m][1] && array[j][k] == interactome2[m][0]))
						{
							found = true;
							smallArray.push(array[0][0]);
							smallArray.push(array[0][i]);
							smallArray.push(array[j][0]);
							smallArray.push(array[j][k]);
							smallArray.push("2");
							
						}
				}
				if(found == false)
					{
						smallArray.push(array[0][0]);
						smallArray.push(array[0][i]);
						smallArray.push(array[j][0]);
						smallArray.push(array[j][k]);
						smallArray.push("0");

					}
					bigArray.push(smallArray);
					found = false;
			}
		}
	}

	console.log(bigArray);

	return bigArray;

}

function execCMD2 (callback){

	// passar para sincrono

	
	child = child_process.execFileSync(blast, ['-query', query, '-db', blastPathOut, '-evalue', '0.05', '-max_target_seqs', '1', '-outfmt',  '6', '-out', blastPathResult]);
	
	var results = [];
	var lineReader = readline.createInterface({
		input: fs.createReadStream(blastPathResult)
		});

		lineReader.on('line', function (line) {
			var lineStr = line.split("\t");
			results.push(lineStr);
	});
		
		lineReader.on('close', () => {
  			 callback(results);
		});
		
};


function interaction1TmpResult (interactions1, tmpResult){
	
	var auxiliarArray = [];

	for (var i = 0; i < interactions1.length; i++) {
		if(i==0)
		{
			var mainGene = [];
			mainGene.push(interactions1[0][0]);
			for (var j = 0; j < tmpResult.length; j++) {
				if(interactions1[0][0] == tmpResult[j][0]){
					mainGene.push(tmpResult[j][1]);
					
				}
			}
			auxiliarArray.push(mainGene);
		}

		var interactGene = [];
		interactGene.push(interactions1[i][1]);
		for (var j = 0; j < tmpResult.length; j++) {
			if(interactions1[i][1] == tmpResult[j][0]){
				//console.log(tmpResult[j][1]);
				interactGene.push(tmpResult[j][1]);
			}
		}
		auxiliarArray.push(interactGene);
	}
 	
	return auxiliarArray;
};


/*if(interactome1[i][j] == tmpResult[j][0])
			{
				
				interactome1[i].splice(1, 0, tmpResult[j][1]);
				if(i = 1)
				{
					interactome1[i].splice(3, 0, tmpResult[j][1]);
				}
			}*/

function createAuxiliarArray(interactome1)
{
	var auxiliarArray = [];
	for (var i = 0; i < interactome1.length; i++) {
		auxiliarArray.push(interactome1[i]);
	}

	return auxiliarArray;
}

function auxiliar(element, tmpResult)
{

	for (var i = 0; i < tmpResult.length; i++) {
		 if(element == tmpResult[i][0])
		 {
		 	return true;
		 }
	}
	return false;
}

/*utility functions*/


exports.createArrayGenes = function(interactions){
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


