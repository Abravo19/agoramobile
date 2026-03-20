import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { addDoc, updateDoc, deleteDoc, doc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function DetailPegi({ route, navigation }: any) {
    const pegi = route?.params?.pegi;
    const [libPegi, setLibPegi] = useState(pegi?.libPegi || "");

    useEffect(() => {
        if (pegi) {
            setLibPegi(pegi.libPegi);
        } else {
            setLibPegi("");
        }
    }, [pegi]);

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
            if (!libPegi.trim()) return;

            const q = query(collection(db, "Pegis"), orderBy("idPegis", "desc"), limit(1));
            const querySnapshot = await getDocs(q);
            let nextId = 1;
            if (!querySnapshot.empty) {
                const lastDoc = querySnapshot.docs[0];
                nextId = lastDoc.data().idPegis + 1;
            }

            await addDoc(collection(db, "Pegis"), {
                idPegis: nextId,
                libPegi: libPegi,
            });
            navigation.goBack();
        } catch (error) {
            console.log("Erreur création PEGI : " + error);
        }
    };

    const handleUpdate = async () => {
        if (!pegi || !pegi.id) return;
        try {
            const pegiRef = doc(db, "Pegis", pegi.id);
            await updateDoc(pegiRef, {
                libPegi: libPegi,
            });
            navigation.goBack();
        } catch (error) {
            console.log("Erreur modification PEGI : " + error);
        }
    };

    const handleDelete = async () => {
        if (!pegi || !pegi.id) return;
        try {
            const pegiRef = doc(db, "Pegis", pegi.id);
            await deleteDoc(pegiRef);
            navigation.goBack();
        } catch (error) {
            console.log("Erreur suppression PEGI : " + error);
        }
    };

    return (
        <View style={styles.viewStyle}>
            <Text style={styles.title}>{pegi ? "Modifier le PEGI" : "Créer un PEGI"}</Text>
            {pegi && (
                <>
                    <Text style={styles.title}>{pegi.libPegi}</Text>
                    <Text style={styles.title}>ID : {pegi.idPegis}</Text>
                </>
            )}
            <>
                <TextInput 
                    style={styles.input} 
                    value={libPegi} 
                    onChangeText={setLibPegi} 
                    placeholder="Nom du PEGI" 
                />
                {pegi ? (
                    <>
                        <Button title="Modifier" onPress={handleUpdate} />
                        <Button title="Supprimer" color="red" onPress={handleDelete} />
                    </>
                ) : (
                    <Button title="Créer" onPress={handleCreate} />
                )}
                <Button
                    color="gray"
                    title="Retour à la liste des PEGI"
                    onPress={() => navigation.navigate("pageGererLesPegis")}
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
        backgroundColor: "lightblue",
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
