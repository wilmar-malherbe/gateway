import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { translate } from '@/translations';

interface SeasonHeaderProps {
  isSummer: boolean;
}

export function SeasonHeader({ isSummer }: SeasonHeaderProps) {
  const { language } = useLanguage();
  const t = translate(language);

  const seasonText = isSummer ? t.home.seasonSummer : t.home.seasonWinter;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/Untitled_design.png')}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.textPill}>
            <Text style={styles.seasonText}>{seasonText}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 160,
    marginBottom: 12,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    borderRadius: 20,
  },
  overlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 20,
  },
  textPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  seasonText: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#333',
    textAlign: 'center',
  },
});
