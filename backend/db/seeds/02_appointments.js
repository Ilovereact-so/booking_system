const bcrypt = require('bcrypt');
const seed_userDAO = require('../../dao/user');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('appointments_services').del();
  await knex('appointments').del();
  await knex.raw('ALTER TABLE appointments_services AUTO_INCREMENT = 1');
  await knex.raw('ALTER TABLE appointments AUTO_INCREMENT = 1');
  // const client_id = 1;
  // const appointment_date = "2024-07-19 10:00:00";
  // const total_cost = "50.00";
  
  // ----------- funkcje generujace rand()
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

  const library = [{
    2025:{
      6:{
        1:[
          "9:00:00",
          "11:00:00"
        ]
      },
      7:{
        2:[
          "9:00:00",
          "11:00:00"
        ]
      }
    }
  }]

  function checklibrary(year, month, day, time) {
    const yearObj = library.find(item => item[year]);
    if (!yearObj) return false;

    const monthObj = yearObj[year][month];
    if (!monthObj) return false;

    const dayArray = monthObj[day];
    if (!dayArray) return false;

    return dayArray.includes(time);
  }


  function getRandomDate() {
    while (true) {
      const year = 2025;
      const month = getRandomInt(5, 8);
      const day = getRandomInt(1, getDaysInMonth(month, year));
      const hours = getRandomInt(9, 16);
      const minutes = getRandomMinutes();
      const seconds = "00";

      const monthStr = month.toString().padStart(2, '0');
      const dayStr = day.toString().padStart(2, '0');
      const hoursStr = hours.toString().padStart(2, '0');
      const minutesStr = minutes.toString().padStart(2, '0');
      const secondsStr = seconds.toString().padStart(2, '0');
      const time = `${hoursStr}:${minutesStr}:${secondsStr}`;

      if (!checklibrary(year, month, day, time)) {
        updateLibrary(year, month, day, time);
        return `${year}-${monthStr}-${dayStr} ${hoursStr}:${minutesStr}:${secondsStr}`;
      }
    }
  }

  function updateLibrary(year, month, day, time) {
    let yearObj = library.find(item => item[year]);
    if (!yearObj) {
      yearObj = { [year]: {} };
      library.push(yearObj);
    }

    let monthObj = yearObj[year][month];
    if (!monthObj) {
      monthObj = {};
      yearObj[year][month] = monthObj;
    }

    let dayArray = monthObj[day];
    if (!dayArray) {
      dayArray = [];
      monthObj[day] = dayArray;
    }

    dayArray.push(time);
  }

  //const library = []
  function getRandomDays(year, month, numberOfDays) {
    const maxDays = getDaysInMonth(month, year);
    const days = new Set();
    
    while (days.size < numberOfDays) {
      const randomDay = getRandomInt(1, maxDays);
      days.add(randomDay);
    }
    
    return Array.from(days);
  }
  
  function getAvailableHours(day, libraryDay) {
    const allHours = [
      "09:00:00", "09:30:00", "10:00:00", "10:30:00",
      "11:00:00", "11:30:00", "12:00:00", "12:30:00",
      "13:00:00", "13:30:00", "14:00:00", "14:30:00",
      "15:00:00", "15:30:00", "16:00:00", "16:30:00"
    ];
  
    const occupiedHours = libraryDay ? libraryDay : [];
    const availableHours = allHours.filter(hour => !occupiedHours.includes(hour));
  
    return availableHours;
  }
  
  function formatDateTime(year, month, day, hour) {
    const monthStr = month.toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    return `${year}-${monthStr}-${dayStr} ${hour}`;
  }
  
  function generateRandomDaysWithHours(library) {
    const update = [];
  
    library.forEach(yearEntry => {
      const [year, months] = Object.entries(yearEntry)[0];
  
      Object.entries(months).forEach(([month, days]) => {
        const randomDays = getRandomDays(parseInt(year), parseInt(month), 10);
  
        randomDays.forEach(day => {
          const occupiedHours = days[day] || [];
          const availableHours = getAvailableHours(day, occupiedHours);
  
          availableHours.forEach(hour => {
            const dateTime = formatDateTime(year, month, day, hour);
            update.push(dateTime);
          });
        });
      });
    });
  
    return update;
  }
  
  // checklibrary(2024, 6, 1, "10:00:00")
  // checklibrary(2024, 8, 3, "14:30:00")
  // checklibrary(2024, 6, 1, "10:00:00")
  // checklibrary(2024, 8, 3, "15:00:00")
  //await seed_userDAO.addAppointment(1, "2024-07-19 16:00:00", 70);
  async function createAppointments() {
    const appointments = Array.from({ length: 600 }).map(async (_item, index) => {
      console.log("Creating appointment " + index);
      await seed_userDAO.addAppointment(1, getRandomDate(), 70);
    });

    await Promise.all(appointments);
    console.log("All appointments created");
    

    const upgrade = Array.from(generateRandomDaysWithHours(library), async (item, index)=>{
      console.log("Upgrade appointment " + index);
      await seed_userDAO.addAppointment(1, item, 70);
    })

    await Promise.all(upgrade);
    console.log("All appointments created");

  }

  try {
    await createAppointments();
  } catch (error) {
    console.error(error);
  }
  
};