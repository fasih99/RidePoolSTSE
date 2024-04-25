import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Pressable,
  Alert,
  Touchable,
  TouchableOpacity,
} from "react-native";
import RNText from "../../components/RNText";
import { AuthContext } from "../../context/authcontext";
import Colors from "../../constants/Colors";
import Loading from "../../components/Loading";
import { router } from "expo-router";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { updateProflie } from "../../constants/api";

const ProfileUpdate = () => {
  const { user, setUser } = useContext(AuthContext);

  const [name, setName] = useState(user?.name);
  const [phone, setPhone] = useState(user?.phone);
  const [bio, setBio] = useState(user?.bio);
  const [loading, setLoading] = useState(false);

  const [gender, setGender] = useState(user?.gender);

  const handleUpdateProfile = async () => {
    console.log(name, phone, bio, gender);
    if (!name || !phone || !bio || !gender) {
      Alert.alert("Update Profile", "All fields are required");
      return;
    } else {
      setLoading(true);
      // Implement your update profile logic here
      await updateProflie(user.id, {
        name,
        phone,
        bio,
        gender,
      });
      setUser((user) => {
        return { ...user, name, phone, bio, gender };
      });
      setLoading(false);
      Alert.alert("Profile Updated", "Profile updated successfully", [
        {
          text: "OK",
          onPress: () => {
            router.back();
          },
        },
      ]);
    }
  };

  return (
    <View
      style={{
        backgroundColor: Colors.secondary,
        padding: 14,
        paddingTop: heightPercentageToDP(2),
        flex: 1,
      }}
    >
      <View
        style={{
          gap: 3.5,
        }}
      >
        <RNText font="Poppins-Bold">Name</RNText>
        <TextInput
          style={{
            borderWidth: 2,
            marginTop: -7,
            borderColor: "#D1D5DB",
            borderRadius: 5,
            padding: 7,
            width: "100%",
          }}
          value={name}
          onChangeText={setName}
        />
        <RNText font="Poppins-Bold">Gender</RNText>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 5,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor:
                gender === "male" ? Colors.primary : Colors.secondary,
              //border
              padding: 10,
              borderWidth: 1,

              width: widthPercentageToDP(40),
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setGender("male");
            }}
          >
            <RNText
              style={{
                color: gender === "male" ? Colors.secondary : Colors.primary,
                textAlign: "center",
              }}
              font={"Poppins-Bold"}
            >
              Male
            </RNText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor:
                gender === "female" ? Colors.primary : Colors.secondary,

              //border
              borderWidth: 1,
              padding: 10,
              width: widthPercentageToDP(40),
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setGender("female");
            }}
          >
            <RNText
              style={{
                color: gender === "female" ? Colors.secondary : Colors.primary,
                textAlign: "center",
              }}
              font={"Poppins-Bold"}
            >
              Female
            </RNText>
          </TouchableOpacity>
        </View>

        <RNText font="Poppins-Bold">Phone Number</RNText>
        <TextInput
          placeholder="your number"
          style={{
            borderWidth: 2,
            marginTop: -7,
            borderColor: "#D1D5DB",
            borderRadius: 5,
            padding: 7,
            width: "100%",
          }}
          value={phone}
          onChangeText={setPhone}
        />
        <RNText font="Poppins-Bold">About You</RNText>
        <TextInput
          placeholder="Write about yourself.."
          style={{
            borderWidth: 2,
            marginTop: -7,
            borderColor: "#D1D5DB",
            borderRadius: 5,
            padding: 7,
            width: "100%",
          }}
          value={bio}
          onChangeText={setBio}
          numberOfLines={4}
          textAlignVertical="top"
        />
        <View
          style={{
            marginTop: 2.5 * 3.5,
            marginVertical: 7,
            marginBottom: 20,
          }}
        >
          {loading ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Loading size={heightPercentageToDP(6.5)} />
            </View>
          ) : (
            <Pressable
              style={{
                borderRadius: 5,
                backgroundColor: "#111",
              }}
              onPress={handleUpdateProfile}
            >
              <RNText
                font={"Poppins-Bold"}
                style={{
                  fontSize: heightPercentageToDP(2),
                  color: "#fff",
                  borderRadius: 5,
                  backgroundColor: "#111",
                  textAlign: "center",
                  padding: 7,
                }}
              >
                Save
              </RNText>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

export default ProfileUpdate;
