import { useQuery } from 'react-query';
import './App.css';

const fetchUsers = async () => {
  try {
    return await (await fetch('https://reqres.in/api/users')).json();
  } catch (err) {
    throw new Error(err);
  }
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
