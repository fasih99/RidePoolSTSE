import { Platform, Pressable } from "react-native";
import React, { useContext } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const ios = Platform.OS === "ios";

import { blurhash } from "../constants";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/authcontext";
import { Image } from "expo-image";

const HomeHeader = () => {
  const { user } = useContext(AuthContext);
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  return (
    <Pressable
      style={{
        position: "absolute",
        top: top,
        left: wp(5),
        zIndex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
      onPress={() => {
        router.push("/menu");
      }}
    >
      <Image
        style={{
          height: hp(5.5),
          aspectRatio: 1,
        }}
        source={require("../assets/app/menu.png")}
      />
    </Pressable>
  );
};

export default HomeHeader;
