import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { v4 as uuidv4 } from 'uuid';

const typeDefs = ` 
type People {
    id: ID!
    firstName: String!
    lastName: String!
    cars: [Car!]!
  }
  
  type Car {
    id: ID!
    year: String!
    make: String!
    model: String!
    price: String!
    personId: ID!
    owner: People!
  }
  
  type Query {
    people: [People!]
    cars: [Car!]
    person(id: ID!): People
  }

  type Mutation {
    addPerson(firstName: String!, lastName: String!): People!
    addCar(year: String!, make: String!, model: String!, price: String!, personId: ID!): Car!
  }`;



const people = [
  {
    id: '1',
    firstName: 'Bill',
    lastName: 'Gates'
  },
  {
    id: '2',
    firstName: 'Steve',
    lastName: 'Jobs'
  },
  {
    id: '3',
    firstName: 'Linux',
    lastName: 'Torvalds'
  }
]

const cars = [
  {
    id: '1',
    year: '2019',
    make: 'Toyota',
    model: 'Corolla',
    price: '40000',
    personId: '1'
  },
  {
    id: '2',
    year: '2018',
    make: 'Lexus',
    model: 'LX 600',
    price: '13000',
    personId: '1'
  },
  {
    id: '3',
    year: '2017',
    make: 'Honda',
    model: 'Civic',
    price: '20000',
    personId: '1'
  },
  {
    id: '4',
    year: '2019',
    make: 'Acura ',
    model: 'MDX',
    price: '60000',
    personId: '2'
  },
  {
    id: '5',
    year: '2018',
    make: 'Ford',
    model: 'Focus',
    price: '35000',
    personId: '2'
  },
  {
    id: '6',
    year: '2017',
    make: 'Honda',
    model: 'Pilot',
    price: '45000',
    personId: '2'
  },
  {
    id: '7',
    year: '2019',
    make: 'Volkswagen',
    model: 'Golf',
    price: '40000',
    personId: '3'
  },
  {
    id: '8',
    year: '2018',
    make: 'Kia',
    model: 'Sorento',
    price: '45000',
    personId: '3'
  },
  {
    id: '9',
    year: '2017',
    make: 'Volvo',
    model: 'XC40',
    price: '55000',
    personId: '3'
  }
]

const resolvers = {
  Query: {
    people: () => people,
    cars: () => cars,
    person: (_, { id }) => people.find(person => person.id === id)
  },
  Mutation: {
    addPerson: (_, { firstName, lastName }) => {
      const newPerson = { id: uuidv4(), firstName, lastName };
      people.push(newPerson);
      return newPerson;
    },
    addCar: (_, { year, make, model, price, personId }) => {
      const newCar = { id: uuidv4(), year, make, model, price, personId };
      cars.push(newCar);
      return newCar;
    }
  }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);