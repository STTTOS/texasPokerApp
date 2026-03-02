import AsyncStorage from '@react-native-async-storage/async-storage';
import { type Href, Link, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';

import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel
} from '@/components/ui/checkbox';
import { CheckIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useUser } from '@/contexts/UserContext';
import { showToast } from '@/utils/toast';

const NICKNAME_MIN = 1;
const NICKNAME_MAX = 12;
const PROTOCOL_AGREED_KEY = 'protocolAgreed';

const timingConfig = {
  duration: 280,
  easing: Easing.out(Easing.ease)
};

/** animate__fadeOutLeft: 向左移动并淡出 */
const FADEOUT_LEFT_OFFSET = 80;

export default function Login() {
  const { login, setNickname } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<'login' | 'setNickname'>('login');
  const [nickname, setNicknameInput] = useState('');
  const [nicknameSubmitting, setNicknameSubmitting] = useState(false);

  const loginProgress = useSharedValue(0);
  const nicknameProgress = useSharedValue(0);

  useEffect(() => {
    AsyncStorage.getItem(PROTOCOL_AGREED_KEY).then((v) => {
      setAgreed(v === 'true');
    });
  }, []);

  useEffect(() => {
    if (mode !== 'setNickname') return;
    loginProgress.value = withTiming(1, timingConfig);
    nicknameProgress.value = withDelay(
      80,
      withTiming(1, { duration: 320, easing: Easing.out(Easing.ease) })
    );
  }, [mode, loginProgress, nicknameProgress]);

  /** animate__fadeOutLeft */
  const loginFormAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(loginProgress.value, [0, 1], [1, 0]),
    transform: [
      {
        translateX: interpolate(
          loginProgress.value,
          [0, 1],
          [0, -FADEOUT_LEFT_OFFSET]
        )
      }
    ]
  }));

  /** 配合 fadeOutLeft，昵称表单从右侧淡入 (fadeInRight) */
  const nicknameFormAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(nicknameProgress.value, [0, 1], [0, 1]),
    transform: [
      {
        translateX: interpolate(
          nicknameProgress.value,
          [0, 1],
          [FADEOUT_LEFT_OFFSET, 0]
        )
      }
    ]
  }));

  const usernameValid = useMemo(
    () => /^[A-Za-z0-9_]{6,16}$/.test(username),
    [username]
  );
  const passwordValid = useMemo(
    () => password.length >= 6 && password.length <= 20,
    [password]
  );
  const canSubmit = useMemo(
    () => usernameValid && passwordValid && agreed,
    [usernameValid, passwordValid, agreed]
  );

  const nicknameValid = useMemo(
    () => nickname.length >= NICKNAME_MIN && nickname.length <= NICKNAME_MAX,
    [nickname]
  );
  const nicknameError =
    nickname.length > 0 && !nicknameValid
      ? `${NICKNAME_MIN}~${NICKNAME_MAX}位字符`
      : '';

  const usernameError =
    username.length > 0 && !usernameValid
      ? '6~16位字符，仅支持数字、字母、下划线'
      : '';
  const passwordError =
    password.length > 0 && !passwordValid ? '6~20位字符' : '';

  const handleLogin = async () => {
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    try {
      const result = await login(username, password);
      if (result.type === 'login') {
        router.push({ pathname: '/transition' });
      } else if (result.type === 'register') {
        setMode('setNickname');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetNickname = async () => {
    if (!nicknameValid || nicknameSubmitting) return;
    setNicknameSubmitting(true);
    try {
      await setNickname(nickname);
      router.push({ pathname: '/home' });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : '设置昵称失败，请重试';
      showToast(message);
    } finally {
      setNicknameSubmitting(false);
    }
  };

  return (
    <View>
      <View style={styles.container} className="bg-yellow-100 dark:bg-black">
        <View className="pt-6 pr-7 basis-[35%] relative">
          {/* 登录/注册表单 - 带过渡 */}
          <Animated.View
            style={[styles.formWrap, loginFormAnimatedStyle]}
            pointerEvents={mode === 'login' ? 'auto' : 'none'}
          >
            <Text size="4xl" bold className="mb-5">
              德州扑克
            </Text>
            <Input variant="underlined" size="md" isInvalid={!!usernameError}>
              <InputField
                placeholder="用户名"
                onChangeText={setUsername}
                value={username}
              />
            </Input>
            {usernameError ? (
              <Text size="sm" className="text-error-500 mt-1">
                {usernameError}
              </Text>
            ) : null}

            <Input
              variant="underlined"
              size="md"
              className="mt-2"
              isInvalid={!!passwordError}
            >
              <InputField
                placeholder="密码"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </Input>
            {passwordError ? (
              <Text size="sm" className="text-error-500 mt-1">
                {passwordError}
              </Text>
            ) : null}

            <Button
              size="md"
              variant="outline"
              action="primary"
              className="mt-8"
              isDisabled={!canSubmit || submitting}
              onPress={handleLogin}
            >
              {submitting && <ButtonSpinner className="mr-1" />}
              <ButtonText action="primary">
                {submitting ? '处理中...' : '一键登录'}
              </ButtonText>
            </Button>

            <Checkbox
              size="md"
              isInvalid={false}
              isDisabled={false}
              value="protocol"
              className="mt-4"
              onChange={(checked) => {
                setAgreed(checked);
                AsyncStorage.setItem(
                  PROTOCOL_AGREED_KEY,
                  checked ? 'true' : 'false'
                );
              }}
              isChecked={agreed}
            >
              <CheckboxIndicator>
                <CheckboxIcon as={CheckIcon} />
              </CheckboxIndicator>
              <CheckboxLabel>
                <Text>已阅读并同意 </Text>
                <Link href={'/protocol' as Href} asChild>
                  <Text className="text-primary-500 underline">用户协议</Text>
                </Link>
              </CheckboxLabel>
            </Checkbox>
            <Text size="sm" className="mt-2">
              如果没有账号,将自动注册, 用户名不可更改
              {/* If you do not have an account, you will be automatically
              registered. */}
            </Text>
          </Animated.View>

          {/* 设置昵称表单 - 带过渡 */}
          <Animated.View
            style={[
              styles.formWrap,
              styles.formWrapOverlay,
              nicknameFormAnimatedStyle
            ]}
            pointerEvents={mode === 'setNickname' ? 'auto' : 'none'}
          >
            <Text size="4xl" bold className="mb-5">
              设置昵称
            </Text>
            <Input variant="underlined" size="md" isInvalid={!!nicknameError}>
              <InputField
                placeholder={`${NICKNAME_MIN}~${NICKNAME_MAX}位昵称`}
                value={nickname}
                onChangeText={setNicknameInput}
              />
            </Input>
            {nicknameError ? (
              <Text size="sm" className="text-error-500 mt-1">
                {nicknameError}
              </Text>
            ) : null}

            <Button
              size="md"
              variant="outline"
              action="primary"
              className="mt-8"
              isDisabled={!nicknameValid || nicknameSubmitting}
              onPress={handleSetNickname}
            >
              {nicknameSubmitting && <ButtonSpinner className="mr-1" />}
              <ButtonText action="primary">
                {nicknameSubmitting ? '加载中...' : '进入游戏'}
              </ButtonText>
            </Button>
          </Animated.View>
        </View>

        <View className="basis-1/2 overflow-hidden rounded-xl">
          <Image
            style={styles.image}
            src="https://cos.wishufree.com/images/compressed/nassrinart_7-mQnSWGqjYTM-unsplash%281%29__40fb77c3-6743-40c8-9320-10c8aae51e52.jpg"
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingHorizontal: '10%',
    paddingVertical: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  formWrap: {
    width: '100%'
  },
  formWrapOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 24,
    paddingRight: 28
  },
  text: {
    color: '#fff'
  },
  image: {
    objectFit: 'cover',
    height: '100%'
  },
  title: {
    color: '#fff',
    fontWeight: 600,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 22
  }
});
