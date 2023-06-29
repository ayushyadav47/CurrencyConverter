import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NetInfo } from '@react-native-community/netinfo'


const Home = ({ navigation }) => {
  const [sourceAmount, setSourceAmount] = useState('');
  const [sourceCurrency, setSourceCurrency] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [netConnected, setNetConnected] = useState(true)


  // useEffect(() => {
  //   const checkConnectivity = async () => {
  //     try {
  //       NetInfo.fetch().then(state => {
  //         console.log("Connection type", state.type);
  //         console.log("Is connected?", state.isConnected);
  //       });

  //     } catch (error) {
  //       console.error('Error checking connectivity:', error);
  //     }
  //   };

  //   checkConnectivity();
  // }, []);

  const fetchCurrencyLatest = async () => {
    const apiKey = 'bf5629b247d9d804051a6643';
    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${sourceCurrency}/${targetCurrency}/${sourceAmount}`
      );
      const data = await response.json();

      if (data.result === 'success') {
        setTargetAmount(data.conversion_result);

        const newSearchHistory = [
          {
            sourceCurrency,
            targetCurrency,
            isPinned: false,
          },
          ...searchHistory.filter(
            (item) =>
              item.sourceCurrency !== sourceCurrency ||
              item.targetCurrency !== targetCurrency
          ),
        ];
        setSearchHistory(newSearchHistory);
        
        // Store conversion rate in offline mode
        if (!netConnected) {
          const offlineConversionRates = await AsyncStorage.getItem('offlineConversionRates');
          const conversionRates = offlineConversionRates ? JSON.parse(offlineConversionRates) : {};
          const key = `${sourceCurrency}_${targetCurrency}`;
          conversionRates[key] = data.conversion_result;
          await AsyncStorage.setItem('offlineConversionRates', JSON.stringify(conversionRates));
        }


      } else {
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
  };


  useEffect(() => {
    loadSearchHistory();
  }, []);

  useEffect(() => {
    saveSearchHistory();
  }, [searchHistory]);

  const loadSearchHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('searchHistory');
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const saveSearchHistory = async () => {
    try {
      await AsyncStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const clearSearchHistory = () => {
    const unpinnedHistory = searchHistory.filter(item => item.isPinned);
    setSearchHistory(unpinnedHistory);

  };

  const handleCurrencySwap = () => {
    setSourceCurrency(targetCurrency);
    setTargetCurrency(sourceCurrency);
  };

  const togglePinnedStatus = (source, target) => {
    const updatedHistory = searchHistory.map((item) => {
      if (item.sourceCurrency === source && item.targetCurrency === target) {
        return {
          ...item,
          isPinned: !item.isPinned,
        };
      }
      return item;
    });
    setSearchHistory(updatedHistory);
  };

  const renderOfflineModeBanner = () => {
    if (!netConnected) {
      return (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Offline Mode</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderOfflineModeBanner()}

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#EDC126' }]}
              onPress={() => navigation.navigate('Exchangechart')}
            >
              <Text style={styles.buttonText}>Exchangechart</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#22CB5C' }]}
              onPress={() => navigation.navigate('Watchlist')}
            >
              <Text style={styles.buttonText}>Go to Watchlist</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.labelText}>Source Amount</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={sourceAmount}
              onChangeText={setSourceAmount}
            />

            <Text style={styles.labelText}>Enter Source Currency</Text>
            <TextInput
              style={styles.textInput}
              value={sourceCurrency}
              onChangeText={setSourceCurrency}
            />

            <TouchableOpacity
              style={styles.swapButtonContainer}
              onPress={handleCurrencySwap}
            >
              <View style={styles.swapButton}>
                <Text style={styles.swapButtonText}>⇅</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.labelText}>Enter Target Currency</Text>
            <TextInput
              style={styles.textInput}
              value={targetCurrency}
              onChangeText={setTargetCurrency}
            />

            <Text style={styles.labelText}>Target Amount</Text>
            <TextInput
              style={[styles.textInput, styles.disabledTextInput]}
              editable={false}
              placeholder="Amount in Converted Currency!"
              value={targetAmount.toString()}
            />

            <Button title="Convert" onPress={fetchCurrencyLatest} />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.labelText}>Recent Searches/Pinned Currencies</Text>
            {searchHistory.length > 0 && (
              <TouchableOpacity style={styles.clearButtonContainer} onPress={clearSearchHistory}>
                <View style={styles.clearButton}>
                  <Feather name="trash-2" size={20} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            )}

            {searchHistory.slice(0, 20).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.historyItem}
                onPress={() => {
                  setSourceCurrency(item.sourceCurrency);
                  setTargetCurrency(item.targetCurrency);
                }}
              >
                <TouchableOpacity onPress={() => togglePinnedStatus(item.sourceCurrency, item.targetCurrency)}>
                  {item.isPinned ? (
                    <MaterialIcons name="bookmark" size={20} color="#FFD700" />
                  ) : (
                    <MaterialIcons name="bookmark-border" size={20} color="#000000" />
                  )}
                </TouchableOpacity>
                <Text style={styles.historyItemText}>
                  {item.sourceCurrency} to {item.targetCurrency}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#242B2E',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  labelText: {
    color: '#FFFFFF',
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    color: '#000000',
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 5,
  },
  disabledTextInput: {
    color: '#000000',
  },
  swapButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  swapButton: {
    backgroundColor: '#35BDD0',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  historyItemText: {
    color: '#000000',
    marginLeft: 10,
  },
  clearButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  clearButton: {
    backgroundColor: '#FF0000',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchlistButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  watchlistButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  watchlistButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  offlineBanner: {
    backgroundColor: '#FF0000',
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  offlineText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default Home;
