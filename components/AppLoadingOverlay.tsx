import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/theme';

interface AppLoadingOverlayProps {
  isLoading: boolean;
  onFinished: () => void;
}

export function AppLoadingOverlay({ isLoading, onFinished }: AppLoadingOverlayProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!isLoading) {
      opacity.value = withDelay(
        200,
        withTiming(0, { duration: 400 }, (finished) => {
          if (finished) {
            runOnJS(onFinished)();
          }
        })
      );
    }
  }, [isLoading]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents={isLoading ? 'auto' : 'none'}>
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/Helderberg_Gemeente_Logo_Blou.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.white,
    zIndex: 999,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 80,
  },
});
