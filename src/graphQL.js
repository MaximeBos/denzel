const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const imdb = require('./imdb');
const DENZEL_IMDB_ID = 'nm0000243';

const CONNECTION_URL = "mongodb+srv://Maxime:Maxime@denzel-vvzyw.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "Denzel_movies";


let collection, database;


const port = 9292;
/////////////////////////////////
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query { 
    populate: String
    random: Movie
    getMovie(id: String): Movie
    getMovies(id: [String], limit: Int): [Movie]
  },
  type Movie {
    link: String
    id: String
    metascore: Int
    poster: String
    rating: Float
    synopsis: String
    title: String
    votes: Float
    year: Int
    date: String
    review: String
  },
  type Mutation{
    updateMovie(id: String, date: String, review: String): Movie
  }
`);


// The root provides a resolver function for each API endpoint
var root = {
    populate: async (source, args) => {
        const movies = await populate(DENZEL_IMDB_ID);
        const insertion = await collection.insertMany(movies);
        return {
            total: insertion.movie.n
        };
    },
};

