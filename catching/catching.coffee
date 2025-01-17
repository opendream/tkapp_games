#set main namespace
goog.provide 'catching'

#get requirements
# goog.require 'catching.Button'
goog.require 'lime.Director'
goog.require 'lime.Scene'
goog.require 'lime.Layer'
goog.require 'lime.Circle'
goog.require 'lime.Label'
goog.require 'lime.Button'
# goog.require 'lime.RoundedRect'
# goog.require 'lime.fill.LinearGradient'
goog.require 'lime.animation.Spawn'
goog.require 'lime.animation.Sequence'
goog.require 'lime.animation.FadeTo'
goog.require 'lime.animation.ScaleTo'
goog.require 'lime.animation.MoveTo'
goog.require 'lime.animation.MoveBy'
goog.require 'lime.animation.ScaleBy'
goog.require 'lime.audio.Audio'

goog.require 'goog.array'
goog.require 'lime.GlossyButton'

sceneWidth = 800
sceneHeight = 600
sceneCenterX = sceneWidth/2
sceneCenterY = sceneHeight/2

callbackFactory =
    timer: ->
catching.events = []
catching.scenes = []
catching.isGameEnded = false
@answerAnimationFactory = []

getIdxMap = (a) ->
  map = goog.array.map a, (e, i) -> i if e
  goog.array.filter map, (e, i) ->  !!e


blockPattern = [[
        0, 0, 0
        0, 1, 1
        1, 1, 0 ], [

        0, 0, 1
        0, 1, 1
        1, 1, 1 ], [

        1, 0, 1
        1, 0, 1
        1, 0, 1 ], [

        0, 0, 0
        0, 0, 1
        1, 0, 1 ], [

        0, 0, 0,
        1, 0, 1
        1, 1, 1
    ]]

blockPatternHard = [[
        0, 0, 0, 0
        0, 1, 1, 1
        1, 1, 0, 1 ], [

        0, 0, 1, 1
        0, 1, 1, 0
        1, 1, 1, 1 ], [

        1, 0, 1, 1
        1, 0, 1, 1
        1, 0, 1, 0 ], [

        0, 0, 0, 1
        1, 0, 1, 1
        1, 1, 1, 1 ], [

        0, 0, 0, 0,
        1, 0, 1, 1,
        1, 1, 1, 0
    ]]

meta_data =
    "gamesai/item-brother.png":
        text: "พี่ชาย"
        sound: "assets/sound/gamesai/item-brother.mp3"
    "gamesai/item-buff.png":
        text: "ควาย"
        sound: "assets/sound/gamesai/item-buff.mp3"
    "gamesai/item-gamesai.png":
        text: "เด็กหญิงแก้มใส"
        sound: "assets/sound/gamesai/item-gamesai.mp3"
    "gamesai/item-grandfather.png":
        text: "คุณตา"
        sound: "assets/sound/gamesai/item-grandfather.mp3"
    "gamesai/item-grandmother.png":
        text: "คุณยาย"
        sound: "assets/sound/gamesai/item-grandmother.mp3"
    "gamesai/item-sister.png":
        text: "คุณน้า"
        sound: "assets/sound/gamesai/item-sister.mp3"
    "gamesai/item-sister2.png":
        text: "น้องสาว"
        sound: "assets/sound/gamesai/item-sister2.mp3"
    "gamesai/item-uncle.png":
        text: "คุณลุง"
        sound: "assets/sound/gamesai/item-uncle.mp3"
    "gamesai/item-wolf.png":
        text: "หมาป่า"
        sound: "assets/sound/gamesai/item-wolf.mp3"

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


# ช้างดื้อ
meta_data =
    "elephant/image-13.png":
        text: "งู"
        sound: "assets/sound/elephant/sound-15.mp3"
    "elephant/image-18.png":
        text: "อีกา"
        sound: "assets/sound/elephant/sound-20.mp3"
    "elephant/image-23.png":
        text: "กวาง"
        sound: "assets/sound/elephant/sound-25.mp3"
    "elephant/image-28.png":
        text: "นกสีเขียว"
        sound: "assets/sound/elephant/sound-30.mp3"
    "elephant/image-3.png":
        text: "พ่อช้าง"
        sound: "assets/sound/elephant/sound-5.mp3"
    "elephant/image-33.png":
        text: "นกสีแดง"
        sound: "assets/sound/elephant/sound-35.mp3"
    "elephant/image-38.png":
        text: "ช้างดื้อ"
        sound: "assets/sound/elephant/sound-40.mp3"
    "elephant/image-43.png":
        text: "เสือ"
        sound: "assets/sound/elephant/sound-45.mp3"
    "elephant/image-8.png":
        text: "แม่ช้าง"
        sound: "assets/sound/elephant/sound-10.mp3"

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

# Helper
randomItemManager = () ->
    IconItemArray = goog.object.getKeys meta_data
    size = IconItemArray.length
    lastGetIdx = 0
    goog.array.shuffle IconItemArray
    return {
        size: size
        getItem: ->
            IconItemArray[lastGetIdx++]
        getAll: ->
            IconItemArray
        getAt: (idx) ->
            IconItemArray[0]
    }

# score
catching.score = do ->
    _score = 0
    add = () ->
        _score++
        @
    reset = () -> _score = 0
    getScore = -> _score
    { getScore, add, reset }

catching.setMetadata = (data) ->
    meta_data = data
    catching.intro()

#animation

setUp = (opts) ->
    switch opts.part
        when "blockPipe"
            if opts.by is 3
                startX = 120
                margin = 225
                addCharacter "block_pipe.png",
                x: startX, y: 45, w: 104, h: 122, absolute: true, at: opts.at,
                callback: (character) -> character.setAnchorPoint 0, 0

                addCharacter "block_pipe.png",
                x: startX + margin, y: 45, w: 104, h: 122, absolute: true, at: opts.at,
                callback: (character) -> character.setAnchorPoint 0, 0

                addCharacter "block_pipe.png",
                x: startX + 2*margin, y: 45, w: 104, h: 122, absolute: true, at: opts.at,
                callback: (character) -> character.setAnchorPoint 0, 0
            else
                startX = 80
                margin = 180
                return [
                    addCharacter "block_pipe.png",
                    x: startX, y: 45, w: 104, h: 122, absolute: true, at: opts.at,
                    callback: (character) -> character.setAnchorPoint 0, 0

                    addCharacter "block_pipe.png",
                    x: startX + margin, y: 45, w: 104, h: 122, absolute: true, at: opts.at,
                    callback: (character) -> character.setAnchorPoint 0, 0

                    addCharacter "block_pipe.png",
                    x: startX + (2 * margin), y: 45, w: 104, h: 122, absolute: true, at: opts.at,
                    callback: (character) -> character.setAnchorPoint 0, 0

                    addCharacter "block_pipe.png",
                    x: startX + (3 * margin), y: 45, w: 104, h: 122, absolute: true, at: opts.at,
                    callback: (character) -> character.setAnchorPoint 0, 0
                ]

                # addCharacter "game_frame.png", x: 0, y: 2, w: 40, h: -20, at: opts.at

addCharacter =  (image, opts) ->
    character = new lime.Sprite
    character.setFill "assets/images/#{image}"
    if opts.absolutePosition? is true or opts.absolute? is true
        posX = opts.x
        posY = opts.y
    else
        posX = sceneCenterX + opts.x
        posY = sceneCenterY + opts.y

    # if opts.absoluteSize? is true or opts.absolute? is true
    #     width=opts.w
    #     height=opts.h
    # else
    #     width = sceneWidth+opts.w
    #     height = sceneHeight+opts.h
    if opts.w?
        width = opts.w
    if opts.h?
        height = opts.h

    weight = weight || 100

    character.setPosition posX, posY if opts.x? and opts.y?
    character.setSize width, height if opts.w? and opts.h?
    opts.at.appendChild character, weight
    opts.callback?(character)
    character.name = opts.name if opts.name?

    return character


timerManager = (opts = {} ) ->
    counter = opts.limit or 10
    delay = opts.delay or 1000
    decreaseBy = opts.decreaseBy or 1
    opts?.runningCallback?(counter)
    counter = counter - 1
    do ->
        callbackFactory.timer = (dt) ->
            unless counter > 0
                opts?.timeoutCallback?(counter) if counter <= 0
            else
                opts?.runningCallback?(counter)
            counter = counter - decreaseBy
        lime.scheduleManager.scheduleWithDelay(callbackFactory.timer, opts.limeScope or callbackFactory, delay)
    return addTime: (time) ->
        counter += time
        opts?.runningCallback?(counter)


buildSetOfAnimation = (col=3, opts = {}) ->
    imageLayer = new lime.Layer
    goog.array.shuffle catching.blockPatternIdx
    local_blockPattern = catching.blockPatternIdx[0]
    goog.array.shuffle catching.blockPatternIdx
    correctIdx = local_blockPattern[0]
    randomManager = do randomItemManager

    file = randomManager.getAt(correctIdx)

    questionBalloon = addCharacter "bubble-big-blue.png"
        x: -80
        y: 100
        at: opts.questionLayer
        absolutePosition: true


    questionImage = addCharacter file,
        x: 10,
        y: -20,
        at: opts.questionLayer
        absolutePosition: true
    questionImage.setOpacity(0)

    questionText = new lime.Label().setText(meta_data[file].text).setPosition(10,45).setFontSize(19).setFontColor('#FFF').setOpacity(0)
    opts.questionLayer.appendChild questionText

    opts.questionLayer.setAnchorPoint(0,1).setPosition(150,450)

    characterSound = meta_data[file].sound

    # Fade in and fade out
    Delay1 = new lime.animation.Delay().setDuration(1.0)
    FadeIn = new lime.animation.FadeTo(1).setDuration(0.3)
    Delay2 = new lime.animation.Delay().setDuration(1.5)
    FadeOut = new lime.animation.FadeTo(0).setDuration(0.1)

    FadeInOut = new lime.animation.Sequence(Delay1, FadeIn, Delay2, FadeOut)
    FadeInOut.addTarget questionText
    FadeInOut.addTarget questionImage

    # Move Up and Fade out
    FirstSpawn = new lime.animation.Spawn(new lime.animation.ScaleTo(1), new lime.animation.FadeTo(1))
    DelaySpawn = new lime.animation.Delay().setDuration(1.9)
    SecondSpawn = new lime.animation.Spawn(new lime.animation.ScaleTo(0), new lime.animation.FadeTo(0).setDuration(1))

    moveUpOut = new lime.animation.Sequence(FirstSpawn, DelaySpawn, SecondSpawn)
    questionBalloon.setScale(0).setAnchorPoint(0,1)
    moveUpOut.addTarget questionBalloon

    playSound = ->
        this.stop()
        this.play()
    lime.scheduleManager.scheduleWithDelay playSound, characterSound, 600, 1
    FadeInOut.play()
    moveUpOut.play()

    row = 0
    @items = []
    row = 3
    for x in [0...col]
        for y in [0...row]
            flatIdx = x*row+y
            if -1 is local_blockPattern.indexOf flatIdx then  continue
            item = addCharacter randomManager.getItem(), x: -sceneCenterX, y: -sceneCenterY, at: imageLayer, Idx: flatIdx, name: "Image #{flatIdx}"
            if col is 3
                startX = 175
                margin = 225
                positionX = startX + (x*margin)
                positionY = y*100-150
            else
                startX = 135
                margin = 180

                positionX = startX + (x * margin)
                positionY = y*100-150

            item.setPosition positionX, positionY
            do (item, flatIdx) ->
                # item.fill_.image_.style.cursor = "hand"
                item.domClassName = goog.getCssName('lime-button');

                listen_key = goog.events.listen item, ['click', 'touchstart'], (e) ->
                    that = this
                    if flatIdx is correctIdx
                        goog.array.forEach catching.events  , (e, i) ->
                            goog.events.removeAll e
                        runningSchedule = answerAnimationFactory.pop()
                        lime.scheduleManager.unschedule runningSchedule.callback, runningSchedule.scope
                        catching.score.add()
                        moveUpOut = new lime.animation.Spawn(new lime.animation.MoveBy(0, -250), new lime.animation.FadeTo(0)).setDuration(1)

                        correctArrow = addCharacter "correct.png",
                            x: that.position_.x
                            y: that.position_.y + imageLayer.position_.y
                            absolute: true
                            at: opts.background
                            callback: (character) -> character.setScale(0.7)
                        correctArrow.runAction(moveUpOut)
                        do (correctArrow) ->
                            callback = ->
                                correctArrow.setHidden(true)
                                imageLayer.removeAllChildren()
                                spawnQuestionAndAnswer questionLayer: opts.questionLayer, background: opts.background
                            setTimeout callback, 500
                    else
                        wrongArrow = addCharacter "wrong.png",
                            x: that.position_.x
                            y: that.position_.y
                            absolute: true
                            at: imageLayer
                            callback: (character) -> character.setScale(0.7)
                        moveUp = new lime.animation.MoveBy(0, -100).setDuration(0.8)
                        # moveUp.addTarget(wrongArrow).play()

                        goog.events.removeAll that
                        position = that.position_
                        x = position.x
                        y = position.y
                        moveUpOut = new lime.animation.Spawn(new lime.animation.MoveTo(x, y-200), new lime.animation.FadeTo(0)).setDuration(1)
                        that.setHidden(true)
                        wrongArrow.runAction(moveUpOut)
                items.push item
                catching.events.push item

    imageLayer.row_ = row
    imageLayer


spawnQuestionAndAnswer = (opts) ->
    background = opts.background
    col = if catching.level is 'hard' then 4 else 3;
    questionLayer = opts.questionLayer
    questionLayer.removeAllChildren()
    imageLayer = buildSetOfAnimation col, questionLayer: questionLayer, background: background
    background.appendChild imageLayer, 1
    background.appendChild questionLayer

    delayFunc = ->
        # Animate
        velocity = 0.1;
        animate01 = (dt) ->
            position = this.getPosition()
            position.y += velocity * dt # if dt is bigger we just move more
            if position.y > 600
                goog.array.forEach catching.events, (e) ->
                    goog.events.removeAll e
                runningSchedule = answerAnimationFactory.pop()
                lime.scheduleManager.unschedule runningSchedule.callback, runningSchedule.scope
                imageLayer.removeAllChildren()
                spawnQuestionAndAnswer background: background, questionLayer: questionLayer if catching.isGameEnded is false
            @setPosition position

        answerAnimationFactory.push callback: animate01, scope: imageLayer
        do (velocity, imageLayer) ->
            lime.scheduleManager.schedule(animate01, imageLayer)

    lime.scheduleManager.scheduleWithDelay(delayFunc, imageLayer, 2000, 1)

#catching
catching.start = ->
    catching.director = new lime.Director document.body, sceneWidth, sceneHeight
    try
        catching.theme = new lime.audio.Audio("assets/sound/theme-song.mp3")
        catching.theme.baseElement.loop = true;
    catch e
        console?.log? e
    scene = catching.intro()

catching.intro = ->
    catching.isGameEnded = false
    catching.scenes = []
    scene = new lime.Scene
    catching.scenes.push scene
    background = new lime.Layer

    goog.object.forEach meta_data, (item, idx) ->
        item.sound = new lime.audio.Audio item.sound


    # goog.object.forEach catching.sound, (item) -> item.baseElement.load()

    scene.appendChild background

    addCharacter "scene_bg.png", x: 2, y: 10, at: background, callback: (character) -> character.setScale(0.99)
    addCharacter "boy.png", x: -230, y: 170, at: background, callback: (character) -> character.setScale(0.8)
    addCharacter "girl.png", x: -60, y: 150, at: background, callback: (character) -> character.setScale(0.8)
    addCharacter "postbox.png", x: 250, y: 100, at: background, callback: (character) -> character.setScale(0.9)
    addCharacter "game_bg.png", x: 0, y: 0, at: background, w: sceneWidth, h: sceneHeight
    addCharacter "game_frame.png", x: -2, y: 5, at: background, callback: (character) -> character.setScale(0.95, 0.9)
    addCharacter "title_1.png", x: 0, y: -180, at: background, callback: (character) -> character.setScale (0.9)
    addCharacter "title_2.png", x: 0, y: -75, at: background, callback: (character) -> character.setScale (0.9)


    btnState1 = new lime.Sprite().setFill 'assets/images/btn_start_normal.png'
    btnState2 = new lime.Sprite().setFill 'assets/images/btn_start_active.png'


    btnStart = new lime.Button(btnState1, btnState2).setPosition(sceneCenterX + 235, sceneCenterY + 200).setScale(0.9)

    background.appendChild btnStart
    catching.director.replaceScene scene

    goog.events.listen btnStart, ['click', 'touchstart'], ->
        do catching.selectLevel

catching.selectLevel = ->
    scene = new lime.Scene
    catching.scenes.push scene
    background = new lime.Layer
    scene.appendChild background

    # setUp part: 'gameFrame', at: background
    # boy  = addCharacter "boy.png", x: -280, y: 170, at: background
    # girl = addCharacter "girl.png", x: -100, y: 200, at: background
    # postbox = addCharacter "postbox.png", x: 350, y: 150, at: background
    # addCharacter "game_frame.png", x: 0, y: 0, w: 40, h: -20, at: background
    # title1 = addCharacter "title_1.png", x: 0, y: -200, at: background
    # title2 = addCharacter "title_2.png", x: 0, y: -75, at: background


    addCharacter "scene_bg.png", x: 2, y: 10, at: background, callback: (character) -> character.setScale(0.99)
    boy = addCharacter "boy.png", x: -230, y: 170, at: background, callback: (character) -> character.setScale(0.8)
    girl = addCharacter "girl.png", x: -60, y: 150, at: background, callback: (character) -> character.setScale(0.8)
    postbox = addCharacter "postbox.png", x: 250, y: 100, at: background, callback: (character) -> character.setScale(0.9)
    addCharacter "game_bg.png", x: 0, y: 0, at: background, w: sceneWidth, h: sceneHeight
    addCharacter "game_frame.png", x: -2, y: 5, at: background, callback: (character) -> character.setScale(0.95, 0.9)
    title1 = addCharacter "title_1.png", x: 0, y: -180, at: background, callback: (character) -> character.setScale (0.9)
    title2 = addCharacter "title_2.png", x: 0, y: -75, at: background, callback: (character) -> character.setScale (0.9)

    boyAction = new lime.animation.Spawn(
        new lime.animation.MoveBy(-40, 0).enableOptimizations(),
        new lime.animation.FadeTo(100).enableOptimizations()
    );


    moveTitleUp = new lime.animation.MoveBy(0, -30).setDuration(0.8).enableOptimizations()
    moveTitleUp.addTarget title1
    moveTitleUp.addTarget title2
    moveTitleUp.play()


    girlAction = new lime.animation.Spawn(
        new lime.animation.MoveBy(300, 0).enableOptimizations(),
        new lime.animation.FadeTo(100).enableOptimizations()
    );

    postboxAction = new lime.animation.Spawn(
        new lime.animation.FadeTo(100).enableOptimizations()
        new lime.animation.FadeTo(0).enableOptimizations()
    );

    girl.runAction(girlAction.setDuration(0.8))
    postbox.runAction(postboxAction.setDuration(0.6))
    boy.runAction(boyAction.setDuration(0.8))

    buttonLayer = new lime.Layer
    fadeIn = new lime.animation.FadeTo(100);

    btnEasyState1 = new lime.Sprite().setFill 'assets/images/btn-lv1.png'
    btnEasyState2 = new lime.Sprite().setFill 'assets/images/btn-lv1-hover.png'
    buttonEasy = new lime.Button(btnEasyState1, btnEasyState2).setPosition(sceneCenterX, sceneCenterY)

    btnLv2State1 = new lime.Sprite().setFill 'assets/images/btn-lv2.png'
    btnLv2State2 = new lime.Sprite().setFill 'assets/images/btn-lv2-hover.png'
    buttonHard = new lime.Button(btnLv2State1, btnLv2State2).setPosition(sceneCenterX, sceneCenterY+100)

    buttonLayer.appendChild buttonEasy
    buttonLayer.appendChild buttonHard
    fadeIn.addTarget(buttonEasy)
    fadeIn.addTarget(buttonHard)
    fadeIn.play()

    scene.appendChild buttonLayer


    goog.events.listen buttonEasy, ['click', 'touchstart'], ->
        catching.score.reset()
        catching.level = 'easy'
        catching.blockPatternIdx = goog.array.map blockPattern, (e, i) -> getIdxMap e
        do catching.secondScene

    goog.events.listen buttonHard, ['click', 'touchstart'], ->
        catching.score.reset()
        catching.level = 'hard'
        catching.blockPatternIdx = goog.array.map blockPatternHard, (e, i) -> getIdxMap e
        do catching.secondScene

    catching.director.replaceScene scene

catching.secondScene = ->
    scene = new lime.Scene
    catching.scenes.push scene
    background = new lime.Layer

    catching.theme.stop()
    catching.theme.play()

    scene.appendChild background

    col = if catching.level is 'easy' then 3 else 4


    addCharacter "scene_bg.png", x: 2, y: 10, at: background, callback: (character) -> character.setScale(0.99)
    addCharacter "game_bg.png", x: 0, y: 0, at: background, w: sceneWidth, h: sceneHeight
    setUp part: 'blockPipe', by: col, at: background
    addCharacter "game_frame.png", x: -2, y: 5, at: background, callback: (character) -> character.setScale(0.95, 0.9)
    clock = addCharacter "clock.png", x: sceneCenterX-85, y: sceneCenterY-120, at: background, name: 'Clock'

    questionLayer = new lime.Layer
    background.appendChild questionLayer

    spawnQuestionAndAnswer background: background, questionLayer: questionLayer

    catching.lblTimer = new lime.Label()
    catching.lblTimer.setSize(50, 50).setFontSize(40).setPosition(clock.position_.x-33, clock.position_.y-5)
    catching.lblTimer.setFontColor '#000'
    scene.appendChild catching.lblTimer
    catching.director.replaceScene scene

    timerManager
        limit: if catching.level is 'hard' then 70 else 80
        delay: 1000
        limeScope: callbackFactory
        runningCallback: (rt) ->
            catching.lblTimer.setText(rt)
        timeoutCallback: (rt) ->
            catching.lblTimer.setText "0 "
            catching.isGameEnded = true
            lime.scheduleManager.unschedule callbackFactory.timer, callbackFactory
            scene = catching.timeoutScene()
            catching.director.replaceScene scene

catching.timeoutScene = () ->
    scene = new lime.Scene
    catching.scenes.push scene
    background = new lime.Layer

    catching.theme.stop()

    addCharacter "scene_bg.png", x: 2, y: 10, at: background, callback: (character) -> character.setScale(0.99)
    addCharacter "game_bg.png", x: 0, y: 0, at: background, w: sceneWidth, h: sceneHeight
    addCharacter "game_frame.png", x: -2, y: 5, at: background, callback: (character) -> character.setScale(0.95, 0.9)

    # Show timeout text
    addCharacter "gameover.png", x: 0, y: 0, at: background, callback: (character) ->
        character.setScale 0
        character.runAction new lime.animation.ScaleTo 1.0

    scene.appendChild background

    changeScene = () -> catching.director.replaceScene catching.lastScene()
    lime.scheduleManager.scheduleWithDelay changeScene, catching, 1500, 1

    return scene


catching.lastScene = () ->
    scene = new lime.Scene
    catching.scenes.push scene
    background = new lime.Layer

    # Show timeout text

    catching.theme.stop()

    addCharacter "scene_bg.png", x: 2, y: 10, at: background, callback: (character) -> character.setScale(0.99)
    addCharacter "boy.png", x: -230, y: 170, at: background, callback: (character) -> character.setScale(0.8)
    addCharacter "girl.png", x: -60, y: 150, at: background, callback: (character) -> character.setScale(0.8)
    addCharacter "game_bg.png", x: 0, y: 0, at: background, w: sceneWidth, h: sceneHeight
    addCharacter "game_frame.png", x: -2, y: 5, at: background, callback: (character) -> character.setScale(0.95, 0.9)

    menu = addCharacter "list.png", x: -225, y: -150, at: background
    title1 = addCharacter "title_1.png", x: -225, y: -260, at: background, callback: (character) -> character.setScale(0.4)
    # menu1 = addCharacter "menu-story.png", x: -225, y: -205, at: background
    menu2 = addCharacter "menu-replay.png", x: -225, y: -141, at: background

    bubble = addCharacter "bubble-point.png", x: 180, y: -80, at: background
    scoreLabel = new lime.Label

    scoreLabel.setText(catching.score.getScore()).setPosition(bubble.position_.x + 10, bubble.position_.y - 36).setFontColor('red').setFontSize(48)
    menu2.domClassName = goog.getCssName('lime-button');

    goog.events.listen menu2, ['click', 'touchstart'], -> catching.intro()

    scene.appendChild background
    scene.appendChild scoreLabel

    return  scene

@catching = catching
@game = catching
@game_func = -> catching

goog.exportSymbol 'catching.start', catching.start