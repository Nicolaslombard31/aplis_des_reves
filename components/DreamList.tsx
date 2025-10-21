// components/DreamList.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function DreamList() {

    const [dreams, setDreams] = useState([]);
    const handleDreamDelete = async () => {
        try {
            await AsyncStorage.removeItem('dreamFormDataArray');
            setDreams([]); // Met à jour l'état local pour refléter la suppression
        } catch (error) {
            console.error('Erreur lors de la suppression des données:', error);
        }
    };

    // Ce useEffect est exécuté à l'instanciation du composant pour charger la liste initiale
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await AsyncStorage.getItem('dreamFormDataArray');
                const dreamFormDataArray = data ? JSON.parse(data) : [];
                setDreams(dreamFormDataArray);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };


        fetchData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const data = await AsyncStorage.getItem('dreamFormDataArray');
                    const dreamFormDataArray = data ? JSON.parse(data) : [];
                    setDreams(dreamFormDataArray);
                } catch (error) {
                    console.error('Erreur lors de la récupération des données:', error);
                }
            };

            fetchData();

            return () => {
                console.log('This route is now unfocused.');
            }
        }, [])
    );

    return (
        <View>
            <Text style={styles.title}>Liste des Rêves :</Text>
            {dreams.map((dream, index) => (
                <Text key={index} style={styles.dreamText}>
                    {dream.dreamText} - {dream.isLucidDream ? 'Lucide' : 'Non Lucide'} - {dream.todayDate}
                    <br />
                    Hashtags:
                    <br />
                    1. {dream.hashtags.hashtag1.id} - {dream.hashtags.hashtag1.label}
                    <br />
                    2. {dream.hashtags.hashtag2.id} - {dream.hashtags.hashtag2.label}
                    <br />
                    3. {dream.hashtags.hashtag3.id} - {dream.hashtags.hashtag3.label}
                </Text>
            ))}


            <Button
                mode="contained"
                onPress={handleDreamDelete}
                style={styles.button}
            >
                Supprimmer les rêves
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    dreamText: {
        fontSize: 16,
        marginBottom: 4,
    },

    button: {
        marginTop: 8,
    },
});

