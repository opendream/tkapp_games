# เพื่อนรักต่างดาว
meta_data =
    "friends/image-13.png":
       text: "คีริ"
       sound: "assets/sound/friends/sound-10.mp3"
    "friends/image-18.png":
       text: "ปูโต๊ะ"
       sound: "assets/sound/friends/sound-20.mp3"
    "friends/image-23.png":
       text: "โปเต๊ะ"
       sound: "assets/sound/friends/sound-25.mp3"
    "friends/image-28.png":
       text: "ศาสตราจารย์คููรุ"
       sound: "assets/sound/friends/sound-30.mp3"
    "friends/image-3.png":
       text: "ไส้เดือน"
       sound: "assets/sound/friends/sound-5.mp3"
    "friends/image-8.png":
       text: "คาระ"
       sound: "assets/sound/friends/sound-15.mp3"


# set_data = -> @game.setMetadata(meta_data)
_this = @
set_data = ->
    _this.game.start()
    _this.game.setMetadata(meta_data)
setTimeout(set_data, 1000)