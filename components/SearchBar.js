import React from "react";
import { StyleSheet, TextInput, View, Keyboard, Button } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const SearchBar = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar__unclicked}>
        <Feather
          name="search"
          size={20}
          color="black"
          style={{ left: 10, position: "absolute" }}
        />
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={props.searchPhrase}
          onChangeText={props.setSearchPhrase}
        />

        {props.searchPhrase.length > 0 && (
          <Entypo
            name="cross"
            size={20}
            color="black"
            style={{ right: 10, position: "absolute" }}
            onPress={() => {
              props.setSearchPhrase("");
            }}
          />
        )}
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: wp(100),
    position: "relative",
  },
  searchBar__unclicked: {
    padding: 6,
    paddingHorizontal: 20,
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  input: {
    fontSize: hp(2.2),
    width: "90%",
    fontWeight: "bold",
    fontFamily: "Poppins-SemiBold",
  },
});
