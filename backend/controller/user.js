const userService = require('../service/user');
class UserController {
  // async loginUser(req, res) {
  //   try {
  //     const id = await userService.loginUser(req.body);
  //     if(id != null){
  //       res.status(201).json(id);
  //     }else{
  //       res.status(403).json(id);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
  
  async checkAppointment(req, res) {
    try {
      const id = await userService.checkAppointment(req.body);
      if(id != null){
        res.status(201).json(id);
      }else{
        res.status(403).json(id);
      }
    } catch (err) {
      console.error(err);
    }
  }
  async addAppointment(req, res) {
    try {
      const id = await userService.addAppointment(req.body);
      if(id != null){
        res.status(201).json(id);
      }else{
        res.status(403).json(id);
      }
    } catch (err) {
      console.error(err);
    }
  }


async checkAppointmentHours(req, res) {
  try {
    const id = await userService.checkAppointmentHours(req.body);
    if(id != null){
      res.status(201).json(id);
    }else{
      res.status(403).json(id);
    }
  } catch (err) {
    console.error(err);
  }
}
async sendCode(req, res) {
  try {
    const id = await userService.sendCode(req.body);
    if(id != null){
      res.status(201).json(id);
    }else{
      res.status(403).json(id);
    }
  } catch (err) {
    console.error(err);
  }
}
async verifyCode(req, res) {
  try {
    const status = await userService.verifyCode(req.body);
    if(status.code >= 200  && status.code < 300 ){
      res.status(status.code).send({ success: true, message:status.message });
    }else if(status.code >= 400){
      res.status(status.code).send({ success: false, message: status.message });
    }else{

    }
  } catch (err) {
    console.error(err);
  }
}
// async sendSMS(req, res) {
//   const { to, code } = req.body;

//     client.messages.create({
//         body: `Twój kod weryfikacyjny to: ${code}`,
//         to,  // Numer telefonu odbiorcy (w formacie międzynarodowym)
//         from: '+1234567890'  // Twój numer Twilio
//     })
//     .then((message) => res.status(200).send({ success: true, sid: message.sid }))
//     .catch((error) => res.status(500).send({ success: false, error }));
// }
}

module.exports = new UserController();