import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

export default function GererLesPlateformes({ navigation }: any) {
    const [plateformes, setPlateformes] = useState([]);
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

    useEffect(() => {
        const fetchPlateformes = async () => {
            const plateformesCol = collection(db, "Plateformes");
            const plateformeSnapshot = await getDocs(plateformesCol);
            const plateformeList = plateformeSnapshot.docs.map((doc) => doc.data());
            setPlateformes(plateformeList);
        };
        fetchPlateformes();
    }, []);

    return (<View style={styles.viewStyle}>
        <Text>Gérer les Plateformes</Text>
        <FlatList
            data={plateformes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("pageDetailPlateforme", { plateforme: item })}>
                    <Text style={styles.cardText}>
                        ID : {item.idPlateformes} - {item.libPlateformes}
                    </Text>
                </TouchableOpacity>
            )}
        />
        <Button
            color="gray"
            title="Visualiser les plateformes"
            onPress={() => navigation.navigate("pageDetailPlateforme")}
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
