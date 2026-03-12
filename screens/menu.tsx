import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
export default function Menu({ navigation, route }: any) {
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                navigation.navigate("pageConnexion");
            }
        });
        return unsubscribe;
    }, []);
    const handleLogout = () => {
        signOut(auth).then(() => {
            navigation.navigate("pageConnexion");
        }).catch((error) => {
            console.log("Erreur déconnexion : " + error);
        });
    };
    return (
        <View style={styles.viewStyle}>
            <Text>Menu</Text>
            <Text>Connecté : {auth.currentUser?.email}</Text>
            <Button
                color="gray"
                title="Gérer les genres"
                onPress={() => navigation.navigate("pageGererLesGenres")}
            />
            <Button
                color="gray"
                title="Gérer les marques"
                onPress={() => navigation.navigate("pageGererLesMarques")}
            />
            <Button
                color="gray"
                title="Gérer les pegis"
                onPress={() => navigation.navigate("pageGererLesPegis")}
            />
            <Button
                color="gray"
                title="Gérer les plateformes"
                onPress={() => navigation.navigate("pageGererLesPlateformes")}
            />
            <Button
                color="red"
                title="Quitter"
                onPress={handleLogout}
            />
            <Button
                color="gray"
                title="Gérer les jeux"
                onPress={() => navigation.navigate("pageGererLesJeux")}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 12,
        backgroundColor: "lightgreen",
        alignItems: "center",
        justifyContent: "center",
    },
});
