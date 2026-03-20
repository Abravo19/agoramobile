import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TextInput, ScrollView } from "react-native";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { addDoc, updateDoc, deleteDoc, doc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function DetailPlateforme({ route, navigation }: any) {
    const plateforme = route?.params?.plateforme;
    const [libPlateformes, setLibPlateformes] = useState(plateforme?.libPlateformes || "");

    useEffect(() => {
        if (plateforme) {
            setLibPlateformes(plateforme.libPlateformes);
        } else {
            setLibPlateformes("");
        }
    }, [plateforme]);

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
            if (!libPlateformes.trim()) return;

            const q = query(collection(db, "Plateformes"), orderBy("idPlateformes", "desc"), limit(1));
            const querySnapshot = await getDocs(q);
            let nextId = 1;
            if (!querySnapshot.empty) {
                const lastDoc = querySnapshot.docs[0];
                nextId = lastDoc.data().idPlateformes + 1;
            }

            await addDoc(collection(db, "Plateformes"), {
                idPlateformes: nextId,
                libPlateformes: libPlateformes,
            });
            navigation.goBack();
        } catch (error) {
            console.log("Erreur création plateforme : " + error);
        }
    };

    const handleUpdate = async () => {
        if (!plateforme || !plateforme.id) return;
        try {
            const plateformeRef = doc(db, "Plateformes", plateforme.id);
            await updateDoc(plateformeRef, {
                libPlateformes: libPlateformes,
            });
            navigation.goBack();
        } catch (error) {
            console.log("Erreur modification plateforme : " + error);
        }
    };

    const handleDelete = async () => {
        if (!plateforme || !plateforme.id) return;
        try {
            const plateformeRef = doc(db, "Plateformes", plateforme.id);
            await deleteDoc(plateformeRef);
            navigation.goBack();
        } catch (error) {
            console.log("Erreur suppression plateforme : " + error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.viewStyle}>
            <Text style={styles.title}>{plateforme ? "Modifier la Plateforme" : "Créer une Plateforme"}</Text>
            {plateforme && (
                <>
                    <Text style={styles.title}>{plateforme.libPlateformes}</Text>
                    <Text style={styles.title}>ID : {plateforme.idPlateformes}</Text>
                </>
            )}
            <TextInput 
                style={styles.input} 
                value={libPlateformes} 
                onChangeText={setLibPlateformes} 
                placeholder="Nom de la Plateforme" 
            />

            <View style={styles.buttonContainer}>
                {plateforme ? (
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
                    <Button color="gray" title="Retour à la liste des Plateformes" onPress={() => navigation.navigate("pageGererLesPlateformes")} />
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
