import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Spacing from './constants/Spacing';
import FontSize from './constants/FontSize';
import Font from './constants/Font';
import Colors from './constants/Colors';

const Dashboard = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Transaksi');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePress}
        style={styles.button}
      >
        <Text
          style={{
            fontFamily: Font['poppins-bold'],
            color: Colors.onPrimary,
            fontSize: FontSize.large,
            textAlign: 'center',
          }}
        >
          Akses Masuk
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing * 1.5,
    paddingHorizontal: Spacing * 5,
    borderRadius: Spacing,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: Spacing,
    },
    shadowOpacity: 0.3,
    shadowRadius: Spacing,
    elevation: Spacing,
  },
});

export default Dashboard;
