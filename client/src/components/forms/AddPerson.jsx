import { useMutation } from '@apollo/client';
import { ADD_PERSON } from '../../App';
import { useState } from 'react';

function AddPerson() {
    const [addPerson] = useMutation(ADD_PERSON);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addPerson({ variables: { firstName: firstName, lastName: lastName } });
    }
  return (
    <>
    <h2>Add Person</h2>
    <form>
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <button type="submit" onClick={handleSubmit}>Add Person</button>
    </form>
    </>
  );
}

export default AddPerson;