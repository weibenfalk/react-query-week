import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import './App.css';

const fetchInfiniteUsers = async ({ pageParam = 1 }) => {
  try {
    return await (
      await fetch(`https://reqres.in/api/users?page=${pageParam}`)
    ).json();
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
  // Call the useQueryClient hook
  const queryClient = useQueryClient();
  // Grab all users
  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    error
  } = useInfiniteQuery('users', fetchInfiniteUsers, {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.page < lastPage.total_pages) return lastPage.page + 1;
      return false;
    }
  });

  // Create a mutation for adding a user
  const {
    mutate,
    mutateAsync,
    isLoading: isAddingUser,
    error: addError
  } = useMutation(addUser);

  const handleAddUser = async () => {
    const newUser = await mutateAsync({
      first_name: 'React Query',
      last_name: 'Rules!'
    });
    console.log('This was an async mutation!');
    console.log(newUser);
    // queryClient.invalidateQueries('users');
    queryClient.setQueryData('users', oldData => ({
      ...oldData,
      data: [newUser, ...oldData.data]
    }));
  };

  if (isLoading) return <p>Loading ...</p>;
  if (error || addError) return <p>Something went wrong ...</p>;

  console.log(data);

  return (
    <div className='App'>
      {isAddingUser ? <p>Adding user...</p> : null}
      <button onClick={handleAddUser}>Add User</button>
      {data.pages.map(page =>
        page.data.map(user => (
          <p key={user.id}>
            {user.first_name} {user.last_name}
          </p>
        ))
      )}
      {isFetching && <p>Loading ...</p>}
      {hasNextPage && <button onClick={fetchNextPage}>Load More</button>}
    </div>
  );
}

export default App;
