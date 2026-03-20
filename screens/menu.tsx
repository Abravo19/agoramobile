import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
export default function Menu({ navigation, route }: any) {
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                navigation.replace("pageConnexion");
            }
        });
        return unsubscribe;
    }, []);
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.replace("pageConnexion");
        } catch (error) {
            console.log("Erreur déconnexion", error);
        }
    };
    const [role, setRole] = useState(null);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                navigation.replace("pageConnexion");
                return;
            }
            try {
                const userDoc = await getDoc(doc(db, "utilisateurs", user.uid));
                if (userDoc.exists()) {
                    setRole(userDoc.data().role);
                } else {
                    console.log("Document utilisateur introuvable !");
                    setRole("inconnu");
                }
            } catch (error) {
                console.log("Erreur lecture Firestore :", error);
            }
        });
        return unsubscribe;
    }, []);

    return (
        <View style={styles.viewStyle}>
            <Text>Menu</Text>
            <Text>Connecté : {auth.currentUser?.email}{role === "admin" && " (admin)"}</Text>
            <Button
                color="gray"
                title="Gérer les genres"
                onPress={() => navigation.navigate("pageGererLesGenres")}
            />
            {role === "admin" && (
                <>
                    <Button
                        color="gray"
                        title="Gérer les marques"
                        onPress={() => navigation.navigate("pageGererLesMarques")}
                    />
                    <Button
                        color="gray"
                        title="Gérer les pegis"
                        onPress={() => navigation.navigate("pageGererLesPegis")}
                    />
                    <Button
                        color="gray"
                        title="Gérer les plateformes"
                        onPress={() => navigation.navigate("pageGererLesPlateformes")}
                    />
                </>)}
            <Button
                color="gray"
                title="Gérer les jeux"
                onPress={() => navigation.navigate("pageGererLesJeux")}
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
});
