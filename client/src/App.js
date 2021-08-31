/* import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap/dist/js/bootstrap.bundle.min'; */
import BookList from "./components/BookList";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import AddBook from "./components/AddBook";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
});
function App() {
  return (
    <ApolloProvider client={client}>
      <div id="main">
        <marquee>
          <h2>React With Graphql Demo</h2>
        </marquee>
        <BookList />
        <AddBook />
      </div>
    </ApolloProvider>
  );
}

export default App;
