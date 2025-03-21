import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import Header from '@/components/Header';
import { useAuth } from '@/app/context/AuthContext';
import * as SecureStore from 'expo-secure-store';

export default function SettingsScreen() {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: () => logout(),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleClearCache = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken'); // Exemplo de limpeza de token
      // Adicione outras limpezas de cache aqui, se necessário (AsyncStorage, etc.)
      Alert.alert('Cache limpo', 'O cache do aplicativo foi limpo com sucesso.');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao limpar o cache.');
    }
  };

  const renderSettingItem = (iconName: React.ComponentProps<typeof Ionicons>['name'], text: string, onPress: () => void, iconSet: any = Ionicons) => {
     const IconComponent = iconSet;
    return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <IconComponent name={iconName} size={24} color="#7248B9" />
      <Text style={styles.settingText}>{text}</Text>
      <Ionicons name="chevron-forward" size={20} color="#7248B9" />
    </TouchableOpacity>
  );
}

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Configurações</Text>

        {renderSettingItem("log-out", "Sair", handleLogout, MaterialCommunityIcons)}
        {renderSettingItem("information-circle-outline", "Sobre", () => {})}
        {renderSettingItem("help-circle-outline", "Suporte", () => {})}
        {renderSettingItem("bug-outline", "Logs do Sistema", () => {}, MaterialCommunityIcons)}
        {renderSettingItem("trash-outline", "Limpar Cache", handleClearCache, Feather)}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Fundo mais claro para destacar os itens
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7248B9',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  settingText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333', // Cor do texto principal
    flex: 1, // Ocupa o espaço restante
  },
});