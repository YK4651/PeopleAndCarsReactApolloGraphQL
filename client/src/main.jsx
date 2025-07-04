import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache({
    typePolicies: {
      People: {
        fields: {
          cars: {
            merge(existing = [], incoming) {
              return incoming;
            }
          }
        }
      }
    }
  }),
});

const root = createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
