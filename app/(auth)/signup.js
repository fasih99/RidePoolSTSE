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
import Loading from "../../components/Loading";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { AuthContext } from "../../context/authcontext";
import { useRouter } from "expo-router";
import CustomKeyboardView from "../../components/CustomKeybordView";
import RNText from "../../components/RNText";
import Colors from "../../constants/Colors";
import { Image } from "expo-image";
const SignUp = () => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [hidePassword, setHidePassword] = useState(true);

  const handleSignIn = async () => {
    if (email === "" || password === "" || name === "") {
      Alert.alert("SignUp", "All fields are required");
      return;
    }

    setLoading(true);

    let response = await register(email, password, name);

    setLoading(false);
    if (!response.success) {
      Alert.alert("Sign Up", response.msg);
    }
  };

  return (
    <CustomKeyboardView>
      <View
        style={{
          paddingTop: hp(8),
          paddingHorizontal: wp(5),
          flex: 1,
          gap: 8,
        }}
      >
        <View
          style={{
            alignItems: "center",
            flex: 1,
          }}
        >
          <Image
            style={{
              width: wp(100),
              aspectRatio: 2.5,
              borderRadius: 4,
            }}
            source="https://firebasestorage.googleapis.com/v0/b/ride-away-app.appspot.com/o/Careers.webp?alt=media&token=b5297169-dfbb-413a-a093-922171ce290f"
          />
        </View>
        <View
          style={{
            gap: 2,
            marginVertical: 20,
          }}
        >
          <RNText
            style={{
              fontSize: 21,
              lineHeight: 28,
            }}
            font={"Poppins-Bold"}
          >
            Welcome to RidePool
          </RNText>
          <RNText
            style={{
              fontSize: 17.5,
              lineHeight: 24.5,
            }}
          >
            Start Your Journey: Register Now!
          </RNText>
        </View>
        <View
          style={{
            flex: 1,
            gap: 4,
          }}
        >
          <RNText font={"Poppins-Medium"}>Name</RNText>
          <TextInput
            placeholder="name"
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
          <RNText font={"Poppins-Medium"}>Email</RNText>
          <TextInput
            placeholder=" passenger@mail.com"
            style={{
              borderWidth: 2,
              marginTop: -7,
              borderColor: "#D1D5DB",
              borderRadius: 5,
              padding: 7,
              width: "100%",
            }}
            value={email}
            onChangeText={setEmail}
          />
          <RNText font={"Poppins-Medium"}>Password</RNText>

          <View
            style={{
              position: "relative",
            }}
          >
            <TextInput
              placeholder=" 6+ characters"
              secureTextEntry={hidePassword ? true : false}
              style={{
                borderWidth: 2,
                marginTop: -7,
                borderColor: "#D1D5DB",
                borderRadius: 5,
                padding: 7,
                width: "100%",
              }}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable
              onPress={() => {
                setHidePassword(!hidePassword);
              }}
              style={{
                position: "absolute",
                right: 5,
                top: 2,
                zIndex: 10,
              }}
            >
              {hidePassword ? (
                <AntDesign name="eye" size={20} color="black" />
              ) : (
                <FontAwesome name="eye-slash" size={20} color="black" />
              )}
            </Pressable>
          </View>
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
                <Loading size={hp(6.5)} />
              </View>
            ) : (
              <Pressable
                style={{
                  backgroundColor: Colors.primary,
                  borderRadius: 5,
                }}
                onPress={handleSignIn}
              >
                <RNText
                  style={{
                    fontSize: hp(2.2),
                    color: "#fff",
                    borderRadius: 5,
                    backgroundColor: "#111",
                    textAlign: "center",
                    padding: 7,
                  }}
                >
                  Sign Up
                </RNText>
              </Pressable>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <RNText
              style={{
                color: "#6B7280",
              }}
            >
              Already have an account?{" "}
            </RNText>
            <TouchableOpacity
              onPress={() => {
                router.replace("/signin");
              }}
            >
              <RNText
                style={{
                  color: "#3B82F6",
                }}
                font={"Poppins-Bold"}
              >
                Sign In
              </RNText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
};

export default SignUp;
