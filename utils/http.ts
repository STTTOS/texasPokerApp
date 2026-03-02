import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosRequestConfig } from 'axios';

import { showToast } from '@/utils/toast';

interface ResBasic<T> {
  code: number;
  msg: string;
  data: T;
}

const baseUrl = 'https://texas.wishufree.com/api/';

// 设置 Axios 请求拦截器
axios.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function betterRequest<R>(
  url: string,
  params?: Record<string, unknown>,
  config?: AxiosRequestConfig & { slience?: boolean }
) {
  try {
    const { data } = await axios<ResBasic<R>>(baseUrl + url, {
      method: 'POST',
      data: params,
      // 请求超时时间30秒
      timeout: 1000 * 30,
      ...config
    });

    if (data?.code !== 200) {
      throw new Error(data.msg);
    }

    return data;
  } catch (error) {
    const isTimeout =
      axios.isAxiosError(error) && error.code === 'ECONNABORTED';
    const errMsg = isTimeout ? '请求超时' : (error as Error).message;

    if (!config?.slience) showToast(errMsg);

    throw new Error(errMsg);
  }
}

export default betterRequest;
