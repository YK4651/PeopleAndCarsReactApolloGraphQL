import { useMutation, useQuery } from '@apollo/client';
import { ADD_CAR, GET_PEOPLE } from '../../graphql/queries';
import { useState } from 'react';

function AddCar() {
    const { data } = useQuery(GET_PEOPLE);
    const [addCar] = useMutation(ADD_CAR);
    const [year, setYear] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [price, setPrice] = useState('');
    const [personId, setPersonId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addCar({ variables: { year: year, make: make, model: model, price: price, personId: personId } });
            setYear('');
            setMake('');
            setModel('');
            setPrice('');
            setPersonId('');
        } catch (error) {
            console.error('Error adding car:', error);
        }
    }

  return (
    <>
    <h2>Add Car</h2>
    <form onSubmit={handleSubmit}>
      <label>Year: </label>
      <input type="text" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} required />
      <label>Make: </label>
      <input type="text" placeholder="Make" value={make} onChange={(e) => setMake(e.target.value)} required />
      <label>Model: </label>
      <input type="text" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} required />
      <label>Price: </label>
      <input type="text" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <label>Person: </label>
      <select value={personId} onChange={(e) => setPersonId(e.target.value)} required>
        <option value="">Select a person</option>
        {data.people.map((person) => (
          <option key={person.id} value={person.id}>{person.firstName} {person.lastName}</option>
        ))}
      </select>
      <button type="submit" onClick={handleSubmit}>Add Car</button>
    </form>
    </>
  );
}

export default AddCar;