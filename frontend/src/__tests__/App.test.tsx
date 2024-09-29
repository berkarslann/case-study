import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';
import { getUsers, updateUser, addUser } from '../services/userService';


jest.mock('../services/userService');

const mockUsers = [
  { id: 1, name: 'Mevlana', surname: 'Acıkgöz', email: 'example1@example.com' },
  { id: 2, name: 'Gökalp', surname: 'Caymaz', email: 'example2@example.com' },
];

describe('App Component', () => {
  beforeEach(() => {
    (getUsers as jest.Mock).mockResolvedValue({
      data: mockUsers,
      totalRows: 2,
    });
  });

  it('renders the User Management heading', () => {
    render(<App />);
    expect(screen.getByText('User Management')).toBeInTheDocument();
  });

  it('fetches and displays users on load', async () => {
    render(<App />);
    expect(getUsers).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.getByText('Mevlana')).toBeInTheDocument();
      expect(screen.getByText('Göaklp')).toBeInTheDocument();
    });
  });

  it('opens the Add User modal on clicking Add User button', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Add User'));
    expect(screen.getByText('Add New User')).toBeInTheDocument(); 
  });

  it('filters users when a search term is entered', async () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'Berk' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

   
    (getUsers as jest.Mock).mockResolvedValue({
      data: [mockUsers[1]],
      totalRows: 1,
    });

    await waitFor(() => {
      expect(screen.queryByText('Ali')).not.toBeInTheDocument();
      expect(screen.getByText('Berk')).toBeInTheDocument();
    });
  });


  it('adds a new user when the Add User modal is saved', async () => {
    (addUser as jest.Mock).mockResolvedValue({});
    render(<App />);

    fireEvent.click(screen.getByText('Add User'));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'newuser@example.com' } });
    fireEvent.change(screen.getByLabelText('Surname'), { target: { value: 'User' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(addUser).toHaveBeenCalledWith({
        id: expect.any(Number),
        name: 'New User',
        surname: 'User',
        email: 'newuser@example.com',
      });
    });
  });
});
