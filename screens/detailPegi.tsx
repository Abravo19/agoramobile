import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

export default function DetailPegi({ route, navigation }: any) {
    const { pegi } = route.params || {};
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
            <Text>Fiche du PEGI</Text>
            {pegi && (
                <>
                    <Text style={styles.title}>{pegi.libPegi}</Text>
                    <Text style={styles.title}>ID : {pegi.idPegis}</Text>
                </>
            )}
            <Button
                color="gray"
                title="Retour à la liste des PEGI"
                onPress={() => navigation.navigate("pageGererLesPegis")}
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
