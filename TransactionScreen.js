import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Spacing from './constants/Spacing';
import FontSize from './constants/FontSize';
import Colors from './constants/Colors';
import { useNavigation } from '@react-navigation/native';

const TransactionScreen = () => {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('COMPLETED');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://10.42.69.66:6969/api/transaction/list');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTransactions(data.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleTransactionPress = (id) => {
    // Navigate to DetailTransaksiScreen and pass the selected transactionId
    navigation.navigate('DetailTransaksi', { id });
  };

  // Filter transactions based on their status
  const filterTransactions = () => {
    return transactions.filter((item) => item.status === selectedStatus);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: Spacing * 2, marginTop: Spacing * 2 }}>

        <TouchableOpacity onPress={() => setSelectedStatus('JUST_IN')} style={selectedStatus === 'JUST_IN' ? styles.activeButton : styles.inactiveButton}>
          <Text style={{ color: selectedStatus === 'JUST_IN' ? 'white' : 'orange', fontSize: FontSize.large }}>Just In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelectedStatus('ON_COOK')} style={selectedStatus === 'ON_COOK' ? styles.activeButton : styles.inactiveButton}>
          <Text style={{ color: selectedStatus === 'ON_COOK' ? 'white' : 'orange', fontSize: FontSize.large }}>On Cook</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelectedStatus('SERVED')} style={selectedStatus === 'SERVED' ? styles.activeButton : styles.inactiveButton}>
          <Text style={{ color: selectedStatus === 'SERVED' ? 'white' : 'orange', fontSize: FontSize.large }}>Served</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelectedStatus('COMPLETED')} style={selectedStatus === 'COMPLETED' ? styles.activeButton : styles.inactiveButton}>
          <Text style={{ color: selectedStatus === 'COMPLETED' ? 'white' : 'orange', fontSize: FontSize.large }}>Completed</Text>
        </TouchableOpacity>

      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1, justifyContent: 'center' }} />
      ) : (
        <FlatList
          data={filterTransactions()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            // Inside the FlatList renderItem={({ item }) => { ... }}
            <TouchableOpacity
              onPress={() => handleTransactionPress(item.id)}
              style={{
                padding: Spacing * 2,
                backgroundColor: Colors.background,
                marginVertical: Spacing,
                borderRadius: Spacing,
                shadowColor: Colors.gray,
                shadowOffset: {
                  width: 0,
                  height: Spacing,
                },
                shadowOpacity: 0.3,
                shadowRadius: Spacing,
                position: 'relative',
              }}
            >
              <View style={{ paddingLeft: Spacing, paddingRight: Spacing, position: 'relative' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{  fontWeight: 'bold' }}>{item.customer_name}</Text>
                <Text style={{ marginLeft: Spacing }}># {item.id}</Text>
              </View>
              <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginVertical: Spacing }} />
                  <Text>ID Transaksi : {item.code}</Text>
                  <Text>ID Pelanggan : {item.customer_id}</Text>
                  <Text>ID Pengguna : {item.user_id}</Text>
                  <Text>Shift: {item.shift} </Text>
                  <Text>Kode Promo :{item.promo_name}</Text>
                  <Text>Nomor Meja : {item.table_code}</Text>
                  <Text>Tanggal Transaksi : {item.date}</Text>
                  <Text>Total Diskon : {item.total_discount}</Text>
                  <Text>Total : {item.total}</Text>
                  <Text style={{ color: item.status === "COMPLETED" ? 'green' : Colors.blue, position: 'absolute', top: 0, right: 0 }}>{item.status}</Text>
              </View> 
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = {
  activeButton: {
    backgroundColor: Colors.primary,
    padding: Spacing * 2,
    borderRadius: Spacing,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: Spacing,
    },
    shadowOpacity: 0.3,
    shadowRadius: Spacing,
  },
  inactiveButton: {
    backgroundColor: Colors.background,
    padding: Spacing * 2,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.white,
  },
};

export default TransactionScreen;

// style={{ position: 'absolute', top: 0, right: 0, color: 'green' }}