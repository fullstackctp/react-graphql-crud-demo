import { gql } from "apollo-boost";

const getBooksQuery = gql`
  {
    books {
      id
      name
      genre
    }
  }
`;

const getAuthorsQuery = gql`
  {
    authors {
      name
      id
    }
  }
`;
const addBookMutation = gql`
  mutation AddBook($name: String!, $genre: String!, $authorId: ID!) {
    addBook(name: $name, genre: $genre, authorId: $authorId) {
      id
      name
    }
  }
`;

const getBookQuery = gql`
  query GetBook($id: ID) {
    book(id: $id) {
      id
      name
      genre
      authorId
      author {
        id
        name
        age
        books {
          id
          name
        }
      }
    }
  }
`;

const deleteBookMutation = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id) {
      id
      name
    }
  }
`;

const updateBookMutation = gql`
 mutation UpdateBook($id:ID!,$name:String!,$genre:String!,$authorId:ID!){
   updateBook(id:$id,name:$name,genre:$genre,authorId:$authorId){
     id
     name
   }
 }
`;
export { getBooksQuery, getAuthorsQuery, addBookMutation, getBookQuery, deleteBookMutation, updateBookMutation };
