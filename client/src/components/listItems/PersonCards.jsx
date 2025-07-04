import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { GET_PEOPLE, EDIT_PERSON, DELETE_PERSON } from '../../graphql/queries';
import { useState } from 'react';
import { Card, Button, Space, Typography, Input, Form } from 'antd';
import { Link } from 'react-router-dom';
import CarCards from './CarCards';

const { Text, Title } = Typography;

function PersonCards() {
    const { data, loading, error } = useQuery(GET_PEOPLE);
    const [editPerson] = useMutation(EDIT_PERSON);
    const [deletePerson] = useMutation(DELETE_PERSON);
    const [editingId, setEditingId] = useState(null);
    const [form] = Form.useForm();
    const client = useApolloClient();
    
    const displayPeople = data?.people || [];
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading people: {error.message}</p>;
    if (!data || !data.people) return <p>No people data available</p>;
    
    return (
        <div>
            <h2>People</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
                {displayPeople.map((person) => (
                    <Card key={person.id} style={{ marginBottom: 16 }}>
                        {editingId === person.id ? (
                            <Form
                                form={form}
                                layout="inline"
                                onFinish={(values) => {
                                    const updatedPerson = {
                                        id: person.id,
                                        firstName: values.firstName || person.firstName,
                                        lastName: values.lastName || person.lastName
                                    };
                                    
                                    const existingPeople = client.readQuery({ query: GET_PEOPLE });
                                    if (existingPeople) {
                                        const updatedPeople = existingPeople.people.map(p => 
                                            p.id === person.id ? { ...p, ...updatedPerson } : p
                                        );
                                        client.writeQuery({
                                            query: GET_PEOPLE,
                                            data: { people: updatedPeople }
                                        });
                                    }
                                    
                                    editPerson({ 
                                        variables: { 
                                            id: person.id, 
                                            firstName: values.firstName || person.firstName, 
                                            lastName: values.lastName || person.lastName 
                                        },
                                        update: (cache, { data }) => {
                                            const existingPeople = cache.readQuery({ query: GET_PEOPLE });
                                            if (existingPeople) {
                                                const updatedPeople = existingPeople.people.map(p => 
                                                    p.id === person.id ? data.editPerson : p
                                                );
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
                                    firstName: person.firstName,
                                    lastName: person.lastName
                                }}
                            >
                                <Form.Item name="firstName" rules={[{ required: true }]}>
                                    <Input placeholder="First Name" />
                                </Form.Item>
                                <Form.Item name="lastName" rules={[{ required: true }]}>
                                    <Input placeholder="Last Name" />
                                </Form.Item>
                                <Form.Item>
                                    <Space>
                                        <Button type="primary" htmlType="submit">Save</Button>
                                        <Button onClick={() => {
                                            setEditingId(null);
                                            form.resetFields();
                                        }}>Cancel</Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        ) : (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <Title level={4} style={{ margin: 0 }}>
                                        {person.firstName} {person.lastName}
                                    </Title>
                                    <Space>
                                        <Button onClick={() => setEditingId(person.id)}>Edit</Button>
                                        <Button danger onClick={() => {
                                            const existingPeople = client.readQuery({ query: GET_PEOPLE });
                                            if (existingPeople) {
                                                const updatedPeople = existingPeople.people.filter(p => p.id !== person.id);
                                                client.writeQuery({
                                                    query: GET_PEOPLE,
                                                    data: { people: updatedPeople }
                                                });
                                            }
                                            
                                            deletePerson({ 
                                                variables: { id: person.id },
                                                update: (cache, { data }) => {
                                                    const existingPeople = cache.readQuery({ query: GET_PEOPLE });
                                                    if (existingPeople) {
                                                        const updatedPeople = existingPeople.people.filter(p => p.id !== person.id);
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
                                
                                <div style={{ marginBottom: '16px' }}>
                                    <Link to={`/people/${person.id}`}>
                                        <Text type="link">LEARN MORE</Text>
                                    </Link>
                                </div>
                                
                                <CarCards personId={person.id} personName={`${person.firstName} ${person.lastName}`} />
                            </div>
                        )}
                    </Card>
                ))} 
            </div>
        </div>
    )
}

export default PersonCards;