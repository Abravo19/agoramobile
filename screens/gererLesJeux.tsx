import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from "react-native";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";

export default function GererLesJeux({ navigation }: any) {
    const [jeux, setJeux] = useState<any[]>([]);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                navigation.navigate("pageConnexion");
                return;
            }
            try {
                const userDoc = await getDoc(doc(db, "utilisateurs", user.uid));
                if (userDoc.exists()) {
                    setRole(userDoc.data().role);
                } else {
                    setRole("inconnu");
                }
            } catch (error) {
                console.log("Erreur lecture role :", error);
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

    const loadJeux = async () => {
        const snap = await getDocs(collection(db, "jeux"));
        const list = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setJeux(list);
    };

    useFocusEffect(
        useCallback(() => {
            loadJeux();
        }, [])
    );

    return (
        <View style={styles.viewStyle}>
            <Text style={styles.title}>Gérer les jeux {role === "admin" && "(admin)"}</Text>
            {role === "admin" && (
                <View style={{ marginBottom: 16 }}>
                    <Button color="gray" title="Créer un jeu" onPress={() => navigation.navigate("pageDetailJeu")} />
                </View>
            )}
            <FlatList
                data={jeux}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("pageDetailJeu", { jeu: item })}>
                        <Text style={styles.cardTitle}>{item.nom}</Text>
                        <Text style={styles.cardText}>Genre : {item.genre?.libGenre}</Text>
                        <Text style={styles.cardText}>Plateforme : {item.plateforme?.libPlateforme}</Text>
                        <Text style={styles.cardText}>PEGI : {item.pegi?.libPegis}</Text>
                        
                        {role === "admin" && (
                            <View style={{ marginTop: 10 }}>
                                <Button title="Modifier" onPress={() => navigation.navigate("pageDetailJeu", { jeu: item })} />
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            />
            <View style={{ marginTop: 10 }}>
                <Button color="gray" title="Retour menu" onPress={() => navigation.navigate("pageMenu")} />
            </View>
            <View style={{ marginTop: 10 }}>
                <Button color="red" title="Quitter" onPress={handleLogout} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
        padding: 16,
        paddingTop: 50,
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
