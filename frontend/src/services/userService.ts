import axios from 'axios';

export const getUsers = async (page: number, pageSize: number, search: string) => {
  const response = await axios.get('http://localhost:8080/users', {
    params: {
      page,
      pageSize,
      search,
    },
  });
  return response.data;
};

export const updateUser = async (user: any) => {
    const response = await axios.post('http://localhost:8080/users/update', user);
    return response.data;
  };

  export const addUser = async (user: any) => {
    const response = await axios.post('http://localhost:8080/users/save', user);
    return response.data;
  };