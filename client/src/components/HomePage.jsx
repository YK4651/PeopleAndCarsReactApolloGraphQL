import { useQuery } from '@apollo/client';
import { GET_PEOPLE } from '../graphql/queries';
import AddCar from './forms/AddCar';
import AddPerson from './forms/AddPerson';
import PersonCards from './listItems/PersonCards';

function HomePage() {
  const { loading, error, data } = useQuery(GET_PEOPLE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const hasPeople = data?.people && data.people.length > 0;

  return (
    <div className="main-container">
      <h1 className="main-title">PEOPLE AND THEIR CARS</h1>
      <div className="form-stack">
        <AddPerson />
        {hasPeople && <AddCar />}
      </div>
      <h2 className="records-title">Records</h2>
      <PersonCards />
    </div>
  );
}

export default HomePage; 