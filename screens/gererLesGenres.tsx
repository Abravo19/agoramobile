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

    useEffect(() => {
        const fetchGenres = async () => {
            const genresCol = collection(db, "genres");
            const genreSnapshot = await getDocs(genresCol);
            const genreList = genreSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setGenres(genreList);
        };
        fetchGenres();
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

    return (<View style={styles.viewStyle}>
        <Text>Gérer les Genres {role === "admin" && "(admin)"}</Text>
        {role === "admin" && <Button color="gray" title="Créer un genre" onPress={() => navigation.navigate("pageDetailGenre")} />}
        <FlatList
            data={genres}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("pageDetailGenre", { genre: item })}>
                    <Text style={styles.cardText}>
                        ID : {item.idGenre} - {item.libGenre}
                    </Text>
                    {role === "admin" && <Button title="Modifier" onPress={() => navigation.navigate("pageDetailGenre", { genre: item })} />}
                </TouchableOpacity>


            )}
        />

        <Button
            color="gray"
            title="Retour au menu"
            onPress={() => navigation.navigate("pageMenu")}
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

    card: {
        width: "100%",
        backgroundColor: "white",
        padding: 16, borderRadius: 10,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3, // Android
    },
    cardText: {
        fontSize: 18,
        fontWeight: "bold",

    },

    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    item: { fontSize: 18, marginBottom: 10 },

});