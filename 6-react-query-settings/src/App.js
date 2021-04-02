import { useQuery } from 'react-query';
import './App.css';

const fetchUsers = async () => {
  const response = await fetch('https://reqres.in/api/users');
  if (!response.ok) {
    throw new Error('Something went wrong!');
  }
  return response.json();
};

const App = () => {
  // Grab all users
  const { data, isLoading, error } = useQuery('users', fetchUsers, {
    enabled: true,
    refetchOnWindowFocus: false,
    refetchInterval: false
  });

  if (isLoading) return <p>Loading ...</p>;
  if (error) return <p>Something went wrong ...</p>;
  if (!data) return null;

  console.log(data);

  return (
    <div className='App'>
      {data.data.map(person => (
        <p key={person.id}>
          {person.first_name} {person.last_name}
        </p>
      ))}
    </div>
  );
};

export default App;
