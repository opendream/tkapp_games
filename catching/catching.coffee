#set main namespace
goog.provide 'catching'

#get requirements
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

goog.require 'goog.array'


sceneWidth = 1024
sceneHeight = 768
sceneCenterX = sceneWidth/2
sceneCenterY = sceneHeight/2


nat = {}
blockPattern = [
    [1, 4, 5, 6, 7 ,8],
    [2, 4, 5, 6, 7, 8],
    [0, 2, 3, 5, 6, 8]
    [5, 8],
    # [0..8]
]

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

randomItemManager = () ->
    size = goog.object.getCount(IconItem)
    IconItemArray = goog.object.getValues IconItem
    lastGetIdx = 0
    goog.array.shuffle IconItemArray
    return size: size, getItem: ->
       IconItemArray[lastGetIdx++]


catching.start = ->
    catching.director = new lime.Director document.body, sceneWidth, sceneHeight
    #var introScene = new lime.Scene
    #var modeScene = new lime.Scene
    #var gameScene = new lime.Scene
    #var summaryScene = new lime.Scene
    scene = catching.intro()
    # set current scene active

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

                # addCharacter "game_frame.png", x: 0, y: 2, w: 40, h: -20, at: opts.at

catching.intro = ->
    scene = new lime.Scene
    background = new lime.Layer

    scene.appendChild background

    setUp part: 'gameFrame', at: background
    addCharacter "boy.png", x: -280, y: 180, at: background
    addCharacter "girl.png", x: -100, y: 200, at: background
    addCharacter "postbox.png", x: 350, y: 150, at: background
    addCharacter "title_1.png", x: 0, y: -200, at: background
    addCharacter "title_2.png", x: 0, y: -75, at: background


    btnState1 = new lime.Sprite().setFill 'assets/images/btn_start_normal.png'
    btnState2 = new lime.Sprite().setFill 'assets/images/btn_start_active.png'


    btnStart = new lime.Button(btnState1, btnState2).setPosition(sceneCenterX + 300, sceneCenterY + 260).setScale 1.3

    background.appendChild btnStart
    catching.director.replaceScene scene

    goog.events.listen btnStart, 'click', ->
        do catching.secondScene


startTimer = (opts = {} ) ->
    counter = opts.limit or 10
    delay = opts.delay or 1000
    decreaseBy = opts.decreaseBy or 1
    opts?.runningCallback?(counter)
    counter = counter - 1

    do ->
        nat.scheduleWithDelay = (dt) ->
            unless counter > 0
                opts?.timeoutCallback?(counter) if counter <= 0
            else
                opts?.runningCallback?(counter)
            counter = counter - decreaseBy
        lime.scheduleManager.scheduleWithDelay(nat.scheduleWithDelay, opts.limeScope or {}, delay)


buildSetOfAnimation = (col=3) ->
    imageLayer = new lime.Layer
    startX = 235
    goog.array.shuffle blockPattern
    blockPattern = blockPattern[0]
    goog.array.shuffle blockPattern
    correctIdx = blockPattern[0]

    randomManager = do randomItemManager

    if col is 3
        for x in [0..2]
            for y in [0..2]
                flatIdx = x*col+y
                if -1 is blockPattern.indexOf flatIdx then continue
                item = addCharacter randomManager.getItem(), x: -sceneCenterX, y: -sceneCenterY, at: imageLayer, Idx: flatIdx, name: "Image #{flatIdx}"
                positionX = startX*(x+1)+50
                positionY = 20+y*100
                item.setPosition positionX, positionY
                do (item, flatIdx) ->
                    goog.events.listen item, 'click', (e) ->
                        if flatIdx is correctIdx
                            console.log "CORRECT", flatIdx
                        else
                            console.log "INCORRECT", flatIdx
    imageLayer


catching.secondScene = ->
    scene = new lime.Scene
    background = new lime.Layer

    scene.appendChild background

    setUp part: 'gameFrame', at: background
    setUp part: 'blockPipe', by: 3, at: background
    clock = addCharacter "clock.png", x: sceneCenterX-100, y: sceneCenterY-140, at: background, name: 'Clock'

    # imageLayer = new lime.Layer
    imageLayer = do buildSetOfAnimation
    console.log imageLayer

    # img1 = addCharacter item.brother, x: -sceneCenterX, y: -sceneCenterY, at: imageLayer, name: 'Image 1'
    # img2 = addCharacter item.buff, x: -sceneCenterY+20, y: -sceneCenterY, at: imageLayer, name: 'Image 2'


    scene.appendChild imageLayer


    # imgList = [img1, img2]
    # imgList.forEach (item) ->
    #     do (item) ->
    #         goog.events.listen item, 'click', (e) ->
    #             console.log e.position.x, e.position.y, item, item.name


    velocity = 0.05;
    lime.scheduleManager.schedule( (dt) ->
        position = @getPosition()
        position.y += velocity * dt # if dt is bigger we just move more
        @setPosition position
    , imageLayer)

    catching.lblTimer = new lime.Label()
    console.log clock
    catching.lblTimer.setSize(50, 50).setFontSize(40).setPosition(clock.position_.x-33, clock.position_.y-5)
    catching.lblTimer.setFontColor '#000'
    scene.appendChild catching.lblTimer
    catching.director.replaceScene scene

    startTimer
        limit: 80
        delay: 1000
        limeScope: nat
        runningCallback: (rt) ->
            catching.lblTimer.setText(rt)
        timeoutCallback: (rt) ->
            catching.lblTimer.setText "0 "
            console.log "TIME OUT"
            lime.scheduleManager.unschedule nat.scheduleWithDelay, nat
            # catching.director.setPaused true

@catching = catching