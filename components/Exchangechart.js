import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Dimensions, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const SampleChart = ({ currency1, currency2 }) => {
  const [chartData, setChartData] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const API_URL = 'http://api.currencylayer.com/historical';
  //       const accessKey = 'd800b928bcfe62f116cfcaa597c3a876';
  //       const sourceCurrency = 'USD';
  //       const targetCurrency = 'INR';
  //       const startDate = '2010-01-01';
  //       const numYears = 10;
  
  //       const updatedData = [];
  
  //       for (let i = 0; i < numYears; i++) {
  //         const currDate = new Date(`${startDate}T00:00:00`);
  //         currDate.setFullYear(currDate.getFullYear() + i);
  //         const formattedDate = currDate.toISOString().split('T')[0];
  
  //         const data = await fetchExchangeRate(API_URL, accessKey, sourceCurrency, targetCurrency, formattedDate);
  //         console.log(data)
  //         updatedData.push(data);
  //       }
  
  //       const values = updatedData.map(rate => rate.quotes[sourceCurrency + targetCurrency]);
  //       setChartData(values);
  //     } catch (error) {
  //       console.error('Error fetching chart data:', error);
  //     }
  //   };
  
  //   async function fetchExchangeRate(apiUrl, accessKey, sourceCurrency, targetCurrency, date) {
  //     const url = `${apiUrl}?access_key=${accessKey}&source=${sourceCurrency}&currencies=${targetCurrency}&date=${date}`;
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     return data;
  //   }
  
  //   fetchData();
  // }, [currency1, currency2]);
  


  return (
    <View style={styles.chartContainer}>
      <Text style={styles.header}>{currency1} and {currency2}</Text>
      <LineChart
        data={{
          labels: ['2014','2015','2016','2017', '2018', '2019', '2020', '2021', '2022', '2023'],
          datasets: [
            {
              data: [45,51,57,61,64,69,73,78,80,81],
              strokeWidth: 2,
            },
          ],
        }}
        width={Dimensions.get('window').width - 16}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

const ExchangeChart = () => {
  const [showChart, setShowChart] = useState(false);
  const [currency1, setCurrency1] = useState('');
  const [currency2, setCurrency2] = useState('');

  const handleChartView = () => {
    setShowChart(true);
  };

  useEffect(() => {
    Alert.alert('Under Development', 'Free APIs do not allow multiple calls within a time frame.');
  }, []); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exchange Rate Chart</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Currency 1</Text>
        <TextInput
          style={styles.input}
          editable={false}
          value={currency1}
          onChangeText={setCurrency1}
          placeholder="USD"
          placeholderTextColor={"#FFFFFF"}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Currency 2</Text>
        <TextInput
          style={styles.input}
          editable={false}
          value={currency2}
          onChangeText={setCurrency2}
          placeholder="INR"
          placeholderTextColor={"#FFFFFF"}
        />
      </View>
      <Button title="View Chart" onPress={handleChartView} />
      {showChart && <SampleChart currency1={currency1} currency2={currency2} />}
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
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    color: '#FFFFFF',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  chartContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ExchangeChart;
