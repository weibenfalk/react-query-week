import { useQuery, useMutation, useQueryClient } from 'react-query';
import './App.css';

type Data = {
  id: number;
  avatar: string;
  email: string;
  first_name: string;
  last_name: string;
};

type Support = {
  text: string;
  url: string;
};

type Users = {
  data: Data[];
  page: number;
  per_page: number;
  support: Support;
  total: number;
  total_pages: number;
};

const fetchUsers = async (): Promise<Users> => {
  try {
    return await (await fetch('https://reqres.in/api/users')).json();
  } catch (err) {
    throw new Error(err);
  }
};

const addUser = async (user: {
  first_name: string;
  last_name: string;
}): Promise<Data> => {
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
  // Call the useQueryClient hook
  const queryClient = useQueryClient();
  // Grab all users
  const { data: users, isLoading, error } = useQuery<Users, ErrorConstructor>(
    'users',
    fetchUsers
  );

  // Create a mutation for adding a user
  const { mutateAsync, isLoading: isAddingUser, error: addError } = useMutation(
    addUser
  );

  const handleAddUser = async () => {
    const newUser = await mutateAsync({
      first_name: 'React Query',
      last_name: 'Rules!'
    });
    console.log('This was an async mutation!');
    console.log('newUser: ', newUser);
    // queryClient.invalidateQueries('users');
    queryClient.setQueryData<Users | undefined>('users', oldData => {
      if (oldData) {
        return {
          ...oldData,
          data: [
            {
              first_name: newUser.first_name,
              last_name: newUser.last_name
            } as Data,
            ...oldData.data
          ]
        };
      }
    });
  };

  if (isLoading) return <p>Loading ...</p>;
  if (error || addError) return <p>Something went wrong ...</p>;
  if (!users) return null;

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
