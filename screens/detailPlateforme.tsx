import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

export default function DetailPlateforme({ route, navigation }: any) {
    const { plateforme } = route.params || {};
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
            <Text>Fiche de la Plateforme</Text>
            {plateforme && (
                <>
                    <Text style={styles.title}>{plateforme.libPlateformes}</Text>
                    <Text style={styles.title}>ID : {plateforme.idPlateformes}</Text>
                </>
            )}
            <Button
                color="gray"
                title="Retour à la liste des Plateformes"
                onPress={() => navigation.navigate("pageGererLesPlateformes")}
            />
            <Button
                color="red"
                title="Quitter"
                onPress={handleLogout}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 12,
        backgroundColor: "lightblue",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        marginBottom: 40,
    },
});
