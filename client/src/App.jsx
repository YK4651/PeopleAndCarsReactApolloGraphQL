import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useQuery, gql } from '@apollo/client';
import AddCar from './components/forms/AddCar';
import AddPerson from './components/forms/AddPerson';

const GET_PEOPLE = gql`
  query GetPeople {
    people {
      id
      firstName
      lastName
    }
  }
`;

export const ADD_PERSON = gql`
  mutation AddPerson($firstName: String!, $lastName: String!) {
    addPerson(firstName: $firstName, lastName: $lastName) {
      id
    }
  }
`;

function App() {
const { loading, error, data } = useQuery(GET_PEOPLE);

console.log(data);

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error.message}</p>;

  return (
    <>
    <h1>People & Cars</h1>
      <div>
        <AddPerson />
        <AddCar />
        
      </div>
    </>
  )
}

export default App
