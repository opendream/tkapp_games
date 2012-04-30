(function() {
  var clickSound, IconItem, IconText, addCharacter, blockPattern, blockPatternHard, buildSetOfAnimation, callbackFactory, sceneCenterX, sceneCenterY, sceneHeight, sceneWidth, spawnQuestionAndAnswer, startTimer;

  goog.provide('pointConnect');

  goog.require('lime.Director');

  goog.require('lime.Scene');

  goog.require('lime.Layer');

  goog.require('lime.Circle');

  goog.require('lime.Label');

  goog.require('lime.Button');

  goog.require('lime.RoundedRect');

  goog.require('lime.fill.LinearGradient');

  goog.require('lime.animation.Spawn');

  goog.require('lime.animation.Sequence');

  goog.require('lime.animation.FadeTo');

  goog.require('lime.animation.ScaleTo');

  goog.require('lime.animation.MoveTo');

  goog.require('lime.animation.MoveBy');

  goog.require('lime.animation.ScaleBy');

  goog.require('lime.audio.Audio');

  goog.require('goog.array');

  goog.require('lime.GlossyButton');

  sceneWidth = 800;

  sceneHeight = 600;

  sceneCenterX = sceneWidth / 2;

  sceneCenterY = sceneHeight / 2;

  callbackFactory = {
    timer: function() {}
  };

  this.allScenes = [];

  pointConnect.isGameEnded = false;

  this.score = (function() {
    var add, getScore, reset, _score;
    _score = 0;
    add = function() {
      _score+=1;
      return this;
    };
    reset = function() {
      return _score = 0;
    };
    getScore = function() {
      return _score;
    };
    return {
      getScore: getScore,
      add: add,
      reset: reset
    };
  })();



  addCharacter = function(image, opts) {
    var character, height, posX, posY, weight, width;
    character = new lime.Sprite;
    character.setFill("assets/images/" + image);
    if ((opts.absolutePosition != null) === true || (opts.absolute != null) === true) {
      posX = opts.x;
      posY = opts.y;
    } else {
      posX = sceneCenterX + opts.x;
      posY = sceneCenterY + opts.y;
    }
    if (opts.w != null) width = opts.w;
    if (opts.h != null) height = opts.h;
    weight = weight || 100;
    if ((opts.x != null) && (opts.y != null)) character.setPosition(posX, posY);
    if ((opts.w != null) && (opts.h != null)) character.setSize(width, height);
    opts.at.appendChild(character, weight);
    if (typeof opts.callback === "function") opts.callback(character);
    if (opts.name != null) character.name = opts.name;
    return character;
  };

  startTimer = function(opts) {
    var counter, decreaseBy, delay;
    if (opts == null) opts = {};
    counter = opts.limit || 10;
    delay = opts.delay || 1000;
    decreaseBy = opts.decreaseBy || 1;
    if (opts != null) {
      if (typeof opts.runningCallback === "function") {
        opts.runningCallback(counter);
      }
    }
    counter = counter - 1;
    return (function() {
      callbackFactory.timer = function(dt) {
        if (!(counter > 0)) {
          if (counter <= 0) {
            if (opts != null) {
              if (typeof opts.timeoutCallback === "function") {
                opts.timeoutCallback(counter);
              }
            }
          }
        } else {
          if (opts != null) {
            if (typeof opts.runningCallback === "function") {
              opts.runningCallback(counter);
            }
          }
        }
        return counter = counter - decreaseBy;
      };
      return lime.scheduleManager.scheduleWithDelay(callbackFactory.timer, opts.limeScope || callbackFactory, delay);
    })();
  };



  pointConnect.start = function() {
    var scene;
    pointConnect.director = new lime.Director(document.body, sceneWidth, sceneHeight);
    try {
      this.theme = new lime.audio.Audio("assets/sound/theme-song.mp3");
      this.theme.baseElement.loop = true;

    } catch (e) {
      if (typeof console !== "undefined" && console !== null) {
        if (typeof console.log === "function") console.log(e);
      }
    }
    return scene = pointConnect.intro();
  };
  pointConnect.stop = function() { 
      this.theme.stop();
      lime.scheduleManager.unschedule(callbackFactory.timer, callbackFactory);
  };
  pointConnect.intro = function() {
    var background, btnStart, btnState1, btnState2, scene;
    pointConnect.isGameEnded = false;
    this.allScenes = [];
    scene = new lime.Scene;
    allScenes.push(scene);
    background = new lime.Layer;
    var gameNameSound = new lime.audio.Audio("assets/sound/gamename.mp3");
    lime.scheduleManager.callAfter(function(){gameNameSound.play()}, gameNameSound, 500)
    //this.gameNameSound = new lime.audio.Audio("assets/sound/gamename.mp3");
    //this.gameNameSound.play();
    scene.appendChild(background);
    addCharacter("scene_bg.png", {
      x: 2,
      y: 10,
      at: background,
      callback: function(char) {
        return char.setScale(0.8);
      }
    });

    var _arrow = addCharacter("arrow.png", {
      x: 200,
      y: 140,
      at: background,
      callback: function(char) {
        return char.setScale(0.9);
      }
    });
    var click = new lime.Label().setFontSize(23).setFontColor("#FFF").setText("CLICK").setPosition(sceneWidth*0.73,sceneHeight*0.73);
    background.appendChild(click);

    addCharacter("game_bg.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
    addCharacter("game_frame.png", {
      x: -2,
      y: 5,
      at: background,
      callback: function(char) {
        return char.setScale(0.95, 0.9);
      }
    });
    
 

    btnState1 = new lime.Sprite().setFill('assets/images/btn_start_normal.png');
    btnState2 = new lime.Sprite().setFill('assets/images/btn_start_active.png');
    btnStart = new lime.Button(btnState1, btnState2).setPosition(sceneCenterX + 140, sceneCenterY + 200).setScale(0.9);
    background.appendChild(btnStart);
    pointConnect.director.replaceScene(scene);
    _arrow.domClassName = goog.getCssName('lime-button');
    clickSound = new lime.audio.Audio("assets/sound/click.mp3");

    goog.events.listen(_arrow, ['click', 'touchstart'], function() {
      clickSound.play();
      return pointConnect.secondScene();
    });
    goog.events.listen(click, ['click', 'touchstart'], function() {
      clickSound.play();
      return pointConnect.secondScene();
    });
    return goog.events.listen(btnStart, ['click', 'touchstart'], function() {
      clickSound.play();
      return pointConnect.secondScene();
    });
  };


  pointConnect.secondScene = function() {
    var correctSound = new lime.audio.Audio("assets/sound/correct.mp3");
    var background, clock, col, questionLayer, scene, helperCount,frame,wrongPicture,rightPicture,pic1,pic2;
    scene = new lime.Scene;
    allScenes.push(scene);
    background = new lime.Layer;
    this.theme.play();
    scene.appendChild(background);

    addCharacter("sky.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
     addCharacter("game_bg.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
    addCharacter("game_frame.png", {
      x: -2,
      y: 5,
      at: background,
      callback: function(char) {
        return char.setScale(0.95, 0.9);
      }
    });  
    clock = addCharacter("clock.png", {
      x: sceneWidth-80,
      y: 100,
      absolute: true,
      at: background,
      name: 'Clock',
    });
    gameLabel = addCharacter("title_1.png",{
      absolute : true,
      x: 30,
      y: 10,
      at: background,
      w:200,
      h:50,
    });
    //gameLabel.setScale(0.8)
    //GAME SECTION
    //Question
    
    var questions = [
    {
      label:[['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],['2','4','6','8','10','12','14','16','18','20','22','24','26','28','30'],['5','10','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95']],
      position:[
                [
                   {x:113.21243523316059,y:221.50259067357513},
                   {x:144.300518134715,y:187.3056994818653},
                   {x:181.6062176165803,y:160.88082901554407},
                   {x:155.18134715025906,y:146.89119170984458},
                   {x:131.86528497409324,y:118.9119170984456},
                   {x:125.64766839378234,y:84.71502590673575},
                   {x:133.41968911917098,y:45.85492227979276},
                   {x:162.95336787564764,y:16.32124352331607},
                   {x:200.25906735751295,y:6.9948186528497445},
                   {x:234.45595854922277,y:11.658031088082907},
                   {x:263.9896373056995,y:25.647668393782396},
                   {x:231.34715025906735,y:34.97409326424872}
                ],[
                   {x:203.1664212076583,y:78.86597938144331}
                  ,{x:234.0942562592047,y:44.4035346097202}
                  ,{x:273.85861561119293,y:35.56701030927837}
                  ,{x:295.0662739322533,y:70.91310751104567}
                  ,{x:288.880706921944,y:125.69955817378502}
                  ,{x:250.88365243004415,y:159.27835051546396}
                  ,{x:200.51546391752578,y:161.92930780559647}
                  ,{x:196.980854197349,y:173.41678939617088}
                  ,{x:207.58468335787921,y:183.1369661266569}
                  ,{x:196.09720176730485,y:196.3917525773196}
                  ,{x:194.3298969072165,y:242.3416789396171}
                  ,{x:214.6539027982327,y:252.0618556701031}
                  ,{x:204.93372606774665,y:266.20029455081004}
                  ,{x:145.72901325478642,y:263.5493372606775}
                  ,{x:90.9425625920471,y:244.10898379970547}
                ],[
                   {x:410.8247422680413,y:183.1369661266569}
                  ,{x:405.52282768777616,y:211.4138438880707}
                  ,{x:396.6863033873343,y:229.0868924889544}
                  ,{x:376.3622974963181,y:239.69072164948454}
                  ,{x:336.5979381443299,y:191.97349042709868}
                  ,{x:326.87776141384387,y:224.66863033873346}
                  ,{x:318.0412371134021,y:217.59941089837997}
                  ,{x:319.80854197349043,y:251.1782032400589}
                  ,{x:276.5095729013255,y:237.03976435935203}
                  ,{x:287.99705449189986,y:251.1782032400589}
                  ,{x:267.67304860088365,y:256.48011782032404}
                  ,{x:289.7643593519882,y:262.6656848306333}
                ]
      ],
      before:"assets/images/problems/2a.png",
      after:"assets/images/problems/2c.png",
      gameLabel:['ให้ลากเส้นตามตัวอักษรภาษาอังกฤษ','ให้ลากเส้นตามสูตรคูณแม่ 2','ให้ลากเส้นตามสูตรคูณแม่ 5']
    },
    {
      label:[['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],['2','4','6','8','10','12','14','16','18','20','22','24','26','28','30'],['7','14','21','28','35','42','49','56','63','70','77','84']],
      position:[
                [
                  {x:210.23564064801178,y:49.70544918998527}
                  ,{x:234.97790868924886,y:47.054491899852735}
                  ,{x:255.30191458026508,y:30.265095729013268}
                  ,{x:276.5095729013255,y:41.75257731958763}
                  ,{x:281.8114874815906,y:73.5640648011782}
                  ,{x:280.92783505154637,y:106.25920471281296}
                  ,{x:287.11340206185565,y:138.95434462444774}
                  ,{x:323.34315169366715,y:162.81296023564067}
                  ,{x:373.7113402061856,y:172.53313696612668}
                  ,{x:416.1266568483063,y:147.79086892488954}
                  ,{x:446.1708394698086,y:119.51399116347574}
                  ,{x:463.8438880706922,y:128.35051546391753}
                  ,{x:447.9381443298969,y:150.4418262150221}
                  ,{x:474.44771723122244,y:140.7216494845361}
                  ,{x:479.74963181148746,y:171.64948453608247}
                  ,{x:455.89101620029453,y:179.6023564064801}
                  ,{x:478.86597938144325,y:184.02061855670104}
                  ,{x:470.0294550810015,y:199.92636229749633}
                  ,{x:377.2459499263623,y:196.3917525773196}
                  ,{x:361.340206185567,y:230.85419734904275}
                  ,{x:337.4815905743741,y:252.0618556701031}
                ],[
                    {x:106.99481865284974,y:181.0880829015544}
                  ,{x:68.1347150259067,y:125.1295336787565}
                  ,{x:108.54922279792743,y:162.43523316062175}
                  ,{x:97.66839378238339,y:78.49740932642487}
                  ,{x:114.76683937823833,y:137.56476683937825}
                  ,{x:131.86528497409324,y:97.15025906735752}
                  ,{x:127.20207253886008,y:146.89119170984458}
                  ,{x:147.40932642487047,y:137.56476683937825}
                  ,{x:134.97409326424867,y:173.31606217616581}
                  ,{x:167.6165803108808,y:185.75129533678756}
                  ,{x:176.94300518134713,y:215.28497409326428}
                  ,{x:206.4766839378238,y:218.3937823834197}
                ],[
                  {x:148.96373056994815,y:240.15544041450778}
                  ,{x:99.22279792746113,y:257.2538860103627}
                  ,{x:51.03626943005179,y:246.37305699481868}
                  ,{x:16.839378238341936,y:255.699481865285}
                  ,{x:4.404145077720187,y:279.01554404145077}
                  ,{x:35.49222797927459,y:299.22279792746116}
                  ,{x:83.67875647668393,y:305.44041450777206}
                  ,{x:133.41968911917098,y:306.99481865284974}
                  ,{x:164.50777202072538,y:314.76683937823833}
                  ,{x:178.49740932642487,y:333.419689119171}
                  ,{x:267.0984455958549,y:348.9637305699482}
                  ,{x:366.58031088082896,y:336.52849740932646}
                ]
      ],
      before:"assets/images/problems/1a.png",
      after:"assets/images/problems/1c.png",
      gameLabel:['ให้ลากเส้นตามตัวอักษรภาษาอังกฤษ','ให้ลากเส้นตามสูตรคูณแม่ 2','ให้ลากเส้นตามสูตรคูณแม่ 7']
    },
    {
      label:[['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],['2','4','6','8','10','12','14','16','18','20','22','24','26','28','30'],['7','14','21','28','35','42','49','56','63','70','77','84']],
      position:[
                [
                  {x:159.86745213549335,y:191.08983799705453}
                  ,{x:137.77614138438878,y:176.9513991163476}
                  ,{x:142.1944035346097,y:133.65243004418267}
                  ,{x:141.3107511045655,y:96.53902798232696}
                  ,{x:147.49631811487478,y:55.89101620029456}
                  ,{x:167.820324005891,y:24.079528718703983}
                  ,{x:196.980854197349,y:9.057437407952875}
                  ,{x:234.0942562592047,y:7.290132547864516}
                  ,{x:271.20765832106036,y:26.73048600883652}
                  ,{x:289.7643593519882,y:56.77466863033874}
                  ,{x:298.60088365243,y:114.2120765832106}
                  ,{x:310.9720176730486,y:161.92930780559647}
                  ,{x:284.46244477172314,y:184.90427098674525}
                ],[
                  {x:245.33678756476684,y:58.29015544041451}
                  ,{x:253.10880829015542,y:81.60621761658032}
                  ,{x:284.1968911917098,y:90.93264248704665}
                  ,{x:284.1968911917098,y:128.23834196891193}
                  ,{x:270.20725388601034,y:154.66321243523316}
                  ,{x:248.44559585492226,y:170.2072538860104}
                  ,{x:214.24870466321244,y:176.42487046632124}
                  ,{x:209.58549222797927,y:193.52331606217615}
                  ,{x:197.15025906735747,y:229.27461139896377}
                  ,{x:189.37823834196888,y:269.6891191709845}
                  ,{x:218.9119170984456,y:275.90673575129534}
                  ,{x:256.21761658031085,y:271.2435233160622}
                ],
                // [
                //   {x:106.84830633284241,y:334.2415316642121}
                //   ,{x:106.84830633284241,y:345.7290132547865}
                //   ,{x:90.05891016200292,y:345.7290132547865}
                //   ,{x:75.03681885125181,y:343.0780559646539}
                //   ,{x:60.01472754050073,y:351.03092783505156}
                //   ,{x:39.690721649484516,y:346.6126656848307}
                //   ,{x:29.970544918998513,y:329.8232695139912}
                //   ,{x:38.807069219440336,y:309.499263622975}
                //   ,{x:4.3446244477171945,y:292.70986745213554}
                //   ,{x:15.832106038291585,y:272.3858615611193}
                //   ,{x:44.99263622974962,y:299.779086892489}
                //   ,{x:80.33873343151691,y:318.33578792341683}
                // ]
      ],
      before:"assets/images/problems/3a.png",
      after:"assets/images/problems/3c.png",
      gameLabel:['ให้ลากเส้นตามตัวอักษรภาษาอังกฤษ','ให้ลากเส้นตามสูตรคูณแม่ 2','ให้ลากเส้นตามสูตรคูณแม่ 7']
    },
    {
      label:[['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],['2','4','6','8','10','12','14','16','18','20','22','24','26','28','30'],['5','10','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95']],
      position:[
                [
                   {x:285.3460972017673,y:62.07658321060384}
                  ,{x:301.2518409425626,y:132.76877761413846}
                  ,{x:318.9248895434462,y:111.5611192930781}
                  ,{x:343.66715758468337,y:111.5611192930781}
                  ,{x:350.7363770250368,y:136.30338733431518}
                  ,{x:328.64506627393223,y:131.0014727540501}
                  ,{x:346.3181148748159,y:145.13991163475703}
                  ,{x:346.3181148748159,y:167.2312223858616}
                  ,{x:322.45949926362294,y:160.1620029455081}
                  ,{x:341.899852724595,y:176.0677466863034}
                  ,{x:339.24889543446244,y:191.08983799705453}
                  ,{x:328.64506627393223,y:178.71870397643596}
                ],[
                  {x:247.82608695652175,y:64.13043478260869}
                  ,{x:238.04347826086956,y:97.82608695652172}
                  ,{x:227.17391304347825,y:141.30434782608694}
                  ,{x:217.39130434782606,y:142.39130434782606}
                  ,{x:202.17391304347825,y:182.60869565217388}
                  ,{x:211.95652173913044,y:205.43478260869563}
                  ,{x:238.04347826086956,y:208.695652173913}
                  ,{x:264.1304347826087,y:195.65217391304344}
                  ,{x:297.8260869565217,y:213.04347826086956}
                  ,{x:314.1304347826087,y:203.26086956521738}
                  ,{x:318.4782608695652,y:179.3478260869565}
                  ,{x:302.17391304347825,y:141.30434782608694}
                ],[
                  {x:14.476021314387197,y:298.66785079928957}
                  ,{x:63.49911190053285,y:283.7477797513322}
                  ,{x:82.68206039076378,y:298.66785079928957}
                  ,{x:114.65364120781527,y:311.4564831261102}
                  ,{x:160.47957371225579,y:318.91651865008885}
                  ,{x:192.4511545293073,y:311.4564831261102}
                  ,{x:184.99111900532858,y:290.14209591474247}
                  ,{x:149.82238010657193,y:270.95914742451157}
                ]
      ],
      before:"assets/images/problems/4a.png",
      after:"assets/images/problems/4c.png",
      gameLabel:['ให้ลากเส้นตามตัวอักษรภาษาอังกฤษ','ให้ลากเส้นตามสูตรคูณแม่ 2','ให้ลากเส้นตามสูตรคูณแม่ 5']
    },
     {
      label:[['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],['2','4','6','8','10','12','14','16','18','20','22','24','26','28','30','32','34','36','38','40'],['7','14','21','28','35','42','49','56','63','70','77','84']],
      position:[
                [
                  {x:11.524500907440995,y:81.94192377495463}
                  ,{x:3.9019963702359064,y:46.007259528130675}
                  ,{x:39.83666061705986,y:37.29582577132487}
                  ,{x:75.77132486388382,y:24.228675136116152}
                  ,{x:119.32849364791286,y:5.716878402903802}
                  ,{x:170.508166969147,y:41.65154264972776}
                  ,{x:163.97459165154265,y:68.87477313974591}
                  ,{x:187.9310344827586,y:78.67513611615246}
                  ,{x:160.70780399274042,y:88.47549909255898}
                  ,{x:162.8856624319419,y:123.32123411978222}
                  ,{x:151.99637023593465,y:158.16696914700543}
                  ,{x:125.86206896551721,y:179.94555353901995}
                ],[
                  {x:79.42148760330576,y:188.1818181818182}
                  ,{x:56.611570247933884,y:207.02479338842977}
                  ,{x:41.735537190082624,y:232.8099173553719}
                  ,{x:25.867768595041298,y:248.67768595041326}
                  ,{x:16.942148760330554,y:261.57024793388433}
                  ,{x:3.057851239669418,y:297.2727272727273}
                  ,{x:11.983471074380162,y:312.1487603305785}
                  ,{x:50.66115702479337,y:318.099173553719}
                  ,{x:63.55371900826444,y:313.1404958677686}
                  ,{x:71.48760330578511,y:280.41322314049586}
                  ,{x:109.17355371900823,y:279.4214876033058}
                  ,{x:129.0082644628099,y:268.5123966942149}
                  ,{x:114.13223140495865,y:214.95867768595042}
                  ,{x:132.97520661157023,y:227.8512396694215}
                  ,{x:158.76033057851237,y:217.93388429752065}
                  ,{x:172.64462809917353,y:221.90082644628103}
                  ,{x:219.25619834710744,y:208.01652892561987}
                  ,{x:214.29752066115702,y:181.23966942148763}
                ],[
                  {x:159.45454545454544,y:299.45454545454555}
                  ,{x:200.90909090909093,y:302.7272727272728}
                  ,{x:187.8181818181818,y:308.18181818181824}
                  ,{x:197.63636363636363,y:320.18181818181824}
                  ,{x:182.36363636363637,y:316.909090909091}
                  ,{x:186.72727272727275,y:328.909090909091}
                  ,{x:219.4545454545455,y:343.0909090909092}
                  ,{x:243.4545454545455,y:348.5454545454546}
                  ,{x:269.6363636363637,y:336.5454545454546}
                  ,{x:277.2727272727273,y:312.5454545454546}
                  ,{x:317.6363636363637,y:318.00000000000006}
                  ,{x:329.6363636363637,y:322.36363636363643}
                ]
      ],
      before:"assets/images/problems/5a.png",
      after:"assets/images/problems/5c.png",
      gameLabel:['ให้ลากเส้นตามตัวอักษรภาษาอังกฤษ','ให้ลากเส้นตามสูตรคูณแม่ 2','ให้ลากเส้นตามสูตรคูณแม่ 7']
    },
    ];
    
    function getPoint(x,y,i){
        var outterSize = 60;
        var innerSize = 7;
        var pointColor = '#3355ff'
        if(randomIndex == 0){
          pointColor = '#3355ff'
        }else if(randomIndex == 1){
          pointColor = '#f00'
        }else if(randomIndex == 2){
          pointColor = '#0f0'
        }
        var pointLabel = new lime.Label().setText(questions[order[queueIndex]]["label"][randomIndex][i]).setSize(innerSize,innerSize).setPosition(x,y-20).setFontColor(pointColor).setFontSize(10);
        var thePoint = new lime.Circle().setSize(innerSize,innerSize).setFill(pointColor).setPosition(x,y);
        var pointLayer = new lime.Layer();
        //pointLayer.appendChild(pointCover);
        pointLayer.appendChild(thePoint);
        pointLayer.appendChild(pointLabel);
        return {
            point : pointLayer
            ,
            //cover : pointCover
        }
    }

    function line(size, x1, y1, x2, y2){ 
        var dx = Math.abs(x2-x1); 
        var dy = Math.abs(y2-y1); 
        var width = Math.sqrt(dx*dx+dy*dy)+size; 
        return new lime.Sprite().setSize(width, size).setAnchorPoint(size/2/width, .5).setRotation(-Math.atan2(y2-y1, x2-x1)*180/Math.PI).setPosition(x1, y1); 
    } 
    var randomIndex
    var questionManager = function(num){

        var pointIndex = 0;
        var question = questions[num];
        randomIndex =  Math.floor(Math.random() * question["position"].length);
        console.log("question[position].length",question["position"].length)
        console.log("randomIndex",randomIndex);
        var questionLength = question["position"][randomIndex].length
        return {
            dragged : function(){
                pointIndex++
            },
            question : question,
            length : questionLength,
            beforeImage : question["before"],
            afterImage : question["after"],
            startPoint : function(){
                return question["position"][randomIndex][pointIndex];
            },
            endPoint : function(){
                if(pointIndex<questionLength)
                    return question["position"][randomIndex][pointIndex+1];
                else
                    return false;
            },
            isEnd : function(){
                 if(pointIndex==questionLength-1)
                    return true
                 else
                    return true
            },
            gameLabel : question["gameLabel"][randomIndex],
            positionList : question["position"]
        }
    }
    var queueIndex
    var order
    var gameManager = function(){
        queueIndex = 0;
        var questionsLength = questions.length
        order = []
        while(order.length < questionsLength){
            var randomnumber=Math.floor(Math.random() * questionsLength);
            var found=false;
            for(var i=0;i<order.length;i++){
              if(order[i]==randomnumber){found=true;break}
            }
            if(!found)order[order.length]=randomnumber;
        }

        return {
            getQuestionManager : function(){
                return questionManager(order[queueIndex]);
            },
            nextQuestion : function(){
                    queueIndex++;
            },
            noGame : function(){
                if(queueIndex >= questionsLength)
                    return true
                else
                    return false
            }
        }
    }

    var thisGame = gameManager();
    var base_x = 150;
    var base_y = 130;
    var points,lines
    var gameLayer = new lime.Layer();
    var thisQuestion
    var afterImage
    var makeGame = function(){
        points = new Array()
        lines = new Array()
        gameLayer = new lime.Layer();
        if(!thisGame.noGame())
          thisQuestion = thisGame.getQuestionManager()
        else 
          return
        beforeImage = new lime.Sprite().setFill(thisQuestion.beforeImage).setPosition(base_x,base_y).setAnchorPoint(0,0).setOpacity(1);
        afterImage = new lime.Sprite().setFill(thisQuestion.afterImage).setPosition(base_x,base_y).setAnchorPoint(0,0).setOpacity(0.01);
        questionLabel = new lime.Label().setFontSize(20).setFontColor("#3355ff").setText(thisQuestion.gameLabel).setPosition(sceneCenterX,sceneCenterY+220)
        gameLayer.appendChild(beforeImage);
        
        //console.log(thisQuestion.length,thisQuestion.beforeImage,thisQuestion.afterImage,thisQuestion.startPoint(),thisQuestion.endPoint())
        //Draw
        var positionList = thisQuestion.positionList
        var lineSize = 3
        //var freeLines = new Array()
        console.log("Drawing Phase")
        //EXTRA LINE
        for(var i = 0 ; i < positionList.length ; i++){
            !function(i){
              if(i!=randomIndex){
                  for(var j = 0 ; j <positionList[i].length ; j++){
                        !function(i,j){
                              var xPos = positionList[i][j].x+base_x;
                              var yPos = positionList[i][j].y+base_y;
                              if(j < positionList[i].length - 1){
                                    var xPosNext = positionList[i][j+1].x+base_x;
                                    var yPosNext = positionList[i][j+1].y+base_y;
                                    //console.log(xPos,yPos,xPosNext,yPosNext)
                                    gameLayer.appendChild(line(lineSize,xPos,yPos,xPosNext,yPosNext).setFill('#000'))
                              }
                        }(i,j)
                  }
              }
            }(i)
        }
        //
        for(var i = 0 ; i < positionList[randomIndex].length ; i++ ){
            !function(i){
                var xPos = positionList[randomIndex][i].x+base_x;
                var yPos = positionList[randomIndex][i].y+base_y;
                
                points.push(getPoint(xPos,yPos,i))

                if(i < positionList[randomIndex].length - 1 ){

                    var xPosNext = positionList[randomIndex][i+1].x+base_x;
                    var yPosNext = positionList[randomIndex][i+1].y+base_y;
                    !function(i){
                        lines.push(line(lineSize,xPos,yPos,xPosNext,yPosNext).setFill('#000').setOpacity(0));
                        gameLayer.appendChild(lines[i]);
                    }(i)
                }

                gameLayer.appendChild(points[i].point)
                //console.log(positionList[randomIndex][i].x,positionList[randomIndex][i].y)
            }(i)        
        }

        gameLayer.appendChild(questionLabel);
        background.appendChild(gameLayer);
    }


    var insideCircle = function(num,x,y){

        checkingPoint = questions[order[queueIndex]]["position"][randomIndex][num]
        //console.log(checkingPoint.x,checkingPoint.y)
        if(x > checkingPoint.x-23 && x < checkingPoint.x+23 &&
           y > checkingPoint.y-23 && y < checkingPoint.y+23){
            return true
        }else{
            return false
        }
    }
    var questionControl = function(){
            var startIndex = 0;
            var nextIndex = 1;

                  goog.events.listen(background,['mousedown','touchstart'],function(e){
                        var clickPos = background.screenToLocal(e.screenPosition);
                        //{x:0,y:0},{}
                        console.log("{x:" + (clickPos.x-base_x) + ",y:" + (clickPos.y-base_y) + "}")
                        var startFlag = false;
                        var nextFlag = false;
                        e.swallow(['mousemove','touchmove'],function(e){
                            var pos = background.screenToLocal(e.screenPosition);
                            //console.log("x=",pos.x-base_x,"y=",pos.y-base_y);
                            for(var j = 0 ;j < thisQuestion.length ; j++){
                               !function(j){
                                     if(insideCircle(j,pos.x-base_x,pos.y-base_y)){
                                         //console.log("inside ",j)
                                         if(j == startIndex){
                                            startFlag = true
                                         }
                                         if(startFlag){
                                            if(j == nextIndex){
                                              lines[j-1].setOpacity(1);
                                               nextIndex++;
                                               score.add();
                                               if(nextIndex == thisQuestion.length){
                                                  gameLayer.removeAllChildren();
                                                  beforeImage.setOpacity(0)
                                                  correctSound.stop()
                                                  correctSound.play()
                                                  gameLayer.appendChild(afterImage);
                                                  afterImage.setOpacity(1)
                                                  lime.scheduleManager.callAfter(function(){nextQuestion()},gameLayer,2500)
                                               }
                                            }
                                         }
                                     }
                                }(j)
                            }
                        });
                      e.swallow(['mouseup','touchend'],function(e){
                        startIndex = nextIndex - 1;
                      })
                  });
    }

    var playGame = function(){
        score.add();
        questionControl();
    }
    var nextQuestion = function(){
        thisGame.nextQuestion();
        if(!thisGame.noGame()){ 
            background.removeChild(gameLayer)
            makeGame();
            playGame();
        }
    }
    makeGame();
    playGame();

    gameLabel.setAnchorPoint(0,0);
    pointConnect.lblTimer = new lime.Label();
    pointConnect.lblTimer.setSize(50, 50).setFontSize(40).setPosition(clock.position_.x, clock.position_.y + 20);
    pointConnect.lblTimer.setFontColor('#000');
    scene.appendChild(pointConnect.lblTimer);
    pointConnect.director.replaceScene(scene);
    return startTimer({
      limit: 40,
      delay: 1000,
      limeScope: callbackFactory,
      runningCallback: function(rt) {
        return pointConnect.lblTimer.setText(rt);
      },
      timeoutCallback: function(rt) {
        pointConnect.lblTimer.setText("0 ");
        pointConnect.isGameEnded = true;
        lime.scheduleManager.unschedule(callbackFactory.timer, callbackFactory);
        scene = pointConnect.timeoutScene();
        return pointConnect.director.replaceScene(scene);
      }
    });
  };

  pointConnect.timeoutScene = function() {
    var background, changeScene, scene;
    scene = new lime.Scene;
    allScenes.push(scene);
    background = new lime.Layer;
    this.theme.stop();
    
    addCharacter("game_bg.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
     addCharacter("sky.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
    addCharacter("game_frame.png", {
      x: -2,
      y: 5,
      at: background,
      callback: function(char) {
        return char.setScale(0.95, 0.9);
      }
    });
    addCharacter("gameover.png", {
      x: 0,
      y: 0,
      at: background,
      callback: function(char) {
        char.setScale(0);
        return char.runAction(new lime.animation.ScaleTo(1.0));
      }
    });
  
    scene.appendChild(background);
    changeScene = function() {
      return pointConnect.director.replaceScene(pointConnect.lastScene());
    };
    lime.scheduleManager.scheduleWithDelay(changeScene, pointConnect, 1500, 1);
    return scene;
  };

  pointConnect.lastScene = function() {
    var background, bubble, menu, menu2, scene, scoreLabel, title1;
    scene = new lime.Scene;
    allScenes.push(scene);
    background = new lime.Layer;
    this.theme.stop();
    addCharacter("boy.png", {
      x: -230,
      y: 170,
      at: background,
      callback: function(char) {
        return char.setScale(0.8);
      }
    });
    addCharacter("girl.png", {
      x: -60,
      y: 150,
      at: background,
      callback: function(char) {
        return char.setScale(0.8);
      }
    });
 addCharacter("sky.png", {
      x: 0,
      y: 0,
      at: background,
      w: sceneWidth,
      h: sceneHeight
    });
    addCharacter("game_frame.png", {
      x: -2,
      y: 5,
      at: background,
      callback: function(char) {
        return char.setScale(0.95, 0.9);
      }
    });
    title1 = addCharacter("title_1.png", {
      x: -225,
      y: -260,
      at: background,
      callback: function(char) {
        return char.setScale(0.4);
      }
    });
    menu2bg = addCharacter("replay.png", {
      absolute: true,
      x: sceneCenterX,
      y: sceneCenterY+40,
      at: background
    });
    menu2 = addCharacter("menu-replay.png", {
      absolute: true,
      x: sceneCenterX,
      y: sceneCenterY+40,
      at: background
    });
    bubble = addCharacter("scorebg.png", {
      x: sceneCenterX,
      y: sceneCenterY-100,
      at: background,
      absolute: true
    });
    scoreLabel = new lime.Label;
    scoreLabel.setText(score.getScore()).setPosition(bubble.position_.x + 10, bubble.position_.y + 40).setFontColor('red').setFontSize(40);
    menu2.domClassName = goog.getCssName('lime-button');
    goog.events.listen(menu2, ['click', 'touchstart'], function() {
      return pointConnect.intro();
    });
    scene.appendChild(background);
    scene.appendChild(scoreLabel);
    return scene;
  };

  this.pointConnect = pointConnect;

  goog.exportSymbol('pointConnect.start', pointConnect.start);

  

}).call(this);