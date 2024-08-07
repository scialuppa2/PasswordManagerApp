import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import axios from 'axios';
import PasswordList from './PasswordList';
import { setupInterceptors } from './axiosConfig';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

const setup = () => {
  return render(
    <BrowserRouter>
      <PasswordList />
    </BrowserRouter>
  );
};

describe('PasswordList', () => {
  beforeAll(() => {
    setupInterceptors(jest.fn());
  });

  beforeEach(() => {
    
    axios.get.mockClear();
  });

  it('renders loading state initially', () => {
    setup();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders passwords on successful fetch', async () => {
    const passwords = [
      { id: 1, name: 'Password1' },
      { id: 2, name: 'Password2' },
    ];

    axios.get.mockResolvedValueOnce({
      data: {
        passwordEntries: passwords,
        totalPages: 1,
      },
    });

    await act(async () => {
      setup();
    });

    await waitFor(() => {
      passwords.forEach(password => {
        expect(screen.getByText(password.name)).toBeInTheDocument();
      });
    });
  });

  it('renders error message on fetch failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch passwords.'));

    await act(async () => {
      setup();
    });

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch passwords/i)).toBeInTheDocument();
    });
  });

  test('updates search term and fetches passwords', async () => {
    render(
      <BrowserRouter>
        <PasswordList />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'new search term' } });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('new search term'));
    });
  });
});
