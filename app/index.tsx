// app/index.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '../constants/Colors';
import { TextStyles } from '../constants/Typography';

const { width } = Dimensions.get('window');
const cardMargin = 10;
const cardWidth = (width - cardMargin * 3) / 2;

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcome}>Bem-vindo ao imec formulários</Text>
      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/forms' as any)}
          activeOpacity={0.8}
        >
          <Image
            source={{
              uri: 'http://postgresql-16-chevereto.5lsiua.easypanel.host/images/2025/03/07/e5a3ff114b37aa9ea390d504cf6930aa.png',
            }}
            style={styles.cardLogo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/forms' as any)}
          activeOpacity={0.8}
        >
          <Image
            source={{
              uri: 'http://postgresql-16-chevereto.5lsiua.easypanel.host/images/2025/03/10/e1eb40e3c64d2608f31828fda933504d.png',
            }}
            style={styles.cardLogo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {/* Card 3: imec Urologia */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/forms' as any)}
          activeOpacity={0.8}
        >
          <Image
            source={{
              uri: 'http://postgresql-16-chevereto.5lsiua.easypanel.host/images/2025/03/10/9e0c794e32e25a5e3f9ede057a537bd2.png',
            }}
            style={styles.cardLogo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View
          style={[
            {
              width: cardWidth,
              height: cardWidth,
              backgroundColor: Colors.white,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            },
            styles.dottedCard,
          ]}
        >
          <Text style={styles.placeholderText}>+</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 40, // espaçamento do topo
    paddingHorizontal: cardMargin,
  },
  welcome: {
    ...TextStyles.heading3,
    textAlign: 'center',
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    height: cardWidth,
    backgroundColor: Colors.white,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: cardMargin,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardLogo: {
    width: cardWidth * 0.8,
    height: cardWidth * 0.8,
  },
  dottedCard: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  placeholderText: {
    ...TextStyles.heading3,
    color: '#ccc',
  },
});
