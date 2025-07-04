import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PERSON_WITH_CARS } from '../graphql/queries';
import { Card, Button, List, Typography, Space } from 'antd';

const { Title, Text } = Typography;

function PersonShowPage() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { id }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.personWithCars) return <p>Person not found</p>;

  const person = data.personWithCars;
  const cars = person.cars || [];

  const formatCurrency = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(price));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/">
          <Button type="primary">GO BACK HOME</Button>
        </Link>
      </div>

      <Card>
        <Title level={2}>
          {person.firstName} {person.lastName}
        </Title>

        <Title level={3}>Cars</Title>
        
        {cars.length === 0 ? (
          <Text type="secondary">No cars owned by this person.</Text>
        ) : (
          <List
            dataSource={cars}
            renderItem={(car) => (
              <List.Item>
                <Card size="small" style={{ width: '100%' }}>
                  <Space direction="vertical" size="small">
                    <Text strong>
                      {car.year} {car.make} {car.model}
                    </Text>
                    <Text type="secondary">
                      Price: {formatCurrency(car.price)}
                    </Text>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}

export default PersonShowPage; 