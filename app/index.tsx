import { router } from "expo-router";
import { Button, Platform, Text, View } from "react-native";
import { getItem, removeItem } from "../lib/storage";

export default function Index() {

  async function logout() {
    // await SecureStore.deleteItemAsync("user_token");

    const refreshToken = await getItem("refresh_token");

    if (Platform.OS !== "web" && refreshToken) {
      await fetch (
        "https://apps.sekolahsabilillah.sch.id/api/auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({refresh_token: refreshToken}),
        }
      );
    }

    await removeItem("user_token");
    await removeItem("refresh_token");

    router.replace("/login");
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      {/* <Button title="Ke Coba" onPress={() => router.push("/coba")} /> */}
      <Button title="Percobaan" onPress={() => router.push("/pokemon")}></Button>
      <Button title="Logout" onPress={logout}></Button>
    </View>
  );
}
