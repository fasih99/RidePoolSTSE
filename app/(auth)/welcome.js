import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AuthContext } from "../../context/authcontext";
import { useRouter } from "expo-router";
import CustomKeyboardView from "../../components/CustomKeybordView";
import RNText from "../../components/RNText";
import Colors from "../../constants/Colors";
import { Image } from "expo-image";
const SignIn = () => {
  const router = useRouter();

  return (
    <View
      style={{
        paddingTop: hp(8),
        paddingHorizontal: wp(3),
        backgroundColor: "#fff",
        flex: 1,
      }}
    >
      <RNText
        font={"Poppins-Medium"}
        style={{
          marginBottom: hp(2),
          fontSize: 21,
          lineHeight: 28,
        }}
      >
        Move Around In Ride Pool.
      </RNText>
      <RNText
        style={{
          fontSize: hp(1.7),
          color: Colors.mediumGray,
          width: wp(80),
        }}
      >
        With hundreds of professional drivers to take you to your destination.
      </RNText>
      <View
        style={{
          alignItems: "center",
          marginTop: 14,
        }}
      >
        <Image
          style={{
            width: wp(100),
            aspectRatio: 1,
            borderRadius: 4,
          }}
          source="https://firebasestorage.googleapis.com/v0/b/ride-away-app.appspot.com/o/dia.png?alt=media&token=c19d62ff-260e-4201-9e50-0c91b8ef6f25"
        />
      </View>

      <View
        style={{
          gap: 4,
        }}
      >
        <View
          style={{
            position: "relative",
            top: hp(15),
            zIndex: 10,
            gap: 12,
          }}
        >
          <Pressable
            style={{
              backgroundColor: "#111",
              borderRadius: 5,
            }}
            onPress={() => {
              router.replace("/signin");
            }}
          >
            <RNText
              font={"Poppins-Medium"}
              style={{
                fontSize: hp(2),
                color: "#fff",
                textAlign: "center",
                padding: 7,
                borderRadius: 5,
              }}
            >
              Already a user?
            </RNText>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: "#fff",
              borderRadius: 5,
            }}
            onPress={() => {
              router.replace("/signup");
            }}
          >
            <RNText
              font={"Poppins-Medium"}
              style={{
                fontSize: hp(2),
                color: "#111",
                borderRadius: 5,
                textAlign: "center",
                padding: 7,
              }}
            >
              Sign Up
            </RNText>
          </Pressable>
        </View>
        <View
          style={{
            backgroundColor: Colors.main,
            width: wp(300),
            borderRadius: wp(300) / 2,
            height: hp(200),
            position: "absolute",
            left: -wp(100),
            top: hp(6),
          }}
        ></View>
      </View>
    </View>
  );
};

export default SignIn;
