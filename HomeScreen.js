// import React from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const HomeScreen = () => {
//   const navigation = useNavigation();

//   const handleLogout = async () => {
//     // Hapus informasi login dari AsyncStorage
//     await AsyncStorage.removeItem('isLoggedIn');
//     // Navigasi kembali ke halaman login setelah logout
//     navigation.replace('Login');
//   };

//   return (
//     <View style={styles.container}>
//       <Text>Selamat datang di Aplikasi</Text>
//       <Button title="Logout" onPress={handleLogout} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default HomeScreen;
