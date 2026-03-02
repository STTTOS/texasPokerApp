import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import type { User } from 'texas-poker-core';

import {
  getUser,
  login as loginService,
  setNickname as setNicknameService
} from '@/service';

// 定义 Context 类型
type UserContextType = {
  /** 用户信息 同时也用于是否登陆标识 */
  user: User | undefined;
  /** 重新拉取用户信息（如 token 存在但 user 未就绪时） */
  loadUser: () => Promise<void>;
  login: (
    username: string,
    password: string
  ) => Promise<{ token: string; type: 'login' | 'register' }>;
  setNickname: (nickname: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

// 创建 Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// 自定义 Hook 用于访问 Context
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser 必须在 UserProvider 内使用');
  }

  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const loadUser = async () => {
    try {
      const userInfo = await getUser();

      setUser(userInfo);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setUser(undefined);
    } finally {
      setLoading(false);
    }
  };

  // 初始化时加载用户数据
  useEffect(() => {
    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );

    const data = await loginService({ username, password: hashedPassword });

    return data;
  };

  const setNickname = async (nickname: string) => {
    await setNicknameService(nickname);
  };

  const logout = async () => {
    setUser(undefined);
    router.push({ pathname: '/login' });
    await AsyncStorage.clear();
  };

  return (
    <UserContext.Provider
      value={{ user, loading, loadUser, login, setNickname, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
