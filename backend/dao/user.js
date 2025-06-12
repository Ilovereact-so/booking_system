const db = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const user = require('../service/user');
const randomToken = require('random-token');
const e = require('express');
const transporter = require('../db/transporter')
const crypto = require('crypto');
require('dotenv').config();

class userDAO {
async loginUser(password, userdata, usertype){
    console.log(usertype, userdata)
    
    async function check() {
      
      if(usertype == 'email'){
        const [DB] = await db('users')
        .where({email: userdata})
        //console.log("email", DB)
        if(DB != null){
          return login(DB)
        }else{
          return false
        }
        
      }else{
        //let huj = "niga"
        const [DB] = await db('users')
        .where({username : userdata})
        //console.log("username", DB)
        if(DB != null){
          return login(DB)
        }else{
          return false
        }
      }
    }
    async function login(DB){
      //console.log('true')
      return bcrypt.compare(password, DB.password).then(function(result) {
        //console.log(result)
        if(result == true){
          //getAccess_token()
          return getAccess_token(DB.id)
        }else{
          return false
        }
      });
      
    }

    async function getAccess_token(user_id){
      var payload = {
        user_id:user_id,
        rt_id: 0
      };
      var secret = 'kurwakurwaKondzioCwelkurwakurwa';
      const access_token = jwt.encode(payload, secret, 'HS512');
      await db('oauth_access_tokens')
      .insert({user_id, access_token})
      //console.log(tokens_db.access_token)

      return access_token
    }

    return check()
    
  }

  async checkAppointment(year, month) {
  console.log(year, month)
    const days = await db('appointments')
    .whereRaw('YEAR(appointment_date) = ?', [year])
    .andWhereRaw('MONTH(appointment_date) = ?', [month])
    .select('appointment_date'); //.select('appointment_date')
    
    const x = Array.from(days,(x,index)=>{
      return new Date(x.appointment_date).getUTCDate()
    })

    const countOccurrences = (arr) => {
      return arr.reduce((acc, num) => {
        acc[num] = (acc[num] || 0) + 1;
        return acc;
      }, {});
    };
    //const day = new Date(days?.appointment_date).getDay()
    //console.log(x.findIndex(19))

    const numbersOfDays = Object.entries(countOccurrences(x))
    .filter(([key, value]) => value === 16)
    .map(([key]) => parseInt(key, 10));
    console.log(countOccurrences(x))
    return numbersOfDays;

  }

  async addAppointment(client_id, appointment_date, total_cost){

    const date = new Date(appointment_date)
    const appointment__number = randomToken(14).toUpperCase() + date.getFullYear() + randomToken(2).toUpperCase() + date.getMonth() + randomToken(2).toUpperCase() + date.getDate() + randomToken(2).toUpperCase() + date.getHours() + "-" + date.getMinutes() + randomToken(4).toUpperCase() 
        
    console.log(client_id,appointment_date,total_cost)
    const id = await db("appointments").insert({client_id,appointment_date,total_cost, appointment__number})
    
    await db("appointment_services").insert({appointment_id:id, service_id:1})
   return id
  }

  async checkAppointmentHours(year, month, day){
    console.log(year, month)
    const days = await db('appointments')
    .whereRaw('YEAR(appointment_date) = ?', [year])
    .andWhereRaw('MONTH(appointment_date) = ?', [month])
    .andWhereRaw('DAY(appointment_date) = ?', [day])
    .select('appointment_date'); //.select('appointment_date')
    
    console.log(days)
    return days
  }

  // async sendSMS(to, code){
  //   client.messages.create({
  //     body: `Twój kod weryfikacyjny to: ${code}`,
  //     to,  // Numer telefonu odbiorcy (w formacie międzynarodowym)
  //     from: '+1234567890'  // Twój numer Twilio
  // }).then((message) =>{
  //   return 
  // })
  // }

  async sendCode(email, code){
    console.log(email)
    const mailOptions = {
      from: `<${process.env.SMTP_USER}>`,
      to: email,
      subject: "Kod potwierdzający - Konfigurator",
      html: `
      <html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kod potwierdzający</title>
</head>
<body style="margin:0; padding:0; background-color: #ffffff; font-family: 'Trebuchet MS', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
    <tr>
      <td align="center" style="padding: 0 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 400px; background-color: #F2F2F2;">
          <tr>
            <td style="padding-top: 60px; text-align: center;">
              <img src="https://res.cloudinary.com/dftyw1fkg/image/upload/v1749675764/logo_wibbly_xg3enk.png" alt="Logo" style="max-width: 120px; height: auto;">
              <h1 style="font-size: 22px; font-weight: 400; margin-top: 24px; margin-bottom: 0; color: #000000;">Kod potwierdzający</h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 40px 20px 0 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border-radius: 20px;">
                <tr>
                  <td style="padding: 30px 20px; text-align: center; border-radius: 40px;">
                    <h2 style="font-size: 18px; font-weight: 400; margin: 0 0 20px 0; color: #000000;">Oto twój kod zatwierdzenia wizyty:</h2>
                    <p style="font-size: 24px; font-weight: 700; letter-spacing: 20px; margin: 0 0 20px 20px; color: #000000;">${code}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 30px 20px 0 20px;">
              <p style="font-size: 16px; color: #000000; margin: 0;">Ten kod jest ważny przez 5 minut. Nie udostępniaj go nikomu.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 80px 20px 40px 20px; font-size: 12px; color: #777777;">
              <p style="margin: 0 0 10px 0;">Powiadomienie systemowe</p>
              <p style="margin: 0;">Jeśli to nie Ty próbujesz się zalogować, zignoruj tę wiadomość.<br>&copy; 2025 <a href="https://wibbly.pl" style="text-decoration: none; color: #777777;">Wibbly.pl</a> &ndash; Wszelkie prawa zastrzeżone.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,headers: {
    'X-Category': 'notifications',
    'X-Priority': '3'
  }
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("✅ Email wysłany!");
      return true
    } catch (err) {
      console.error("❌ Błąd:", err);
      return false
    }
  }

  async generateCode(){
    const code = crypto.randomInt(100000, 999999).toString(); // Generowanie 6-cyfrowego kodu
    // Ustawienie kodu w Redis z TTL 5 minut (300 sekund)
    console.log('Kod ustawiony w Redis:', code);
    return code
  }
     
}


module.exports = new userDAO();
