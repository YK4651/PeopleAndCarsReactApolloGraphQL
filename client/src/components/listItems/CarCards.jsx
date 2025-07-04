import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { EDIT_CAR, DELETE_CAR, GET_PEOPLE } from '../../graphql/queries';
import { useState } from 'react';
import { Card, Button, Space, Typography, Input, Form, Select } from 'antd';

const { Text } = Typography;

function CarCards({ personId, personName }) {
    const { data: peopleData, loading, error } = useQuery(GET_PEOPLE);
    const [editCar] = useMutation(EDIT_CAR);
    const [deleteCar] = useMutation(DELETE_CAR);
    const [editingId, setEditingId] = useState(null);
    const [form] = Form.useForm();
    const client = useApolloClient();

    const currentPerson = peopleData?.people?.find(person => person.id === personId);
    const currentCars = currentPerson?.cars || [];
    
    const displayCars = currentCars || [];
    
    const formatCurrency = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(parseFloat(price));
    };
    
    if (loading) return <p>Loading cars...</p>;
    if (error) return <p>Error loading cars: {error.message}</p>;
    
    return (
        <div>
            <h4>Cars</h4>
            {displayCars.length === 0 ? (
                <Text type="secondary">No cars owned by this person.</Text>
            ) : (
                <div style={{ display: 'grid', gap: '8px' }}>
                    {displayCars.map((car) => (
                        <Card key={car.id} size="small">
                            {editingId === car.id ? (
                                <Form
                                    form={form}
                                    layout="inline"
                                    onFinish={(values) => {
                                        const updatedCar = {
                                            type: 'edit',
                                            id: car.id,
                                            year: values.year || car.year,
                                            make: values.make || car.make,
                                            model: values.model || car.model,
                                            price: values.price || car.price,
                                            personId: values.personId || car.personId
                                        };
                                        
                                        const existingPeople = client.readQuery({ query: GET_PEOPLE });
                                        if (existingPeople) {
                                            const updatedPeople = existingPeople.people.map(person => ({
                                                ...person,
                                                cars: person.cars.map(c => 
                                                    c.id === car.id ? { ...c, ...updatedCar } : c
                                                )
                                            }));
                                            client.writeQuery({
                                                query: GET_PEOPLE,
                                                data: { people: updatedPeople }
                                            });
                                        }
                                        editCar({ 
                                            variables: { 
                                                id: car.id, 
                                                year: values.year || car.year,
                                                make: values.make || car.make,
                                                model: values.model || car.model,
                                                price: values.price || car.price,
                                                personId: values.personId || car.personId
                                            },
                                            update: (cache, { data }) => {
                                                const existingPeople = cache.readQuery({ query: GET_PEOPLE });
                                                if (existingPeople) {
                                                    const updatedPeople = existingPeople.people.map(person => ({
                                                        ...person,
                                                        cars: person.cars.map(c => 
                                                            c.id === car.id ? data.editCar : c
                                                        )
                                                    }));
                                                    cache.writeQuery({
                                                        query: GET_PEOPLE,
                                                        data: { people: updatedPeople }
                                                    });
                                                }
                                            }
                                        });
                                        setEditingId(null);
                                        form.resetFields();
                                    }}
                                    initialValues={{
                                        year: car.year,
                                        make: car.make,
                                        model: car.model,
                                        price: car.price,
                                        personId: car.personId
                                    }}
                                >
                                    <Form.Item name="year" rules={[{ required: true }]}>
                                        <Input placeholder="Year" style={{ width: '80px' }} />
                                    </Form.Item>
                                    <Form.Item name="make" rules={[{ required: true }]}>
                                        <Input placeholder="Make" style={{ width: '100px' }} />
                                    </Form.Item>
                                    <Form.Item name="model" rules={[{ required: true }]}>
                                        <Input placeholder="Model" style={{ width: '120px' }} />
                                    </Form.Item>
                                    <Form.Item name="price" rules={[{ required: true }]}>
                                        <Input placeholder="Price" style={{ width: '100px' }} />
                                    </Form.Item>
                                    <Form.Item name="personId" rules={[{ required: true }]}>
                                        <Select
                                            style={{ width: '150px' }}
                                            placeholder="Select owner"
                                        >
                                            {peopleData?.people?.map((person) => (
                                                <Select.Option key={person.id} value={person.id}>
                                                    {person.firstName} {person.lastName}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item>
                                        <Space>
                                            <Button type="primary" htmlType="submit" size="small">Save</Button>
                                            <Button onClick={() => {
                                                setEditingId(null);
                                                form.resetFields();
                                            }} size="small">Cancel</Button>
                                        </Space>
                                    </Form.Item>
                                </Form>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <Text strong>{car.year} {car.make} {car.model}</Text>
                                        <br />
                                        <Text type="secondary">{formatCurrency(car.price)}</Text>
                                    </div>
                                    <Space>
                                        <Button size="small" onClick={() => setEditingId(car.id)}>Edit</Button>
                                        <Button size="small" danger onClick={() => {
                                            const existingPeople = client.readQuery({ query: GET_PEOPLE });
                                            if (existingPeople) {
                                                const updatedPeople = existingPeople.people.map(person => ({
                                                    ...person,
                                                    cars: person.cars.filter(c => c.id !== car.id)
                                                }));
                                                client.writeQuery({
                                                    query: GET_PEOPLE,
                                                    data: { people: updatedPeople }
                                                });
                                            }
                                            deleteCar({ 
                                                variables: { id: car.id },
                                                update: (cache, { data }) => {
                                                    const existingPeople = cache.readQuery({ query: GET_PEOPLE });
                                                    if (existingPeople) {
                                                        const updatedPeople = existingPeople.people.map(person => ({
                                                            ...person,
                                                            cars: person.cars.filter(c => c.id !== car.id)
                                                        }));
                                                        cache.writeQuery({
                                                            query: GET_PEOPLE,
                                                            data: { people: updatedPeople }
                                                        });
                                                    }
                                                }
                                            });
                                        }}>Delete</Button>
                                    </Space>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CarCards; 