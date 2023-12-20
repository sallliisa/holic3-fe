import React from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Spacing from './constants/Spacing';
import FontSize from './constants/FontSize';
import Font from './constants/Font';
import Colors from './constants/Colors';


const WelcomeScreen = () => {

    const navigation = useNavigation();

    const handlePress = () => {
        // Navigate to 'Login' screen
        navigation.navigate('Login');
    };

    const { height } = Dimensions.get('window');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ flex: 1 }}>
        <ImageBackground
          style={{ flex: 1, height: height / 2.5 }}
          resizeMode="contain"
          source={require('./assets/MakanBersama.png')}
        />
        <View style={{ paddingHorizontal: Spacing * 4, paddingTop: Spacing * 4 }}>
          <Text
            style={{
              fontSize: FontSize.xxLarge,
              color: Colors.primary,
              fontFamily: Font['poppins-bold'],
              textAlign: 'center',
            }}
          >
            Warmindo Zezaga
          </Text>

          <Text
            style={{
              fontSize: FontSize.small,
              color: Colors.text,
              fontFamily: Font['poppins-regular'],
              textAlign: 'center',
              marginTop: Spacing * 2,
            }}
          >
            Yuk, Cek Daftar Transaksi Warmindo Zezaga.
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: Spacing * 2,
            paddingVertical: Spacing * 5,
            justifyContent: 'center', // Center content vertically
            alignItems: 'center', // Center content horizontally
          }}
        >
          <TouchableOpacity
            onPress={handlePress}
            style={{
              backgroundColor: Colors.primary,
              paddingVertical: Spacing * 1.5,
              paddingHorizontal: Spacing * 5,
              width: '48%',
              borderRadius: Spacing,
              shadowColor: Colors.primary,
              shadowOffset: {
                width: 0,
                height: Spacing,
              },
              shadowOpacity: 0.3,
            }}
          >
            <Text
              style={{
                fontFamily: Font['poppins-bold'],
                color: Colors.onPrimary,
                fontSize: FontSize.large,
                textAlign: 'center',
              }}
            >
              Mulai
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});