import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { db } from "../firebaseConfig";
import { addDoc, updateDoc, deleteDoc, doc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function DetailGenre({ route, navigation }: any) {
    const genre = route?.params?.genre;
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
    const [libGenre, setLibGenre] = useState(genre?.libGenre || "");

    useEffect(() => {
        if (genre) {
            setLibGenre(genre.libGenre);
        } else {
            setLibGenre("");
        }
    }, [genre]);

    //fonction pour créer un genre utilisant l'id du dernier genre + 1
    const handleCreate = async () => {
        try {
            if (!libGenre.trim()) {
                return;
            }

            const q = query(collection(db, "genres"), orderBy("idGenre", "desc"), limit(1));
            const querySnapshot = await getDocs(q);
            let nextId = 1;
            if (!querySnapshot.empty) {
                const lastDoc = querySnapshot.docs[0];
                nextId = lastDoc.data().idGenre + 1;
            }
            console.log("Nouveau ID : ", nextId);

            await addDoc(collection(db, "genres"), {
                idGenre: nextId,
                libGenre: libGenre,
            });
            navigation.goBack();
        } catch (error) {
            console.log("Erreur création genre : " + error);
        }
    };//fin de handleCreate

    const handleUpdate = async () => {
        if (!genre || !genre.id) return;
        try {
            const genreRef = doc(db, "genres", genre.id);
            await updateDoc(genreRef, {
                libGenre: libGenre,
            });
            navigation.goBack();
        } catch (error) {
            console.log("Erreur modification genre : " + error);
        }
    };

    const handleDelete = async () => {
        if (!genre || !genre.id) return;
        try {
            const genreRef = doc(db, "genres", genre.id);
            await deleteDoc(genreRef);
            navigation.goBack();
        } catch (error) {
            console.log("Erreur suppression genre : " + error);
        }
    };

    return (
        <View style={styles.viewStyle}>
            <Text style={styles.title}>{genre ? "Modifier le genre" : "Créer un genre"}</Text>
            {genre && (
                <>
                    <Text style={styles.title}>{genre.libGenre}</Text>
                    <Text style={styles.title}>ID : {genre.idGenre}</Text>
                </>
            )}
            {(
                <>
                    <TextInput style={styles.input} value={libGenre} onChangeText={setLibGenre} placeholder="Nom du genre" />
                    {genre ? (
                        <>
                            <Button title="Modifier" onPress={handleUpdate} />
                            <Button title="Supprimer" color="red" onPress={handleDelete} />
                        </>
                    ) : (
                        <Button title="Créer" onPress={handleCreate} />
                    )}
                    <Button color="gray" title="Retour à la liste des genres" onPress={() => navigation.navigate("pageGererLesGenres")} />
                </>
            )}
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
    input: {
        height: 40,
        width: "80%",
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: "white",
    },
});
