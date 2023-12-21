import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Spacing from './constants/Spacing';
import FontSize from './constants/FontSize';
import Colors from './constants/Colors';
import Font from './constants/Font';
import { useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DetailTransaksiScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [details, setDetails] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionData, setTransactionData] = useState({})

  const { id } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mengambil data dari api detail transaksi
        const responseDetails = await fetch(`http://10.42.69.66:6969/api/transactionDetail/list?transaction_id=${id}`);
        if (!responseDetails.ok) {
          throw new Error(`HTTP error! Status: ${responseDetails.status}`);
        }
        const detailsData = await responseDetails.json();
        console.log('Transaction Details API Response:', detailsData);
        setDetails(detailsData.data); 

        const responseStatus = await fetch(`http://10.42.69.66:6969/api/transaction/show/${id}`);
        if (!responseStatus.ok) throw new Error(`HTTP error! Status: ${responseStatus.status}`);
        const {data: transactionData} = await responseStatus.json();
        setTransactionData(transactionData)
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setError('Error fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleStatusUpdate = async () => {
    console.log()
    try {
      let apiUrl = "";
      if (transactionData.status === "TAKEN") {
        apiUrl = "http://10.42.69.66:6969/api/transaction/take_order";
      } else if (transactionData.status === "ON_COOK") {
        apiUrl = "http://10.42.69.66:6969/api/transaction/finish";
      } else {
        console.warn("Invalid status for status update");
        return;
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transaction_id: id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log('response is', response)
      navigation.navigate('Transaksi');
      console.log("Status update successful");
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };

  let totalItems = 0;
  let totalTransactionCost = 0;
  if (details.length > 0) {
    totalItems = details.reduce((acc, item) => acc + item.amount, 0);
    totalTransactionCost = details.reduce((acc, item) => acc + item.amount * item.menu_unit_cost, 0);
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingIndicator} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
          <View style={{flexDirection: 'column', gap: 32}}>
            <View style={{flexDirection: 'column', gap: 4}}>
              <Text style={{fontSize: FontSize.large}}>{transactionData.code}</Text>
              <Text style={{color: Colors.darkText}}>{new Date(transactionData.date).toLocaleDateString('id-ID')} - Meja {transactionData.table_code} - Shift {transactionData.shift}</Text>
              <Text>Pelanggan: {transactionData.customer_name}</Text>
              <Text>Penyaji: {transactionData.user_name}</Text>
              <Text>Kode Promo :{transactionData.promo_name}</Text>
            </View>

            <FlatList
              contentContainerStyle={{flexDirection: 'column', gap: 8, display: 'flex'}}
              data={details}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.gray, padding: 8, borderRadius: 16}}>
                  <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                    <Image
                      style={styles.menuImage}
                      source={{ uri: item.menu_img_photo }}
                    />
                    <View style={{display: 'flex', flexDirection: 'column', gap: 4}}>
                      <View style={{display: 'flex', flexDirection: 'row', gap: 4}}>
                        <Text>{item.menu_name}</Text>
                        <Text style={{color: Colors.darkText}}>x{item.amount}</Text>
                      </View>
                      <Text style={{fontSize: 12}}>Rp. {item.menu_unit_cost}</Text>
                    </View>
                  </View>
                  <Text style={{fontSize: 12}}>Rp. {item.menu_unit_cost * item.amount}</Text>
                </View>
              )}
            />

            <View style={{display: 'flex', flexDirection: 'column', gap: 2}}>
              <Text>Subtotal: <Text>Rp. {transactionData.subtotal}</Text></Text>
              <Text>Promo: <Text>Rp. {transactionData.total_discount}</Text></Text>
              <Text>Total: <Text style={styles.boldText}>Rp. {transactionData.total}</Text></Text>
            </View>

            <View style={{display: 'flex', flexDirection: 'column', gap: 2}}>
              <Text>Status: <Text style={styles.boldText}>{transactionData.status}</Text></Text>
              <Text>Pembayaran: <Text style={styles.boldText}>{transactionData.payment_method}</Text></Text>
            </View>
          </View>
          {["TAKEN", "ON_COOK"].includes(transactionData.status) && (
            <TouchableOpacity
            onPress={() => {
              handleStatusUpdate();
            }}
            style={{ ...styles.button }}
            >
              {/* <FontAwesome name="shopping-cart" size={24} color={Colors.onPrimary} style={styles.buttonIcon} /> */}
              <Text style={styles.buttonText}>{transactionData.status == 'TAKEN' ? 'Mulai Masak' : 'Selesai Masak'}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.error,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: Spacing * 4,
    paddingRight: Spacing * 4,
    paddingBottom: Spacing * 2,
    paddingTop: Spacing * 4,
    backgroundColor: Colors.background,
    borderRadius: Spacing,
    shadowColor: Colors.gray,
    shadowOffset: {
      width: 0,
      height: Spacing,
    },
    shadowOpacity: 0.3,
    shadowRadius: Spacing,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  totalContainer: {
    padding: Spacing * 2,
  },
  boldText: {
    fontFamily: Font['poppins-bold'],
  },
  statusContainer: {
    padding: Spacing * 2,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing * 2,
    backgroundColor: Colors.primary,
    borderRadius: Spacing,
    elevation: 5,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: Spacing,
    },
    shadowOpacity: 0.3,
    shadowRadius: Spacing,
    maxWidth: 700,
  },
  buttonText: {
    fontFamily: Font['poppins-bold'],
    color: Colors.onPrimary,
    textAlign: 'center',
    fontSize: FontSize.large,
  },
});

export default DetailTransaksiScreen;
