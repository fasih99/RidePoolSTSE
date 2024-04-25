import { View, Platform, Pressable, Button } from "react-native";

import React, { useContext, useState } from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import { blurhash } from "../../constants";
import Loading from "../../components/Loading";
import CustomKeyboardView from "../../components/CustomKeybordView";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AuthContext } from "../../context/authcontext";
import ProfileImage from "../../components/ProflieImage";
import RNText from "../../components/RNText";
import Colors from "../../constants/Colors";
const ios = Platform.OS === "ios";

const Profile = () => {
  const { top } = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleClose = () => {
    router.back();
  };
  const { logout, user, setUser } = useContext(AuthContext);
  const [updateImage, setUpdateImage] = useState(false);
  const { friend } = useLocalSearchParams();
  const upateProfile = (url) => {
    setUpdateImage(false);

    setUser((user) => {
      return { ...user, profileUrl: url };
    });
  };

  return (
    <CustomKeyboardView>
      <View
        style={{
          paddingTop: ios ? top : top + 10,
          padding: 20,
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable
            style={{
              alignSelf: "flex-end",
            }}
            onPress={handleClose}
          >
            <Ionicons name="arrow-back" size={22} color="black" />
          </Pressable>
          <RNText
            font={"Poppins-Medium"}
            style={{
              fontSize: 17.5,
              lineHeight: 24.5,
              textAlign: "center",
              marginLeft: 7,
            }}
          >
            Menu
          </RNText>
        </View>

        {updateImage === false ? (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                position: "relative",
                marginHorizontal: 14,
              }}
            >
              <Image
                style={{
                  height: heightPercentageToDP(15),
                  aspectRatio: 1,
                  borderRadius: 10,
                }}
                source={user?.profileUrl}
                placeholder={blurhash}
                transition={500}
              />
              <Pressable
                onPress={() => setUpdateImage(true)}
                style={{
                  position: "absolute",
                  left: widthPercentageToDP(41),
                  bottom: -15,
                  backgroundColor: "#000",
                  padding: 8,
                  borderRadius: 50,
                  height: 34,
                  width: 34,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="edit" size={16} color={Colors.secondary} />
              </Pressable>
            </View>
          </>
        ) : (
          <View
            style={{
              minHeight: heightPercentageToDP(35),
              paddingBottom: 20,
              position: "relative",
            }}
          >
            <Pressable
              onPress={() => setUpdateImage(false)}
              style={{
                position: "absolute",
                right: heightPercentageToDP(20),
                backgroundColor: "#000",
                padding: 8,
                borderRadius: 50,
                height: 40,
                width: 40,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2,
              }}
            >
              <MaterialIcons name="close" size={24} color={Colors.secondary} />
            </Pressable>
            <ProfileImage id={user.id} upateProfile={upateProfile} />
          </View>
        )}
        <RNText
          font={"Poppins-Medium"}
          style={{
            fontSize: 17.5,
            lineHeight: 24.5,
            textAlign: "center",
            marginTop: 14,
          }}
        >
          {user?.name}
        </RNText>
        <View
          style={{
            borderBottomColor: "#ccc",
            borderBottomWidth: 1,
            marginVertical: 20,
            width: widthPercentageToDP(100),
            alignSelf: "center",
          }}
        ></View>

        <View
          style={{
            width: widthPercentageToDP(80),
            alignSelf: "center",
          }}
        >
          <View>
            <Pressable
              onPress={() => router.push("profile")}
              style={{
                backgroundColor: Colors.secondary,
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
              }}
            >
              <MaterialCommunityIcons name="pencil" size={23} color="black" />
              <RNText
                style={{
                  fontSize: 17.5,
                  lineHeight: 24.5,
                }}
                font={"Poppins-Medium"}
              >
                Update Profile
              </RNText>
              <Entypo
                name="chevron-right"
                size={24}
                color={Colors.mediumGray}
                style={{
                  position: "absolute",
                  right: -10,
                }}
              />
            </Pressable>
            <View
              style={{
                borderBottomColor: "#ccc",
                borderBottomWidth: 1,
                marginVertical: 20,
                width: widthPercentageToDP(100),
                alignSelf: "center",
              }}
            ></View>
          </View>
          <View>
            <Pressable
              onPress={() => router.push("rides")}
              style={{
                backgroundColor: Colors.secondary,
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Entypo name="back-in-time" size={23} color="black" />
              <RNText
                style={{
                  fontSize: 17.5,
                  lineHeight: 24.5,
                }}
                font={"Poppins-Medium"}
              >
                My Rides
              </RNText>
              <Entypo
                name="chevron-right"
                size={24}
                color={Colors.mediumGray}
                style={{
                  position: "absolute",
                  right: -10,
                }}
              />
            </Pressable>
            <View
              style={{
                borderBottomColor: "#ccc",
                borderBottomWidth: 1,
                marginVertical: 20,
                width: widthPercentageToDP(100),
                alignSelf: "center",
              }}
            ></View>
          </View>

          <View>
            <Pressable
              onPress={() => router.push("terms")}
              style={{
                backgroundColor: Colors.secondary,
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Ionicons name="help-buoy" size={23} color="black" />
              <RNText
                style={{
                  fontSize: 17.5,
                  lineHeight: 24.5,
                }}
                font={"Poppins-Medium"}
              >
                Terms and Conditions
              </RNText>
              <Entypo
                name="chevron-right"
                size={24}
                color={Colors.mediumGray}
                style={{
                  position: "absolute",
                  right: -10,
                }}
              />
            </Pressable>
            <View
              style={{
                borderBottomColor: "#ccc",
                borderBottomWidth: 1,
                marginVertical: 20,
                width: widthPercentageToDP(100),
                alignSelf: "center",
              }}
            ></View>
          </View>
          <View>
            <Pressable
              style={{
                backgroundColor: Colors.secondary,
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
              }}
            >
              <AntDesign name="setting" size={23} color="black" />
              <RNText
                style={{
                  fontSize: 17.5,
                  lineHeight: 24.5,
                }}
                font={"Poppins-Medium"}
              >
                Settings
              </RNText>
              <Entypo
                name="chevron-right"
                size={24}
                color={Colors.mediumGray}
                style={{
                  position: "absolute",
                  right: -10,
                }}
              />
            </Pressable>
            <View
              style={{
                borderBottomColor: "#ccc",
                borderBottomWidth: 1,
                marginVertical: 20,
                width: widthPercentageToDP(100),
                alignSelf: "center",
              }}
            ></View>
          </View>
          <View>
            <Pressable
              onPress={logout}
              style={{
                backgroundColor: Colors.secondary,
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Entypo name="log-out" size={23} color="black" />
              <RNText
                style={{
                  fontSize: 17.5,
                  lineHeight: 24.5,
                }}
                font={"Poppins-Medium"}
              >
                Logout
              </RNText>
              <Entypo
                name="chevron-right"
                size={24}
                color={Colors.mediumGray}
                style={{
                  position: "absolute",
                  right: -10,
                }}
              />
            </Pressable>
            <View
              style={{
                borderBottomColor: "#ccc",
                borderBottomWidth: 1,
                marginVertical: 20,
                width: widthPercentageToDP(100),
                alignSelf: "center",
              }}
            ></View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
};

export default Profile;
