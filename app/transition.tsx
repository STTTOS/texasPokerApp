import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUser } from '@/contexts/UserContext';

// 此transiton应该用于长耗时行为的过渡页面
const PokerLoadingScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, loadUser } = useUser();

  const [progress, setProgress] = useState(0);
  const hasNavigated = useRef(false);

  // 使用 useRef 来持久化动画值
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  // 筹码旋转动画
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, [spinValue]);

  // 模拟加载进度（仅更新 progress，不在 setState 回调里做导航）
  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(intervalId);
          return 100;
        }
        return newProgress;
      });
    }, 150);

    return () => clearInterval(intervalId);
  }, []);

  // progress 达到 100 时在 useEffect 中执行导航和收尾动画，避免「在渲染中更新父组件」
  useEffect(() => {
    if (progress < 100 || hasNavigated.current) return;

    hasNavigated.current = true;
    const path = user ? '/home' : '/login';

    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1.5,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();

    router.push({ pathname: path });
  }, [progress, user, router, scaleValue, opacityValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // 若 user 不存在则拉取用户信息（如已有 token 但尚未加载）
  useEffect(() => {
    if (user === undefined) {
      loadUser();
    }
  }, [user, loadUser]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right
        }
      ]}
    >
      {/* 扑克桌背景 */}
      <View style={styles.pokerTable} />

      {/* 筹码动画 */}
      <Animated.View
        style={[styles.chipContainer, { transform: [{ rotate: spin }] }]}
      >
        <View style={styles.chipLarge} />
        <View style={styles.chipMedium} />
        <View style={styles.chipSmall} />
      </Animated.View>

      {/* 中间内容区：可收缩，避免小屏溢出 */}
      <View style={styles.contentWrap}>
        {/* 扑克牌元素 */}
        <View style={styles.cardsContainer}>
          <View style={[styles.card, styles.cardAce]}>
            <Text style={styles.cardText}>A</Text>
            <Text style={[styles.suit]}>♠</Text>
          </View>
          <View style={[styles.card, styles.cardKing]}>
            <Text style={[styles.cardText, styles.hearts]}>K</Text>
            <Text style={[styles.suit, styles.hearts]}>♥</Text>
          </View>
        </View>

        {/* 进度指示器 */}
        <Animated.View
          style={[
            styles.progressContainer,
            {
              opacity: opacityValue,
              transform: [{ scale: scaleValue }]
            }
          ]}
        >
          <Text style={styles.title}>德州扑克</Text>
          <Text style={styles.subtitle}>游戏加载中...</Text>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          <Text style={styles.progressText}>{progress}%</Text>
        </Animated.View>
      </View>

      {/* 底部装饰 */}
      <Text
        style={[styles.footer, { bottom: Math.max(insets.bottom, 12) + 8 }]}
      >
        ALL IN OR FOLD
      </Text>
    </View>
  );
};

// 样式保持不变...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a7e07',
    overflow: 'hidden'
  },
  contentWrap: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%'
  },
  pokerTable: {
    position: 'absolute',
    boxSizing: 'content-box'
  },
  chipContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chipLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#c00',
    borderWidth: 5,
    borderColor: '#fff',
    position: 'absolute'
  },
  chipMedium: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00c',
    borderWidth: 5,
    borderColor: '#fff',
    position: 'absolute',
    transform: [{ rotate: '60deg' }]
  },
  chipSmall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0c0',
    borderWidth: 5,
    borderColor: '#fff',
    position: 'absolute',
    transform: [{ rotate: '120deg' }]
  },
  cardsContainer: {
    flexDirection: 'row',
    marginBottom: 24
  },
  card: {
    width: 80,
    height: 120,
    borderRadius: 10,
    justifyContent: 'space-between',
    // alignItems: 'center',
    marginHorizontal: -20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10
  },
  cardAce: {
    backgroundColor: '#fff',
    transform: [{ rotate: '-20deg' }],
    color: 'red'
  },
  cardKing: {
    backgroundColor: '#fff',
    transform: [{ rotate: '10deg' }],
    opacity: 0.8
  },
  cardText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000'
  },
  suit: {
    fontSize: 36,
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  hearts: {
    color: 'red'
  },
  progressContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#b8860b',
    marginTop: 16
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20
  },
  progressBar: {
    width: 250,
    height: 10,
    backgroundColor: '#444',
    borderRadius: 5,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    // 金色进度条
    backgroundColor: '#ffd700'
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ffd700',
    fontWeight: 'bold'
  },
  footer: {
    position: 'absolute',
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 16,
    letterSpacing: 4
  }
});

export default PokerLoadingScreen;
