import { useQuery, useMutation } from '@apollo/client';
import { useOptimistic } from 'react';
import { GET_PEOPLE, EDIT_PERSON, DELETE_PERSON } from '../../graphql/queries';
import { GET_CARS } from '../../graphql/queries';
import { useState } from 'react';
import { Card } from 'antd';
import CarCards from './CarCards';

function PersonCards() {
    const { data, loading, error } = useQuery(GET_PEOPLE);
    const { data: carsData, loading: carsLoading, error: carsError } = useQuery(GET_CARS);
    const [editPerson] = useMutation(EDIT_PERSON);
    const [deletePerson] = useMutation(DELETE_PERSON);
    const [editingId, setEditingId] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    
    const [optimisticPeople, addOptimisticPeople] = useOptimistic(
        data?.people || [],
        (state, newPerson) => {
            if (newPerson.type === 'edit') {
                return state.map(person => 
                    person.id === newPerson.id 
                        ? { ...person, firstName: newPerson.firstName, lastName: newPerson.lastName }
                        : person
                );
            } else if (newPerson.type === 'delete') {
                return state.filter(person => person.id !== newPerson.id);
            }
            return state;
        }
    );
    
    // データが読み込まれていない場合は楽観的更新を使用しない
    const displayPeople = data?.people ? optimisticPeople : [];
    
    console.log('People data:', data);
    console.log('Cars data:', carsData);
    
    if (loading || carsLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading people: {error.message}</p>;
    if (carsError) return <p>Error loading cars: {carsError.message}</p>;
    if (!data || !data.people) return <p>No people data available</p>;
    if (!carsData || !carsData.cars) return <p>No cars data available</p>;
    
    const getCarCount = (personId) => {
        return carsData.cars.filter(car => car.personId === personId).length;
    };
    
    return (
        <div>
            <h2>Person Cards</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {displayPeople.map((person) => (
                    <li key={person.id}>
                        <Card style={{ marginBottom: 16 }}>
                            {editingId === person.id ? (
                                <div>
                                    <input 
                                        type="text" 
                                        value={firstName} 
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder={person.firstName}
                                    />
                                    <input 
                                        type="text" 
                                        value={lastName} 
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder={person.lastName}
                                    />
                                    <button onClick={() => {
                                        const updatedPerson = {
                                            type: 'edit',
                                            id: person.id,
                                            firstName: firstName || person.firstName,
                                            lastName: lastName || person.lastName
                                        };
                                        addOptimisticPeople(updatedPerson);
                                        editPerson({ 
                                            variables: { 
                                                id: person.id, 
                                                firstName: firstName || person.firstName, 
                                                lastName: lastName || person.lastName 
                                            },
                                            refetchQueries: ['GetPeople']
                                        });
                                        setEditingId(null);
                                        setFirstName('');
                                        setLastName('');
                                    }}>Save</button>
                                    <button onClick={() => {
                                        setEditingId(null);
                                        setFirstName('');
                                        setLastName('');
                                    }}>Cancel</button>
                                </div>
                            ) : (
                                <div>
                                    {person.firstName} {person.lastName}
                                    <button onClick={() => setEditingId(person.id)}>Edit</button>
                                    <button onClick={() => {
                                        addOptimisticPeople({ type: 'delete', id: person.id });
                                        deletePerson({ 
                                            variables: { id: person.id },
                                            refetchQueries: ['GetPeople']
                                        });
                                    }}>Delete</button>
                                    <CarCards personId={person.id} personName={`${person.firstName} ${person.lastName}`} />
                                </div>
                            )}
                        </Card>
                    </li>
                ))} 
            </ul>
        </div>
    )
}

export default PersonCards;