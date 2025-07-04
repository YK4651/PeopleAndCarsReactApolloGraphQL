import { useMutation, useQuery, useApolloClient } from '@apollo/client';
import { ADD_CAR, GET_PEOPLE } from '../../graphql/queries';
import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Select } from 'antd';

const { Title } = Typography;

function AddCar() {
    const { data } = useQuery(GET_PEOPLE);
    const [addCar] = useMutation(ADD_CAR);
    const [form] = Form.useForm();
    const client = useApolloClient();

    const handleSubmit = async (values) => {    
        const tempId = `temp-${Date.now()}`;
        const tempCar = {
            id: tempId,
            year: values.year,
            make: values.make,
            model: values.model,
            price: values.price,
            personId: values.personId,
            __typename: 'Car'
        };

        try {
            const existingPeople = client.readQuery({ query: GET_PEOPLE });
            if (existingPeople) {
                const updatedPeople = existingPeople.people.map(person => {
                    if (person.id === values.personId) {
                        return {
                            ...person,
                            cars: [...(person.cars || []), tempCar]
                        };
                    }
                    return person;
                });
                client.writeQuery({
                    query: GET_PEOPLE,
                    data: { people: updatedPeople }
                });
            }

            await addCar({ 
                variables: { 
                    year: values.year, 
                    make: values.make, 
                    model: values.model, 
                    price: values.price, 
                    personId: values.personId 
                },
                update: (cache, { data }) => {
                    const existingPeople = cache.readQuery({ query: GET_PEOPLE });
                    if (existingPeople) {
                        const updatedPeople = existingPeople.people.map(person => {
                            if (person.id === values.personId) {
                                return {
                                    ...person,
                                    cars: person.cars.map(car => 
                                        car.id === tempId ? data.addCar : car
                                    )
                                };
                            }
                            return person;
                        });
                        cache.writeQuery({
                            query: GET_PEOPLE,
                            data: { people: updatedPeople }
                        });
                    }
                }
            });
            form.resetFields();
        } catch (error) {
            console.error('Error adding car:', error);
            const existingPeople = client.readQuery({ query: GET_PEOPLE });
            if (existingPeople) {
                const updatedPeople = existingPeople.people.map(person => ({
                    ...person,
                    cars: person.cars.filter(car => car.id !== tempId)
                }));
                client.writeQuery({
                    query: GET_PEOPLE,
                    data: { people: updatedPeople }
                });
            }
        }
    }

    return (
        <Card>
            <Title level={3}>Add Car</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item 
                    name="year" 
                    label="Year"
                    rules={[{ required: true, message: 'Please enter year' }]}
                >
                    <Input placeholder="Year" />
                </Form.Item>
                <Form.Item 
                    name="make" 
                    label="Make"
                    rules={[{ required: true, message: 'Please enter make' }]}
                >
                    <Input placeholder="Make" />
                </Form.Item>
                <Form.Item 
                    name="model" 
                    label="Model"
                    rules={[{ required: true, message: 'Please enter model' }]}
                >
                    <Input placeholder="Model" />
                </Form.Item>
                <Form.Item 
                    name="price" 
                    label="Price"
                    rules={[{ required: true, message: 'Please enter price' }]}
                >
                    <Input placeholder="Price" />
                </Form.Item>
                <Form.Item 
                    name="personId" 
                    label="Owner"
                    rules={[{ required: true, message: 'Please select an owner' }]}
                >
                    <Select placeholder="Select a person">
                        {data?.people?.map((person) => (
                            <Select.Option key={person.id} value={person.id}>
                                {person.firstName} {person.lastName}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Add Car
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default AddCar;