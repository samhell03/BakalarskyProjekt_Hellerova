import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getItemsForTrip, insertItem, deleteItem, createItemsTable, insertTentItems, deleteAllItemsForTrip } from './database'; // Import funkcí z databáze

export default function TentScreen({ route }) {
  const { trip } = route.params;

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [defaultItemsLoaded, setDefaultItemsLoaded] = useState(false); 

  useEffect(() => {
    const loadItems = async () => {
      try {
        await createItemsTable(); // Zajistíme, že je tabulka položek vytvořena

        let savedItems = await getItemsForTrip(trip.id); // Načteme aktuální položky z databáze

        // Pokud nejsou žádné položky, načteme výchozí položky pro stanování
        if (savedItems.length === 0) {
          await insertTentItems(trip.id); // Načteme výchozí položky pro stanování
          savedItems = await getItemsForTrip(trip.id); // Znovu načteme položky po vložení
        }

        setItems(savedItems); // Nastavíme položky do stavu
      } catch (error) {
        console.error('Chyba při načítání položek:', error);
        Alert.alert('Chyba', 'Nepodařilo se načíst položky.');
      }
    };

    loadItems();
  }, [trip.id]);

  // Funkce pro přidání nové položky
  const handleAddItem = async () => {
    if (newItem.trim() !== '') {
      try {
        await insertItem(trip.id, newItem.trim()); // Přidáme novou položku do databáze
        setNewItem(''); // Vyprázdníme input

        // Načteme položky znovu po přidání
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

  // Funkce pro smazání položky
  const handleDeleteItem = async (item) => {
    try {
      await deleteItem(item.id); // Smažeme položku z databáze
      const updatedItems = await getItemsForTrip(trip.id); // Načteme položky po smazání
      setItems(updatedItems);
    } catch (error) {
      console.error('Chyba při mazání položky:', error);
    }
  };

  // Funkce pro načtení výchozích položek pro stanování
  const loadDefaultTentItems = async () => {
    try {
      await deleteAllItemsForTrip(trip.id); // Smažeme všechny položky pro daný výlet
      await insertTentItems(trip.id); // Znovu vložíme výchozí položky
      const updatedItems = await getItemsForTrip(trip.id); // Načteme nové položky
      setItems(updatedItems); // Aktualizujeme stav
      Alert.alert('Úspěch', 'Výchozí položky byly znovu načteny.');
    } catch (error) {
      console.error('Chyba při načítání výchozích položek:', error);
      Alert.alert('Chyba', 'Nepodařilo se znovu načíst výchozí položky.');
    }
  };

  // Funkce pro uložení položek (aktuálně jen jako placeholder)
  const handleSaveItems = async () => {
    try {
      Alert.alert('Položky uloženy', 'Vaše položky byly úspěšně uloženy.');
    } catch (error) {
      console.error('Chyba při ukládání položek:', error);
      Alert.alert('Chyba', 'Nepodařilo se uložit položky.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Zabalit: {trip.trip_name}</Text>

      <Text style={styles.subHeader}>
        Na tento výlet se chystáte pod <Text style={styles.strong}>stan</Text>, pojďme si společně zabalit!
      </Text>

      <View style={styles.refreshContainer}>
        <TouchableOpacity onPress={loadDefaultTentItems}>
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

      {/* Input pro přidání nové položky */}
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

      {/* Tlačítko pro uložení položek */}
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
    marginBottom: 5,
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
