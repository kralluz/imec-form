// app/(tabs)/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '@/components/Header';

const FormScreens = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => router.push('/technicians')}
        >
          <MaterialIcons
            name="note-add"
            size={24}
            style={styles.newButtonIcon}
          />
          <Text style={styles.newButtonText}>Novo Formulário</Text>
        </TouchableOpacity>
        <View style={styles.actionBar}>
          <TouchableOpacity
            onPress={() => setOrder(order === 'desc' ? 'asc' : 'desc')}
            style={styles.toggleButton}
          >
            <MaterialCommunityIcons
              name={order === 'desc' ? 'sort-descending' : 'sort-ascending'}
              size={24}
              style={styles.toggleIcon}
            />
          </TouchableOpacity>
          <View style={styles.viewModeToggle}>
            <TouchableOpacity
              onPress={() => setViewMode('grid')}
              style={styles.toggleButton}
            >
              <MaterialIcons
                name="grid-view"
                size={24}
                style={[
                  styles.toggleIcon,
                  viewMode === 'grid' && styles.activeIcon,
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode('list')}
              style={styles.toggleButton}
            >
              <MaterialIcons
                name="list"
                size={24}
                style={[
                  styles.toggleIcon,
                  viewMode === 'list' && styles.activeIcon,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.emptyText}>Nenhum formulário salvo.</Text>
      </ScrollView>
    </View>
  );
};

export default FormScreens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(69, 152, 241)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  newButtonIcon: {
    marginRight: 8,
    color: '#fff',
  },
  newButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewModeToggle: {
    flexDirection: 'row',
  },
  toggleButton: {
    marginHorizontal: 4,
  },
  toggleIcon: {
    color: '#777',
  },
  activeIcon: {
    color: '#333',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#777',
  },
});
