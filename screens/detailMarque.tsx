import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";
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
        <View style={styles.viewStyle}>
            <Text style={styles.title}>{marque ? "Modifier la marque" : "Créer une marque"}</Text>
            {marque && (
                <>
                    <Text style={styles.title}>{marque.libMarques}</Text>
                    <Text style={styles.title}>ID : {marque.idMarques}</Text>
                </>
            )}
            <>
                <TextInput 
                    style={styles.input} 
                    value={libMarques} 
                    onChangeText={setLibMarques} 
                    placeholder="Nom de la marque" 
                />
                {marque ? (
                    <>
                        <Button title="Modifier" onPress={handleUpdate} />
                        <Button title="Supprimer" color="red" onPress={handleDelete} />
                    </>
                ) : (
                    <Button title="Créer" onPress={handleCreate} />
                )}
                <Button
                    color="gray"
                    title="Retour à la liste des marques"
                    onPress={() => navigation.navigate("pageGererLesMarques")}
                />
            </>
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