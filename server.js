'use strict';

const express = require('express');
const server = express();
const port = 3000;
const moviesdetails = require('./Movie Reviews/data.json'); 
const cors = require('cors');
server.use(cors());

server.listen(port, () => {console.log(`Listenig to port ${port} rn, press Ctrl+C (^C) to terminate`);})

function Reviews (title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

/*Indidvidual routes*/
server.get("/", getrequest);
server.get("/favourites", getfavourites);
server.get("*", error404);
// server.get("/err500", servererror500)


/*Home*/
function getrequest(req, res) {
    let data = new Reviews (moviesdetails.title,  moviesdetails.poster_path, moviesdetails.overview);
    return res.status(200).json(data);
}

/*Favourites*/
function getfavourites(req, res) {
    return res.status(200).send("Welcome To The Favorite Page");
}
/*Error 404 (Not found)*/

function error404 (req,res){
    return res.status(404).send("Sorry! The page you've requested could not be found");
}

/*Server Error 500*/
function servererror500 (req,res){                      
    return res.status(500).send("Server Error 500! Sorry, something went wrong!");
}
