const crypto = require('crypto');
const redisClient = require('../redisClient');
require('dotenv').config();

// Twilio SID i auth token (znajdziesz w panelu Twilio)
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

class UserSMS {
    // Funkcja wysyłająca SMS z kodem
    async SMS(req, res) {
        try {
            const { phone } = req.body;
            const code = crypto.randomInt(100000, 999999).toString(); // Generowanie 6-cyfrowego kodu

            // Ustawienie kodu w Redis z TTL 5 minut (300 sekund)
            await redisClient.set(phone, code, { EX: 300 }); // Opcje ustawienia TTL w Redis bez callbacku
            console.log('Kod ustawiony w Redis:', code);

            // Wysyłanie SMS za pomocą Twilio
            const message = await client.messages.create({
                body: `Twój Fryzjer - kod weryfikacyjny to : ${code}`,
                to: "+48" + phone,
                from: '+13342588687',  // Twój numer Twilio
            });

            console.log('SMS wysłany:', message.sid);
            return res.status(200).send({ success: true, sid: message.sid });
        } catch (err) {
            console.error('Błąd przy wysyłaniu SMS lub Redis:', err);
            return res.status(500).send({ success: false, message: 'Internal server error', error: err.message });
        }
    }

    // Funkcja weryfikująca kod
    async VerifyCode(req, res) {
        try {
            const { phone, code } = req.body;

            // Pobieranie kodu z Redis
            const storedCode = await redisClient.get(phone);
            const timesCode = await redisClient.lRange("veryfyPhoneTimes",0,-1)
            const count = timesCode.filter(num => num === phone).length;
            console.log(count)
            redisClient.rPush("veryfyPhoneTimes",phone)
            if(count < 10){
                if(count === 9){
                    const date = new Date()
                    const day = String(date.getDate()).padStart(2, '0');  // Dzień (dodaje 0 na początku, jeśli liczba jest jednocyfrowa)
                    const month = String(date.getMonth() + 1).padStart(2, '0');  // Miesiąc (getMonth() zwraca miesiące od 0 do 11, więc dodajemy 1)
                    const year = date.getFullYear();  // Rok
                    const hours = String(date.getHours()).padStart(2, '0');  // Godziny
                    const minutes = String(date.getMinutes()).padStart(2, '0');  // Minuty
                    
                    redisClient.set(phone+"Failed",`${year}-${month}-${day}T${hours}:${minutes}:00`)
                }
                if (storedCode === code) {
                    // Kod poprawny, usuwamy go z Redis
                    await redisClient.del(phone);
                    console.log('Kod poprawny, usunięty z Redis:', phone);
                    return res.status(200).send({ success: true, message: 'Poprawnie zweryfikowany kod' });
                } else {
                    // Kod jest nieprawidłowy lub wygasł
                    console.log('Niepoprawny lub wygasły kod:', phone);
                    return res.status(400).send({ success: false, message: 'Niepoprawny lub wygasły kod' });
                }
            }
                if (storedCode === code && code < 10) {
                    // Kod poprawny, usuwamy go z Redis
                    await redisClient.del(phone);
                    console.log('Kod poprawny, usunięty z Redis:', phone);
                    return res.status(200).send({ success: true, message: 'Poprawnie zweryfikowany kod' });
                } else {

                    const failed = redisClient.get(phone+"Failed")
                    const actualdate = new Date()
                    const FD = await failed.then((res)=>{
                        return new Date(res)
                    })
                    const differenceInTime = actualdate.getTime()- FD.getTime()
                    const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));  // Milisekundy na dni
                    const differenceInHours = Math.floor((differenceInTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));  // Pozostałe godziny
                    const differenceInMinutes = Math.floor((differenceInTime % (1000 * 60 * 60)) / (1000 * 60));  // Pozostałe minuty
                    if(differenceInDays > 1 || differenceInHours >= 2 ){
                        redisClient.del(phone+"Failed")
                        if (storedCode === code) {
                            // Kod poprawny, usuwamy go z Redis
                            await redisClient.del(phone);
                            console.log('Kod poprawny, usunięty z Redis:', phone);
                            return res.status(200).send({ success: true, message: 'Poprawnie zweryfikowany kod' });
                        } else {
                            // Kod jest nieprawidłowy lub wygasł
                            console.log('Niepoprawny lub wygasły kod:', phone);
                            return res.status(400).send({ success: false, message: 'Niepoprawny lub wygasły kod' });
                        }
                    }else{
                        console.log(`Różnica: ${differenceInDays} dni, ${differenceInHours} godzin, ${differenceInMinutes} minut, aktualnaData: ${actualdate}, dataOsiągnęcialimitu: ${FD}`);
                        //console.log('sprawdzenie kodu 10+ razy:', phone);
                        return res.status(400).send({ success: false, message: 'Osiągnięto limit, spróbuj ponownie za: ',failed:FD });
                    }
                    
                }
            
            


            
        } catch (err) {
            console.error('Błąd przy weryfikacji kodu lub Redis:', err);
            return res.status(500).send({ success: false, message: 'Wewnętrzny błąd serwera', error: err.message });
        }
    }
}

module.exports = new UserSMS();
