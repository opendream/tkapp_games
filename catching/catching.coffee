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
goog.require 'lime.RoundedRect'
goog.require 'lime.fill.LinearGradient'
goog.require 'lime.animation.Spawn'
goog.require 'lime.animation.FadeTo'
goog.require 'lime.animation.ScaleTo'
goog.require 'lime.animation.MoveTo'
goog.require 'lime.animation.MoveBy'
goog.require 'lime.animation.ScaleBy'

goog.require 'goog.array'
goog.require 'lime.GlossyButton'

sceneWidth = 1024
sceneHeight = 768
sceneCenterX = sceneWidth/2
sceneCenterY = sceneHeight/2

callbackFactory =
    timer: ->

@muteMe = []

answerAnimationFactory = []
nat = {}

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
        0, 0, 1 ], [

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
        0, 1, 1, 1 ], [

        0, 0, 0, 0,
        1, 0, 1, 1,
        1, 1, 1, 0
    ]]


IconItem =
    brother: "item-brother.png"
    buff: "item-buff.png"
    gamesai: "item-gamesai.png"
    grandfather: "item-grandfather.png"
    grandmother: "item-grandmother.png"
    sister: "item-sister.png"
    sister2: "item-sister2.png"
    uncle: "item-uncle.png"
    wolf: "item-wolf.png"


# Helper
randomItemManager = () ->
    size = goog.object.getCount(IconItem)
    IconItemArray = goog.object.getValues IconItem
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
@score = do ->
    _score = 0
    add = () ->
        _score++
        @
    reset = () -> _score = 0
    getScore = -> _score
    { getScore, add, reset }

#animation

setUp = (opts) ->
    switch opts.part
        when "gameFrame"
            addCharacter "scene_bg.png", x: 4, y: -10, w: -150, h: -130, at: opts.at
            addCharacter "game_frame.png", x: 0, y: 0, w: 40, h: -20, at: opts.at
            addCharacter "game_bg.png", x: 0, y: 0, w: 0, h: 0, at: opts.at
        when "blockPipe"
            if opts.by is 3
                startX = 235
                addCharacter "block_pipe.png",
                x: startX, y: 50, w: 104, h: 122, absolute: true, at: opts.at,
                callback: (char) -> char.setAnchorPoint 0, 0

                addCharacter "block_pipe.png",
                x: startX * 2, y: 50, w: 104, h: 122, absolute: true, at: opts.at,
                callback: (char) -> char.setAnchorPoint 0, 0

                addCharacter "block_pipe.png",
                x: startX * 3, y: 50, w: 104, h: 122, absolute: true, at: opts.at,
                callback: (char) -> char.setAnchorPoint 0, 0
            else
                startX = 100
                margin = 245
                return [
                    addCharacter "block_pipe.png",
                    x: startX, y: 50, w: 104, h: 122, absolute: true, at: opts.at,
                    callback: (char) -> char.setAnchorPoint 0, 0

                    addCharacter "block_pipe.png",
                    x: startX + margin, y: 50, w: 104, h: 122, absolute: true, at: opts.at,
                    callback: (char) -> char.setAnchorPoint 0, 0

                    addCharacter "block_pipe.png",
                    x: startX + (2 * margin), y: 50, w: 104, h: 122, absolute: true, at: opts.at,
                    callback: (char) -> char.setAnchorPoint 0, 0

                    addCharacter "block_pipe.png",
                    x: startX + (3 * margin), y: 50, w: 104, h: 122, absolute: true, at: opts.at,
                    callback: (char) -> char.setAnchorPoint 0, 0
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

    if opts.absoluteSize? is true or opts.absolute? is true
        width=opts.w
        height=opts.h
    else
        width = sceneWidth+opts.w
        height = sceneHeight+opts.h

    character.setPosition posX, posY if opts.x? and opts.y?
    character.setSize width, height if opts.w? and opts.h?
    opts.at.appendChild character
    opts.callback?(character)
    character.name = opts.name if opts.name?
    return character


startTimer = (opts = {} ) ->
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


buildSetOfAnimation = (col=3, opts = {}) ->
    imageLayer = new lime.Layer
    startX = 235
    console.log catching.blockPatternIdx
    goog.array.shuffle catching.blockPatternIdx
    local_blockPattern = catching.blockPatternIdx[0]
    goog.array.shuffle catching.blockPatternIdx
    correctIdx = local_blockPattern[0]
    randomManager = do randomItemManager
    question = addCharacter randomManager.getAt(correctIdx),
        x: 100
        y: sceneHeight-200
        at: opts.questionLayer
        absolutePosition: true
        callback: (char) -> char.setAnchorPoint 0, 0
    row = 0
    @items = []
    console.log "COL IS ", col, [0...col]
    row = 3
    for x in [0...col]
        for y in [0...row]
            flatIdx = x*row+y
            console.log flatIdx
            if -1 is local_blockPattern.indexOf flatIdx then  continue
            item = addCharacter randomManager.getItem(), x: -sceneCenterX, y: -sceneCenterY, at: imageLayer, Idx: flatIdx, name: "Image #{flatIdx}"
            if col is 3
                positionX = startX*(x+1)+55
                positionY = 20+y*100
            else
                startX = 155
                margin = 245
                positionX = startX + (x * margin)
                positionY = 20+y*100

            console.log positionX, positionY
            item.setPosition positionX, positionY
            do (item, flatIdx) ->
                # item.fill_.image_.style.cursor = "hand"
                listen_key = goog.events.listen item, ['click', 'touchstart'], (e) ->
                    that = this
                    if flatIdx is correctIdx
                        goog.array.forEach muteMe, (e, i) ->
                            goog.events.removeAll e
                        lime.scheduleManager.unschedule answerAnimationFactory.pop(), imageLayer
                        score.add()
                        moveUp = new lime.animation.MoveBy(0, -120).setDuration(0.4)
                        correctArrow = addCharacter "correct.png", x: that.position_.x, y: that.position_.y, absolute: true, at: imageLayer
                        moveUp.addTarget(correctArrow).play()
                        do ->
                            callback = ->
                                imageLayer.removeAllChildren()
                                spawnQuestionAndAnswer questionLayer: opts.questionLayer, background: opts.background
                            setTimeout callback, 500
                    else
                        wrongArrow = addCharacter "wrong.png", x: that.position_.x, y: that.position_.y, absolute: true, at: imageLayer
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
                muteMe.push item

    imageLayer.row_ = row
    imageLayer


spawnQuestionAndAnswer = (opts) ->
    background = opts.background

    col = if catching.level is 'hard' then 4 else 3;
    console.log col
    questionLayer = opts.questionLayer
    questionLayer.removeAllChildren()
    imageLayer = buildSetOfAnimation col, questionLayer: questionLayer, background: background
    background.appendChild imageLayer
    background.appendChild questionLayer
    # Animate
    velocity = 0.1;
    animate01 = (dt) ->
        position = @getPosition()
        position.y += velocity * dt # if dt is bigger we just move more
        if position.y > 700
            goog.array.forEach muteMe, (e) ->
                goog.events.removeAll e
            lime.scheduleManager.unschedule answerAnimationFactory.pop(), imageLayer
            imageLayer.removeAllChildren()
            spawnQuestionAndAnswer background: background, questionLayer: questionLayer
        @setPosition position

    answerAnimationFactory.push animate01

    setUp part: 'blockPipe', by: col, at: background
    addCharacter "game_frame.png", x: 0, y: 0, w: 40, h: -20, at: background
    do (velocity, imageLayer) ->
        lime.scheduleManager.schedule(animate01, imageLayer)



#catching
catching.start = ->
    catching.director = new lime.Director document.body, sceneWidth, sceneHeight
    #var introScene = new lime.Scene
    #var modeScene = new lime.Scene
    #var gameScene = new lime.Scene
    #var summaryScene = new lime.Scene
    scene = catching.intro()
    # set current scene active

catching.intro = ->
    scene = new lime.Scene
    background = new lime.Layer

    smoke = [
        new lime.Sprite().setFill('assets/images/smoke-1.png')
        new lime.Sprite().setFill('assets/images/smoke-2.png')
        new lime.Sprite().setFill('assets/images/smoke-3.png')
        new lime.Sprite().setFill('assets/images/smoke-4.png')
    ]

    scene.appendChild background

    # new lime.animation.FadeTo(0).addTarget(smoke[0]).play()
    # new lime.animation.FadeTo(0).addTarget(smoke[1]).play()
    # new lime.animation.FadeTo(0).addTarget(smoke[2]).play()
    # new lime.animation.FadeTo(0).addTarget(smoke[3]).play()

    setUp part: 'gameFrame', at: background
    addCharacter "boy.png", x: -280, y: 170, at: background
    addCharacter "girl.png", x: -100, y: 200, at: background
    addCharacter "postbox.png", x: 350, y: 150, at: background
    addCharacter "title_1.png", x: 0, y: -200, at: background
    addCharacter "title_2.png", x: 0, y: -75, at: background


    btnState1 = new lime.Sprite().setFill 'assets/images/btn_start_normal.png'
    btnState2 = new lime.Sprite().setFill 'assets/images/btn_start_active.png'


    btnStart = new lime.Button(btnState1, btnState2).setPosition(sceneCenterX + 300, sceneCenterY + 260).setScale 1.3

    background.appendChild btnStart
    catching.director.replaceScene scene

    goog.events.listen btnStart, ['click', 'touchstart'], ->
        do catching.selectLevel

catching.selectLevel = ->
    scene = new lime.Scene
    background = new lime.Layer
    scene.appendChild background

    setUp part: 'gameFrame', at: background
    boy  = addCharacter "boy.png", x: -280, y: 170, at: background
    girl = addCharacter "girl.png", x: -100, y: 200, at: background
    postbox = addCharacter "postbox.png", x: 350, y: 150, at: background
    addCharacter "game_frame.png", x: 0, y: 0, w: 40, h: -20, at: background
    title1 = addCharacter "title_1.png", x: 0, y: -200, at: background
    title2 = addCharacter "title_2.png", x: 0, y: -75, at: background

    boyAction = new lime.animation.Spawn(
        new lime.animation.MoveTo(boy.position_.x-60, boy.position_.y),
        new lime.animation.FadeTo(100)
    );


    moveTitleUp = new lime.animation.MoveBy(0, -80).setDuration(0.8)
    moveTitleUp.addTarget title1
    moveTitleUp.addTarget title2
    moveTitleUp.play()


    girlAction = new lime.animation.Spawn(
        new lime.animation.MoveTo(girl.position_.x+480, girl.position_.y),
        new lime.animation.FadeTo(100)
    );

    postboxAction = new lime.animation.Spawn(
        new lime.animation.FadeTo(100)
        new lime.animation.FadeTo(0)
    );

    girl.runAction(girlAction.setDuration(0.8))
    postbox.runAction(postboxAction.setDuration(0.6))
    boy.runAction(boyAction.setDuration(0.8))

    buttonLayer = new lime.Layer
    fadeIn = new lime.animation.FadeTo(100);

    btnEasyState1 = new lime.Sprite().setFill 'assets/images/btn-lv1.png'
    btnEasyState2 = new lime.Sprite().setFill 'assets/images/btn-lv1-hover.png'
    buttonEasy = new lime.Button(btnEasyState1, btnEasyState2).setPosition(sceneCenterX, sceneCenterY-50)

    btnLv2State1 = new lime.Sprite().setFill 'assets/images/btn-lv2.png'
    btnLv2State2 = new lime.Sprite().setFill 'assets/images/btn-lv2-hover.png'
    buttonHard = new lime.Button(btnLv2State1, btnLv2State2).setPosition(sceneCenterX, sceneCenterY+50)

    buttonLayer.appendChild buttonEasy
    buttonLayer.appendChild buttonHard
    fadeIn.addTarget(buttonEasy)
    fadeIn.addTarget(buttonHard)
    fadeIn.play()

    scene.appendChild buttonLayer


    goog.events.listen buttonEasy, ['click', 'touchstart'], ->
        score.reset()
        catching.level = 'easy'
        catching.blockPatternIdx = goog.array.map blockPattern, (e, i) -> getIdxMap e
        console.log catching.blockPatternIdx
        do catching.secondScene

    goog.events.listen buttonHard, ['click', 'touchstart'], ->
        score.reset()
        catching.level = 'hard'
        catching.blockPatternIdx = goog.array.map blockPatternHard, (e, i) -> getIdxMap e
        console.log catching.blockPatternIdx
        do catching.secondScene



    catching.director.replaceScene scene

catching.secondScene = ->
    scene = new lime.Scene
    background = new lime.Layer

    scene.appendChild background

    setUp part: 'gameFrame', at: background
    clock = addCharacter "clock.png", x: sceneCenterX-100, y: sceneCenterY-140, at: background, name: 'Clock'

    questionLayer = new lime.Layer
    background.appendChild questionLayer

    spawnQuestionAndAnswer background: background, questionLayer: questionLayer

    catching.lblTimer = new lime.Label()
    catching.lblTimer.setSize(50, 50).setFontSize(40).setPosition(clock.position_.x-33, clock.position_.y-5)
    catching.lblTimer.setFontColor '#000'
    scene.appendChild catching.lblTimer
    catching.director.replaceScene scene

    startTimer
        limit: if catching.level is 'hard' then 70 else 80
        delay: 1000
        limeScope: nat
        runningCallback: (rt) ->
            catching.lblTimer.setText(rt)
        timeoutCallback: (rt) ->
            catching.lblTimer.setText "0 "
            lime.scheduleManager.unschedule nat.scheduleWithDelay, nat
            scene = catching.lastScene()

            catching.director.replaceScene scene

            # catching.director.setPaused true


catching.lastScene = () ->
    scene = new lime.Scene
    background = new lime.Layer
    setUp part: 'gameFrame', at: background
    menu = addCharacter "list.png", x: -295, y: -170, at: background
    menu.setScale 1.2
    title1 = addCharacter "title_1.png", x: -295, y: -310, at: background
    title1.setScale 0.5
    menu1 = addCharacter "menu-story.png", x: -295, y: -230, at: background
    menu1.setScale 1.3
    menu2 = addCharacter "menu-replay.png", x: -295, y: -156, at: background
    menu2.setScale 1.3
    boy  = addCharacter "boy.png", x: -280, y: 170, at: background
    girl = addCharacter "girl.png", x: -100, y: 200, at: background
    bubble = addCharacter "bubble-point.png", x: 180, y: -80, at: background
    bubble.setScale 1.4
    scoreLabel = new lime.Label

    scoreLabel.setText(score.getScore()).setPosition(bubble.position_.x + 10, bubble.position_.y - 36).setFontColor('red').setFontSize(48)

    scene.appendChild background
    scene.appendChild scoreLabel

    return  scene

@catching = catching
