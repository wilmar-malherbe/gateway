import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import Animated, { useAnimatedProps } from 'react-native-reanimated';

const AnimatedMaterialIcons = Animated.createAnimatedComponent(MaterialIcons);

interface AnimatedIconSymbolProps {
  name: ComponentProps<typeof MaterialIcons>['name'];
  size?: number;
  animatedColor: Animated.SharedValue<string>;
}

export function AnimatedIconSymbol({ name, size = 24, animatedColor }: AnimatedIconSymbolProps) {
  const animatedProps = useAnimatedProps(() => {
    return {
      color: animatedColor.value,
    };
  });

  return <AnimatedMaterialIcons name={name} size={size} animatedProps={animatedProps} />;
}
