import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FAB from 'react-native-fab'


const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [isAddingCurrency, setIsAddingCurrency] = useState(false);
  const [inputCurrency1, setInputCurrency1] = useState('');
  const [inputCurrency2, setInputCurrency2] = useState('');

  useEffect(() => {
    // Load watchlist data from AsyncStorage
    loadWatchlist();
  }, []);

  useEffect(() => {
    // Save watchlist data to AsyncStorage whenever it changes
    saveWatchlist();
  }, [watchlist]);

  const loadWatchlist = async () => {
    try {
      const savedWatchlist = await AsyncStorage.getItem('watchlist');
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
    } catch (error) {
      console.log('Error loading watchlist', error);
    }
  };

  const saveWatchlist = async () => {
    try {
      await AsyncStorage.setItem('watchlist', JSON.stringify(watchlist));
    } catch (error) {
      console.log('Error saving watchlist', error);
    }
  };




  const addToWatchlist = async () => {
    const currencyPair = `${inputCurrency1}/${inputCurrency2}`;

    // Check if the currency pair is already in the watchlist
    if (watchlist.includes(currencyPair)) {
      Alert.alert('Error', 'This currency pair is already in the watchlist.');
      return;
    }

    // Fetch the conversion rate from the API

    try {
      const apiKey = 'bf5629b247d9d804051a6643'; // Replace with your actual API key
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${inputCurrency1}/${inputCurrency2}/1`);
      const data = await response.json();

      if (data.result === 'success') {
        const conversionRate = data.conversion_rate;
        const currencyPairWithRate = `${currencyPair} (${conversionRate})`;
        setWatchlist([...watchlist, currencyPairWithRate]);
      } else {
        // Handle error case
        if (data['error-type'] === 'unsupported-code') {
          Alert.alert('Error', 'Invalid currency code(s) entered.');
        } else {
          Alert.alert('Error', 'An error occurred while fetching the conversion rate.');
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'An error occurred while fetching the conversion rate.');
    }

    // Clear the input fields
    setInputCurrency1('');
    setInputCurrency2('');

    // Close the currency input form
    setIsAddingCurrency(false);
  };

  const removeCurrencyPair = (currencyPair) => {
    // Remove the currency pair from the watchlist
    const updatedWatchlist = watchlist.filter((pair) => pair !== currencyPair);
    setWatchlist(updatedWatchlist);
  };

  const openCurrencyInputForm = () => {
    setIsAddingCurrency(true);
  };

  const closeCurrencyInputForm = () => {
    setIsAddingCurrency(false);
    setInputCurrency1('');
    setInputCurrency2('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Watchlist</Text>
      {/* Render the watchlist */}
      {watchlist.map((currencyPair) => (
        <View key={currencyPair} style={styles.watchlistItem}>
          <Text style={styles.watchlistItemText}>{currencyPair}</Text>
          {/* Button to remove the currency pair from the watchlist */}
          <TouchableOpacity onPress={() => removeCurrencyPair(currencyPair)}>
            <Text style={styles.watchlistItemText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Floating Action Button */}
      <FAB
        buttonColor="#207398"
        iconTextColor="#FFFFFF"
        onClickAction={openCurrencyInputForm}
        visible={!isAddingCurrency}
      />

      {/* Currency Input Form */}
      {isAddingCurrency && (
        <View style={styles.currencyInputForm}>
          <TextInput
            style={styles.textInput}
            placeholder="Input Currency 1"
            placeholderTextColor={"#000000"}
            value={inputCurrency1}
            onChangeText={setInputCurrency1}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Input Currency 2"
            placeholderTextColor={"#000000"}
            value={inputCurrency2}
            onChangeText={setInputCurrency2}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={addToWatchlist} style={[styles.button, styles.addButton]}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeCurrencyInputForm} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#242B2E',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  watchlistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  watchlistItemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  currencyInputForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    color: "#000000",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: 'green',
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default Watchlist;
