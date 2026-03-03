import React from 'react';
import { View, StyleSheet, Pressable, Platform, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/theme';
import { AnimatedIconSymbol } from './AnimatedIconSymbol';

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 90,
  mass: 0.8,
};

const ICON_MAPPING: Record<string, string> = {
  'house.fill': 'home',
  'newspaper.fill': 'newspaper',
  'play.rectangle.fill': 'play-circle',
  'ellipsis.circle.fill': 'more-horiz',
};

interface TabIconProps {
  index: number;
  isFocused: boolean;
  iconName: string;
  bubblePosition: Animated.SharedValue<number>;
  tabWidth: number;
}

function TabIcon({ index, isFocused, iconName, bubblePosition, tabWidth }: TabIconProps) {
  const scale = useSharedValue(isFocused ? 1.2 : 1);

  React.useEffect(() => {
    scale.value = withSpring(isFocused ? 1.2 : 1, SPRING_CONFIG);
  }, [isFocused, scale]);

  const animatedColor = useDerivedValue(() => {
    const tabCenter = index * tabWidth + tabWidth / 2;
    const bubbleCenter = bubblePosition.value + tabWidth / 2;
    const distance = Math.abs(bubbleCenter - tabCenter);
    const threshold = tabWidth / 2;

    return interpolateColor(
      distance,
      [0, threshold],
      [COLORS.white, '#8E8E93']
    );
  }, [bubblePosition, index, tabWidth]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const materialIconName = ICON_MAPPING[iconName] || 'home';

  return (
    <Animated.View style={animatedIconStyle}>
      <AnimatedIconSymbol name={materialIconName} size={24} animatedColor={animatedColor} />
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

          const getIconName = () => {
            switch (route.name) {
              case 'index':
                return 'house.fill';
              case 'news':
                return 'newspaper.fill';
              case 'videos':
                return 'play.rectangle.fill';
              case 'menu':
                return 'ellipsis.circle.fill';
              default:
                return 'house.fill';
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tab}
            >
              <TabIcon
                index={index}
                isFocused={isFocused}
                iconName={getIconName()}
                bubblePosition={translateX}
                tabWidth={tabWidth}
              />
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
      ios: 20,
      android: 12,
      default: 12,
    }),
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
