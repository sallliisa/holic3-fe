import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Spacing from './constants/Spacing';
import FontSize from './constants/FontSize';
import Font from './constants/Font';
import Colors from './constants/Colors';
import storage from './lib/storage';

const Dashboard = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Transaksi');
  };
  const [user, setUser] = useState({})
  const [shift, setShift] = useState(0)
  const [loading, setLoading] = useState(true)
  storage.load({key: 'user'}).then(res => {
    setUser(res)
  })

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://10.42.69.66:6969/api/get_current_shift`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setShift(data.data.shift);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <View style={{display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', gap: 24}}>
      <View style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        <View style={{display: 'flex', flexDirection: 'column', gap: 2}}>
          <Text>Selamat Datang</Text>
          <Text style={{fontSize: FontSize.large}}>{user.name}</Text>
        </View>
        <View style={{display: 'flex', flexDirection: 'column', gap: 2}}>
          <Text>Role: {user.role?.name}</Text>
          {loading ? (<></>) : (<Text>Shift Sekarang: {shift}</Text>)}
        </View>
      </View>
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
          Mulai Shift
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
