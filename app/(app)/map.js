import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
  useCallback,
} from "react";
import MapView, { Marker } from "react-native-maps";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AuthContext } from "../../context/authcontext";

import { generateRandomCoordinates } from "../../constants/helpers";
import BottomSheet, {
  TouchableOpacity,
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import RNText from "../../components/RNText";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeHeader from "../../components/HomeHeader";
import { mapsStyles } from "../../constants";
import {
  AntDesign,
  FontAwesome5,
  Foundation,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import { Image } from "expo-image";
import dayjs from "dayjs";
import {
  MALE_RIDES,
  FEMALE_RIDES,
  genders,
  languages,
  drivers,
  SURGE_CHARGE,
} from "../../constants/data";
import { addRide } from "../../constants/api";

export default function Map() {
  const { location, user } = useContext(AuthContext);
  const [index, setIndex] = useState(0);

  const [tripIndex, setTripIndex] = useState(0);

  const [pickUpLocation, setPickUpLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);

  const [riderPreference, setRiderPreference] = useState({
    gender: "Both",
    languages: [],
  });

  const [markers, setMarkers] = useState([]);
  const [tripStatus, setTripStatus] = useState(null);
  const [selectedRide, setSelectedRide] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [driver, setDriver] = useState(null);
  const [timeToReach, setTimeToReach] = useState(
    Math.floor(Math.random() * 5) + 3
  );

  const [isDaily, setIsDaily] = useState(true);

  const [selectedHours, setSelectedHours] = useState(false);
  const [distance, setDistance] = useState(null);
  const resetRide = () => {
    setTripStatus(null);
    setPickUpLocation(null);
    setDropLocation(null);
    setTripIndex(0);
    setIndex(0);
    setDriver(null);
    setSelectedRide(null);
    setSelectedHours(null);
    setIsDaily(true);
    setDistance(null);
  };
  const setData = () => {
    setPickUpLocation({
      description: "L. B. Nagar, Hyderabad, Telangana, India",
      location: { lat: 17.3457176, lng: 78.55222959999999 },
    });
    setDropLocation({
      description: "Dilsukhnagar, Hyderabad, Telangana, India",
      location: { lat: 17.3684658, lng: 78.53159409999999 },
    });
  };
  const pickUpLocationRef = useRef(null);
  const dropLocationRef = useRef(null);
  const mapRef = useRef(null);
  const locationSheetModalRef = useRef(null);
  const tripSheetModalRef = useRef(null);
  const filterSheetModalRef = useRef(null);
  const rideInitModalRef = useRef(null);

  const snapPoints = useMemo(() => ["26%", "75%"], []);

  const tripSnapPoints = useMemo(() => ["40%", "55%"], []);

  const rideInitSnapPoints = useMemo(() => ["42%"], []);
  const gender = user?.gender === "female" ? true : false;

  const isPathProvided = pickUpLocation !== null && dropLocation !== null;

  useEffect(() => {
    if (pickUpLocation !== null) {
      setMarkers(
        Array.from({ length: 10 }, () =>
          generateRandomCoordinates(
            pickUpLocation.location.lat,
            pickUpLocation.location.lng,
            1
          )
        )
      );
    } else if (location !== null) {
      setMarkers(
        Array.from({ length: 10 }, () =>
          generateRandomCoordinates(
            location.coords.latitude,
            location.coords.longitude,
            1
          )
        )
      );
    }
  }, [location, pickUpLocation]);

  useEffect(() => {
    if (!pickUpLocation || !dropLocation) return;

    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: {
        top: 100,
        right: 100,
        bottom: 100,
        left: 100,
      },
    });
  }, [pickUpLocation, dropLocation]);
  useEffect(() => {
    if (!pickUpLocation || !dropLocation) return;
    if (tripIndex === 1) {
      const bounds = {
        northEast: {
          latitude: Math.max(
            pickUpLocation.location.lat,
            dropLocation.location.lat
          ),
          longitude: Math.max(
            pickUpLocation.location.lng,
            dropLocation.location.lng
          ),
        },
        southWest: {
          latitude: Math.min(
            pickUpLocation.location.lat,
            dropLocation.location.lat
          ),
          longitude: Math.min(
            pickUpLocation.location.lng,
            dropLocation.location.lng
          ),
        },
      };

      mapRef.current.fitToCoordinates([bounds.northEast, bounds.southWest], {
        edgePadding: { top: 100, right: 100, bottom: 300, left: 100 },
        animated: true,
      }); // this is not working
    } else {
      mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
        edgePadding: {
          top: 100,
          right: 250,
          bottom: 100,
          left: 250,
        },
      });
    }
  }, [tripIndex]);
  // useEffect(() => {
  //   setData();
  // }, []);

  useEffect(() => {
    if (index === 1) {
      if (pickUpLocation)
        pickUpLocationRef.current?.setAddressText(pickUpLocation?.description);
      if (dropLocation)
        dropLocationRef.current?.setAddressText(dropLocation?.description);
    }
    if (index === 0) mapRef.current.fitToElements(true);
  }, [index]);

  useEffect(() => {
    if (tripStatus === null) return;

    if (tripStatus === "Arriving") {
      const filteredDrivers = drivers.filter((driver) => {
        if (
          (driver.languages.some(
            (lang) =>
              riderPreference.languages.includes(lang) ||
              riderPreference.languages.length === 0
          ) &&
            (riderPreference.gender === "Both" ||
              riderPreference.gender === driver.gender)) ||
          (selectedRide?.name === "RidePool Pink" && driver.gender === "Female")
        )
          return true;
        else return false;
      });
      if (filteredDrivers.length > 0) {
        setDriver(
          filteredDrivers[Math.floor(Math.random() * filteredDrivers.length)]
        );
      } else {
        Alert.alert(
          "No drivers available",
          "Apologies, we currently don't have any drivers available matching your preferences.",
          [
            {
              text: "OK",
              onPress: () => {
                setTripStatus(null);
              },
            },
          ]
        );
      }
    }
    if (tripStatus === "Cancelled") {
      const trip = {
        rider: user,
        driver,
        ride: selectedRide,
        distance,
        pickUpLocation,
        dropLocation,
        date: new Date(),
        selectedHours,
        isDaily,
        tripStatus,
      };

      addRide(trip, user.id).then((res) => {
        if (res.success) {
          Alert.alert(
            "Trip Cancelled",
            "Your trip has been saved successfully",
            [
              {
                text: "OK",
                onPress: () => {
                  //resetRide();
                },
              },
            ]
          );
        } else {
          Alert.alert("Error", "There was an error saving your trip", [
            {
              text: "OK",
              onPress: () => {
                // resetRide();
              },
            },
          ]);
        }
      });
    }
    if (tripStatus === "Completed") {
      const trip = {
        rider: user,
        driver,
        ride: selectedRide,
        distance,
        pickUpLocation,
        dropLocation,
        date: new Date(),
        selectedHours,
        isDaily,
        tripStatus,
      };

      addRide(trip, user.id).then((res) => {
        if (res.success) {
          Alert.alert(
            "Trip Completed",
            "Your trip has been completed successfully",
            [
              {
                text: "OK",
                onPress: () => {
                  //resetRide();
                },
              },
            ]
          );
        } else {
          Alert.alert("Error", "There was an error completing your trip", [
            {
              text: "OK",
              onPress: () => {
                // resetRide();
              },
            },
          ]);
        }
      });
    }
    if (tripStatus === "Started") {
    }
  }, [tripStatus]);

  useEffect(() => {
    if (pickUpLocation)
      pickUpLocationRef.current?.setAddressText(pickUpLocation?.description);
    if (dropLocation)
      dropLocationRef.current?.setAddressText(dropLocation?.description);

    if (!pickUpLocation || !dropLocation) return;

    // create a iffe function to get the distance between two points
    (async () => {
      try {
        const { rows } = await fetch(
          `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${pickUpLocation.location.lat},${pickUpLocation.location.lng}&destinations=${dropLocation.location.lat},${dropLocation.location.lng}&key=AIzaSyBLUR_dBTa9l4s-UYSpdVUJOJR3FFv2_6E`
        ).then((res) => res.json());
        // if the distance is not found return

        if (rows[0].elements[0].status === "OK") {
          setDistance({
            duration: rows[0].elements[0].duration,
            distance: rows[0].elements[0].distance,
          });
        } else {
          // say user we are not able to travel
          Alert.alert(
            "Service Area Exceeded",
            "Apologies, we currently can't support trips exceeding our service area.",
            [
              {
                text: "OK",
                onPress: () => {
                  setPickUpLocation(null);
                  setDropLocation(null);
                },
              },
            ]
          );
          setDistance({
            duration: { text: "0 mins", value: 0 },
            distance: { text: "0 mi", value: 0 },
          });
        }
      } catch (error) {
        Alert.alert(
          "Service Area Exceeded",
          "Apologies, we currently can't support trips exceeding our service area.",
          [
            {
              text: "OK",
              onPress: () => {
                setDropLocation(null);
                setPickUpLocation(null);
              },
            },
          ]
        );

        setDistance({
          duration: { text: "0 mins", value: 0 },
          distance: { text: "0 mi", value: 0 },
        });
      }

      // calculate the ride price based on the distance
    })();
  }, [pickUpLocation, dropLocation]);

  const renderBackDrop = useCallback(
    (props) => <BottomSheetBackdrop enableTouchThrough={false} {...props} />,
    []
  );

  const StartModal = (
    <View
      style={{
        height: "100%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
    >
      <RNText
        font={"Poppins-Medium"}
        style={{
          textAlign: "center",
          fontSize: 17.5,
          lineHeight: 24.5,
          marginVertical: 7,
        }}
      >
        Set your pick-up location
      </RNText>
      <View
        style={{
          borderTopWidth: 1,
          borderColor: Colors.lightGray,
          marginVertical: 8,
        }}
      ></View>
      <View
        style={{
          paddingHorizontal: 16,
          gap: 3,
          marginTop: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setIndex(1);
          }}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            //add border
            borderWidth: 1,
            borderRadius: 10,
            borderColor: Colors.lightGray,
            padding: 8,
            paddingHorizontal: 16,
            backgroundColor: Colors.lightGray,
          }}
        >
          <FontAwesome5 name="dot-circle" size={16} color="black" />
          <RNText
            font={"Poppins-Medium"}
            numberOfLines={1}
            style={{
              width: wp(65),

              fontSize: 15.75,
              lineHeight: 24.5,
            }}
          >
            {pickUpLocation?.description || "Search Location"}
          </RNText>
          <MaterialIcons name="search" size={20} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            padding: 8,
            paddingHorizontal: 16,

            borderRadius: 10,
            marginTop: 16,
          }}
        >
          <RNText
            font={"Poppins-Medium"}
            style={{
              fontSize: 17.5,
              lineHeight: 24.5,
              textAlign: "center",
              color: "white",
            }}
          >
            Confirm pick-up
          </RNText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const locationModal = (
    <View
      style={{
        height: "100%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
    >
      <RNText
        font={"Poppins-Medium"}
        style={{
          textAlign: "center",
          fontSize: 17.5,
          lineHeight: 24.5,
          marginVertical: 7,
        }}
      >
        plan your trip
      </RNText>
      <View
        style={{
          borderTopWidth: 1,
          borderColor: Colors.lightGray,
          marginVertical: 8,
        }}
      ></View>
      <View
        style={{
          paddingHorizontal: 16,
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
              }}
            >
              <Octicons name="dot" size={24} color={Colors.green} />
              <GooglePlacesAutocomplete
                ref={pickUpLocationRef}
                placeholder="Pickup location"
                nearbyPlacesAPI="GooglePlacesSearch"
                debounce={400}
                fetchDetails={true}
                listEmptyComponent={
                  <View style={{ flex: 1 }}>
                    <RNText
                      font={"Poppins-Medium"}
                      style={{
                        textAlign: "center",
                      }}
                    >
                      No results were found
                    </RNText>
                  </View>
                }
                enablePoweredByContainer={false}
                styles={{
                  textInput: {
                    marginLeft: 16,
                    backgroundColor: "transparent",
                    fontFamily: "Poppins-Medium",
                    fontSize: 15,
                    height: "100%",
                    borderRadius: 5,
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    flex: 1,
                  },
                  listView: {
                    backgroundColor: "white",
                    position: "absolute",
                    top: 100,
                    left: -40,
                    width: wp(94),
                    zIndex: 1000,
                  },
                }}
                onPress={(data, details = null) => {
                  setPickUpLocation({
                    location: details?.geometry?.location,
                    description: data.description,
                  });
                }}
                query={{
                  key: "AIzaSyBLUR_dBTa9l4s-UYSpdVUJOJR3FFv2_6E",
                  language: "en",
                  // only us
                  components: "country:us",
                }}
              />
              <AntDesign
                name="closecircleo"
                size={16}
                color={Colors.mediumGray}
                onPress={() => {
                  pickUpLocationRef.current.clear();
                  setPickUpLocation(null);
                }}
              />
            </View>
            <MaterialCommunityIcons
              name="dots-vertical"
              style={{
                position: "absolute",
                top: 27,
                left: -7,
              }}
              size={26}
              color={Colors.lightGray}
            />
            <View
              style={{
                borderTopWidth: 1,
                borderColor: Colors.lightGray,
                width: wp(75),
                alignSelf: "flex-end",
              }}
            ></View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Octicons name="dot" size={24} color={Colors.red} />
              <GooglePlacesAutocomplete
                ref={dropLocationRef}
                placeholder="Drop location"
                nearbyPlacesAPI="GooglePlacesSearch"
                debounce={400}
                minLength={2}
                fetchDetails={true}
                enablePoweredByContainer={false}
                listEmptyComponent={
                  <View style={{ flex: 1 }}>
                    <RNText
                      style={{
                        textAlign: "center",
                      }}
                      font={"Poppins-Medium"}
                    >
                      No results were found
                    </RNText>
                  </View>
                }
                styles={{
                  textInput: {
                    marginLeft: 16,
                    backgroundColor: "transparent",
                    fontFamily: "Poppins-Medium",
                    fontSize: 15,
                    height: "100%",
                    borderRadius: 5,
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    flex: 1,
                  },
                  listView: {
                    backgroundColor: "white",
                    position: "absolute",
                    top: 70,
                    left: -40,
                    width: wp(94),
                    zIndex: 1000,
                  },
                }}
                onPress={(data, details = null) => {
                  setDropLocation({
                    location: details?.geometry?.location,
                    description: data.description,
                  });
                }}
                query={{
                  key: "AIzaSyBLUR_dBTa9l4s-UYSpdVUJOJR3FFv2_6E",
                  language: "en",
                  components: "country:us",
                }}
              />
              <AntDesign
                name="closecircleo"
                size={16}
                color={Colors.mediumGray}
                onPress={() => {
                  dropLocationRef.current.clear();
                  setDropLocation(null);
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
  const ridesModal = (
    <View
      style={{
        height: "100%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
    >
      <View
        style={{
          position: "relative",
        }}
      >
        {isDaily && (
          <RNText
            font={"Poppins-Medium"}
            style={{
              textAlign: "center",
              fontSize: 17.5,
              lineHeight: 24.5,
              marginVertical: 7,
            }}
          >
            Choose ride for {distance?.distance?.text} trip
          </RNText>
        )}
        {!isDaily && selectedHours && (
          <View style={{}}>
            {/* back icon */}
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="black"
              style={{ position: "absolute", left: 24, top: 4, zIndex: 99 }}
              onPress={() => {
                setSelectedHours(null);
              }}
            />

            <RNText
              font={"Poppins-Medium"}
              style={{
                textAlign: "center",
                fontSize: 17.5,
                lineHeight: 24.5,
                marginVertical: 7,
              }}
            >
              Choose ride for{" "}
              <RNText
                style={{
                  color: Colors.main,
                }}
                font={"Poppins-Bold"}
                onPress={() => {
                  setSelectedHours(null);
                }}
              >
                {selectedHours} hr
              </RNText>{" "}
              trip
            </RNText>
          </View>
        )}
        {!isDaily && !selectedHours && (
          <RNText
            font={"Poppins-Medium"}
            style={{
              textAlign: "center",
              fontSize: 17.5,
              lineHeight: 24.5,
              marginVertical: 7,
            }}
          >
            Select a package
          </RNText>
        )}

        <AntDesign
          name="filter"
          size={24}
          color="black"
          style={{
            position: "absolute",
            right: 24,
          }}
          onPress={() => {
            setOpenFilter(!openFilter);
          }}
        />
      </View>

      <View
        style={{
          borderTopWidth: 1,
          borderColor: Colors.lightGray,
          marginVertical: 8,
        }}
      ></View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: -8,
          marginBottom: 8,
        }}
      >
        <TouchableOpacity
          style={{
            borderBottomWidth: isDaily ? 2 : 0,
            borderColor: isDaily ? Colors.primary : "transparent",
          }}
          onPress={() => {
            setIsDaily(true);
          }}
        >
          <Image
            source={{
              uri: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_426,h_240/v1597151255/assets/af/a978c2-d3de-4b6b-a80e-001ef05370ff/original/UberX.jpg",
            }}
            style={{
              height: 50,
              aspectRatio: 1,
            }}
          />
          <RNText
            font={"Poppins-Medium"}
            style={{
              textAlign: "center",
              fontSize: 12.25,
              lineHeight: 17.5,
            }}
          >
            Daily
          </RNText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderBottomWidth: isDaily ? 0 : 2,
            borderColor: isDaily ? "transparent" : Colors.primary,
          }}
          onPress={() => {
            setIsDaily(false);
          }}
        >
          <Image
            source={{
              uri: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_426,h_240/v1630531077/assets/38/494083-cc23-4cf7-801c-0deed7d9ca55/original/uber-hourly.png",
            }}
            style={{
              height: 50,
              aspectRatio: 1,
            }}
          />
          <RNText
            font={"Poppins-Medium"}
            style={{
              textAlign: "center",
              fontSize: 12.25,
              lineHeight: 17.5,
            }}
          >
            Rentals
          </RNText>
        </TouchableOpacity>
      </View>
      {isDaily && (
        <View
          style={{
            paddingHorizontal: 8,
            gap: 8,
            marginTop: 2,
          }}
        >
          {(gender === true ? FEMALE_RIDES : MALE_RIDES).map((ride) => (
            <TouchableOpacity
              key={ride.id}
              onPress={() => {
                setSelectedRide(ride);
                setTripIndex(1);
                setTimeToReach(ride.time);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 2,
                borderRadius: 10,
                borderColor:
                  selectedRide?.id === ride.id ? Colors.primary : "transparent",
                padding: 8,
                paddingHorizontal: 8,
              }}
            >
              <Image
                source={ride.image}
                style={{
                  height: 50,
                  aspectRatio: 1.5,
                }}
              />
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
                  {ride.name}
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
                  {dayjs().add(ride.time, "minutes").format("hh:mma ")}·{" "}
                  {ride.time} min away
                </RNText>
              </View>
              <View>
                <RNText
                  font={"Poppins-Medium"}
                  numberOfLines={1}
                  style={{
                    fontSize: 15.75,
                    lineHeight: 24.5,
                  }}
                >
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(
                    (distance?.duration?.value *
                      SURGE_CHARGE *
                      ride.multiplier) /
                      100
                  )}
                </RNText>
                <RNText
                  font={"Poppins-Medium"}
                  numberOfLines={1}
                  style={{
                    color: Colors.mediumGray,
                    fontSize: 10.5,
                    lineHeight: 14,
                    alignSelf: "flex-start",
                  }}
                >
                  {distance?.duration?.text}
                </RNText>
              </View>
            </TouchableOpacity>
          ))}

          {selectedRide && (
            <>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.primary,
                  padding: 8,
                  paddingHorizontal: 16,

                  borderRadius: 10,
                }}
                onPress={() => {
                  setTripStatus("Arriving");
                }}
              >
                <RNText
                  font={"Poppins-Medium"}
                  style={{
                    fontSize: 17.5,
                    lineHeight: 24.5,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Choose {selectedRide?.name || "Ride"}
                </RNText>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
      {!isDaily && (
        <View
          style={{
            paddingHorizontal: 8,
            gap: 8,
            marginTop: 2,
          }}
        >
          {!selectedHours && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 8,
                  marginVertical: 16,
                  flexWrap: "wrap",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedHours(index);
                    }}
                    key={index}
                    style={{
                      height: 50,
                      width: 50,
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      padding: 1,

                      backgroundColor:
                        selectedHours === index
                          ? Colors.primary
                          : "transparent",
                      paddingHorizontal: 4,
                      borderRadius: 4,
                      //add border
                      borderWidth: 1,
                      borderColor: Colors.lightGray,
                    }}
                  >
                    <RNText
                      font={"Poppins-Bold"}
                      style={{
                        color: selectedHours === index ? "white" : "black",
                        fontSize: 12.25,
                        lineHeight: 17.5,
                      }}
                    >
                      {index} hr
                    </RNText>
                    <RNText
                      font={"Poppins-Medium"}
                      style={{
                        color: selectedHours === index ? "white" : "black",
                        fontSize: 12.25,
                        lineHeight: 17.5,
                      }}
                    >
                      {index * 10} mi
                    </RNText>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
          {selectedHours && (
            <View
              style={{
                paddingHorizontal: 8,
                gap: 8,
                marginTop: 2,
              }}
            >
              {(gender === true ? FEMALE_RIDES : MALE_RIDES).map((ride) => (
                <TouchableOpacity
                  key={ride.id}
                  onPress={() => {
                    setSelectedRide(ride);
                    setTripIndex(1);
                    setTimeToReach(ride.time);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderWidth: 2,
                    borderRadius: 10,
                    borderColor:
                      selectedRide?.id === ride.id
                        ? Colors.primary
                        : "transparent",
                    padding: 8,
                    paddingHorizontal: 8,
                  }}
                >
                  <Image
                    source={ride.image}
                    style={{
                      height: 50,
                      aspectRatio: 1.5,
                    }}
                  />
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
                      {ride.name}
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
                      {selectedHours * 10} mi included · {ride.time} min away
                    </RNText>
                  </View>
                  <View>
                    <RNText
                      font={"Poppins-Medium"}
                      style={{
                        fontSize: 15.75,
                        lineHeight: 24.5,
                      }}
                      numberOfLines={1}
                    >
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(
                        // calculate hourly price default price is 50$ then 10$ for every 1 hour
                        35 * ride.multiplier * selectedHours
                      )}
                    </RNText>
                    <RNText
                      font={"Poppins-Medium"}
                      numberOfLines={1}
                      style={{
                        color: Colors.mediumGray,
                        fontSize: 10.5,
                        lineHeight: 14,
                        alignSelf: "flex-start",
                      }}
                    >
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(
                        // calculate hourly price default price is 50$ then 10$ for every 1 hour
                        35 * ride.multiplier
                      )}{" "}
                      / hour
                    </RNText>
                  </View>
                </TouchableOpacity>
              ))}

              {selectedRide && (
                <>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.primary,
                      padding: 8,
                      paddingHorizontal: 16,

                      borderRadius: 10,
                    }}
                    onPress={() => {
                      setTripStatus("Arriving");
                    }}
                  >
                    <RNText
                      font={"Poppins-Medium"}
                      style={{
                        fontSize: 17.5,
                        lineHeight: 24.5,
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      Choose {selectedRide?.name || "Ride"}
                    </RNText>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#212121" }}>
      <HomeHeader />
      <MapView
        ref={mapRef}
        region={{
          latitude: location ? location.coords.latitude : 17.490141,
          longitude: location ? location.coords.longitude : 78.349036,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        style={{
          width: "100%",
          height: hp(75),
        }}
        customMapStyle={mapsStyles}
        initialRegion={INITIAL_REGION}
        showsUserLocation={
          location !== null &&
          (pickUpLocation === null || dropLocation === null)
        }
        showsMyLocationButton
        showsCompass={false}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            image={{
              uri: marker.icon,
            }}
            style={{
              zIndex: 99,
            }}
            rotation={marker.rotation}
            tracksViewChanges={false}
          />
        ))}

        {pickUpLocation !== null && dropLocation !== null && (
          <MapViewDirections
            origin={pickUpLocation.description}
            destination={dropLocation.description}
            apikey={"AIzaSyBLUR_dBTa9l4s-UYSpdVUJOJR3FFv2_6E"}
            strokeWidth={3}
            strokeColor="hotpink"
          />
        )}

        {pickUpLocation !== null && dropLocation !== null && (
          <Marker
            coordinate={{
              latitude: pickUpLocation.location.lat,
              longitude: pickUpLocation.location.lng,
            }}
            image={{
              uri: "https://cdn-icons-png.flaticon.com/128/5425/5425869.png",
            }}
            title="origin"
            identifier="origin"
            tracksViewChanges={false}
            zIndex={999}
            onPress={() => {
              setPickUpLocation(null);
              setIndex(1);
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                maxWidth: 250,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: "100%",
                  margin: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 1,
                  backgroundColor: "#111",
                  paddingHorizontal: 4,
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
                  {/* random number between 3-8 */}
                  {timeToReach}
                </RNText>
                <RNText
                  style={{
                    color: "#fff",
                    fontSize: 10.5,
                    lineHeight: 14,
                  }}
                  font={"Poppins-Bold"}
                >
                  mins
                </RNText>
              </View>
              <RNText
                style={{
                  padding: 6,
                  paddingHorizontal: 8,
                  width: 140,
                }}
                numberOfLines={1}
                font={"Poppins-Medium"}
              >
                {pickUpLocation.description}
              </RNText>
              <MaterialIcons name="chevron-right" size={24} color="black" />
            </View>
          </Marker>
        )}
        {pickUpLocation !== null && dropLocation !== null && (
          <Marker
            coordinate={{
              latitude: dropLocation.location.lat,
              longitude: dropLocation.location.lng,
            }}
            image={{
              uri: "https://cdn-icons-png.flaticon.com/128/5425/5425869.png",
            }}
            title="destination"
            identifier="destination"
            tracksViewChanges={false}
            zIndex={999}
            onPress={() => {
              setDropLocation(null);
              setIndex(1);
            }}
          >
            <View
              style={{
                backgroundColor: "#111",
                padding: 6,
                borderWidth: 1,
                paddingHorizontal: 8,
                borderRadius: 10,
                maxWidth: 200,
              }}
            >
              <RNText
                numberOfLines={1}
                font={"Poppins-Medium"}
                style={{
                  color: "white",
                }}
              >
                {dropLocation.description}
              </RNText>
            </View>
          </Marker>
        )}
      </MapView>
      {isPathProvided ? (
        <>
          {tripStatus !== null ? (
            <BottomSheet
              ref={rideInitModalRef}
              snapPoints={rideInitSnapPoints}
              style={{ borderRadius: 20 }}
            >
              <RNText
                font={"Poppins-Medium"}
                style={{
                  textAlign: "center",
                  fontSize: 17.5,
                  lineHeight: 24.5,
                  marginVertical: 7,
                }}
              >
                {tripStatus === "Arriving" &&
                  `Your ride is arriving in ${timeToReach} mins`}
                {tripStatus === "Started" &&
                  `You will reach in ${distance?.duration?.text}`}
                {tripStatus === "Cancelled" && "Ride Cancelled"}
                {tripStatus === "Completed" && "Ride Completed"}
              </RNText>
              <View
                style={{
                  borderTopWidth: 1,
                  borderColor: Colors.lightGray,
                  marginVertical: 8,
                }}
              ></View>

              <TouchableOpacity
                key={selectedRide.id}
                onPress={() => {}}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  width: wp(90),
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
                      uri: driver?.avatarUrl,
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
                    source={selectedRide.image}
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
                        color: "white",
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
                    {driver?.name}
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
                    {driver?.vehicle} · {driver?.model}
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
                    width: wp(25),
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
                    {driver?.gender}
                  </RNText>
                  {driver?.gender === "Female" ? (
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
                    width: wp(25),
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
                    {driver?.licensePlate}
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
                    width: wp(30),
                  }}
                >
                  <RNText
                    font={"Poppins-Bold"}
                    style={{
                      fontSize: 15.75,
                      lineHeight: 24.5,
                    }}
                  >
                    {isDaily
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(
                          (distance?.duration?.value *
                            SURGE_CHARGE *
                            selectedRide.multiplier) /
                            100
                        )
                      : new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(35 * selectedRide.multiplier * selectedHours)}
                  </RNText>
                </View>
              </View>
              <View
                style={{
                  borderTopWidth: 1,
                  borderColor: Colors.lightGray,
                  marginTop: 8,
                }}
              ></View>
              {tripStatus === "Arriving" && (
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 4,
                    paddingHorizontal: 8,
                    paddingVertical: 10,
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
                    Enter pin to start ride
                  </RNText>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                    }}
                  >
                    {[2, 3, 4, 6].map((index) => (
                      <View
                        key={index}
                        style={{
                          height: 30,
                          width: 30,
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 1,
                          backgroundColor: "#111",
                          paddingHorizontal: 4,
                          borderRadius: 3,
                        }}
                      >
                        <RNText
                          font={"Poppins-Bold"}
                          style={{
                            color: "white",
                            fontSize: 12.25,
                            lineHeight: 17.5,
                          }}
                        >
                          {index}
                        </RNText>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {tripStatus === "Started" && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    backgroundColor: Colors.primary,
                    paddingVertical: 10,
                  }}
                >
                  {driver?.languages.map((lang) => (
                    <View
                      key={lang}
                      style={{
                        padding: 4,
                        paddingHorizontal: 8,
                        backgroundColor: Colors.secondary,
                        borderRadius: 4,
                        alignSelf: "center",
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
                        {lang}
                      </RNText>
                    </View>
                  ))}
                </View>
              )}
              <View
                style={{
                  borderTopWidth: 1,
                  borderColor: Colors.lightGray,
                  // marginVertical: 8,
                }}
              ></View>

              {tripStatus === "Arriving" && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.red,
                        padding: 8,
                        paddingHorizontal: 16,

                        borderRadius: 10,
                        marginTop: 16,
                        marginHorizontal: 16,
                        width: wp(40),
                      }}
                      onPress={() => {
                        setTripStatus("Cancelled");
                      }}
                    >
                      <RNText
                        font={"Poppins-Medium"}
                        style={{
                          fontSize: 17.5,
                          lineHeight: 24.5,
                          textAlign: "center",
                          color: "white",
                        }}
                      >
                        Cancel Ride
                      </RNText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.primary,
                        padding: 8,
                        paddingHorizontal: 16,

                        borderRadius: 10,
                        marginTop: 16,
                        marginHorizontal: 16,
                        width: wp(40),
                      }}
                      onPress={() => {
                        setTripStatus("Started");
                      }}
                    >
                      <RNText
                        font={"Poppins-Medium"}
                        style={{
                          fontSize: 17.5,
                          lineHeight: 24.5,
                          textAlign: "center",
                          color: "white",
                        }}
                      >
                        Start Ride
                      </RNText>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              {tripStatus === "Started" && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.red,
                      padding: 8,
                      paddingHorizontal: 16,

                      borderRadius: 4,
                      marginTop: 16,
                      marginHorizontal: 16,
                      width: wp(80),
                    }}
                    onPress={() => {
                      setTripStatus("Completed");
                    }}
                  >
                    <RNText
                      font={"Poppins-Medium"}
                      style={{
                        fontSize: 17.5,
                        lineHeight: 24.5,
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      Pay & Complete Ride
                    </RNText>
                  </TouchableOpacity>
                </View>
              )}
              {tripStatus === "Cancelled" && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <RNText
                      font={"Poppins-Medium"}
                      style={{
                        padding: 8,
                        marginTop: 16,
                        textAlign: "center",
                        fontSize: 15.75,
                        lineHeight: 24.5,
                      }}
                    >
                      Your ride has been cancelled
                    </RNText>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.red,
                        padding: 8,

                        borderRadius: 4,
                        marginHorizontal: 16,
                        width: wp(80),
                      }}
                      onPress={resetRide}
                    >
                      <RNText
                        font={"Poppins-Medium"}
                        style={{
                          fontSize: 17.5,
                          lineHeight: 24.5,
                          textAlign: "center",
                          color: "white",
                        }}
                      >
                        Book Again
                      </RNText>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              {tripStatus === "Completed" && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <RNText
                      font={"Poppins-Medium"}
                      style={{
                        padding: 8,
                        marginTop: 16,
                        textAlign: "center",
                        fontSize: 15.75,
                        lineHeight: 24.5,
                      }}
                    >
                      Thank you for riding with us 🎉
                    </RNText>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.red,
                        padding: 8,

                        borderRadius: 4,
                        marginHorizontal: 16,
                        width: wp(80),
                      }}
                      onPress={resetRide}
                    >
                      <RNText
                        font={"Poppins-Medium"}
                        style={{
                          fontSize: 17.5,
                          lineHeight: 24.5,
                          textAlign: "center",
                          color: "white",
                        }}
                      >
                        Ride Again
                      </RNText>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </BottomSheet>
          ) : (
            <BottomSheet
              ref={tripSheetModalRef}
              snapPoints={tripSnapPoints}
              index={tripIndex}
              style={{ borderRadius: 20 }}
              onChange={(tripIndex) => {
                setTripIndex(tripIndex);
              }}
            >
              {ridesModal}
            </BottomSheet>
          )}
        </>
      ) : (
        <BottomSheet
          ref={locationSheetModalRef}
          snapPoints={snapPoints}
          index={index}
          style={{ borderRadius: 20 }}
          onChange={(index) => {
            setIndex(index);
          }}
        >
          {index === 0 && StartModal}
          {index === 1 && locationModal}
        </BottomSheet>
      )}
      {openFilter && (
        <BottomSheet
          ref={filterSheetModalRef}
          snapPoints={gender ? ["52%"] : ["41%"]}
          onClose={() => {
            setOpenFilter(false);
          }}
          style={{ borderRadius: 20 }}
          backdropComponent={renderBackDrop}
          enablePanDownToClose={true}
          onChange={(index) => {
            setIndex(index);
          }}
        >
          <View>
            <View>
              {gender && (
                <>
                  <RNText
                    font={"Poppins-Medium"}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      textAlign: "center",
                      fontSize: 15.75,
                      lineHeight: 24.5,
                      marginVertical: 3.5,
                    }}
                  >
                    Choose your rider preference
                  </RNText>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    {genders.map((gender) => (
                      <TouchableOpacity
                        key={gender.id}
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          padding: 8,
                          paddingHorizontal: 16,
                          backgroundColor:
                            riderPreference.gender === gender.name
                              ? Colors.primary
                              : Colors.lightGray,
                          borderRadius: 10,
                        }}
                        onPress={() => {
                          setRiderPreference(
                            (prevState) =>
                              (prevState = {
                                ...prevState,
                                gender: gender.name,
                              })
                          );
                        }}
                      >
                        <RNText
                          style={{
                            color:
                              riderPreference.gender === gender.name
                                ? "white"
                                : "black",
                            fontFamily:
                              riderPreference.gender === gender.name
                                ? "Poppins-Medium"
                                : "Poppins-Regular",
                          }}
                        >
                          {gender.name}
                        </RNText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
              <RNText
                font={"Poppins-Medium"}
                style={{
                  paddingHorizontal: 16,
                  marginTop: 12,
                  borderRadius: 10,
                  textAlign: "center",
                  fontSize: 15.75,
                  lineHeight: 24.5,
                  marginVertical: 3.5,
                }}
              >
                Languages you are comfortable with
              </RNText>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  padding: 8,
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {languages.map((language) => (
                  <TouchableOpacity
                    key={language.id}
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 8,
                      paddingHorizontal: 16,
                      backgroundColor: riderPreference.languages.includes(
                        language.name
                      )
                        ? Colors.primary
                        : Colors.lightGray,
                      borderRadius: 10,
                      width: wp(29),
                    }}
                    onPress={() => {
                      setRiderPreference((prevState) => {
                        if (prevState.languages.includes(language.name)) {
                          return {
                            ...prevState,
                            languages: prevState.languages.filter(
                              (lang) => lang !== language.name
                            ),
                          };
                        } else {
                          return {
                            ...prevState,
                            languages: [...prevState.languages, language.name],
                          };
                        }
                      });
                    }}
                  >
                    <RNText
                      style={{
                        color: riderPreference.languages.includes(language.name)
                          ? "white"
                          : "black",
                        fontFamily: riderPreference.languages.includes(
                          language.name
                        )
                          ? "Poppins-Medium"
                          : "Poppins-Regular",
                      }}
                    >
                      {language.name}
                    </RNText>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: Colors.primary,
                  padding: 8,
                  paddingHorizontal: 16,
                  marginHorizontal: 16,
                  borderRadius: 10,
                  marginTop: 8,
                }}
                onPress={() => {
                  filterSheetModalRef.current?.close();
                }}
              >
                <RNText
                  font={"Poppins-Medium"}
                  style={{
                    fontSize: 17.5,
                    lineHeight: 24.5,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Update Preferences
                </RNText>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheet>
      )}
    </GestureHandlerRootView>
  );
}

export const INITIAL_REGION = {
  latitude: 17.490141,
  longitude: 78.349036,
  latitudeDelta: 0.001,
  longitudeDelta: 0.002,
};

// AIzaSyBLUR_dBTa9l4s-UYSpdVUJOJR3FFv2_6E
