import { useQuery, useMutation } from 'react-query';
import './App.css';

const fetchUsers = async () => {
  try {
    return await (await fetch('https://reqres.in/api/users')).json();
  } catch (err) {
    throw new Error(err);
  }
};

const addUser = async user => {
  try {
    return await (
      await fetch('https://reqres.in/api/users', {
        method: 'POST',
        body: JSON.stringify({
          first_name: user.first_name,
          last_name: user.last_name
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
    ).json();
  } catch (err) {
    throw new Error(err);
  }
};

function App() {
  // Grab all users
  const { data: users, isLoading, error, refetch } = useQuery(
    'users',
    fetchUsers
  );

  // Create a mutation for adding a user
  const {
    mutate,
    mutateAsync,
    isLoading: isAddingUser,
    error: addError
  } = useMutation(addUser);

  const handleAddUser = async () => {
    const data = await mutateAsync({
      first_name: 'React Query',
      last_name: 'Rules!'
    });
    console.log('This was an async mutation!');
    console.log(data);
    refetch();
  };

  if (isLoading) return <p>Loading ...</p>;
  if (error || addError) return <p>Something went wrong ...</p>;

  console.log(users);

  return (
    <div className='App'>
      {isAddingUser ? <p>Adding user...</p> : null}
      <button onClick={handleAddUser}>Add User</button>
      {users.data.map(user => (
        <p key={user.id}>
          {user.first_name} {user.last_name}
        </p>
      ))}
    </div>
  );
}

export default App;
