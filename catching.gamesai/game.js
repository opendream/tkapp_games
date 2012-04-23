(function() {
  var meta_data, set_data, _this;

  meta_data = {
    "gamesai/item-brother.png": {
      text: "พี่ชาย",
      sound: "assets/sound/gamesai/item-brother.mp3"
    },
    "gamesai/item-buff.png": {
      text: "ควาย",
      sound: "assets/sound/gamesai/item-buff.mp3"
    },
    "gamesai/item-gamesai.png": {
      text: "เด็กหญิงแก้มใส",
      sound: "assets/sound/gamesai/item-gamesai.mp3"
    },
    "gamesai/item-grandfather.png": {
      text: "คุณตา",
      sound: "assets/sound/gamesai/item-grandfather.mp3"
    },
    "gamesai/item-grandmother.png": {
      text: "คุณยาย",
      sound: "assets/sound/gamesai/item-grandmother.mp3"
    },
    "gamesai/item-sister.png": {
      text: "คุณน้า",
      sound: "assets/sound/gamesai/item-sister.mp3"
    },
    "gamesai/item-sister2.png": {
      text: "น้องสาว",
      sound: "assets/sound/gamesai/item-sister2.mp3"
    },
    "gamesai/item-uncle.png": {
      text: "คุณลุง",
      sound: "assets/sound/gamesai/item-uncle.mp3"
    },
    "gamesai/item-wolf.png": {
      text: "หมาป่า",
      sound: "assets/sound/gamesai/item-wolf.mp3"
    }
  };

  _this = this;

  set_data = function() {
    _this.game.start();
    return _this.game.setMetadata(meta_data);
  };

  setTimeout(set_data, 1000);

}).call(this);
