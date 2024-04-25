import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";

const SafeArea = ({ children }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
});

export default SafeArea;
