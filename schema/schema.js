const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;
const _ = require("lodash");

const Book = require("../model/book");
const Author = require("../model/author");

//dummy data
/* var books = [
  { name: "The Alchemist", genre: "Drama", authorId: "1" },
  { name: "Shiva to shankara", genre: "Psychology", authorId: "2" },
  { name: "Song of ice and fire", genre: "High Fantasy", authorId: "3" },
  { name: "The Long Earth", genre: "Sci-Fi", authorId: "3" },
  { name: "The Hero Of Ages", genre: "Fantasy", authorId: "1" },
  { name: "The Colour of Magic", genre: "High Fantasy", authorId: "1" },
];
var authors = [
  { name: "Paulo Coelho", age: 73, id: "1" },
  { name: "Devdutt Pattanaik", age: 48, id: "2" },
  { name: "George RR Martin", age: 65, id: "3" },
]; */

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    authorId: { type: GraphQLID },
    author: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({ _id: parent.authorId });
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({ authorId: parent.id });
        /* return _.filter(books, { authorId: parent.id }); */
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //code to get data from db/other source
        /* return _.find(books, { authorId: args.authorId }); */
        return Book.findById(args.id);
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findById(args.id);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({});
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        return author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
        return book.save();
      },
    },
    deleteBook: {
      type: BookType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Book.findByIdAndDelete(args.id);
      },
    },
    updateBook:{
      type: BookType,
      args:{
        id: { type: new GraphQLNonNull(GraphQLID)},
        name: { type: new GraphQLNonNull(GraphQLString)},
        genre:{type: new GraphQLNonNull(GraphQLString)},
        authorId:{type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent,args){
      return  Book.findByIdAndUpdate(args.id,{
          name:args.name,
          genre:args.genre,
          authorId:args.authorId
        })
      }
    }
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
