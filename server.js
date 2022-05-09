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

// server.listen(port, () => {console.log(`Listenig to port ${port} rn, press Ctrl+C (^C) to terminate`);})

function Reviews (id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}
//-------------------T13------------------
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
let url = "postgres://mjj:0000@localhost:5432/movielibrary2";
server.use(express.json());
const { Client } = require('pg');
const client = new Client(url);
//---------------------------------------

/*Indidvidual routes*/
server.get("/", getrequest);
server.get("/favourites", getfavourites);
server.get("/trending", trending);                   //T12
server.get("/search", search);                       //T12
server.get("/topmovies", topmovies);                 //T12
server.get("/discover", discover);                   //T12
server.post('/addMovie', postHandler);               //T13  http://localhost:3000/addMovie
server.get('/getMovies', getHandler);                //T13  http://localhost:3000/getMovies
server.put('/update/:id', updatehandeler);           //T14  http://localhost:3000/update/:id
server.delete('/delete/:id', deletehandeler);        //T14  http://localhost:3000/delete/:id
server.get('/getMovie/:id', getTitleByID);           //T14  http://localhost:3000/getMovie/:id
server.use(handleError);                             //T13

//----------Additional-----------
// server.get("/latest", latest); //T12
// server.get("/rated", rated); //T12
// server.get("/movielist", movielist); //T12
server.get("*", error404);

//----------Functions------------
//-------------T11---------------
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
    return res.status(404).send("Oops! Sorry, the page you've requested could not be found");
}

/*Server Error 500*/
function servererror500 (req,res){                      
    return res.status(500).send("Server Error 500! Sorry, something went wrong!");
}
//-------------T12---------------
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
//-------------T13---------------
function postHandler(req, res) {
    console.log(req.body);

    let {title,runtime,summary} = req.body; //destructuring:{let title = req.body.title;
                                                            //let time = req.body.time;    
                                                            //let summary = req.body.summary;}

   let sql = `INSERT INTO movrev(title,runtime,summary) VALUES($1, $2, $3) RETURNING *;`; 
   let values = [title, runtime, summary];
   
    client.query(sql, values).then((result) => {
        console.log(result);
        // return res.status(201).json(result.rows);

    }).catch((err) => {
        handleError(err, req, res);
    })

}
//http:localhost:3000/getData
function getHandler(req, res) {
    let sql = `SELECT * FROM movrev;`;
    client.query(sql).then((result)=>{
        console.log(result);
        res.json(result.rows);
    }).catch((err) => {
         handleError(err, req, res);
    })
}

function handleError(error,req,res, next){
    res.status(500).send(error)
}

//-------------T14---------------
function updatehandeler (req,res)           //update movie by id
{
    const id = req.params.id;
    const movie = req.body; 
    const sql = `UPDATE movrev SET title=$1, runtime=$2, summary=$3 WHERE id = ${id} RETURNING *;`;
    let values = [movie.title, movie.runtime, movie.summary];

    client.query (sql,values).then(data=>{res.status(200).json(data.rows)
    }).catch(error=>{
        console.log(error);
        handleError(error,req,res)})
}

function deletehandeler (req,res)        //Delete movie by id
{
    const id = req.params.id;
    const sql = `DELETE FROM movrev WHERE id = ${id};`; 
    client.query(sql).then(()=>{
        res.status(200).json("Movie deleted successfully");
    }).catch(error=>{handleError(error,req,res)})
}

function getTitleByID (req,res)        //get movie by id
{
    const id = req.params.id;
    const sql = `SELECT * FROM movrev WHERE id = ${id}; RETURNING *`;
    const values = [id]; 
    client.query(sql,values).then(data=>{
        res.status(200).json(data.rows)
        }).catch(error=>{handleError(error,req,res)})

}


//--------------------------------------------------------------------------------------------------------//
client.connect().then(() => {
    server.listen(port, () => {console.log(`Listenig to port ${port} rn, press Ctrl+C (^C) to terminate`);})
})
