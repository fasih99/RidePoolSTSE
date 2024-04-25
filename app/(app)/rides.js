import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useContext } from "react";
import RNText from "../../components/RNText";
import { SURGE_CHARGE, MALE_RIDES, FEMALE_RIDES } from "../../constants/data";
import Colors from "../../constants/Colors";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { Image } from "expo-image";
import {
  Entypo,
  Foundation,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import dayjs from "dayjs";
import { AuthContext } from "../../context/authcontext";

const Rides = () => {
  const { rides } = useContext(AuthContext);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 7,
      }}
    >
      {rides.length > 0 ? (
        rides.map((ride) => (
          <View key={ride.id}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <RNText
                font={"Poppins-Medium"}
                style={{
                  fontSize: 17.5,
                  lineHeight: 24.5,
                }}
              >
                {dayjs(ride?.date.seconds * 1000).format(
                  "dddd, MMMM D, YYYY h:mm A"
                )}
              </RNText>
            </View>
            <TouchableOpacity
              // key={ride.id}
              onPress={() => {}}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
                width: widthPercentageToDP(90),
                padding: 8,
                gap: 8,
                paddingHorizontal: 8,
                position: "relative",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Image
                  source={{
                    uri: ride?.driver?.avatarUrl,
                  }}
                  style={{
                    height: 50,
                    aspectRatio: 1,
                    borderRadius: 50,
                    position: "absolute",
                    left: 22,
                    top: 10,
                    zIndex: 99,
                  }}
                />
                <Image
                  source={{
                    uri: ride?.ride?.image,
                  }}
                  style={{
                    height: 60,
                    aspectRatio: 1.5,
                    marginLeft: 40,
                  }}
                />
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 3,
                    marginTop: -10,
                    borderRadius: 10,
                    backgroundColor: "#111",
                    width: 48,
                    zIndex: 199,
                    flexDirection: "row",
                  }}
                >
                  <RNText
                    style={{
                      color: "#fff",
                      fontSize: 10.5,
                      lineHeight: 14,
                    }}
                    font={"Poppins-Bold"}
                  >
                    4.5{" "}
                  </RNText>
                  <MaterialCommunityIcons
                    name="star"
                    size={14}
                    color="yellow"
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <RNText
                  font={"Poppins-Medium"}
                  style={{
                    fontSize: 15.75,
                    lineHeight: 24.5,
                  }}
                  numberOfLines={1}
                >
                  {ride?.driver?.name}{" "}
                </RNText>

                <RNText
                  font={"Poppins-Medium"}
                  numberOfLines={1}
                  style={{
                    color: Colors.mediumGray,
                    fontSize: 12.25,
                    lineHeight: 17.5,
                  }}
                >
                  {ride?.driver?.vehicle} · {ride?.driver?.model}
                </RNText>
              </View>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 4,
                  paddingHorizontal: 8,
                  backgroundColor: Colors.primary,
                  borderRadius: 10,
                  width: widthPercentageToDP(25),
                  marginLeft: 20,
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                <RNText
                  font={"Poppins-Bold"}
                  style={{
                    fontSize: 12.25,
                    lineHeight: 17.5,
                    color: "white",
                  }}
                  numberOfLines={1}
                >
                  {ride?.driver?.gender}
                </RNText>
                {ride?.driver?.gender === "Female" ? (
                  <Foundation name="female-symbol" size={24} color="white" />
                ) : (
                  <Foundation name="male-symbol" size={24} color="white" />
                )}
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 4,
                  paddingHorizontal: 8,
                  backgroundColor: Colors.yellow,
                  borderRadius: 10,
                  width: widthPercentageToDP(25),
                  marginLeft: 20,
                }}
              >
                <RNText
                  font={"Poppins-Bold"}
                  style={{
                    fontSize: 12.25,
                    lineHeight: 17.5,
                  }}
                  numberOfLines={1}
                >
                  {ride?.driver?.licensePlate}
                </RNText>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 4,
                  paddingHorizontal: 8,
                  backgroundColor: Colors.lightGray,
                  borderRadius: 10,
                  width: widthPercentageToDP(30),
                }}
              >
                <RNText
                  font={"Poppins-Bold"}
                  style={{ fontSize: 15.75, lineHeight: 24.5 }}
                >
                  {ride?.isDaily
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(
                        (ride?.distance?.duration?.value *
                          SURGE_CHARGE *
                          ride?.ride.multiplier) /
                          100
                      )
                    : new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(
                        35 * ride?.ride.multiplier * ride?.selectedHours
                      )}
                </RNText>
              </View>
            </View>

            <View
              style={{
                gap: 3,
                marginTop: 12,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderWidth: 2,
                  borderRadius: 16,
                  borderColor: Colors.lightGray,
                  padding: 8,
                  paddingHorizontal: 16,
                  backgroundColor: Colors.extraLightGray,
                }}
              >
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      gap: 12,
                    }}
                  >
                    <Octicons name="dot" size={24} color={Colors.green} />
                    <RNText
                      font={"Poppins-Medium"}
                      style={{
                        fontSize: 15.75,
                        lineHeight: 24.5,
                      }}
                    >
                      {ride?.pickUpLocation?.description}
                    </RNText>
                  </View>

                  <View
                    style={{
                      borderTopWidth: 1,
                      borderColor: Colors.lightGray,
                      width: widthPercentageToDP(90),
                      alignSelf: "flex-end",
                    }}
                  ></View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      gap: 12,
                    }}
                  >
                    <Octicons name="dot" size={24} color={Colors.red} />
                    <RNText
                      font={"Poppins-Medium"}
                      style={{
                        fontSize: 15.75,
                        lineHeight: 24.5,
                      }}
                    >
                      {ride?.dropLocation?.description}
                    </RNText>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: 10,
              }}
            >
              <RNText
                font={"Poppins-Medium"}
                style={{
                  fontSize: 15.75,
                  lineHeight: 24.5,
                }}
              >
                Distance: {ride?.distance?.distance?.text}
              </RNText>
              <RNText
                font={"Poppins-Medium"}
                style={{
                  fontSize: 15.75,
                  lineHeight: 24.5,
                }}
              >
                Duration: {ride?.distance?.duration?.text}
              </RNText>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 10,
                backgroundColor:
                  ride?.tripStatus === "Completed" ? Colors.green : Colors.red,
                width: widthPercentageToDP(90),
                padding: 8,
                borderRadius: 10,
                alignSelf: "center",
              }}
            >
              <RNText
                font={"Poppins-Medium"}
                style={{
                  fontSize: 17.5,
                  lineHeight: 24.5,
                  color: "white",
                }}
              >
                {ride.tripStatus}
              </RNText>
            </View>
            <View
              style={{
                borderTopWidth: 1,
                borderColor: Colors.lightGray,
                marginVertical: 8,
              }}
            ></View>
          </View>
        ))
      ) : (
        <View
          style={{
            alignItems: "center",
            padding: 14,
            flex: 1,
          }}
        >
          <RNText
            font={"Poppins-Medium"}
            style={{
              fontSize: 15.75,
              lineHeight: 24.5,
            }}
          >
            No Rides Found
          </RNText>
        </View>
      )}
    </ScrollView>
  );
};

export default Rides;
