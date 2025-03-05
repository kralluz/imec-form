import React from 'react';

import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;

  onPress: () => void;

  style?: object;

  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, style, children }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={styles.buttonText}>{title}</Text>

      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',

    padding: 10,

    borderRadius: 5,

    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',

    fontSize: 16,
  },
});

export default Button;
