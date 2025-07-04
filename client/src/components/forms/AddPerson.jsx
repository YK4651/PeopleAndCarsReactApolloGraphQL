import { useMutation, useApolloClient } from '@apollo/client';
import { ADD_PERSON, GET_PEOPLE } from '../../graphql/queries';
import { useState } from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';

const { Title } = Typography;

function AddPerson() {
    const [addPerson] = useMutation(ADD_PERSON);
    const [form] = Form.useForm();
    const client = useApolloClient();

    const handleSubmit = async (values) => {
        const tempId = `temp-${Date.now()}`;
        const tempPerson = {
            id: tempId,
            firstName: values.firstName,
            lastName: values.lastName,
            cars: [],
            __typename: 'People'
        };

        try {
            const existingPeople = client.readQuery({ query: GET_PEOPLE });
            if (existingPeople) {
                client.writeQuery({
                    query: GET_PEOPLE,
                    data: {
                        people: [...existingPeople.people, tempPerson]
                    }
                });
            }

            await addPerson({ 
                variables: { firstName: values.firstName, lastName: values.lastName },
                update: (cache, { data }) => {
                    const existingPeople = cache.readQuery({ query: GET_PEOPLE });
                    if (existingPeople) {
                        cache.writeQuery({
                            query: GET_PEOPLE,
                            data: {
                                people: existingPeople.people.map(person => 
                                    person.id === tempId ? data.addPerson : person
                                )
                            }
                        });
                    }
                }
            });
            form.resetFields();
        } catch (error) {
            console.error('Error adding person:', error);
            const existingPeople = client.readQuery({ query: GET_PEOPLE });
            if (existingPeople) {
                client.writeQuery({
                    query: GET_PEOPLE,
                    data: {
                        people: existingPeople.people.filter(person => person.id !== tempId)
                    }
                });
            }
        }
    }

    return (
        <Card>
            <Title level={3}>Add Person</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item 
                    name="firstName" 
                    label="First Name"
                    rules={[{ required: true, message: 'Please enter first name' }]}
                >
                    <Input placeholder="First Name" />
                </Form.Item>
                <Form.Item 
                    name="lastName" 
                    label="Last Name"
                    rules={[{ required: true, message: 'Please enter last name' }]}
                >
                    <Input placeholder="Last Name" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Add Person
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default AddPerson;