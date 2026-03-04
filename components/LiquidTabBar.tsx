import React from 'react';
import { View, StyleSheet, Pressable, Platform, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/theme';

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 90,
  mass: 0.8,
};

interface TabIconProps {
  isFocused: boolean;
  icon: ((props: { focused: boolean; color: string; size: number }) => React.ReactNode) | undefined;
}

function TabIcon({ isFocused, icon }: TabIconProps) {
  const scale = useSharedValue(isFocused ? 1.2 : 1);

  React.useEffect(() => {
    scale.value = withSpring(isFocused ? 1.2 : 1, SPRING_CONFIG);
  }, [isFocused, scale]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedIconStyle}>
      {icon?.({
        focused: isFocused,
        color: isFocused ? COLORS.white : '#8E8E93',
        size: 24,
      })}
    </Animated.View>
  );
}

export function LiquidTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const screenWidth = Dimensions.get('window').width;
  const tabWidth = screenWidth / state.routes.length;
  const translateX = useSharedValue(state.index * tabWidth);

  React.useEffect(() => {
    translateX.value = withSpring(state.index * tabWidth, SPRING_CONFIG);
  }, [state.index, tabWidth, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.tabBarContainer}>
        <Animated.View
          style={[
            styles.liquidBubble,
            {
              width: tabWidth,
            },
            animatedStyle,
          ]}
        >
          <View style={styles.bubble} />
        </Animated.View>

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tab}
            >
              <TabIcon isFocused={isFocused} icon={options.tabBarIcon} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.baseLight,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingBottom: Platform.select({
      ios: 34,
      android: 20,
      default: 20,
    }),
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabBarContainer: {
    flexDirection: 'row',
    height: 70,
    position: 'relative',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  liquidBubble: {
    position: 'absolute',
    height: '100%',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
  },
});
