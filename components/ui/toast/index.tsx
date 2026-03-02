'use client';

import { createToastHook } from '@gluestack-ui/toast';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { setToastShow } from '@/utils/toast';

const useToast = createToastHook(View, View);

/**
 * 在 ToastProvider 内注册全局 show，供 utils/toast.showToast 使用
 */
export function ToastBridge({ children }: { children?: React.ReactNode }) {
  const toast = useToast();

  useEffect(() => {
    setToastShow((opts) => {
      const { title, message, duration = 4000 } = opts;
      return toast.show({
        placement: 'top',
        duration,
        render: ({ id }) => (
          <View key={id} style={styles.container}>
            {title ? (
              <Text numberOfLines={1} style={styles.title}>
                {title}
              </Text>
            ) : null}
            <Text numberOfLines={3} style={styles.message}>
              {message}
            </Text>
          </View>
        )
      });
    });
    return () => setToastShow(null);
  }, [toast]);

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderRadius: 8,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 16
    // minWidth: 200
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  message: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14
  }
});

export { useToast };
