(function() {
  var meta_data, set_data, _this;

  meta_data = {
    "elephant/image-13.png": {
      text: "งู",
      sound: "assets/sound/elephant/sound-15.mp3"
    },
    "elephant/image-18.png": {
      text: "อีกา",
      sound: "assets/sound/elephant/sound-20.mp3"
    },
    "elephant/image-23.png": {
      text: "กวาง",
      sound: "assets/sound/elephant/sound-25.mp3"
    },
    "elephant/image-28.png": {
      text: "นกสีเขียว",
      sound: "assets/sound/elephant/sound-30.mp3"
    },
    "elephant/image-3.png": {
      text: "พ่อช้าง",
      sound: "assets/sound/elephant/sound-5.mp3"
    },
    "elephant/image-33.png": {
      text: "นกสีแดง",
      sound: "assets/sound/elephant/sound-35.mp3"
    },
    "elephant/image-38.png": {
      text: "ช้างดื้อ",
      sound: "assets/sound/elephant/sound-40.mp3"
    },
    "elephant/image-43.png": {
      text: "เสือ",
      sound: "assets/sound/elephant/sound-45.mp3"
    },
    "elephant/image-8.png": {
      text: "แม่ช้าง",
      sound: "assets/sound/elephant/sound-10.mp3"
    }
  };

  _this = this;

  set_data = function() {
    _this.game.start();
    return _this.game.setMetadata(meta_data);
  };

  setTimeout(set_data, 1000);

}).call(this);
