import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
export default function DetailJeu({ route, navigation }: any) {
    const { jeu } = route.params || {};
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
            <Text>Détails du jeu</Text>
            {jeu && (
                <>
                    <Text style={styles.title}>{jeu.nom}</Text>
                    <Text style={styles.title}>ID : {jeu.id}</Text>
                    <Text style={styles.title}>Genre : {jeu.genre.libGenre}</Text>
                    <Text style={styles.title}>Plateforme : {jeu.plateforme.libPlateforme}</Text>
                    <Text style={styles.title}>PEGI : {jeu.pegi.libPegis}</Text>
                    <Text style={styles.title}>Marque : {jeu.marque.nomMarque}</Text>
                    <Text style={styles.title}>Prix : {jeu.prix} €</Text>
                    <Text style={styles.title}>Date de parution : {jeu.dateParution}</Text>
                </>
            )}
            <Button
                color="gray"
                title="Retour à la liste des jeux"
                onPress={() => navigation.navigate("pageGererLesJeux")}
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
        backgroundColor: "lightgreen",
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