# Roamly – Mobilní aplikace pro plánování výletů

Aplikace **Roamly** slouží k plánování výletů a správě balicích seznamů podle typu výletu. Vyvinuto jako bakalářský projekt v rámci studia na **Technické univerzitě v Liberci**.

---

##  Funkce aplikace
- Přehled všech výletů rozdělený na:
  - **Aktuální výlety**
  - **Plánované výlety**
  - **Proběhlé výlety**
- Vytváření a úprava výletů
- Dostupný seznam věcí k zabalení s výchozími položkami podle typu výletu, možnost přidání vlastních
- Kalendář s přehledem naplánovaných výletů
- Ukládání dat pomocí **SQLite**

##  Použité technologie

- **React Native** (Expo)
- **SQLite** přes `expo-sqlite`
- Jazyk: **JavaScript**
- Platforma: **Android / iOS**

##  Jak aplikaci spustit a nainstalovat
### 1. Instalace Expo CLI
```bash
npm install -g expo-cli
```
---

##  Ukázky z aplikace
<table>
  <tr>
    <td align="center">
      <img src="./assets/Home.jpg" alt="Domovská obrazovka" width="300" />
    </td>
    <td align="center">
      <img src="./assets/Form.jpg" alt="Formulář pro přidání výletu" width="300" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="./assets/Trips01.jpg" alt="Přehled výletů 1" width="300" />
      <br/>
      <img src="./assets/Trips02.jpg" alt="Přehled výletů 2" width="300" />
    </td>
    <td align="center">
      <img src="./assets/Calendar.jpg" alt="Kalendář s naplánovanými výlety" width="300" />
    </td>
  </tr>
</table>
