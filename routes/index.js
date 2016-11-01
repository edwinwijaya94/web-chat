var express = require('express');
var router = express.Router();

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/* GET home page. */
router.get('/', function(req, res, next) {
	if (!req.query.id){
		res.redirect('/login');	
	}else{
		res.render('index', { title: 'Express'});
	}
  
});
module.exports = router;
