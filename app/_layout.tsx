import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AppState, useColorScheme } from 'react-native';
import {
  ReanimatedLogLevel,
  configureReanimatedLogger
} from 'react-native-reanimated';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { ToastBridge } from '@/components/ui/toast';
import { UserProvider } from '@/contexts/UserContext';
import '@/global.css';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  // Reanimated runs in strict mode by default
  strict: false
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf')
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const lockLandscape = () => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
    );
  };

  useEffect(() => {
    lockLandscape();

    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => {
        const { orientation } = event.orientationInfo;
        const isPortrait =
          orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
          orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN;
        if (isPortrait) {
          lockLandscape();
        }
      }
    );

    const appStateSub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        lockLandscape();
      }
    });

    return () => {
      subscription.remove();
      appStateSub.remove();
    };
  }, []);
  const theme = useColorScheme();

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode={theme || 'light'}>
      <ToastBridge>
        <UserProvider>
          {/* <ErrorProvider> */}
          <Stack
            screenOptions={{
              // 禁用所有屏幕的返回手势
              gestureEnabled: false
            }}
            initialRouteName="transition"
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="game"
              options={{
                headerShown: false,
                headerBackButtonDisplayMode: 'minimal',
                headerBackVisible: true,
                headerBackTitle: ''
              }}
            />
            <Stack.Screen
              name="login"
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen
              name="transition"
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen
              name="home"
              options={{
                headerShown: false
              }}
            />
          </Stack>
          {/* </ErrorProvider> */}
        </UserProvider>
      </ToastBridge>
    </GluestackUIProvider>
  );
}
