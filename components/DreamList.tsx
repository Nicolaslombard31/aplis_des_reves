import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Searchbar } from 'react-native-paper';


export default function DreamList() {
  const [dreams, setDreams] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDreams, setFilteredDreams] = useState<any[]>([]);

  const handleDeleteDream = async (indexToDelete: number) => {
    try {
      const updatedDreams = dreams.filter((_, index) => index !== indexToDelete);
      setDreams(updatedDreams);
      await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(updatedDreams));
    } catch (error) {
      console.error('Erreur lors de la suppression du rêve:', error);
    }
  };

  const fetchData = async () => {
    try {
      const data = await AsyncStorage.getItem('dreamFormDataArray');
      const dreamFormDataArray = data ? JSON.parse(data) : [];
      setDreams(dreamFormDataArray);
      setFilteredDreams(dreamFormDataArray);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      return () => console.log('This route is now unfocused.');
    }, [])
  );

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDreams(dreams);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const results = dreams.filter((dream) =>
        [dream.dreamTone, dream.dreamType, dream.dreamPerson].some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lowerQuery)
        )
      );
      setFilteredDreams(results);
    }
  }, [searchQuery, dreams]);
  

  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16 }}>
        <Searchbar
            placeholder="Rechercher un rêve..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
        />

        {filteredDreams.length === 0 ? (
            <Text style={styles.noDreamText}>Aucun rêve trouvé</Text>
        ) : (
            filteredDreams.map((dream, index) => (
            <View key={index} style={styles.dreamContainer}>
                <Text style={styles.dreamText}>
                {dream.todayDate} {dream.time} - {dream.dreamType}
                {'\n'}
                État avant: {dream.dreamStateBefore} | après: {dream.dreamStateAfter}
                {'\n'}
                Personne: {dream.dreamPerson} | Lieu: {dream.dreamLocation}
                {'\n'}
                Intensité: {dream.dreamIntensity} | Clarté: {dream.dreamClarity}
                {'\n'}
                Hashtags:
                {'\n'}
                1. {dream.hashtags?.hashtag1?.label}
                {'\n'}
                2. {dream.hashtags?.hashtag2?.label}
                {'\n'}
                3. {dream.hashtags?.hashtag3?.label}
                {'\n'}
                Qualité du sommeil: {dream.dreamSleepQuality}
                {'\n'}
                Signification: {dream.dreamMeaning}
                {'\n'}
                Tonalité: {dream.dreamTone}
                </Text>

                <Button
                mode="contained"
                onPress={() => handleDeleteDream(index)}
                style={styles.deleteButton}
                buttonColor="black"
                textColor="white"
                >
                Supprimer ce rêve
                </Button>

                <Text>{'\n'}-------------------------------</Text>
            </View>
            ))
        )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 20,
    borderRadius: 10,
  },
  dreamContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#bbbbbb',
  },
  dreamText: {
    fontSize: 14,
    marginBottom: 8,
  },
  deleteButton: {
    alignSelf: 'flex-end',
  },
  noDreamText: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    color: 'black',
  },
});
