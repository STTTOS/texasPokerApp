import { Redirect } from 'expo-router';

export default function Entry() {
  // TODO: 检查是否有登录态
  // 如果有直接跳转到home, 否则跳转到中转页进行加载
  return <Redirect href="/transition"></Redirect>;
}
