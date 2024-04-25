import { Linking, Platform } from "react-native";

export const goToMaps = ({ latitude, longitude }) => {
  const scheme = Platform.select({ ios: "maps:0,0?q=", android: "geo:0,0?q=" });
  const latLng = `${latitude},${longitude}`;
  const label = "";
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}&dirflg=w&t=m`,
    android: `${scheme}${latLng}(${label})&dirflg=w&t=m`,
  });

  Linking.openURL(url);
};
export const generateRandomCoordinates = (latitude, longitude, radius) => {
  // Earth radius in kilometers
  const earthRadius = 6371;

  // Convert latitude and longitude from degrees to radians
  const radLatitude = latitude * (Math.PI / 180);
  const radLongitude = longitude * (Math.PI / 180);

  // Generate a random angle in radians
  const randomAngle = Math.random() * 2 * Math.PI;

  // Generate a random distance within the specified radius
  const randomDistance = Math.random() * radius;

  // Calculate new latitude and longitude using Haversine formula
  const newLatitude = Math.asin(
    Math.sin(radLatitude) * Math.cos(randomDistance / earthRadius) +
      Math.cos(radLatitude) *
        Math.sin(randomDistance / earthRadius) *
        Math.cos(randomAngle)
  );

  const newLongitude =
    radLongitude +
    Math.atan2(
      Math.sin(randomAngle) *
        Math.sin(randomDistance / earthRadius) *
        Math.cos(radLatitude),
      Math.cos(randomDistance / earthRadius) -
        Math.sin(radLatitude) * Math.sin(newLatitude)
    );

  // Convert new latitude and longitude from radians to degrees
  const newLatitudeDegrees = newLatitude * (180 / Math.PI);
  const newLongitudeDegrees = newLongitude * (180 / Math.PI);

  return {
    latitude: newLatitudeDegrees,
    longitude: newLongitudeDegrees,
    // icon: "https://d1a3f4spazzrp4.cloudfront.net/car-types/map70px/product/map-uberx.png",
    // icon: "https://d1a3f4spazzrp4.cloudfront.net/car-types/map70px/map-suv.png",
    // show random icons
    icon:
      Math.random() < 0.5
        ? "https://d1a3f4spazzrp4.cloudfront.net/car-types/map70px/product/map-uberx.png"
        : "https://d1a3f4spazzrp4.cloudfront.net/car-types/map70px/map-suv.png",
    // rotate the icon randomly
    rotation: Math.floor(Math.random() * 360),
  };
};
