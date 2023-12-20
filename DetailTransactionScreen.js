import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Spacing from './constants/Spacing';
import FontSize from './constants/FontSize';
import Colors from './constants/Colors';
import Font from './constants/Font';
import { useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const DetailTransaksiScreen = () => {
  const route = useRoute();
  const [details, setDetails] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionPayment, setTransactionPayment] = useState([]);

  const { id } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mengambil data  dari api  detail transaksi
        const responseDetails = await fetch(`http://10.42.69.66:6969/api/transactionDetail/list?transaction_id=${id}`);
        if (!responseDetails.ok) {
          throw new Error(`HTTP error! Status: ${responseDetails.status}`);
        }
        const detailsData = await responseDetails.json();
        console.log('Transaction Details API Response:', detailsData);
        setDetails(detailsData.data);

        const responseStatus = await fetch(`http://10.42.69.66:6969/api/transaction/list`);
        if (!responseStatus.ok) {
          throw new Error(`HTTP error! Status: ${responseStatus.status}`);
        }
        const statusData = await responseStatus.json();
        console.log('Transaction Status API Response:', statusData);

        const transactionData = statusData.data.find(transaction => transaction.id === id);

        if (!transactionData) {
          throw new Error('Transaction data not found.');
        }

        const transactionStatus = transactionData.status;
        const transactionPayment = transactionData.payment_method;

        setStatus(transactionStatus);
        setTransactionPayment(transactionPayment);
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
    try {
      let apiUrl = "";

      // Determine the appropriate API endpoint based on the current status
      if (status === "TAKEN") {
        apiUrl = "http://10.42.69.66:6969/api/transaction/take_order";
      } else if (status === "ON_COOK") {
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
        body: JSON.stringify({ transaction_id: id }), // Adjust the payload as needed
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Assuming a successful update, you may want to update the local state
      // or perform any other necessary actions
      console.log("Status update successful");
    } catch (error) {
      console.error("Error updating status:", error.message);
      // Handle the error as needed
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
        <>
          <FlatList
            data={details}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <View style={styles.itemDetails}>
                  <Image
                    style={styles.menuImage}
                    source={{ uri: item.menu_img_photo }}
                  />
                  <Text>{item.amount} x </Text>
                  <Text>{item.menu_name}</Text>
                </View>
                <Text>Rp. {item.menu_unit_cost}</Text>
              </View>
            )}
          />

          <View style={styles.totalContainer}>
            <Text>Total Item: <Text style={styles.boldText}>{totalItems}</Text></Text>
            <Text>Total: <Text style={styles.boldText}>Rp. {totalTransactionCost}</Text></Text>
          </View>

          <View style={styles.statusContainer}>
            <Text>Status: <Text style={styles.boldText}>{status}</Text></Text>
            <Text>Pembayaran: <Text style={styles.boldText}>{transactionPayment}</Text></Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleStatusUpdate}
              style={styles.button}
            >
              <FontAwesome name="shopping-cart" size={24} color={Colors.onPrimary} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Selesaikan Pesanan</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    marginVertical: Spacing,
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
    marginRight: 10,
    borderRadius: 8,
  },
  totalContainer: {
    padding: Spacing * 2,
  },
  boldText: {
    fontFamily: Font['poppins-bold'],
  },
  statusContainer: {
    marginVertical: Spacing * 0.5,
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
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontFamily: Font['poppins-bold'],
    color: Colors.onPrimary,
    textAlign: 'center',
    fontSize: FontSize.large,
  },
});

export default DetailTransaksiScreen;
