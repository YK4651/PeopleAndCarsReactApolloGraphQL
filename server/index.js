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
    editPerson(id: ID!, firstName: String!, lastName: String!): People!
    deletePerson(id: ID!): People!
    editCar(id: ID!, year: String!, make: String!, model: String!, price: String!, personId: ID!): Car!
    deleteCar(id: ID!): Car!
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
      console.log('New person added:', newPerson);
      console.log('All people:', people);
      return newPerson;
    },
    addCar: (_, { year, make, model, price, personId }) => {
      const newCar = { id: uuidv4(), year, make, model, price, personId };
      cars.push(newCar);
      console.log('New car added:', newCar);
      console.log('All cars:', cars);
      return newCar;
    },
    editPerson: (_, { id, firstName, lastName }) => {
      const person = people.find(person => person.id === id);
      if (!person) throw new Error('Person not found');
      person.firstName = firstName;
      person.lastName = lastName;
      return person;
    },
    deletePerson: (_, { id }) => {
      const index = people.findIndex(person => person.id === id);
      if (index === -1) throw new Error('Person not found');
      const deletedPerson = people.splice(index, 1)[0];
      return deletedPerson;
    },
    editCar: (_, { id, year, make, model, price, personId }) => {
      const car = cars.find(car => car.id === id);
      if (!car) throw new Error('Car not found');
      car.year = year;
      car.make = make;
      car.model = model;
      car.price = price;
      car.personId = personId;
      console.log('Car updated:', car);
      console.log('All cars:', cars);
      return car;
    },
    deleteCar: (_, { id }) => {
      const index = cars.findIndex(car => car.id === id);
      if (index === -1) throw new Error('Car not found');
      const deletedCar = cars.splice(index, 1)[0];
      console.log('Car deleted:', deletedCar);
      console.log('All cars:', cars);
      return deletedCar;
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