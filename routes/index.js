var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  request('http://www.inf.upol.cz/studium/bakalarske-prace', function(error, response, body) {
    $ = cheerio.load(body);
    // find all teachers
    teachers = $('div.col-md-9').children('div');
    // remove all descriptions which are taken
    teachers.each(function (index, teacher) {
      $(teacher).children('span').each(function (index, subject) {
        $subject = $(subject);
        $subject.prev('strong').remove();
        $subject.next().remove();
        $subject.remove()
      })
    });

    // second iteration, grab all `strongs` (i.e. not taken descriptions) and additional data
    result = [];
    teachers.each(function (index, teacher) {
      result[index] = [];
      $(teacher).children('strong').each(function (no, subject) {
        $subject = $(subject);
        result[index].push($subject.prev('h3'));
        result[index].push($subject);
        result[index].push($subject.next('p'));
      })
    });

    // last iteration, update teachers data
    teachers.each(function (index, teacher) {
      $(teacher).html(result[index].join(''))
    });

    res.render('index', { title: 'Express' , body: teachers});
  })
});

module.exports = router;
