import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";


export default function GererLesGenres({ navigation }: any) {
    const [genres, setGenres] = useState([]);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
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

    const [role, setRole] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                navigation.replace("pageConnexion");
                return;
            }
            try {
                const userDoc = await getDoc(doc(db, "utilisateurs", user.uid));
                if (userDoc.exists()) {
                    setRole(userDoc.data().role);
                } else {
                    setRole("inconnu");
                }
                const genresCol = collection(db, "genres");
                const genreSnapshot = await getDocs(genresCol);
                const genreList = genreSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setGenres(genreList);
            } catch (error) {
                console.log("Erreur :", error);
            }
        });
        return unsubscribe;
    }, []);

    const loadGenres = async () => {
        const querySnapshot = await getDocs(collection(db, "genres"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setGenres(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadGenres();
        }, [])
    );

    return (
        <View style={styles.viewStyle}>
            <Text style={styles.title}>Gérer les Genres {role === "admin" && "(admin)"}</Text>
            {role === "admin" && (
                <View style={{ marginBottom: 16 }}>
                    <Button color="gray" title="Créer un genre" onPress={() => navigation.navigate("pageDetailGenre")} />
                </View>
            )}
            <FlatList
                data={genres}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("pageDetailGenre", { genre: item })}>
                        <Text style={styles.cardTitle}>{item.libGenre}</Text>
                        <Text style={styles.cardText}>
                            ID : {item.idGenre}
                        </Text>
                        {role === "admin" && (
                            <View style={{ marginTop: 10 }}>
                                <Button title="Modifier" onPress={() => navigation.navigate("pageDetailGenre", { genre: item })} />
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            />

            <View style={{ marginTop: 10 }}>
                <Button
                    color="gray"
                    title="Retour au menu"
                    onPress={() => navigation.navigate("pageMenu")}
                />
            </View>
            <View style={{ marginTop: 10 }}>
                <Button
                    color="red"
                    title="Quitter"
                    onPress={handleLogout}
                />
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