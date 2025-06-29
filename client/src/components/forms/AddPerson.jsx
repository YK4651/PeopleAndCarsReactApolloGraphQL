import { useMutation } from '@apollo/client';
import { ADD_PERSON } from '../../graphql/queries';
import { useState } from 'react';

function AddPerson() {
    const [addPerson] = useMutation(ADD_PERSON);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addPerson({ 
                variables: { firstName: firstName, lastName: lastName },
                refetchQueries: ['GetPeople']
            });
            setFirstName('');
            setLastName('');
        } catch (error) {
            console.error('Error adding person:', error);
        }
    }
  return (
    <>
    <h2>Add Person</h2>
    <form onSubmit={handleSubmit}>
        <label>First Name: </label>
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <label>Last Name: </label>
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <button type="submit">Add Person</button>
    </form>
    </>
  );
}

export default AddPerson;