import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from './styles';
import { HeaderInfo } from '../../types';

interface HeaderProps {
  headerInfo: HeaderInfo;
}

const Header: React.FC<HeaderProps> = ({ headerInfo }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>IMEC Diagnóstico</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Data:</Text>
            <Text style={styles.infoValue}>{headerInfo.date}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Hora:</Text>
            <Text style={styles.infoValue}>{headerInfo.time}</Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>IP:</Text>
            <Text style={styles.infoValue}>{headerInfo.ip}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Máscara:</Text>
            <Text style={styles.infoValue}>{headerInfo.mask}</Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>MAC:</Text>
            <Text style={styles.infoValue}>{headerInfo.mac}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Header;