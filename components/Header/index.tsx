import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from './styles';
import { HeaderInfo } from '../../types';

interface HeaderProps {
  headerInfo: HeaderInfo;
}

const Header: React.FC<HeaderProps> = ({ headerInfo }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logoimecdiagnostico.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default Header;
