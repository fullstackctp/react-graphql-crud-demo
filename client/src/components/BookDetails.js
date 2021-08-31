import React, { Component } from "react";
import { graphql } from "react-apollo";
import {
  getBookQuery,
  deleteBookMutation,
  getBooksQuery,
  getAuthorsQuery,
  updateBookMutation
} from "../queries/query";
import { flowRight as compose } from "lodash";

class BookDetails extends Component {
constructor(props) {
    super(props)
    this.state = {
         name:'',
         genre:'',
         authorId:'',
         editBook: false
    }
}

displayAuthors() {
    let data = this.props.getAuthorsQuery;
    if (data.loading) {
      return <option disabled>Loading Authors..</option>;
    } else {
      return data.authors.map((author) => {
        return (
          <option key={author.id} value={author.id}>
            {author.name}
          </option>
        );
      });
    }
  }
  displayBookDetails() {
    const { book } = this.props.data;
    if (book) {
      return (
        <div>
          <p className="booksdetailhead">{book.name}</p>
          <button onClick={this.updateEnable.bind(this)} className="updatebookbtn">
            Update Book
          </button> <button onClick={this.removeBook.bind(this)} className="removebookbtn">
            Delete Book
          </button>
          <p className="bookdetail">Genre: {book.genre}</p>
          <p className="bookdetail">Author: {book.author[0].name}</p>
          <p className="bookdetail">All books by this author:</p>
          <ul className="other-books">
            {book.author[0].books.map((item) => {
              return (
                <li key={item.id} className="booksbyauthor">
                  {item.name}
                </li>
              );
            })}
          </ul>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
 
  removeBook(e) {
    e.preventDefault();
    this.props.deleteBookMutation({
      variables: {
        id: this.props.bookId,
      },
      refetchQueries: [
        {
          query: getBooksQuery,
        },
      ],
    });
    console.log("book Id: " + this.props.bookId);
  }

  updateEnable(e){
    e.preventDefault();
    this.setState({
        editBook: !this.state.updateBook,
        name:this.props.data.book.name,
        genre:this.props.data.book.genre,
        authorId:this.props.data.book.authorId
    })
}

updateBook(e){
e.preventDefault();
this.props.updateBookMutation({
    variables:{
        id:this.props.bookId,
        name:this.state.name,
        genre:this.state.genre,
        authorId:this.state.authorId
    },
    refetchQueries:[{
        query:getBookQuery,
        query:getBooksQuery
    }]
})
this.setState({
    editBook:false
})
}
  render() {
    return (
        <>
      <div id="book-details">
        {this.displayBookDetails()}
        <br/>
        
        </div>
        {!this.state.editBook? <></> :
        <form  className="formupdate" onSubmit={this.updateBook.bind(this)}>
          <div className="field">
            <label>Book name:</label>
            <input
              type="text"
              onChange={(e) => this.setState({ name: e.target.value })}
              value={this.state.name}
            />
          </div>

          <div className="field">
            <label>Genre:</label>
            <input
              type="text"
              onChange={(e) => this.setState({ genre: e.target.value })}
              value={this.state.genre}
            />
          </div>

          <div className="field">
            <label>Author</label>
            <select
              onChange={(e) => this.setState({ authorId: e.target.value })}
            >
              <option>Select Author</option>
              {this.displayAuthors()}
            </select>
          </div>

          <button className="formupdatebtn">Update</button>
        </form>}
      </>
    );
  }
}

export default compose(
  graphql(getBookQuery, {
    options: (props) => {
      return {
        variables: {
          id: props.bookId,
        },
      };
    },
  }),
  graphql(deleteBookMutation, { name: "deleteBookMutation" }),
  graphql(getAuthorsQuery,{name:"getAuthorsQuery"}),
  graphql(updateBookMutation,{name:"updateBookMutation"})
)(BookDetails);
