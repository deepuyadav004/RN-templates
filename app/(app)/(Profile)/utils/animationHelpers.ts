import { Animated } from 'react-native';

// Create a shared animated value for the header
export const headerScrollY = new Animated.Value(0);
export const headerShowAnimation = new Animated.Value(1);

// Create a shared scroll handler that can be used by all sections
export const createScrollHandler = () => {
  const lastScrollY = { current: 0 };
  const scrollDirection = { current: 0 };

  return Animated.event(
    [{ nativeEvent: { contentOffset: { y: headerScrollY } } }],
    {
      useNativeDriver: true,
      listener: (event) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        if (currentScrollY <= 0) {
          // At the top - always show header
          Animated.timing(headerShowAnimation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
          }).start();
        } else if (currentScrollY < lastScrollY.current) {
          // Scrolling up - show header
          if (scrollDirection.current !== 1) {
            scrollDirection.current = 1;
            Animated.timing(headerShowAnimation, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true
            }).start();
          }
        } else if (currentScrollY > lastScrollY.current) {
          // Scrolling down - hide header after threshold
          if (scrollDirection.current !== -1 && currentScrollY > 100) {
            scrollDirection.current = -1;
            Animated.timing(headerShowAnimation, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true
            }).start();
          }
        }
        lastScrollY.current = currentScrollY;
      }
    }
  );
};

// Shared scroll handler that all sections can use
export const sharedScrollHandler = createScrollHandler();
