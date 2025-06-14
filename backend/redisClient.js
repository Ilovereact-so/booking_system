const redis = require('redis');

// Tworzenie klienta Redis
const isProduction = process.env.NODE_ENV === 'production';

const redisClient = redis.createClient(
  isProduction
    ? { socket: { path: process.env.REDIS_SOCKET_PATH } }
    : { url: "redis://0.0.0.0:6379" }
);

// Obsługa błędów Redis
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

// Upewnij się, że klient połączy się przed wykonywaniem operacji
(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');

        // Ustawienie wartości w Redis
        const reply = await redisClient.set('key', 'value');
        console.log('Set key result:', reply); // Powinno zwrócić 'OK'

        // Odczytanie wartości z Redis
        const value = await redisClient.get('key');
        console.log('Retrieved value:', value); // Powinno zwrócić 'value'

    } catch (err) {
        console.error('Error during Redis operation:', err);
    }
})();
// Eksport klienta Redis, aby można było go zaimportować w innych plikach
module.exports = redisClient;