import { Animated } from 'react-native';

// Create a shared animated value for the header
export const headerScrollY = new Animated.Value(0);
export const headerShowAnimation = new Animated.Value(1); // Always visible

// Create a shared scroll handler that can be used by all sections
export const createScrollHandler = () => {
  return Animated.event(
    [{ nativeEvent: { contentOffset: { y: headerScrollY } } }],
    {
      useNativeDriver: true,
      listener: () => {
        // Always keep header visible by maintaining value at 1
        if (headerShowAnimation._value !== 1) {
          Animated.timing(headerShowAnimation, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true
          }).start();
        }
      }
    }
  );
};

// Shared scroll handler that all sections can use
export const sharedScrollHandler = createScrollHandler();
