import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TextInput, ScrollView } from "react-native";
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
        <ScrollView contentContainerStyle={styles.viewStyle}>
            <Text style={styles.title}>{genre ? "Modifier le genre" : "Créer un genre"}</Text>
            {genre && (
                <>
                    <Text style={styles.title}>{genre.libGenre}</Text>
                    <Text style={styles.title}>ID : {genre.idGenre}</Text>
                </>
            )}
            <TextInput 
                style={styles.input} 
                value={libGenre} 
                onChangeText={setLibGenre} 
                placeholder="Nom du genre" 
            />

            <View style={styles.buttonContainer}>
                {genre ? (
                    <>
                        <View style={styles.buttonSpacing}>
                            <Button title="Modifier" onPress={handleUpdate} />
                        </View>
                        <View style={styles.buttonSpacing}>
                            <Button title="Supprimer" color="red" onPress={handleDelete} />
                        </View>
                    </>
                ) : (
                    <View style={styles.buttonSpacing}>
                        <Button title="Créer" onPress={handleCreate} />
                    </View>
                )}
                <View style={styles.buttonSpacing}>
                    <Button color="gray" title="Retour à la liste des genres" onPress={() => navigation.navigate("pageGererLesGenres")} />
                </View>
                <View style={styles.buttonSpacing}>
                    <Button color="red" title="Quitter" onPress={handleLogout} />
                </View>
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    viewStyle: {
        flexGrow: 1,
        paddingTop: 50,
        paddingBottom: 50,
        paddingHorizontal: 12,
        backgroundColor: "lightgreen",
        alignItems: "center",
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
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: "white",
    },
    buttonContainer: {
        width: "80%",
        marginTop: 10,
    },
    buttonSpacing: {
        marginBottom: 15,
    }
});
