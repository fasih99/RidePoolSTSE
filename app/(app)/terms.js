import React from "react";
import RNText from "../../components/RNText";
import { View } from "react-native";

const TermsAndConditions = () => {
  return (
    <View
      style={{
        padding: 14,
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <RNText font={"Poppins-Bold"}>Terms and Conditions</RNText>
      <RNText>
        By using our ride-sharing service, you agree to the following terms and
        conditions:
      </RNText>
      <RNText>- You must be at least 14 years old to use our service.</RNText>
      <RNText>- You must have a valid driver's license.</RNText>
      <RNText>- You must obey all traffic laws and regulations.</RNText>
      <RNText>
        - You are responsible for any damages caused to the vehicle during your
        ride.
      </RNText>
      <RNText>- You must treat the driver and the vehicle with respect.</RNText>
      <RNText>
        - We reserve the right to terminate your account for any violation of
        these terms.
      </RNText>
      
      <RNText style={{fontWeight: "bold"}}>
        - Delete Account : In order to delete your account please send us an email through your registered email ID at ridepool.us@gmail.com</RNText>
        <RNText style={{fontWeight: "bold"}}> - Upon recieving a request to delete your account we will promptly delete your account. </RNText>
     

     <RNText></RNText>
      <RNText font={"Poppins-Bold"}>Support</RNText>
      <RNText style={{fontWeight: "bold"}}>
        - Customer Service : +1 9402796141
      </RNText>
    </View>
  );
};

export default TermsAndConditions;
