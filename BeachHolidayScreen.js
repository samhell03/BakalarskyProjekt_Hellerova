import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getItemsForTrip, insertItem, deleteItem, createItemsTable, insertBeachItems, deleteAllItemsForTrip } from './database'; // Upravíme import

export default function BeachHolidayScreen({ route }) {
  const { trip } = route.params;

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    const loadItems = async () => {
      try {
        await createItemsTable();
        let savedItems = await getItemsForTrip(trip.id);
        if (savedItems.length === 0) {
          await insertBeachItems(trip.id);
          savedItems = await getItemsForTrip(trip.id);
        }
        setItems(savedItems);
      } catch (error) {
        console.error('Chyba při načítání položek:', error);
        Alert.alert('Chyba', 'Nepodařilo se načíst položky.');
      }
    };

    loadItems();
  }, [trip.id]);

  const handleAddItem = async () => {
    if (newItem.trim() !== '') {
      try {
        await insertItem(trip.id, newItem.trim());
        setNewItem('');
        const updatedItems = await getItemsForTrip(trip.id);
        setItems(updatedItems);
      } catch (error) {
        console.error('Chyba při přidávání položky:', error);
        Alert.alert('Chyba', 'Nepodařilo se přidat položku.');
      }
    } else {
      Alert.alert('Chyba', 'Položka nesmí být prázdná!');
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      await deleteItem(item.id);
      const updatedItems = await getItemsForTrip(trip.id);
      setItems(updatedItems);
    } catch (error) {
      console.error('Chyba při mazání položky:', error);
    }
  };

  // Funkce pro refresh na výchozí položky
  const loadDefaultBeachItems = async () => {
    try {
      await deleteAllItemsForTrip(trip.id);
      await insertBeachItems(trip.id);
      const updatedItems = await getItemsForTrip(trip.id);
      setItems(updatedItems);
      Alert.alert('Úspěch', 'Výchozí položky byly znovu načteny.');
    } catch (error) {
      console.error('Chyba při obnově výchozích položek:', error);
      Alert.alert('Chyba', 'Nepodařilo se znovu načíst výchozí položky.');
    }
  };

  const handleSaveItems = async () => {
    try {
      Alert.alert('Seznam uložen', 'Váš seznam byl úspěšně uložen.');
    } catch (error) {
      console.error('Chyba při ukládání položek', error);
      Alert.alert('Chyba', 'Nepodařilo se uložit seznam.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Zabalit: {trip.trip_name}</Text>

      <Text style={styles.subHeader}>
        Chystáte se na <Text style={styles.strong}>plážovou dovolenou</Text>, pojďme si společně zabalit!
      </Text>

      {/* Refresh tlačítko */}
      <View style={styles.refreshContainer}>
        <TouchableOpacity onPress={loadDefaultBeachItems}>
          <Icon name="refresh-circle" size={42} color="#FF1493" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.item}>• {item.item_name}</Text>
            <TouchableOpacity onPress={() => handleDeleteItem(item)}>
              <Text style={styles.deleteText}>Smazat</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Přidej vlastní věc..."
        placeholderTextColor="#FF69B4"
        value={newItem}
        onChangeText={setNewItem}
        onSubmitEditing={handleAddItem}
        returnKeyType="done"
      />

      <TouchableOpacity style={styles.button} onPress={handleAddItem}>
        <Text style={styles.buttonText}>Přidat položku</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSaveItems}>
        <Text style={styles.buttonText}>Uložit položky</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4EC',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF1493',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 40,
  },
  subHeader: {
    fontSize: 18,
    color: '#FF69B4',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  strong: {
    fontWeight: 'bold',
    color: '#C71585',
  },
  refreshContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
    marginTop: -20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  item: {
    fontSize: 18,
    color: '#C71585',
    flex: 1,
  },
  deleteText: {
    color: '#FF1493',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#FF69B4',
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    fontSize: 16,
    color: '#C71585',
  },
  button: {
    backgroundColor: '#FF1493',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  refreshContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
    marginTop: -20,
  },
});
