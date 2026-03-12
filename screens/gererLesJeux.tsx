import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

export default function GererLesJeux({ navigation }) {
    const [jeux, setJeux] = useState([]);
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

    useEffect(() => {
        const fetchJeux = async () => {
            const snap = await getDocs(collection(db, "jeux"));
            const list = snap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setJeux(list);
        };

        fetchJeux();
    }, []);

    return (
        <View style={styles.viewStyle}>
            <Text style={styles.title}>Gérer les jeux</Text>
            <FlatList
                data={jeux}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("pageDetailJeu", { jeu: item })}>
                        <Text style={styles.cardTitle}>{item.nom}</Text>
                        <Text style={styles.cardText}>Genre : {item.genre.libGenre}</Text>
                        <Text style={styles.cardText}>Plateforme : {item.plateforme.libPlateforme}</Text>
                        <Text style={styles.cardText}>PEGI : {item.pegi.libPegis}</Text>
                    </TouchableOpacity>
                )}
            />
            <Button title="Retour menu" onPress={() => navigation.navigate("pageMenu")} />
            <Button color="red" title="Quitter" onPress={handleLogout} />
        </View>
    );
}
const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
        padding: 16,
        backgroundColor: "lightgreen",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        alignSelf: "center",
    },
    card: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    cardText: {
        fontSize: 14,
        marginTop: 4,
    },
});
