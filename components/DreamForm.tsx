// components/DreamForm.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Button, TextInput } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import { Dropdown } from 'react-native-paper-dropdown';



const { width } = Dimensions.get('window');

const OPTIONS = [
  { label: 'rêve ordinaire', value: 'ordinaire' },
  { label: 'cauchemard', value: 'cauchemard' },
  { label: 'rêve lucide', value: 'lucide' },
];

const TONALITE_OPTIONS = [
  { label: 'Positive', value: 'positive' },
  { label: 'Neutre', value: 'neutre' },
  { label: 'Négatif', value: 'négatif' },
];

export default function DreamForm() {
  const [dreamStateBefore, setStateBefore] = useState('');
  const [dreamStateAfter, setStateAfter] = useState('');
  const [dreamIntensity, setDreamIntensity] = useState('');
  const [dreamClarity, setDreamClarity] = useState('');
  const [dreamLocation, setLocation] = useState('');
  const [dreamSleepQuality, setDreamSleepQuality] = useState('');
  const [dreamType, setDreamType] = useState('');
  const [dreamMeaning, setMeaning] = useState('');
  const [dreamTone, setDreamTone] = useState('');
  const [dreamPerson, setPerson] = useState('');
  const [hashtag1, setHashtag1] = useState('');
  const [hashtag2, setHashtag2] = useState('');
  const [hashtag3, setHashtag3] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // --- Nouveaux états pour l'heure ---
  const [visible, setVisible] = useState(false);
  const [hour, setHour] = useState<number | null>(null);
  const [minute, setMinute] = useState<number | null>(null);

  const padZero = (n: number) => String(n).padStart(2, '0');
  const formattedTime =
    hour !== null && minute !== null ? `${padZero(hour)}:${padZero(minute)}` : '';

  const openTimePicker = () => setVisible(true);
  const closeTimePicker = () => setVisible(false);
  const onConfirmTime = ({ hours, minutes }: { hours: number; minutes: number }) => {
    setHour(hours);
    setMinute(minutes);
    closeTimePicker();
  };

  const findHashtagIdByLabel = async (hashtag: string) => {
    try {
      const existingDreams = await AsyncStorage.getItem('dreamFormDataArray');
      let dreamsData = existingDreams ? JSON.parse(existingDreams) : [];

      for (let dream of dreamsData) {
        for (let hashtagKey in dream.hashtags) {
          const hashtagStored = dream.hashtags[hashtagKey];
          if (hashtagStored && hashtagStored.label === hashtag) {
            return hashtagStored.id;
          }
        }
      }

      const newId = `hashtag-${Math.random().toString(36).substr(2, 9)}`;
      return newId;
    } catch (error) {
      console.error('Erreur lors de la gestion des hashtags:', error);
      return null;
    }
  };


  const handleDreamSubmission = async () => {
    try {
      const existingData = await AsyncStorage.getItem('dreamFormDataArray');
      const formDataArray = existingData ? JSON.parse(existingData) : [];

      const hashtag1Id = await findHashtagIdByLabel(hashtag1);
      const hashtag2Id = await findHashtagIdByLabel(hashtag2);
      const hashtag3Id = await findHashtagIdByLabel(hashtag3);

      const today = new Date();
      const dateForStorage = selectedDate || today.toISOString().split('T')[0];
      const timeString = formattedTime || '';

      console.log(dreamType);

      formDataArray.push({
        dreamStateBefore,
        dreamStateAfter,
        dreamIntensity,
        dreamPerson,
        dreamTone,
        dreamLocation,
        dreamMeaning,
        dreamClarity,
        dreamSleepQuality,
        dreamType,
        todayDate: dateForStorage,
        time: timeString,
        hashtags: {
          hashtag1: { id: hashtag1Id, label: hashtag1 },
          hashtag2: { id: hashtag2Id, label: hashtag2 },
          hashtag3: { id: hashtag3Id, label: hashtag3 },
        },
      });      

      await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(formDataArray));

      setStateBefore(1);
      setStateAfter(1);
      setDreamIntensity(1);
      setDreamClarity('');
      setDreamSleepQuality(1);
      setMeaning('');
      setDreamType('');
      setDreamTone('');
      setPerson('');
      setLocation('');
      setHashtag1('');
      setHashtag2('');
      setHashtag3('');
      setSelectedDate(null);
      setHour(null);
      setMinute(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
    }
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
          
          <Text style={{ marginBottom: 8 }}>Date du rêve</Text>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={
              selectedDate
                ? { [selectedDate]: { selected: true, selectedColor: '#6200ee' } }
                : {}
            }
          />

          <View style={{ width: width * 0.8, alignSelf: 'center', marginTop: 12}}>
            <Text style={{ marginBottom: 8 }}>Heure du rêve</Text>
            <Button mode="outlined" onPress={openTimePicker} style={ styles.button}>
              {formattedTime ? `Heure: ${formattedTime}` : "Choisir l'heure"}
            </Button>
          </View>

          <Text style={{ marginBottom: 8 }}>Type de rêve</Text>
          <Dropdown
            label="Choisir le type de rêve"
            placeholder="Sélectionner le type"
            options={OPTIONS}
            value={dreamType}
            onSelect={setDreamType}
          />

          <View style={{ width: width * 0.8, alignSelf: 'center', marginTop: 12 }}>
            <Text style={{ marginBottom: 8 }}>Etat émotion avant le rêve</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={1}
              maximumValue={3}
              step={1}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor="red"
              thumbTintColor="#6200ee"
              value={dreamStateBefore}
              onValueChange={setStateBefore}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Très mal</Text>
            <Text>moyen</Text>
            <Text>Très bien</Text>
          </View>

          <View style={{ width: width * 0.8, alignSelf: 'center', marginTop: 12 }}>
            <Text style={{ marginBottom: 8 }}>Etat émotion après le rêve</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={1}
              maximumValue={3}
              step={1}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor="red"
              thumbTintColor="#6200ee"
              value = {dreamStateAfter}
              onValueChange={setStateAfter}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Très mal</Text>
            <Text>moyen</Text>
            <Text>Très bien</Text>
          </View>

          <TextInput
            label="Personnes dans le rêve"
            value={dreamPerson}
            onChangeText={setPerson}
            mode="outlined"
            multiline
            numberOfLines={6}
            style={[styles.input, { width: width * 0.8, alignSelf: 'center' }]}
          />

          <TextInput
            label="Lieux du rêve"
            value={dreamLocation}
            onChangeText={setLocation}
            mode="outlined"
            multiline
            numberOfLines={6}
            style={[styles.input, { width: width * 0.8, alignSelf: 'center' }]}
          />

          <View style={{ width: width * 0.8, alignSelf: 'center', marginTop: 12 }}>
            <Text style={{ marginBottom: 8 }}>Intensité émotionnelle</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={1}
              maximumValue={10}
              step={1}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor="red"
              thumbTintColor="#6200ee"
              value={dreamIntensity}
              onValueChange={setDreamIntensity}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>1</Text>
            <Text>2</Text>
            <Text>3</Text>
            <Text>4</Text>
            <Text>5</Text>
            <Text>6</Text>
            <Text>7</Text>
            <Text>8</Text>
            <Text>9</Text>
            <Text>10</Text>
          </View>

          <TextInput
            label="Clarté du rêve"
            value={dreamClarity}
            onChangeText={setDreamClarity}
            mode="outlined"
            multiline
            numberOfLines={6}
            style={[styles.input, { width: width * 0.8, alignSelf: 'center' }]}
          />

          {[hashtag1, hashtag2, hashtag3].map((h, i) => (
            <TextInput
              key={i}
              label={`Hashtag ${i + 1}`}
              value={i === 0 ? hashtag1 : i === 1 ? hashtag2 : hashtag3}
              onChangeText={(t) => {
                if (i === 0) setHashtag1(t);
                else if (i === 1) setHashtag2(t);
                else setHashtag3(t);
              }}
              mode="outlined"
              style={[styles.input, { width: width * 0.8, alignSelf: 'center' }]}
            />
          ))}
          
          <View style={{ width: width * 0.8, alignSelf: 'center', marginTop: 12 }}>
            <Text style={{ marginBottom: 8 }}>Qualité du sommeil</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={1}
              maximumValue={10}
              step={1}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor="red"
              thumbTintColor="#6200ee"
              value={dreamSleepQuality}
              onValueChange={setDreamSleepQuality}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>1</Text>
            <Text>2</Text>
            <Text>3</Text>
            <Text>4</Text>
            <Text>5</Text>
            <Text>6</Text>
            <Text>7</Text>
            <Text>8</Text>
            <Text>9</Text>
            <Text>10</Text>
          </View>

          <TimePickerModal
            visible={visible}
            onDismiss={closeTimePicker}
            onConfirm={onConfirmTime}
            hours={hour ?? 0}
            minutes={minute ?? 0}
            label="Sélectionner l'heure"
            locale="fr"
          />

          <TextInput
            label="Signification personnelle du rêve"
            value={dreamMeaning}
            onChangeText={setMeaning}
            mode="outlined"
            multiline
            numberOfLines={6}
            style={[styles.input, { width: width * 0.8, alignSelf: 'center' }]}
          />

          <Text style={{ marginBottom: 8 }}>Tonalité globale du rêve</Text>
          <Dropdown
            label="Choisir la tonalité du rêve"
            placeholder="Sélectionner la tonalité"
            options={TONALITE_OPTIONS}
            value={dreamTone}
            onSelect={setDreamTone}
          />

          <Button
            onPress={handleDreamSubmission}
            style={styles.button}
          >
            Submit
          </Button>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  input: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    backgroundColor: 'darkblue',
  },
});
