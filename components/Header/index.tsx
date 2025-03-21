import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'react-native';
import { useAuth } from '@/app/context/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();

  const pathname = usePathname();
  const router = useRouter();

  const isIndexRoute = pathname === '/forms';
  const isSettingsRoute = pathname === '/settings';

  const handleGoBack = () => {
    router.back();
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <View style={[styles.container, { backgroundColor: '#7248B9' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#7248B9" />
      <View style={styles.header}>
        {!isIndexRoute ? (
          <TouchableOpacity style={styles.iconButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconButtonPlaceholder} />
        )}
        {user?.img ? (
          <Image
            source={{ uri: user.img }}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : null}
        {!isSettingsRoute ? (
          <TouchableOpacity style={styles.iconButton} onPress={handleSettings}>
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconButtonPlaceholder} />
        )}
      </View>
      <View style={[styles.bottomBand, { backgroundColor: '#FFA40B' }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  logo: {
    width: 200,
    height: 50,
  },
  iconButton: {
    padding: 8,
  },
  iconButtonPlaceholder: {
    width: 40,
  },
  bottomBand: {
    height: 6,
  },
});

export default Header;
