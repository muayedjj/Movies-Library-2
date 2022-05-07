'use strict';

const express = require('express');
const server = express();
const port = 3000;
const moviesdetails = require('./Movie Reviews/data.json'); 
const cors = require('cors');
server.use(cors());
const axios = require ('axios'); //T12
require(`dotenv`).config(); //T12
const APIK = process.env.APIkey //T12

server.listen(port, () => {console.log(`Listenig to port ${port} rn, press Ctrl+C (^C) to terminate`);})

function Reviews (id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

/*Indidvidual routes*/
server.get("/", getrequest);
server.get("/favourites", getfavourites);
server.get("/trending", trending); //T12
server.get("/search", search);
server.get("/topmovies", topmovies);
server.get("/discover", discover);
//----------Additional-----------
// server.get("/latest", latest);
// server.get("/rated", rated);
// server.get("/movielist", movielist);
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
//----------------------------------------------T12

function trending (req, res){
    let url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${APIK}`
    let profile = []
    axios.get(url).then(result => {
        console.log(result.data);
        result.data.results.map(item => {
            profile.push (new Reviews (item.id, item.title, item.release_date, item.poster_path, item.overview))
        })
        res.status(200).json(profile);
    }).catch(reqerror => {console.log(reqerror)});
}

function search (req, res){
    let movietitle = req.query.query;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${APIK}&language=en-US&query=${movietitle}&page=1&include_adult=false`;
    let searchprofile = [];
    axios.get(url).then(result => {
        console.log(result.data);
        result.data.results.map(item => {
            searchprofile.push (new Reviews (item.id, item.title, item.release_date, item.poster_path, item.overview))
        })
        res.status(200).json(searchprofile);
    }).catch(reqerror => {console.log(reqerror)});
}

function topmovies (req, res){
    // let movietitle = req.query.query;
    let url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${APIK}&language=en-US&page=1`;
    let top_rated = [];
    axios.get(url).then(result => {
        console.log(result.data);
        result.data.results.map(item => {
            top_rated.push (new Reviews (item.id, item.title, item.release_date, item.poster_path, item.overview))
        })
        res.status(200).json(top_rated);
    }).catch(reqerror => {console.log(reqerror)});
}

function discover (req, res){
    // let movietitle = req.query.query;
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${APIK}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`;
    let discover = [];
    axios.get(url).then(result => {
        console.log(result.data);
        result.data.results.map(item => {
            discover.push (new Reviews (item.id, item.title, item.release_date, item.poster_path, item.overview))
        })
        res.status(200).json(discover);
    }).catch(reqerror => {console.log(reqerror)});
}

/*----------Additional-----------
function latest (req, res){
    // let movietitle = req.query.query;
    let url = `https://api.themoviedb.org/3/movie/latest?api_key=${APIK}&language=en-US`;
    let latest = [];
    axios.get(url).then(result => {
        console.log(result.data);
        result.data.results.map(item => {
            latest.push (new Reviews (item.id, item.title, item.release_date, item.poster_path, item.overview))
        })
        res.status(200).json(latest);
    }).catch(reqerror => {console.log(reqerror)});
}

function rated (req, res){
    // let movietitle = req.query.query;
    let url = `https://api.themoviedb.org/3/guest_session/{guest_session_id}/rated/movies?api_key=${APIK}&language=en-US&sort_by=created_at.asc`;
    let rated = [];
    axios.get(url).then(result => {
        console.log(result.data);
        result.data.results.map(item => {
            rated.push (new Reviews (item.id, item.title, item.release_date, item.poster_path, item.overview))
        })
        res.status(200).json(rated);
    }).catch(reqerror => {console.log(reqerror)});
}

function movielist (req, res){
    // let movietitle = req.query.query;
    let url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${APIK}&language=en-US    `;
    let movielst = [];
    axios.get(url).then(result => {
        console.log(result.data);
        result.data.results.map(item => {
            movielst.push (new Reviews (item.id, item.title, item.release_date, item.poster_path, item.overview))
        })
        res.status(200).json(movielst);
    }).catch(reqerror => {console.log(reqerror)});
}
--------------Task 12 Additional, end.------------*/