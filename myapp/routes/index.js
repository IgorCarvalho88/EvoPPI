var express = require('express');
var router = express.Router();
var interactome = require('./../models/interactome.js');
var dictionary = require('./../models/dictionary.js');
var fasta = require('./../models/fasta.js');
var path = require('path');
var readline = require('readline');
var fs = require('fs');

var query = path.join(__dirname, '..', 'database/fasta/query.txt');



/* GET home page. */
router.get('/', function(req, res, next) {
	var species;
	species = dictionary.getAllSpecies();
	//console.log(species);
	//dictionary.readFile('Bos taurus.txt');

	res.render('index',{
			title: 'Express',
			species:species

		});

});

/* GET different species page */
router.get('/differentSpecies', function(req, res, next) {
	var species;
	species = dictionary.getAllSpecies();

	res.render('teste',{
			title: 'Express',
			species:species

		});

});

/*Route called by ajax function for different species page only*/
/*jsdefault --> jquery function  --> #fasta*/
router.get('/differentSpecies/:fileName', function(req, res, next){

		
	var gene = req.query.gene;
	
	var firstInteractome = interactome.readFile(req.query.interactome1);
	var secondInteractome = interactome.readFile(req.query.interactome2);

	var interactions1 = interactome.getGeneInteractions(gene, firstInteractome.fileName);
	var interactions2 = interactome.getGeneInteractions(gene, secondInteractome.fileName);

	//var fasta;
	var especieName = req.params.fileName.replace(" ", "_");
	/*This will create query.txt file with gene and gene´s interactions from species1*/
	genes = fasta.createArrayGenes(interactions1);
	filePath = fasta.createFilePath(especieName);


	var cb =  function(arrayMatrix){
			res.send(arrayMatrix);
	}

	fasta.createQuery(filePath, genes, interactions1, secondInteractome.fileName, cb);

});

/*Route called by ajax function for different species page only*/
/*jsdefault --> jquery function  --> myfunction2*/
router.get('/createDbTemp/:fileName', function(req, res, next){
	var especieName = req.params.fileName.replace(" ", "_");
	/*Runs Command creating the DB blast Referring to the second species */
	fasta.execCMD(especieName);
	res.send("database created");
	console.log("entrei");

});


/*Routes called by ajax functions for species and different species page*/
router.get('/genes/:fileName', function(req, res, next){
	//res.send(req.params.fileName);
	var genes;
	genes = dictionary.readFile(req.params.fileName);
	res.send(genes.fileName);
	//res.send(genes);

});


router.get('/interactome/:fileName', function(req, res, next){
	var interactomes;
	var especieName = req.params.fileName.replace(" ", "_");
	interactomes = interactome.getAllInteractomes(especieName);
	res.send(interactomes);
});

/*Route called by ajax function for same species page only*/
/*jsdefault --> jquery function  --> #sameSpecies*/
router.get('/interactome/', function(req, res, next){
	var firstInteractome;
	var secondInteractome;

	var interactions1;
	var interactions2;

	var finalResult;

	var gene = req.query.gene;
	
	firstInteractome = interactome.readFile(req.query.interactome1);
	secondInteractome = interactome.readFile(req.query.interactome2);

	interactions1 = interactome.getGeneInteractions(gene, firstInteractome.fileName);
	interactions2 = interactome.getGeneInteractions(gene, secondInteractome.fileName);

	
	finalResult = interactome.compare(interactions1, interactions2);
	res.send(finalResult);


	/*res.render('teste',{
			title: 'Express',
			finalResult:finalResult

		});*/
});



module.exports = router;
