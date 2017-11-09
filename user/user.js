const {mongoose} = require('./../db/mongoose');
const {User} = require('./../models/user');
const {Device} = require('./../models/device');
const axios = require('axios');

var findUserByName = function(name) {
  return new Promise((resolve, reject) => {
    User.findOne({name}).then((user) => {
      resolve(user);
    });
  });
};

var findCardID = function (card_id) {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({card_id}, {last_activity: new Date()}).then((user) => {
      if(user) {
        resolve(user);
      } else {
        reject();
      }
    }, (e) => {
      reject();
    });
  });
};

var findAllUsers = function() {
  return new Promise((resolve, reject) => {
    User.find().then((users) => {
      resolve(users);
    });
  })
};

var newUser = function(name, photo) {
  return new Promise((resolve, reject) => {
    user = new User({name, photo});
    user.save().then(() => {
      resolve();
    });
  });
};

var removeUser = function(name) {
  return new Promise((resolve, reject) => {
    User.remove({name}).then((user) => {
      resolve();
    });
  });
};

var removeCard = function(name) {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({name},{card_id:''}).then(() => {
      resolve();
    });
  });
};

var registerCard = function(keypad, user_id) {
  return new Promise ((resolve, reject) => {
    axios({url: `http://${keypad}/newCard`, method: 'get'}).then((response) => {
      User.findOneAndUpdate({_id:mongoose.Types.ObjectId(user_id)}, {card_id:response.data}).then(()=> {
        resolve(response.data);
      });
    }).catch((e) => {
      reject();
    });
  });
};

// app.post('/registerCard', (req, res) => {
//   Device.find({name: req.body.device}).then((device) => {
//   console.log(device);
//     axios({url: 'http://192.168.15.66/newCard', method: 'get'}).then((response) => {
//       console.log(response);
//       res.send('DEU CERTO');
//     }, (error) => {
//       console.log(error);
//     });
//   }, (error) => {
//     // console.log(error);
//     res.send('DEU ERRADO');
//   })
// });

module.exports = {
  findUserByName,
  // findTag,
  findAllUsers,
  newUser,
  removeUser,
  removeCard,
  registerCard
};
