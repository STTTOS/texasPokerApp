import type { PlayerTakeActionRes } from '@/types/game';

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';

import useWebSocketReceiver, { GameWSEvents } from '@/hooks/useWebSocketReceiver';

/**
 * 公屏公告组件
 */
const PublicMessage = () => {
	const [text, setText] = useState<string>();
	const translateY = useRef(new Animated.Value(-30)).current;

	useWebSocketReceiver({
		handlers: {
			[GameWSEvents.PlayerTakeAction]: (playerTakeActionRes: PlayerTakeActionRes) => {
				const { userId, actionType, amount } = playerTakeActionRes;

				setText(`${userId} ${actionType} ${amount}`);
			}
		},
	});

	useEffect(() => {
		if (text) {
			fadeIn();

			const timer = setTimeout(fadeOut, 2000); // 留出淡出动画时间
			return () => clearTimeout(timer);
		}
	}, [text]);

	// 淡入动画
	const fadeIn = () => {
		Animated.timing(translateY, {
			toValue: 0,
			duration: 300,
			easing: Easing.ease,
			useNativeDriver: true,
		}).start();
	};

	// 淡出动画
	const fadeOut = () => {
		Animated.timing(translateY, {
			toValue: 30,
			duration: 300,
			easing: Easing.ease,
			useNativeDriver: true,
		}).start(() => {
			translateY.setValue(-30);
		});
	};

	return (
		<Animated.View style={[styles.container]}>
			<Animated.Text style={[styles.text, { transform: [{ translateY }] }]}>{text}</Animated.Text>
		</Animated.View>
	);
};

// 样式
const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: '35%',
		alignSelf: 'center',
		height: 30,
		overflow: 'hidden',
		maxWidth: '100%',
	},

	text: {
		color: '#fff',
		fontSize: 14,
		lineHeight: 20,
		textAlign: 'center'
	},
});

export default PublicMessage;