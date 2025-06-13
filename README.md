

<p align="center">
  <img src="https://wibbly.pl/assets/logo_wibbly.svg" alt="Logo Wibbly" width="150"/>
</p>

# Booking System

Full‑stackowy system do zarządzania rezerwacjami z wykorzystaniem Node.js, Express, Knex.js i React. Projekt wspiera środowiska developerskie oraz produkcyjne, uwzględniając konfigurację dla Redis, migracje bazy danych i seed’y.



## 🌐 Demo online

Projekt jest dostępny do podglądu pod adresem:  
[https://booking-system.wibbly.pl](https://booking-system.wibbly.pl)



## 🚀 Funkcje

- Przeglądanie i tworzenie rezerwacji (`appointments`)
- Powiązania wiele-do-wielu między rezerwacjami a usługami (`appointments_services`)
- Obsługa klientów i usług
- Obsługa środowisk `development` i `production`
- Redis do cache lub sesji

## 🧰 Stack technologiczny

- **Backend**: Node.js, Express
- **Baza danych**: MySQL / PostgreSQL (Knex.js jako warstwa ORM)
- **Frontend**: React
- **Cache**: Redis
- **Zarządzanie migracjami/seedami**: Knex.js
- **Hosting**: Środowisko z Node.js (np. panel hostingowy z obsługą `npm`, `SSH`, Redis socket)

## 📁 Struktura projektu
```bash
booking_system/
├── backend/
│ ├── db/
│ │ ├── migrations/
│ │ └── seeds/
│ ├── knexfile.js
│ ├── .env
│ └── app.js
└── frontend/
```

## ⚙️ Instalacja i uruchomienie

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/Ilovereact-so/booking_system.git
cd booking_system/backend

```
### 2. Konfiguracja `.env`
```bash
NODE_ENV=development
DB_CLIENT=mysql2
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=booking_system
```

### Redis lokalnie `TCP`:
```REDIS_URL=redis://127.0.0.1:6379```

### Redis w środowisku produkcyjnym `socket`:

```REDIS_SOCKET_PATH=/home/USER/.redis/redis.sock```


### 3. Instalacja zależności
```
npm install
```
### 4. Migracje i seedy
```
npx knex migrate:latest --knexfile db/knexfile.js
npx knex seed:run --specific=db/seeds/02_appointments.js --knexfile db/knexfile.js
```
### 5. Uruchomienie serwera -- backend (nodemon)
```
npm run dev
```
### 6. Uruchomienie serwera -- frontend (react.js)
```
npm start
```

## ⚠️ Informacje dodatkowe

- Ten projekt został stworzony jako demonstracja moich umiejętności i jest udostępniony do **wglądu**.  
- Nie jest przeznaczony do użytku produkcyjnego ani komercyjnego.
