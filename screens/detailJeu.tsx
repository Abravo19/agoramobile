import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TextInput, ScrollView } from "react-native";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { addDoc, updateDoc, deleteDoc, doc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function DetailJeu({ route, navigation }: any) {
    const jeu = route?.params?.jeu;
    
    // Primitive states mapped to jeu's shape
    const [nom, setNom] = useState(jeu?.nom || "");
    const [prix, setPrix] = useState(jeu?.prix !== undefined ? jeu.prix.toString() : "");
    const [dateParution, setDateParution] = useState(jeu?.dateParution || "");
    const [libGenre, setLibGenre] = useState(jeu?.genre?.libGenre || "");
    const [libPlateforme, setLibPlateforme] = useState(jeu?.plateforme?.libPlateforme || "");
    const [libPegis, setLibPegis] = useState(jeu?.pegi?.libPegis || "");
    const [nomMarque, setNomMarque] = useState(jeu?.marque?.nomMarque || "");

    useEffect(() => {
        if (jeu) {
            setNom(jeu.nom);
            setPrix(jeu.prix !== undefined ? jeu.prix.toString() : "");
            setDateParution(jeu.dateParution);
            setLibGenre(jeu.genre?.libGenre || "");
            setLibPlateforme(jeu.plateforme?.libPlateforme || "");
            setLibPegis(jeu.pegi?.libPegis || "");
            setNomMarque(jeu.marque?.nomMarque || "");
        } else {
            setNom("");
            setPrix("");
            setDateParution("");
            setLibGenre("");
            setLibPlateforme("");
            setLibPegis("");
            setNomMarque("");
        }
    }, [jeu]);

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

    const buildJeuObject = () => {
        return {
            nom,
            prix: parseFloat(prix) || 0,
            dateParution,
            genre: { libGenre },
            plateforme: { libPlateforme },
            pegi: { libPegis },
            marque: { nomMarque }
        };
    };

    const handleCreate = async () => {
        try {
            if (!nom.trim()) return;
            const newJeu = buildJeuObject();
            
            // To maintain numeric id sequence if Jeux relies on it
            const q = query(collection(db, "jeux"), orderBy("id", "desc"), limit(1));
            const querySnapshot = await getDocs(q);
            let nextId = 1;
            if (!querySnapshot.empty) {
                const lastDoc = querySnapshot.docs[0];
                if(lastDoc.data().id !== undefined) {
                    nextId = lastDoc.data().id + 1;
                }
            }
            (newJeu as any).id = nextId;

            await addDoc(collection(db, "jeux"), newJeu);
            navigation.goBack();
        } catch (error) {
            console.log("Erreur création jeu : " + error);
        }
    };

    const handleUpdate = async () => {
        if (!jeu || !jeu.id) return;
        try {
            const jeuRef = doc(db, "jeux", jeu.id);
            await updateDoc(jeuRef, buildJeuObject());
            navigation.goBack();
        } catch (error) {
            console.log("Erreur modification jeu : " + error);
        }
    };

    const handleDelete = async () => {
        if (!jeu || !jeu.id) return;
        try {
            const jeuRef = doc(db, "jeux", jeu.id);
            await deleteDoc(jeuRef);
            navigation.goBack();
        } catch (error) {
            console.log("Erreur suppression jeu : " + error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.viewStyle}>
            <Text style={styles.title}>{jeu ? "Modifier le jeu" : "Créer un jeu"}</Text>
            
            <TextInput style={styles.input} value={nom} onChangeText={setNom} placeholder="Nom du jeu" />
            <TextInput style={styles.input} value={prix} onChangeText={setPrix} placeholder="Prix (€)" keyboardType="numeric" />
            <TextInput style={styles.input} value={dateParution} onChangeText={setDateParution} placeholder="Date de parution" />
            
            <Text style={styles.subtitle}>Relations</Text>
            <TextInput style={styles.input} value={libGenre} onChangeText={setLibGenre} placeholder="Genre" />
            <TextInput style={styles.input} value={libPlateforme} onChangeText={setLibPlateforme} placeholder="Plateforme" />
            <TextInput style={styles.input} value={libPegis} onChangeText={setLibPegis} placeholder="PEGI" />
            <TextInput style={styles.input} value={nomMarque} onChangeText={setNomMarque} placeholder="Marque" />

            <View style={styles.buttonContainer}>
                {jeu ? (
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
                    <Button
                        color="gray"
                        title="Retour"
                        onPress={() => navigation.navigate("pageGererLesJeux")}
                    />
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
    subtitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 10,
        alignSelf: "flex-start",
        marginLeft: "10%",
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