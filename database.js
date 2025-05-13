import * as SQLite from 'expo-sqlite';

// Otevření databáze
export const openDatabase = async () => {
  const db = await SQLite.openDatabaseSync('trip.db');
  await db.execAsync('PRAGMA foreign_keys = ON;');
  console.log("Databáze byla úspěšně otevřena");
  return db;
};


// Vytvoření tabulky pro výlety
export const createTable = async () => {
  const db = await openDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_name TEXT,
      trip_description TEXT,
      start_date TEXT,
      end_date TEXT,
      country TEXT
    );
  `);
};

// Funkce pro formátování datumu
export const formatDate = (date) => {
  return date.toISOString().split('T')[0]; // formátuje na "YYYY-MM-DD"
};

export const insertTrip = async (trip_name, trip_description, start_date, end_date, country) => {
  const db = await openDatabase();

  const formattedStartDate = formatDate(new Date(start_date));
  const formattedEndDate = formatDate(new Date(end_date));

  if (!formattedStartDate || !formattedEndDate) {
    throw new Error('Neplatné datumy');
  }

  try {
    const result = await db.runAsync(
      'INSERT INTO trips (trip_name, trip_description, start_date, end_date, country) VALUES (?, ?, ?, ?, ?)',
      trip_name, trip_description, formattedStartDate, formattedEndDate, country
    );
    console.log('Výlet přidán:', result);
  } catch (error) {
    console.error('Chyba při přidávání výletu:', error);
  }
};


export const loadTrips = async () => {
  try {
    const result = await getTrips();
    setTrips(result);
  } catch (error) {
    console.error('Chyba při načítání výletů:', error);
    Alert.alert('Chyba', 'Nastala chyba při načítání výletů.');
  }
};


export const getTrips = async () => {
  const db = await openDatabase();
  const trips = await db.getAllAsync('SELECT * FROM trips');
  console.log('Výlety z databáze:', trips);
  return trips;
};



// Funkce pro smazání výletu podle ID (nejprve smaž položky, pak výlet)
export const deleteTrip = async (id) => {
  const db = await openDatabase();
  try {
    await deleteItemsForTrip(id);
    await db.runAsync('DELETE FROM trips WHERE id = ?', id);
  } catch (error) {
    console.error('Chyba při mazání výletu:', error);
    throw error;
  }
};

export const updateTrip = async (id, updatedTrip) => {
  const db = await openDatabase();
  const { trip_name, trip_description, start_date, end_date, country } = updatedTrip;

  await db.runAsync(
    `UPDATE trips SET trip_name = ?, trip_description = ?, start_date = ?, end_date = ?, country = ? WHERE id = ?`,
    trip_name, trip_description, start_date, end_date, country, id
  );
};



// Funkce pro získání datumu začátku a konce výletu na základě tripId
export const getTripDates = async (tripId) => {
  const db = await openDatabase();
  const result = await db.getAllAsync('SELECT start_date, end_date, country FROM trips WHERE id = ?', [tripId]);

  console.log('Datum a země výletu:', result);
  if (result && result.length > 0) {
    return {
      startDate: result[0].start_date,
      endDate: result[0].end_date,
      country: result[0].country
    };
  }

  return {
    startDate: '',
    endDate: '',
    country: ''
  };
};

export const createItemsTable = async () => {
  const db = await openDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id INTEGER,
      item_name TEXT,
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
    );
  `);
};

export const insertItem = async (tripId, itemName) => {
  const db = await openDatabase();
  try {
    await db.runAsync(
      'INSERT INTO items (trip_id, item_name) VALUES (?, ?)',
      tripId, itemName
    );
  } catch (error) {
    console.error('Chyba při přidávání položky:', error);
    throw error;
  }
};

export const deleteItemsForTrip = async (tripId) => {
  const db = await openDatabase();
  try {
    await db.runAsync('DELETE FROM items WHERE trip_id = ?', tripId);
  } catch (error) {
    console.error('Chyba při mazání položek:', error);
    throw error;
  }
};


// Funkce pro smazání položky
export const deleteItem = async (id) => {
  const db = await openDatabase();
  try {
    await db.runAsync('DELETE FROM items WHERE id = ?', id);
  } catch (error) {
    console.error('Chyba při mazání položky:', error);
    throw error;
  }
};

// Funkce pro vložení výchozích položek pro stanování
export const insertTentItems = async (tripId) => {
  const db = await openDatabase();
  const items = [
    'Stan',
    'Spacák',
    'Karimatka',
    'Čelovka',
    'Kapesní nůž',
    'Plynový vařič',
    'Pláštěnka',
    'Teplé oblečení',
    'Powerbanka'
  ];

  const insertPromises = items.map(item =>
    db.runAsync('INSERT INTO items (trip_id, item_name) VALUES (?, ?)', tripId, item)
  );

  await Promise.all(insertPromises);
};

export const insertTripItems = async (tripId) => {
  const db = await openDatabase();
  const items = [
    'Mapa',
    'Průvodce',
    'Fotoaparát',
    'Vízum',
    'Peněženka',
    'Obuv',
  ];

  const insertPromises = items.map(item =>
    db.runAsync('INSERT INTO items (trip_id, item_name) VALUES (?, ?)', tripId, item)
  );

  await Promise.all(insertPromises);
};

export const insertAdventureItems = async (tripId) => {
  const db = await openDatabase();
  const items = [
    'Horolezecká výbava',
    'Kompas',
    'Pásek',
    'Lano',
    'Vysílačka'
  ];

  const insertPromises = items.map(item =>
    db.runAsync('INSERT INTO items (trip_id, item_name) VALUES (?, ?)', tripId, item)
  );

  await Promise.all(insertPromises);
};

export const insertBeachItems = async (tripId) => {
  const db = await openDatabase();
  const items = [
    'Doklady',
    'Cestovní pas',
    'Sluneční brýle',
    'Plavky',
    'Opalovací krém',
    'Kamera',
    'Potápěčské vybavení'
  ];

  const insertPromises = items.map(item =>
    db.runAsync('INSERT INTO items (trip_id, item_name) VALUES (?, ?)', tripId, item)
  );

  await Promise.all(insertPromises);
};

export const insertWinterItems = async (tripId) => {
  const db = await openDatabase();
  const items = [
    'Lyže/Snowboard',
    'Teplé rukavice',
    'Čepice',
    'Šála',
    'Lyžáky',
    'Termoprádlo',
  ];

  const insertPromises = items.map(item =>
    db.runAsync('INSERT INTO items (trip_id, item_name) VALUES (?, ?)', tripId, item)
  );

  await Promise.all(insertPromises);
};

export const insertCampingItems = async (tripId) => {
  const db = await openDatabase();
  const items = [
    'Nádrž na vodu',
    'Kabel do auta',
    'Kempingové židle',
    'Gril',
    'Zapalovač',
    'Deka',
    'Powerbanka',
  ];

  const insertPromises = items.map(item =>
    db.runAsync('INSERT INTO items (trip_id, item_name) VALUES (?, ?)', tripId, item)
  );

  await Promise.all(insertPromises);
};


export const insertHutItems = async (tripId) => {
  const db = await openDatabase();
  const items = [
    'Obuv do přírody',
    'Svítilna',
    'Fotoaparát',
    'Lékárnička',
    'Karty',
    'Skládací stůl a židle'
  ];

  const insertPromises = items.map(item =>
    db.runAsync('INSERT INTO items (trip_id, item_name) VALUES (?, ?)', tripId, item)
  );

  await Promise.all(insertPromises);
};

export const insertFestivalItems = async (tripId) => {
  const db = await openDatabase();
  const items = [
    'Vstupenky',
    'Stan',
    'Kempingové židle',
    'Plynový vařič',
    'Powerbanka'
  ];

  const insertPromises = items.map(item =>
    db.runAsync('INSERT INTO items (trip_id, item_name) VALUES (?, ?)', tripId, item)
  );

  await Promise.all(insertPromises);
};

export const insertWellnessItems = async (tripId) => {
  const db = await openDatabase();
  const items = [
    'Župan',
    'Plavky',
    'Ručník',
    'Pantofle'
  ];

  const insertPromises = items.map(item =>
    db.runAsync('INSERT INTO items (trip_id, item_name) VALUES (?, ?)', tripId, item)
  );

  await Promise.all(insertPromises);
};


export const deleteAllItemsForTrip = async (tripId) => {
  const db = await openDatabase();
  return await db.runAsync(
    'DELETE FROM items WHERE trip_id = ?', tripId);
};



// Funkce pro získání všech položek k danému výletu
export const getItemsForTrip = async (tripId) => {
  const db = await openDatabase();
  try {
    const items = await db.getAllAsync('SELECT * FROM items WHERE trip_id = ?', tripId);
    return items;
  } catch (error) {
    console.error('Chyba při načítání položek:', error);
    throw error;
  }
};
