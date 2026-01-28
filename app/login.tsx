import { getClientType, getDeviceId } from '@/lib/device';
import { setItem } from '@/lib/storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        if (!username || !password) {
            Alert.alert("Error", "Username dan password wajib diisi");
            return;
        }

        setLoading(true);

        // login pakai dummy
        // if (username === "admin" && password === "admin") {
        //     // await SecureStore.setItemAsync("user_token", "dummy-token-123");
        //     await setItem("user_token", "dummy-token-123");
        //     router.replace("/")
        // } else {
        //     Alert.alert("Login gagal", "Username atau password salah")
        // }

        try {
            const res = await fetch(
                "https://apps.sekolahsabilillah.sch.id/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        username, password,
                        device_id: getDeviceId(),
                        client: getClientType(),
                        ...(Platform.OS !== "web" && {return_refresh: true}),
                    }),
                }
            );

            if (!res.ok) {
                throw new Error("Username atau Password salah");
            }

            const data = await res.json();

            // simpan akses token
            await setItem("user_token", data.access_token);
            // simpan refresh token untuk mobile
            if (data.refresh_token) {
                await setItem("refresh_token", data.refresh_token);
            }

            router.replace("/");
        } catch (err: any) {
            Alert.alert("Login gagal", err.message || "Terjadi Kesalahan");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Halaman Login</Text>

                <View style={styles.field}>
                    <Text style={styles.label}>Username : </Text>
                    <TextInput
                        placeholder='Masukkan Username' 
                        placeholderTextColor='#ccc'
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Password : </Text>
                    <TextInput 
                        placeholder='Masukkan Password' 
                        placeholderTextColor='#ccc'
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                    <Pressable 
                        style={({pressed}) => [
                            styles.button,
                            pressed && {opacity: 0.8},
                        ]}
                        onPress={handleLogin} 
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>{loading ? "Loading..." : "Login"}</Text>
                    </Pressable>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        padding: 20,
        backgroundColor: "#0b7052"
    },
    card: {
        width: "100%",
        maxWidth: 400,
        backgroundColor: "#0f8a64",
        padding: 25,
        borderRadius: 16,
        gap: 18,
        elevation: 5,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 40,
        color: "white",
        textAlign: 'center',
        marginBottom: 10
    },
    field: {
        gap: 6
    },
    label: {
        color: "white",

    },
    input: {
        borderWidth: 0.5,
        borderCurve: 'continuous',
        borderRadius: 10,
        borderColor: 'white',
        color: "white",
        textDecorationColor: "white",
        width: "100%",
        height: 48,
        paddingHorizontal: 12
    },
    button: {
        marginTop: 10,
        height: 48,
        backgroundColor: "#AFCB1F",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        color: "#0b7052",
        fontWeight: "bold",
        fontSize: 16,
    }
    
})