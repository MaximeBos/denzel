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
    populate: async () => {
        const movies = await populate(DENZEL_IMDB_ID);
        const insertion = await collection.insertMany(movies);
        return {
            total: insertion.movie.n
        };
    },

    random: async () => {
        let options = {
            "limit": 1,
            "skip": Math.floor(Math.random() * await collection.countDocuments({"metascore": {$gte: 70}}))
        }
        let query = {
            "metascore": { $gte: 70}
        };
        return await collection.findOne(query, options);
    },

    getMovie: async (args) => {
        return await collection.findOne({"id": args.id})
    },

    getMovies: async (args) => {
        let options = {"limit": args.limit, "sort": [ ['metascore', 'desc']]
        };
        return await collection.find({"metascore": {$gte: args.metascore}}, options).toArray();
    },

    updateMovie: async (args) => {
        const post =  await collection.updateMany({"id": args.id}, {$set: {review: args.review, date: args.date}}, {"upsert": true});
        return await collection.findOne({"id": args.id});
    }
};

async function populate(actor) {
    try {
        console.log(📽️ fetching filmography of ${actor}...);
        return await imdb(actor);
    } catch (e) {
        console.error(e);
    }
}

let app = express();
app.use('/graphQL', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiQL: true
}));


