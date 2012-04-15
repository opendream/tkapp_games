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


sceneWidth = 1024
sceneHeight = 768
sceneCenterX = sceneWidth/2
sceneCenterY = sceneHeight/2


nat = {}


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

catching.secondScene = ->
    scene = new lime.Scene
    background = new lime.Layer

    scene.appendChild background

    setUp part: 'gameFrame', at: background
    setUp part: 'blockPipe', by: 3, at: background
    clock = addCharacter "clock.png", x: sceneCenterX-100, y: sceneCenterY-140, at: background, name: 'Clock'

    # img1 = addCharacter "image_1.png", x: -sceneCenterX, y: -sceneCenterY, at: background, name: 'Image 1'
    # img2 = addCharacter "image_2.png", x: -sceneCenterY+20, y: -sceneCenterY, at: background, name: 'Image 2'

    # imgList = [img1, img2]
    # imgList.forEach (item) ->
    #     do (item) ->
    #         goog.events.listen item, 'click', (e) ->
    #             console.log e.position.x, e.position.y, item, item.name
    #     velocity = 0.01;
    #     lime.scheduleManager.schedule( (dt) ->
    #         position = @getPosition()
    #         position.y += velocity * dt # if dt is bigger we just move more
    #         @setPosition position
    #     , item)

    catching.lblTimer = new lime.Label()
    console.log clock
    catching.lblTimer.setSize(50, 50).setFontSize(40).setPosition(clock.position_.x-32, clock.position_.y-5)
    catching.lblTimer.setFontColor '#000'
    scene.appendChild catching.lblTimer
    catching.director.replaceScene scene

    startTimer
        limit: 30
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