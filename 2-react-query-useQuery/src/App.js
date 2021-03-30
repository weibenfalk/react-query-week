import { useQuery } from 'react-query';
import './App.css';

const fetchUsers = async () => {
  const response = await fetch('https://reqres.in/api/users');
  if (!response.ok) {
    throw new Error('Something went wrong!');
  }
  return response.json();
};

function App() {
  // Grab all users
  const { data: users, isLoading, error } = useQuery('users', fetchUsers);

  if (isLoading) return <p>Loading ...</p>;
  if (error) return <p>Something went wrong ...</p>;

  console.log(users);

  return (
    <div className='App'>
      {users.data.map(user => (
        <p key={user.id}>
          {user.first_name} {user.last_name}
        </p>
      ))}
    </div>
  );
}

export default App;
