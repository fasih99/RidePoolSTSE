import React, { useEffect } from "react";
import { Slot, Stack, useRouter, useSegments } from "expo-router";

export default AppLayout = () => {
  return (
    <>
      <Stack
        screenOptions={
          {
            //screen animation from left to right
          }
        }
      >
        <Stack.Screen
          name="map"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="menu"
          options={{
            animation: "slide_from_left",

            headerShown: false,
          }}
        />
        <Stack.Screen
          name="rides"
          options={{
            animation: "slide_from_left",
            headerTitleAlign: "center",
            headerTitle: "My Rides",
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            animation: "slide_from_left",

            headerTitleAlign: "center",
            headerTitle: "Update Profile",
          }}
        />
        <Stack.Screen
          name="terms"
          options={{
            animation: "slide_from_left",

            headerTitleAlign: "center",
            headerTitle: "Terms And Conditions",
          }}
        />
      </Stack>
    </>
  );
};
