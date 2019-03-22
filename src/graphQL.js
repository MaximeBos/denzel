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


type Mutation {
    addMovies(author_id: ID, first_name: String, last_name: String): Author
    updateMovie(author_id: ID!, first_name: String, last_name: String): Author
    deleteAuthor(author_id: ID!): Author
}


const queries = require('../queries/queries');

const schema = makeExecutableSchema(
        resolvers: {
        // Prototypes des fonctions GET
    //nom requete : ce quelle retourne
        Query: {
            population: (_, filters) => queries.getPupulation(filters),
            random_must_watch: (_, filters) => queries.getMovie(filters),
            movies: (_, filters) => queries.getMovie(filters),
        },
        // Prototypes des fonctions POST, UPDATE, DELETE
        Mutation: {
            addMovie: async (_, movie) => {
                const newMovie = await queries.addMovie(movie);

                return newMovie[0];
            },
            updateMovie: async (_, movie) => {
                const newMovie = await queries.updateMovie(movie);

                return newMovie[0];
            },
            deleteMovie: async (_, movieId) => {
                const deletedMovie = await queries.deleteMovie(movieId);

                return deletedMovie[0];
            },
        },
        // Fonctions de récupération des données d'un auteur à partir d'un commentaire
        Movie: {
            author: async (comment) => {
                const author = await queries.getAuthors({ author_id: comment.author });
                return author[0];
            },
        },
        // Fonctions de récupération des données de commentaires à partir d'un film
        Movie: {
            comments: async (movie) => {
                const arr = await Promise.all(movie.comments.map(async (comment) => {
                    const coms = await queries.getComments({ comment_id: comment });
                    return coms[0];
                }));
                return arr;
            },
        },
    },
});

module.exports = schema;

















