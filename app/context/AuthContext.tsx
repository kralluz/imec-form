import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';

const BASE_URL = 'http://172.16.108.152:3021';

export interface User {
  id: string;
  name: string;
  img: string;
  email: string;
  role: 'COMMON' | 'ADMIN' | string;
  createdAt: string;
}

interface AuthContextData {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getUsers: () => Promise<User[]>;
  user: User | null;
  getUserData: () => Promise<User>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  
  useEffect(() => {
    (async () => {
      try {
        const savedToken = await SecureStore.getItemAsync('userToken');
        if (savedToken) {
          setToken(savedToken);
        }
      } catch (err) {
        console.error('Erro ao recuperar token:', err);
      }
    })();
  }, []);

  
  useEffect(() => {
    if (token) {
      (async () => {
        try {
          const userData = await getUserData();
          setUser(userData);
        } catch (err) {
          console.error('Erro ao buscar dados do usuário:', err);
        }
      })();
    } else {
      
      setUser(null);
    }
  }, [token]);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciais inválidas');
      }

      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        await SecureStore.setItemAsync('userToken', data.token);
        Toast.show({
          type: 'success',
          text1: 'Login realizado com sucesso',
        });
      } else {
        throw new Error('Token não retornado na resposta');
      }
    } catch (err: any) {
      setError(err.message);
      Toast.show({
        type: 'error',
        text1: 'Erro ao fazer login',
        text2: err.message,
      });
      console.error('Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      setToken(null);
      setUser(null);
      await SecureStore.deleteItemAsync('userToken');
      Toast.show({
        type: 'success',
        text1: 'Logout realizado com sucesso',
      });
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
      Toast.show({
        type: 'error',
        text1: 'Erro ao fazer logout',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUsers = async (): Promise<User[]> => {
    try {
      const response = await fetch(`${BASE_URL}/users/`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!response.ok) {
        throw new Error('Erro ao buscar a lista de usuários');
      }
      const data: User[] = await response.json();
      return data;
    } catch (err: any) {
      console.error('Erro ao buscar usuários:', err);
      throw err;
    }
  };

  const getUserData = async (): Promise<User> => {
    if (!token) {
      throw new Error(
        'Token ausente. Não é possível buscar os dados do usuário.',
      );
    }
    try {
      const response = await fetch(`${BASE_URL}/auth/user/data`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do usuário');
      }
      const data: User = await response.json();
      return data;
    } catch (err: any) {
      console.error('Erro ao buscar dados do usuário:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        error,
        login,
        logout,
        getUsers,
        getUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
