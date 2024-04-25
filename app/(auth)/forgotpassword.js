import React, { useContext, useState } from "react";
import { View, TextInput, Button, Alert, Text, Pressable } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SvgXml } from "react-native-svg";
import Loading from "../../components/Loading";
import { AuthContext } from "../../context/authcontext";
import { useRouter } from "expo-router";
import RNText from "../../components/RNText";
import Colors from "../../constants/Colors";
import password from "../../assets/svg/password";
const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useContext(AuthContext);
  const router = useRouter();
  const handleResetPassword = async () => {
    //check if email is empty
    if (email === "") {
      Alert.alert("SignUp", "Email is required");
      return;
    }
    setLoading(true);
    const status = await resetPassword(email);
    setLoading(false);

    if (status.success) {
      Alert.alert(
        "Password Reset Email Sent",
        "Please check your email to reset your password.",
        [
          {
            text: "Go to Sign In",
            onPress: () => router.replace("/signin"),
          },
        ]
      );
    } else {
      Alert.alert("Reset Password", status.message);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <View
        style={{
          paddingTop: hp(8),
          paddingHorizontal: wp(5),
          flex: 1,
          gap: 4,
        }}
      >
        <View
          style={{
            alignItems: "center",
          }}
        >
          <SvgXml key={`login`} xml={password} width={200} height={200} />
        </View>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <RNText
            style={{
              fontSize: 31.5,
              lineHeight: 35,
            }}
            font={"Poppins-Medium"}
          >
            Reset Password
          </RNText>
        </View>
        <RNText font={"Poppins-Medium"}>Email</RNText>
        <TextInput
          placeholder="test@test.com"
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
        <RNText>
          Please enter your registered email address. You will receive a link to
          create a new password via email.
        </RNText>
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
            <>
              <Pressable
                style={{
                  backgroundColor: "#111",
                  borderRadius: 5,
                }}
                onPress={handleResetPassword}
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
                  Reset
                </RNText>
              </Pressable>
              <Pressable
                style={{
                  backgroundColor: Colors.main,
                  borderRadius: 5,
                  marginTop: 14,
                }}
                onPress={() => {
                  router.replace("/signin");
                }}
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
                  Back
                </RNText>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;
