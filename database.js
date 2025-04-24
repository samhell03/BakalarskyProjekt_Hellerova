import * as SQLite from 'expo-sqlite';
import { openDatabase } from 'react-native-sqlite-storage';

// Funkce pro otevření nebo vytvoření databáze
const db = SQLite.openDatabase('trips.db');

// Funkce pro vytvoření tabulek
export const createTable = async () => {
  const db = await openDatabase();

  await db.execAsync(
      `CREATE TABLE IF NOT EXISTS trips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        date TEXT,
        country TEXT
      );`
  );

// Funkce pro přidání výletu do databáze
const addTrip = (name, description, date, country) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO trips (name, description, date, country) VALUES (?, ?, ?, ?);',
      [name, description, date, country],
      (_, result) => {
        console.log('Výlet přidán:', result);
      },
      (_, error) => {
        console.log('Chyba při přidávání výletu:', error);
      }
    );
  });
};

// Funkce pro získání všech výletů
const getTrips = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM trips;',
      [],
      (_, result) => {
        callback(result.rows._array);
      },
      (_, error) => {
        console.log('Chyba při získávání výletů:', error);
      }
    );
  });
};

export { createTable, addTrip, getTrips };
