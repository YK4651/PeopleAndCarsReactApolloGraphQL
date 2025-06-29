import { useQuery, useMutation } from '@apollo/client';
import { useOptimistic } from 'react';
import { GET_CARS, EDIT_CAR, DELETE_CAR } from '../../graphql/queries';
import { useState } from 'react';

function CarCards({ personId, personName }) {
    const { data, loading, error } = useQuery(GET_CARS);
    const [editCar] = useMutation(EDIT_CAR);
    const [deleteCar] = useMutation(DELETE_CAR);
    const [editingId, setEditingId] = useState(null);
    const [year, setYear] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [price, setPrice] = useState('');
    
    const [optimisticCars, addOptimisticCars] = useOptimistic(
        data?.cars || [],
        (state, newCar) => {
            if (newCar.type === 'edit') {
                return state.map(car => 
                    car.id === newCar.id 
                        ? { ...car, year: newCar.year, make: newCar.make, model: newCar.model, price: newCar.price }
                        : car
                );
            } else if (newCar.type === 'delete') {
                return state.filter(car => car.id !== newCar.id);
            }
            return state;
        }
    );
    
    // データが読み込まれていない場合は楽観的更新を使用しない
    const displayCars = data?.cars ? optimisticCars : [];
    
    // 特定の人の車のみをフィルタリング
    const personCars = displayCars.filter(car => car.personId === personId);
    
    if (loading) return <p>Loading cars...</p>;
    if (error) return <p>Error loading cars: {error.message}</p>;
    
    return (
        <div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {personCars.map((car) => (
                        <li key={car.id}>
                            {editingId === car.id ? (
                                <div>
                                    <input 
                                        type="text" 
                                        value={year} 
                                        onChange={(e) => setYear(e.target.value)}
                                        placeholder={car.year}
                                    />
                                    <input 
                                        type="text" 
                                        value={make} 
                                        onChange={(e) => setMake(e.target.value)}
                                        placeholder={car.make}
                                    />
                                    <input 
                                        type="text" 
                                        value={model} 
                                        onChange={(e) => setModel(e.target.value)}
                                        placeholder={car.model}
                                    />
                                    <input 
                                        type="text" 
                                        value={price} 
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder={car.price}
                                    />
                                    <button onClick={() => {
                                        const updatedCar = {
                                            type: 'edit',
                                            id: car.id,
                                            year: year || car.year,
                                            make: make || car.make,
                                            model: model || car.model,
                                            price: price || car.price
                                        };
                                        addOptimisticCars(updatedCar);
                                        editCar({ 
                                            variables: { 
                                                id: car.id, 
                                                year: year || car.year,
                                                make: make || car.make,
                                                model: model || car.model,
                                                price: price || car.price,
                                                personId: car.personId // 所有者は変更しない
                                            },
                                            refetchQueries: ['GetCars']
                                        });
                                        setEditingId(null);
                                        setYear('');
                                        setMake('');
                                        setModel('');
                                        setPrice('');
                                    }}>Save</button>
                                    <button onClick={() => {
                                        setEditingId(null);
                                        setYear('');
                                        setMake('');
                                        setModel('');
                                        setPrice('');
                                    }}>Cancel</button>
                                </div>
                            ) : (
                                <div>
                                    {`${car.year} ${car.make} ${car.model} -> $${car.price}`}
                                    <button onClick={() => setEditingId(car.id)}>Edit</button>
                                    <button onClick={() => {
                                        addOptimisticCars({ type: 'delete', id: car.id });
                                        deleteCar({ 
                                            variables: { id: car.id },
                                            refetchQueries: ['GetCars']
                                        });
                                    }}>Delete</button>
                                </div>
                            )}
                        </li>
                    ))} 
                </ul>
        </div>
    )
}

export default CarCards; 