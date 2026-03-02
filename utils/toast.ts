/**
 * 全局 Toast 触发，供非 React 环境（如 http 拦截器）使用。
 * 由 ToastBridge 在应用内注册 @gluestack-ui/toast 的 show。
 */

type ShowToastFn = (opts: {
  title?: string;
  message: string;
  duration?: number;
}) => string;

let showFn: ShowToastFn | null = null;

export function setToastShow(fn: ShowToastFn | null) {
  showFn = fn;
}

export function showToast(message: string, title?: string, duration = 4000) {
  showFn?.({ message, title, duration });
}
