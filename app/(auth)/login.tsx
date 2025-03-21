// app/(auth)/index.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Modal,
  TextInput,
  Pressable,
  Animated,
  Easing,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { router, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import Colors from '@/constants/Colors';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../context/UsersContext';
import { cardWidth, styles } from '../HomeScreen.styles';

export default function HomeScreen() {
  const { users, isLoading, error, getUsers } = useUsers();
  const { token, login } = useAuth();
  const routerExpo = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ email: string } | null>(
    null,
  );
  const [password, setPassword] = useState('');
  const [loginProcessing, setLoginProcessing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorShake, setErrorShake] = useState(false);

  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (token) {
      routerExpo.replace('/forms');
    }
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getUsers();
    setRefreshing(false);
  };

  const triggerShake = () => {
    setErrorShake(true);
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        setErrorShake(false);
      }, 1000);
    });
  };

  const handleCardPress = (user: { email: string }) => {
    setSelectedUser(user);
    setPassword('');
    setModalVisible(true);
  };

  const handleLogin = async () => {
    if (!selectedUser) return;
    setLoginProcessing(true);
    try {
      await login(selectedUser.email, password);
      router.push('/forms');
      setModalVisible(false);
    } catch (err: any) {
      if (err.message === 'Credenciais inválidas') {
        triggerShake();
        setPassword('');
      }
    } finally {
      setLoginProcessing(false);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.welcome}>Bem-vindo ao imec formulários</Text>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : users.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum setor cadastrado</Text>
            </View>
          ) : (
            <View style={styles.cardsContainer}>
              {users.map((user: any) => (
                <TouchableOpacity
                  key={user.id}
                  style={styles.card}
                  onPress={() => handleCardPress(user)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: user.img }}
                    style={styles.cardLogo}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
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
          )}
        </ScrollView>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ translateX: shakeAnimation }],
                  borderColor: errorShake ? 'red' : Colors.white,
                  borderWidth: errorShake ? 2 : 0,
                },
              ]}
            >
              <Text style={styles.modalTitle}>Digite sua senha</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                {password.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setPassword('')}
                  >
                    <Text style={styles.clearButtonText}>X</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.modalButtons}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={styles.loginButton}
                  onPress={handleLogin}
                  disabled={loginProcessing}
                >
                  <Text style={styles.buttonText}>
                    {loginProcessing ? 'Processando...' : 'Entrar'}
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </SafeAreaView>
      <Toast topOffset={50} />
    </>
  );
}
