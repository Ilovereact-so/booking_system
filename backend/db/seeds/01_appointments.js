const bcrypt = require('bcrypt');
const seed_userDAO = require('../../dao/user');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  // await knex('appointment_services').del();
  // await knex('appointments').del();
  // const client_id = 1;
  // const appointment_date = "2024-07-19 10:00:00";
  // const total_cost = "50.00";
  
  // const appointments = [
  //   {
  //     "client_id":1,
  //     "appointment_date":"2024-07-19 09:00:00",
  //     "total_cost":"50.00"
  //   },
  //   {
  //     "client_id":1,
  //     "appointment_date":"2024-07-19 09:30:00",
  //     "total_cost":"50.00"
  //   },
  //   {
  //     "client_id":1,
  //     "appointment_date":"2024-07-19 10:00:00",
  //     "total_cost":"50.00"
  //   },
  //   {
  //     "client_id":1,
  //     "appointment_date":"2024-07-19 10:30:00",
  //     "total_cost":"50.00"
  //   },
  //   {
  //     "client_id":1,
  //     "appointment_date":"2024-07-19 11:00:00",
  //     "total_cost":"50.00"
  //   },
  //   {
  //     "client_id":1,
  //     "appointment_date":"2024-07-19 11:30:00",
  //     "total_cost":"50.00"
  //   },
  //   {
  //     "client_id":1,
  //     "appointment_date":"2024-07-19 12:00:00",
  //     "total_cost":"50.00"
  //   },
  //   {
  //     "client_id":1,
  //     "appointment_date":"2024-07-19 12:30:00",
  //     "total_cost":"50.00"
  //   },
  //   {
  //     "client_id":1,
  //     "appointment_date":"2024-07-19 13:00:00",
  //     "total_cost":"50.00"
  //   },
  //   {
  //     "client_id":1,
  //     "appointment_date":"2024-07-19 13:30:00",
  //     "total_cost":"50.00"
  //   },
  //   {
  //     "client_id":1,
  //     "appointment_date":"2024-07-19 14:00:00",
  //     "total_cost":"50.00"
  //   },
  //   {
  //     "client_id":1,
  //     "appointment_date":"2024-07-19 14:30:00",
  //     "total_cost":"50.00"
  //   },
  //   {
  //     "client_id":1,
  //     "appointment_date":"2024-07-19 15:00:00",
  //     "total_cost":"50.00"
  //   },
  //   {
  //     "client_id":1,
  //     "appointment_date":"2024-07-19 15:30:00",
  //     "total_cost":"50.00"
  //   },
  //   {
  //     "client_id":1,
  //     "appointment_date":"2024-07-19 16:00:00",
  //     "total_cost":"50.00"
  //   },
  //   {
  //     "client_id":1,
  //     "appointment_date":"2024-07-19 16:30:00",
  //     "total_cost":"50.00"
  //   },
  //   {
  //     "client_id":1,
  //     "appointment_date":"2024-07-4 16:30:00",
  //     "total_cost":"50.00"
  //   },
  //   {
  //     "client_id":1,
  //     "appointment_date":"2024-07-5 12:30:00",
  //     "total_cost":"50.00"
  //   },
  // ]

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }
  
  function getRandomMinutes() {
    const minutesArray = [0, 30];
    return minutesArray[getRandomInt(0, 1)];
  }

  function getRandomTime() { // uzupełnienie
    const hours = getRandomInt(6, 16);
    const minutes = (hours === 16) ? 30 : getRandomMinutes(); // Jeśli godzina to 16, minuty muszą być 30
    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    return `${hoursStr}:${minutesStr}:00`;
  }
  function getRandomDate(day, month) { // uzupełnienie
    const year = 2024;
    const dayStr = day.toString().padStart(2, '0');
    const timeStr = getRandomTime();
    return `${year}-${month}-${dayStr} ${timeStr}`;
  }
  
  function getRandomDate() {
    const year = 2024;
    const month = getRandomInt(6, 9); // Miesiąc od 1 do 12
    const day = getRandomInt(1, getDaysInMonth(month, year)); // Dzień odpowiedni dla miesiąca
    const hours = getRandomInt(9, 16); // Godziny od 0 do 23
    const minutes = getRandomMinutes(); // Minuty tylko 0 lub 30
    const seconds = "00"; // Sekundy od 0 do 59
  
    // Formatowanie miesiąca, dnia, godzin, minut i sekund do dwóch cyfr
    const monthStr = month.toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');
  
    return `${year}-${monthStr}-${dayStr} ${hoursStr}:${minutesStr}:${secondsStr}`;
  }


  const createAppointments = async () => {
    const appointments = Array.from({ length: 800 }, async (_item, index) => {
      console.log("Creating appointment " + index);
      await seed_userDAO.addAppointment(1, getRandomDate(), 70);
    });

    // Czekaj na zakończenie wszystkich operacji asynchronicznych
    await Promise.all(appointments);
    console.log("All appointments created");

  };

  createAppointments().catch(error => console.error(error));

  // const promises = appointments.map(async(item,index)=>{
  //   console.log("niga "+index)
  //   await seed_userDAO.addAppointment(item.client_id, item.appointment_date, item.total_cost)
  // })
  // await Promise.all(promises)

  const filling = async ()=>{
    const months = [6,7,8,9]
    const appointments = Array.from(months, async(item, index)=>{
      const monthPool = await seed_userDAO.checkAppointment({year:"2024",month:"0"+item})
      createRandomAppointments(monthPool).catch(error => console.error(error));
    })
    await Promise.all(appointments);
    
  }
  filling().catch(error => console.error(error));

  async function createRandomAppointments(month) {
    // Filtracja dni z wartością < 16
    const eligibleDays = Object.keys(daysData).filter(day => daysData[day] < 16);
  
    // Wybór losowych 10 dni
    const randomDays = [];
    while (randomDays.length < 10 && eligibleDays.length > 0) {
      const randomIndex = getRandomInt(0, eligibleDays.length - 1);
      const randomDay = eligibleDays.splice(randomIndex, 1)[0];
      randomDays.push(randomDay);
    }
  
    // Tworzenie losowych spotkań
    const appointmentsPromises = [];
    randomDays.forEach(day => {
      const numAppointments = 16 - daysData[day];
      for (let i = 0; i < numAppointments; i++) {
        const randomDate = getRandomDate(day, month);
        const appointmentPromise = seed_userDAO.addAppointment(1, randomDate, 70);
        appointmentsPromises.push(appointmentPromise);
      }
    });
  
    // Oczekiwanie na zakończenie wszystkich operacji
    await Promise.all(appointmentsPromises);
    console.log("All random appointments created.");
  }
};
