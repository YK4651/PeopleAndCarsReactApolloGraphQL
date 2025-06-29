import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useQuery, gql } from '@apollo/client';
import AddCar from './components/forms/AddCar';
import AddPerson from './components/forms/AddPerson';
import { GET_PEOPLE } from './graphql/queries';
import PersonCards from './components/listItems/PersonCards';

function App() {
const { loading, error, data } = useQuery(GET_PEOPLE);

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error.message}</p>;

  return (
    <>
    <h1>People & Cars</h1>
      <div>
        <AddPerson />
        <AddCar />
        <PersonCards />
      </div>
    </>
  )
}

export default App
