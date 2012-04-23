meta_data =
    "dokrak/image-13.png":
        text: "เจ้าดอกรัก"
        sound: "assets/sound/dokrak/sound-20.mp3"
    "dokrak/image-18.png":
        text: "แม่เจ้าดอกรัก"
        sound: "assets/sound/dokrak/sound-15.mp3"
    "dokrak/image-23.png":
        text: "ตาเจียม"
        sound: "assets/sound/dokrak/sound-25.mp3"
    "dokrak/image-28.png":
        text: "นางพริ้ง"
        sound: "assets/sound/dokrak/sound-30.mp3"
    "dokrak/image-3.png":
        text: "หมวก"
        sound: "assets/sound/dokrak/sound-5.mp3"
    "dokrak/image-33.png":
        text: "นายแม้น"
        sound: "assets/sound/dokrak/sound-35.mp3"
    "dokrak/image-38.png":
        text: "ยายละไม"
        sound: "assets/sound/dokrak/sound-40.mp3"
    "dokrak/image-8.png":
        text: "จอบขุดดิน"
        sound: "assets/sound/dokrak/sound-10.mp3"

# set_data = -> @game.setMetadata(meta_data)
_this = @
set_data = ->
    _this.game.start()
    _this.game.setMetadata(meta_data)
setTimeout(set_data, 1000)