import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TextInput, ScrollView } from "react-native";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { addDoc, updateDoc, deleteDoc, doc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function DetailMarque({ route, navigation }: any) {
    const marque = route?.params?.marque;
    const [libMarques, setLibMarques] = useState(marque?.libMarques || "");

    useEffect(() => {
        if (marque) {
            setLibMarques(marque.libMarques);
        } else {
            setLibMarques("");
        }
    }, [marque]);

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

    const handleCreate = async () => {
        try {
            if (!libMarques.trim()) return;

            const q = query(collection(db, "Marques"), orderBy("idMarques", "desc"), limit(1));
            const querySnapshot = await getDocs(q);
            let nextId = 1;
            if (!querySnapshot.empty) {
                const lastDoc = querySnapshot.docs[0];
                nextId = lastDoc.data().idMarques + 1;
            }

            await addDoc(collection(db, "Marques"), {
                idMarques: nextId,
                libMarques: libMarques,
            });
            navigation.goBack();
        } catch (error) {
            console.log("Erreur création marque : " + error);
        }
    };

    const handleUpdate = async () => {
        if (!marque || !marque.id) return;
        try {
            const marqueRef = doc(db, "Marques", marque.id);
            await updateDoc(marqueRef, {
                libMarques: libMarques,
            });
            navigation.goBack();
        } catch (error) {
            console.log("Erreur modification marque : " + error);
        }
    };

    const handleDelete = async () => {
        if (!marque || !marque.id) return;
        try {
            const marqueRef = doc(db, "Marques", marque.id);
            await deleteDoc(marqueRef);
            navigation.goBack();
        } catch (error) {
            console.log("Erreur suppression marque : " + error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.viewStyle}>
            <Text style={styles.title}>{marque ? "Modifier la marque" : "Créer une marque"}</Text>
            {marque && (
                <>
                    <Text style={styles.title}>{marque.libMarques}</Text>
                    <Text style={styles.title}>ID : {marque.idMarques}</Text>
                </>
            )}
            <TextInput 
                style={styles.input} 
                value={libMarques} 
                onChangeText={setLibMarques} 
                placeholder="Nom de la marque" 
            />

            <View style={styles.buttonContainer}>
                {marque ? (
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
                    <Button color="gray" title="Retour à la liste des marques" onPress={() => navigation.navigate("pageGererLesMarques")} />
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