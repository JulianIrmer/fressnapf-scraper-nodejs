const express = require('express');
const mongojs = require('mongojs');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const port = 5000;
const data = [];

const app = express();
app.use(express.static('public'));
app.use(express.json());

function getData(){
  const url = 'https://www.fressnapf.de/c/hund/';
  let id = 0;

  fetch(url)
    .then(response => response.text())
    .then(body => {
      $ = cheerio.load(body);
      let subCategories = [];

      $('.link').each((i, cat) => {
        const $cat = $(cat);
        const subName = $cat.text();
        const subURL = $cat.attr('href');

        const subCategory = {
          name: subName,
          url: subURL
        }

        subCategories.push(subCategory);
      });

      $('.pco-group').each((i, item) => {
        const $item = $(item);
        const name = $item.find('.pco-group-link .p-header').text();
        const categoryURL = $item.find('.pco-group-link').attr('href');

        const category = {
          id: id,
          name: name,
          url: categoryURL,
          subCategories: subCategories
        };
        
        data.push(category);
        id++;
        console.log(category);
      });
      
    })
    .catch();
}


getData();

app.listen(port, (err) =>{
  if(err){
    console.log(err);
  }
  else{
    console.log('Server listening on port '+port);
  }
});