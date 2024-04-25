import React from "react";
import { Text } from "react-native";

const RNText = ({ style, font, ...props }) => {
  const fontFamily = font || "Poppins-Regular"; // Default fontFamily

  return <Text style={[{ fontFamily }, style]} {...props} />;
};

export default RNText;
