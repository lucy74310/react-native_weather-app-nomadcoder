import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "d2472c82b90c8a6dcc0423ae207b666a";

const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Thunderstorm: "lightning",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Atmosphere: "cloudy-gusts",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    // const permission = await Location.requestForegroundPermissionsAsync();
    /*
    Object {
      "android": Object {
        "accuracy": "fine",
        "scoped": "fine",
      },
      "canAskAgain": true,
      "expires": "never",
      "granted": true,
      "status": "granted",
    }
     */
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
      return;
    }
    // const location = await Location.getCurrentPositionAsync({ accuracy: 5 });
    /**
    Object {
      "coords": Object {
        "accuracy": 13.293000221252441,
        "altitude": 43.5,
        "altitudeAccuracy": 3.2503244876861572,
        "heading": 0,
        "latitude": 37.4867803,
        "longitude": 126.9091728,
        "speed": 0,
      },
      "mocked": false,
      "timestamp": 1641166134778,
    }
     */
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({
      accuracy: 5,
    });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    if (location[0].city) {
      setCity(location[0].city);
    } else {
      setCity(location[0].district);
    }
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={alert}&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
    console.log(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator
              color="white"
              size="large"
              style={{ marginTop: 10 }}
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={68}
                  color="white"
                />
              </View>

              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    marginTop: 50,
    fontSize: 68,
    fontWeight: "400",
    color: "white",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "stretch",
    paddingLeft: 10,
    paddingRight: 10,
  },
  temp: {
    marginTop: 50,
    fontSize: 118,
    color: "white",
  },
  description: {
    marginTop: -30,
    fontSize: 48,
    color: "white",
  },
  tinyText: {
    fontSize: 30,
    color: "white",
  },
});
