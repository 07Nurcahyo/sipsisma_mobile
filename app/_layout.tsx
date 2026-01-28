import { Stack, router, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getItem } from "../lib/storage";

export default function RootLayout() {
  const segments = useSegments();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLogin();
  }, []);

  async function checkLogin() {
    // const token = await SecureStore.getItemAsync("user_token");
    const token = await getItem("user_token");
    const inAuthPage = segments[0] === "login";

    if (!token && !inAuthPage) {
      router.replace("/login");
    }

    if (token && inAuthPage) {
      router.replace("/");
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
