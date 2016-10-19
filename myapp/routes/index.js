var express = require('express');
var router = express.Router();
var interactome = require('./../models/interactome.js');
var dictionary = require('./../models/dictionary.js');



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

/*router.get('/interactome/:interactome1/:interactome2/:geneName', function(req, res, next){
	var firstInteracome;
	var secondInteracome;
	//var especieName = req.params.fileName.replace(" ", "_");
	firstInteracome = interactome.readFile(req.params.interactome1);
	secondInteracome = interactome.readFile(req.params.interactome2);
	res.send(interactomes);
});*/

router.get('/interactome/', function(req, res, next){
	var firstInteractome;
	var secondInteractome;

	var interactions1;
	var interactions2;

	var finalResult;

	var gene = req.query.gene;
	//var especieName = req.params.fileName.replace(" ", "_");
	firstInteractome = interactome.readFile(req.query.interactome1);
	secondInteractome = interactome.readFile(req.query.interactome2);

	interactions1 = interactome.getGeneInteractions(gene, firstInteractome.fileName);
	interactions2 = interactome.getGeneInteractions(gene, secondInteractome.fileName);

	//interactions1 =  interactome.addLabel1(interactions1);
	//interactions2 =  interactome.addLabel2(interactions2);

	//console.log(interactions1);
	//console.log(interactions2);

	finalResult = interactome.compare(interactions1, interactions2);

	//console.log(finalResult);
	//res.send(interactomes);


	res.render('teste',{
			title: 'Express',
			finalResult:finalResult

		});
});



module.exports = router;
