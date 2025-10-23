// components/DreamList.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
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
        <ScrollView keyboardShouldPersistTaps="handled">
            {dreams.map((dream, index) => (
                <Text key={index} 
                style={styles.dreamText} 
                >
                    {dream.todayDate} {dream.time} - {dream.dreamType} 
                    {'\n'}
                    Etat avant le rêve: {dream.dreamStateBefore} 
                    {'\n'} 
                    Etat après le rêve: {dream.dreamStateAfter}
                    {'\n'}
                    Hashtags:
                    {'\n'}
                    1. {dream.hashtags.hashtag1.label}
                    {'\n'}
                    2. {dream.hashtags.hashtag2.label}
                    {'\n'}
                    3. {dream.hashtags.hashtag3.label}
                    {'\n'}
                    -------------------------
                </Text>
            ))}


            <Button
                mode="contained"
                onPress={handleDreamDelete}
                style={styles.button}
            >
                Supprimmer les rêves
            </Button>
        </ScrollView>
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

