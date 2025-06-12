const userDAO = require('../dao/user');
const redisClient = require('../redisClient');

class userService {
  // loginUser(userDto) {
  //   const {password, userdata, usertype } = userDto;
  //   return userDAO.loginUser(password, userdata, usertype);
  // }
  checkAppointment(userDto) {
    const {year, month} = userDto; //{year:, month:} back all days in month
    return userDAO.checkAppointment(year, month);
  }

  addAppointment(userDto) {
    const {client_id, appointment_date, total_cost} = userDto; //{year:, month:} back all days in month
    return userDAO.addAppointment(client_id, appointment_date, total_cost);
  }
  
  checkAppointmentHours(userDto) {
    const {year, month, day} = userDto; //{year:, month:} back all days in month
    return userDAO.checkAppointmentHours(year, month, day);
  }
  async sendCode(userDto) {
    const {email} = userDto; //{year:, month:} back all days in month
    let e = String(email)
    const code = await userDAO.generateCode()
    await redisClient.set(e, code, { EX: 300 }); // Opcje ustawienia TTL w Redis bez callbacku
    
    
    
    return userDAO.sendCode(email, code);
  }
  async verifyCode(userDto) {
    const { email, code } = userDto;

    try {
      const storedCode = await redisClient.get(email);

      // Zlicz dotychczasowe próby weryfikacji
      const allAttempts = await redisClient.lRange("verificationAttempts", 0, -1);
      const attemptCount = allAttempts.filter(entry => entry === email).length;

      // Zapisz aktualną próbę
      await redisClient.rPush("verificationAttempts", email);

      // Jeśli liczba prób < 10 — normalna weryfikacja
      if (attemptCount < 10) {
        // Jeśli to 10. próba — zapisujemy czas blokady (jako timestamp)
        if (attemptCount === 9) {
          await redisClient.set(`${email}_blockedAt`, Date.now());
        }

        if (storedCode === code) {
          await redisClient.del(email);
          return { code: 200, message: "Kod poprawny" };
        } else {
          return { code: 400, message: "Kod nieprawidłowy lub wygasł" };
        }
      }

      // Przekroczony limit prób — sprawdź czas blokady
      const blockedAtRaw = await redisClient.get(`${email}_blockedAt`);

      if (!blockedAtRaw) {
        return { code: 400, message: "Przekroczono limit prób. Spróbuj później." };
      }

      const blockedAt = parseInt(blockedAtRaw, 10);
      const now = Date.now();
      const timeDiffMinutes = Math.floor((now - blockedAt) / (1000 * 60));

      if (timeDiffMinutes >= 120) {
        // Minęły 2 godziny — odblokuj i sprawdź kod ponownie
        await redisClient.del(`${email}_blockedAt`);

        if (storedCode === code) {
          await redisClient.del(email);
          return { code: 200, message: "Kod poprawny (po blokadzie)" };
        } else {
          return { code: 400, message: "Kod nieprawidłowy" };
        }
      } else {
        const timeLeft = 120 - timeDiffMinutes;
        return {
          code: 429,
          message: `Osiągnięto limit prób. Spróbuj ponownie za ${timeLeft} minut.`
        };
      }

    } catch (err) {
      console.error("Błąd w verifyCode:", err);
      return { code: 500, message: "Błąd serwera" };
    }
  }

  // sendSMS(userDto) {
  //   const {to, code} = userDto; //{year:, month:} back all days in month
  //   return userDAO.sendSMS(to, code);
  // }
}

module.exports = new userService();
