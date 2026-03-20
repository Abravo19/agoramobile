import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";

export default function GererLesPegis({ navigation }: any) {
    const [pegis, setPegis] = useState<any[]>([]);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                navigation.navigate("pageConnexion");
                return;
            }
            try {
                const userDoc = await getDoc(doc(db, "utilisateurs", user.uid));
                if (userDoc.exists()) {
                    setRole(userDoc.data().role);
                } else {
                    setRole("inconnu");
                }
            } catch (error) {
                console.log("Erreur lecture role :", error);
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

    const loadPegis = async () => {
        const querySnapshot = await getDocs(collection(db, "Pegis"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPegis(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadPegis();
        }, [])
    );

    return (
        <View style={styles.viewStyle}>
            <Text style={styles.title}>Gérer les PEGI {role === "admin" && "(admin)"}</Text>
            {role === "admin" && (
                <Button color="gray" title="Créer un PEGI" onPress={() => navigation.navigate("pageDetailPegi")} />
            )}
            
            <FlatList
                data={pegis}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("pageDetailPegi", { pegi: item })}>
                        <Text style={styles.cardText}>
                            ID : {item.idPegis} - {item.libPegi}
                        </Text>
                        {role === "admin" && (
                            <Button title="Modifier" onPress={() => navigation.navigate("pageDetailPegi", { pegi: item })} />
                        )}
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
        padding: 16, 
        borderRadius: 10,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    cardText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    title: { 
        fontSize: 24, 
        fontWeight: "bold", 
        marginBottom: 20 
    },
});