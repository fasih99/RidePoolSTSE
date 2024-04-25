import { Image } from "expo-image";
import { ActivityIndicator, View } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

export default function StartPage() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#72b6f5",
      }}
    >
      <Image
        style={{
          width: widthPercentageToDP(100),
          height: heightPercentageToDP(54),
          borderRadius: 4,
          backgroundColor: "#72b6f5",
        }}
        source="https://firebasestorage.googleapis.com/v0/b/ride-away-app.appspot.com/o/Box.png?alt=media&token=5cc43c07-158e-48c9-8dc7-aeca8f0f335d"
      />
      <ActivityIndicator
        size="large"
        color="#fff"
        style={{
          position: "absolute",
          bottom: 20,
        }}
      />
    </View>
  );
}
