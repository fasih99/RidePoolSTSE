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
import { SvgFromUri, SvgXml } from "react-native-svg";
import loginImg from "../../assets/svg/login";
import Loading from "../../components/Loading";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { AuthContext } from "../../context/authcontext";
import { useRouter } from "expo-router";
import CustomKeyboardView from "../../components/CustomKeybordView";
import { Image } from "expo-image";
import RNText from "../../components/RNText";
import Colors from "../../constants/Colors";
const SignIn = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [hidePassword, setHidePassword] = useState(true);

  const handleSignIn = async () => {
    if (email === "" || password === "") {
      Alert.alert("Sign In", "Email and Password are required");
      return;
    }

    setLoading(true);

    let response = await login(email, password);

    setLoading(false);
    if (!response.success) {
      Alert.alert("SignIn", response.msg);
    }

    // Implement your sign-in logic here
  };

  return (
    <CustomKeyboardView>
      <View
        style={{
          paddingTop: hp(8),
          paddingHorizontal: wp(5),
          backgroundColor: "#fff",
          flex: 1,
          gap: 8,
        }}
      >
        <View
          style={{
            alignItems: "center",
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
            Sign in to get started
          </RNText>
        </View>
        <View
          style={{
            flex: 1,
            gap: 4,
          }}
        >
          <RNText>Email</RNText>
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
          <RNText>Password</RNText>

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
                router.replace("/forgotpassword");
              }}
            >
              <RNText
                style={{
                  textAlign: "right",
                  marginVertical: 3.5,
                }}
              >
                Forgot password?
              </RNText>
            </Pressable>

            <Pressable
              onPress={() => {
                setHidePassword(!hidePassword);
              }}
              style={{
                zIndex: 10,
                position: "absolute",
                right: 5,
                top: 2,
              }}
            >
              {hidePassword ? (
                <AntDesign name="eye" size={20} color="black" />
              ) : (
                <FontAwesome name="eye-slash" size={20} color="black" />
              )}
            </Pressable>
          </View>
          <View>
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
                  backgroundColor: Colors.main,
                  borderRadius: 5,
                }}
                onPress={handleSignIn}
              >
                <RNText
                  style={{
                    fontSize: hp(2),
                    color: "#fff",
                    borderRadius: 5,
                    backgroundColor: "#111",
                    textAlign: "center",
                    padding: 7,
                  }}
                  font={"Poppins-Medium"}
                >
                  Sign In
                </RNText>
              </Pressable>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginVertical: 7,
            }}
          >
            <RNText
              style={{
                color: "#6B7280",
              }}
            >
              Don't have an account?{" "}
            </RNText>
            <TouchableOpacity
              onPress={() => {
                router.replace("/signup");
              }}
            >
              <RNText style={{ color: "#3B82F6" }} font={"Poppins-Bold"}>
                Sign Up
              </RNText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
};

export default SignIn;
