import { Platform } from "react-native";

export function getDeviceId() {
    if (Platform.OS === "web") {
        return "web-browser";
    }
    return "android-app-001";
}

export function getClientType() {
    return Platform.OS === "web" ? "web" : "mobile";
}