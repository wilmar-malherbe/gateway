import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ViewToken,
} from 'react-native';
import { ServiceTime } from '@/hooks/useSeasonalServices';
import { useLanguage } from '@/contexts/LanguageContext';
import { Clock, MapPin } from 'lucide-react-native';

interface ServiceCarouselProps {
  services: ServiceTime[];
}

const { width } = Dimensions.get('window');
const CONTENT_PADDING = 16;
const CARD_WIDTH = width - (CONTENT_PADDING * 2);
const CARD_SPACING = 16;

export function ServiceCarousel({ services }: ServiceCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { language } = useLanguage();
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderService = ({ item }: { item: ServiceTime }) => {
    const serviceName = language === 'afr' ? item.service_name_afr : item.service_name_eng;

    return (
      <View style={styles.card}>
        <Text style={styles.serviceName}>{serviceName}</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Clock size={20} color="#666" strokeWidth={2} />
            <Text style={styles.detailText}>{item.service_time}</Text>
          </View>

          <View style={styles.detailRow}>
            <MapPin size={20} color="#666" strokeWidth={2} />
            <Text style={styles.detailText}>{item.venue}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPaginationDots = () => {
    return (
      <View style={styles.paginationContainer}>
        {services.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  if (services.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No services available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={services}
        renderItem={renderService}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
        ItemSeparatorComponent={() => <View style={{ width: CARD_SPACING }} />}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      {renderPaginationDots()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -CONTENT_PADDING,
    width: width,
  },
  flatListContent: {
    paddingHorizontal: CONTENT_PADDING,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    minHeight: 180,
    justifyContent: 'center',
  },
  serviceName: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#666',
    flex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  paginationDotActive: {
    backgroundColor: '#1093eb',
    width: 24,
  },
  emptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#999',
  },
});
