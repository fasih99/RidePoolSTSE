import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View, FlatList, Pressable } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { blurhash } from "../constants";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import RNText from "./RNText";
var relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

const Item = ({ item }) => {
  const { name, id, profileUrl, lastMessage, lastUpdated } = item;
  return (
    <Pressable
      style={{
        marginBottom: 10,
        minHeight: 40,
        width: wp(100),
        padding: 7,
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={() => {
        router.push(
          "/chat?name=" + name + "&id=" + id + "&profileUrl=" + profileUrl
        );
      }}
    >
      <Image
        style={{
          height: hp(7),
          aspectRatio: 1,
          borderRadius: 50,
          backgroundColor: "#0553",
        }}
        source={profileUrl || "https://picsum.photos/seed/696/3000/2000"}
        placeholder={blurhash}
        transition={200}
      />
      <View
        style={{
          marginLeft: 10,
        }}
      >
        <RNText
          style={{
            fontFamily: "Poppins-Bold",
            fontSize: 15.75,
            lineHeight: 24.5,
          }}
        >
          {name}
        </RNText>
        {lastMessage ? (
          <RNText
            style={{
              fontFamily: "Poppins-Medium",
              color: "#374151",
            }}
            numberOfLines={1}
          >
            {id !== lastMessage?.user._id && (
              <Ionicons name="checkmark" size={16} color={"#2e64e5"} />
            )}
            {lastMessage.text}
          </RNText>
        ) : (
          <RNText
            style={{
              fontFamily: "Poppins-Medium",

              color: "#374151",
            }}
          >
            No messages yet
          </RNText>
        )}
      </View>
      <RNText style={styles.input}>
        <RNText
          style={{
            color: "#6B7280",
            fontSize: 10.5,
            lineHeight: 14,
            marginBottom: 14,
          }}
        >
          ({dayjs(lastUpdated).fromNow()})
        </RNText>
      </RNText>
    </Pressable>
  );
};

// the filter
const List = (props) => {
  const renderItem = ({ item }) => {
    // when no input, show all
    if (props.searchPhrase === "") {
      return <Item item={item} />;
    }
    // filter of the name
    if (
      item.name
        .toUpperCase()
        .includes(props.searchPhrase.toUpperCase().trim().replace(/\s/g, ""))
    ) {
      return <Item item={item} />;
    }
    // filter of the description
    if (
      item.lastMessage
        .toUpperCase()
        .includes(props.searchPhrase.toUpperCase().trim().replace(/\s/g, ""))
    ) {
      return <Item item={item} />;
    }
  };

  return (
    <View
      style={{
        padding: 7,
        paddingBottom: 60,
      }}
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        data={props.data}
        renderItem={renderItem}
        keyExtractor={(item) => item.chatId}
      />
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  input: {
    fontSize: 12,
    marginLeft: "auto",
    marginRight: 10,
    fontFamily: "Poppins-SemiBold",
    color: "#6B7280",
    alignSelf: "flex-start",
  },
});
