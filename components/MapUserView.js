import React from "react";
import { Image } from "expo-image";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontAwesome5 } from "@expo/vector-icons";

import { blurhash } from "../constants";
import { Pressable, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { goToMaps } from "../constants/helpers";
import dayjs from "dayjs";
import RNText from "./RNText";
var relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

const MapUserView = ({ user, index, handleInfoClick }) => {
  return (
    <View
      style={{
        width: wp(88),
        height: hp(16),
        margin: 5,
        borderRadius: 10,
        position: "relative",
        flexDirection: "row",
      }}
    >
      <Pressable
        style={{
          right: 10,
          position: "absolute",
          top: 4,
          zIndex: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          goToMaps({
            latitude: user?.location?.latitude,
            longitude: user?.location?.longitude,
          });
        }}
      >
        {user?.location && (
          <RNText
            style={{
              color: "#6B7280",
              fontSize: 10.5,
              lineHeight: 14,
              marginBottom: 14,
            }}
          >
            ({dayjs(user?.location?.timestamp?.seconds * 1000).fromNow()})
          </RNText>
        )}
        <FontAwesome5 name="directions" size={30} color="#1a73e8" />
      </Pressable>
      <TouchableOpacity
        onPress={() => {
          handleInfoClick(index);
        }}
      >
        <Image
          style={{
            height: "100%",
            aspectRatio: 1,
            borderRadius: 4,
            backgroundColor: "#0553",
          }}
          source={
            user?.profileUrl || "https://picsum.photos/seed/696/3000/2000"
          }
          placeholder={blurhash}
          transition={500}
        />
      </TouchableOpacity>
      <View
        style={{
          backgroundColor: "#ffffff",
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          padding: 7,
          gap: 2,
          flex: 1,
        }}
      >
        <RNText
          style={{
            fontSize: 15.75,
            lineHeight: 24.5,
          }}
        >
          {user.name}{" "}
        </RNText>

        <RNText
          style={{
            fontSize: 12.25,
            lineHeight: 17.5,
          }}
        >
          Major:
          <RNText>{user?.location?.timestamp?.seconds}</RNText>
        </RNText>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            style={{
              backgroundColor: "#111",
              borderRadius: 5,
              marginLeft: "auto",
            }}
            onPress={() => {
              router.push(
                "/chat?name=" +
                  user.name +
                  "&id=" +
                  user.id +
                  "&profileUrl=" +
                  user?.profileUrl
              );
            }}
          >
            <RNText
              style={{
                padding: 6,
                color: "#fff",
                textAlign: "center",
                borderRadius: 5,
                fontSize: 12.25,
                lineHeight: 17.5,
              }}
            >
              Message
            </RNText>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: "#3B82F6",
              borderRadius: 5,
            }}
            onPress={() => {
              // set the user to the router params and navigate to profile route
              router.push("/profile?friend=" + user.name);
            }}
          >
            <RNText
              style={{
                padding: 6,
                borderRadius: 5,
                color: "#fff",
                fontSize: 12.25,
                lineHeight: 17.5,
                textAlign: "center",
              }}
            >
              View Profile
            </RNText>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default MapUserView;
