import React, { createContext, useContext, useState, ReactNode } from 'react';

const BASE_URL = 'http://172.16.108.152:3021';

export interface User {
  id: string;
  name: string;
  img: string;
  email?: string;
}

interface UsersContextData {
  users: User[];
  isLoading: boolean;
  error: string | null;
  getUsers: () => Promise<void>;
}

const UsersContext = createContext<UsersContextData | undefined>(undefined);

interface UsersProviderProps {
  children: ReactNode;
}

export const UsersProvider: React.FC<UsersProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getUsers = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/users/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('🚀 ~ getUsers ~ response:', response);

      if (!response.ok) {
        if (response.status === 404) {
          setUsers([]);
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao carregar usuários');
      }

      const data: User[] = await response.json();
      if (response.status === 404 || data.length === 0) {
        setUsers([]);
      } else {
        setUsers(data);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao carregar usuários:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UsersContext.Provider value={{ users, isLoading, error, getUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = (): UsersContextData => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};
