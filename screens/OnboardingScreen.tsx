import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

interface OnboardingScreenProps {
  navigation: OnboardingScreenNavigationProp;
}

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  title: string;
  description: string;
  icon: string;
}

const slides: OnboardingSlide[] = [
  {
    title: 'Buy & Sell Palm Oil',
    description: 'Connect with buyers and sellers in the palm oil marketplace. Trade with confidence.',
    icon: '🛒',
  },
  {
    title: 'Browse Listings',
    description: 'Explore available palm oil listings from verified sellers. Find the best prices and quality.',
    icon: '🔍',
  },
  {
    title: 'Track Orders',
    description: 'Monitor your orders in real-time. Get updates on delivery status and manage your transactions.',
    icon: '📦',
  },
  {
    title: 'Get Started',
    description: 'Join thousands of traders in the palm oil marketplace. Start buying or selling today!',
    icon: '🚀',
  },
];

export default function OnboardingScreen({ navigation }: OnboardingScreenProps): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };

  const handleNext = (): void => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = async (): Promise<void> => {
    await AsyncStorage.setItem('onboarding_completed', 'true');
    navigation.replace('Login');
  };

  const handleGetStarted = async (): Promise<void> => {
    await AsyncStorage.setItem('onboarding_completed', 'true');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/palm-link.png')} 
                style={styles.logo} 
                resizeMode="contain"
              />
            </View>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{slide.icon}</Text>
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {currentIndex < slides.length - 1 ? (
            <>
              <Button
                title="Skip"
                onPress={handleSkip}
                variant="text"
                size="medium"
                style={styles.skipButton}
              />
              <Button
                title="Next"
                onPress={handleNext}
                variant="primary"
                size="medium"
                style={styles.nextButton}
              />
            </>
          ) : (
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              variant="primary"
              size="large"
              fullWidth
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 100,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  iconContainer: {
    marginBottom: 32,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: '#e27a14',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  skipButton: {
    flex: 0,
  },
  nextButton: {
    flex: 1,
  },
});
