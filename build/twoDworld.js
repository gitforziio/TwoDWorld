
var time = 0;

var gameW = 800;
var gameH = 600;

var stay = 'stay';

var score = 0;
var reward = 0;
var rreward;
var action;

var s = [0,0,0,0,0,0,0,0];



var lastDistance = gameH;
var cartDistance = gameH;




var game = new Phaser.Game(gameW, gameH, Phaser.CANVAS, 'worldbox', { preload: preload, create: create, update: update, render: render });

//-----------------------------------------------------------
//          FUNCTIONS
//-----------------------------------------------------------

function getmess(radius) {
    s = Math.pow(radius,2);
    mess = Math.ceil(s/10);
    return mess;
}

//-----------------------------------------------------------
//          CLASSES
//-----------------------------------------------------------

function makeCircleTex(diameter, fillC, fillA, lineW, lineC, lineA) {
    g = game.add.graphics(0,0);
    g.lineStyle(lineW, lineC, lineA);
    g.beginFill(fillC, fillA);
    g.drawCircle(-gameW, -gameH, diameter)
    g.endFill();
    tex = {};
    tex.diameter = diameter;
    tex.radius = diameter/2;
    tex.texture = g.generateTexture()
    return tex;
}

function makeCircleSprite(tex, key) {
    sp = game.add.sprite(tex.diameter, tex.diameter, tex.texture);
    game.physics.p2.enable([ sp ], true);
    sp.body.setCircle(tex.radius);
    sp.body.mess = getmess(tex.radius);
    sp.key = key;
    return sp;
}



//-----------------------------------------------------------
//          TEXES
//-----------------------------------------------------------



//-----------------------------------------------------------
//          GAME ENGINE
//-----------------------------------------------------------

function preload() {

}

var result = 'Move with the cursors';

function create() {

    //  Enable p2 physics
    game.physics.startSystem(Phaser.Physics.P2JS);

    ballTex = makeCircleTex(50, 0xffffff, 1, 1, 0xffffff, 0.5);
    ball = makeCircleSprite(ballTex, 'ball');

    organTex = makeCircleTex(5, 0xff0000, 1, 1, 0xff0000, 0.5);
    organ = makeCircleSprite(organTex, 'organ');

    var constraint = game.physics.p2.createLockConstraint(ball, organ, [25, 0], 10);


    mouseTex = makeCircleTex(5, 0x000000, 1, 1, 0xffffff, 1);
    mouse = makeCircleSprite(mouseTex, 'mouse');

    mouse.body.static = true;

    wwwTex = makeCircleTex(50, 0xffffff, 1, 1, 0x000000, 1);
    www = makeCircleSprite(wwwTex, 'target');
    www.body.x = gameW/2;
    www.body.y = gameH/2;

    //www.body.static = true;


    mouseSpring = game.physics.p2.createSpring(mouse, organ, 150, 1000, 10);
    line = new Phaser.Line(organ.x, organ.y, mouse.x, mouse.y);

    //  Check for the block hitting another object
    ball.body.onBeginContact.add(ballHit, this);

    //game.input.addMoveCallback(move, this);


    cartDistance = Phaser.Math.distance(ball.x, ball.y, www.x, www.y);

}

// function move(pointer, x, y, isDown) {

//     mouse.body.x = x;
//     mouse.body.y = y;
//     line.setTo(organ.x, organ.y, mouse.x, mouse.y);

// }


function agentMove(act) {
    if (act == 1) {
        if (mouse.body.x + 250 <= gameW) {
            mouse.body.x += 250;
        }
        else {
            mouse.body.x = gameW;
        }
        stay = '       250';
    }
    else if(act == 3) {
        if (mouse.body.x - 250 >= 0) {
            mouse.body.x -= 250;
        }
        else {
            mouse.body.x = 0;
        }
        stay = '       250';
    }
    else if(act == 5) {
        if (mouse.body.y + 250 <= gameH) {
            mouse.body.y += 250;
        }
        else {
            mouse.body.y = gameH;
        }
        stay = '       250';
    }
    else if(act == 7) {
        if (mouse.body.y - 250 >= 0) {
            mouse.body.y -= 250;
        }
        else {
            mouse.body.y = 0;
        }
        stay = '       250';
    }
    else if(act == 2) {
        if (mouse.body.x + 100 <= gameW) {
            mouse.body.x += 100;
        }
        else {
            mouse.body.x = gameW;
        }
        stay = '    100';
    }
    else if(act == 4) {
        if (mouse.body.x - 100 >= 0) {
            mouse.body.x -= 100;
        }
        else {
            mouse.body.x = 0;
        }
        stay = '    100';
    }
    else if(act == 6) {
        if (mouse.body.y + 100 <= gameH) {
            mouse.body.y += 100;
        }
        else {
            mouse.body.y = gameH;
        }
        stay = '    100';
    }
    else if(act == 8) {
        if (mouse.body.y - 100 >= 0) {
            mouse.body.y -= 100;
        }
        else {
            mouse.body.y = 0;
        }
        stay = '    100';
    }
    else if(act == 9) {
        stay = '0';
    }
    else if(act == 10) {
        if (mouse.body.x + 10 <= gameW) {
            mouse.body.x += 10;
        }
        else {
            mouse.body.x = gameW;
        }
        stay = '  10';
    }
    else if(act == 11) {
        if (mouse.body.x - 10 >= 0) {
            mouse.body.x -= 10;
        }
        else {
            mouse.body.x = 0;
        }
        stay = '  10';
    }
    else if(act == 12) {
        if (mouse.body.y + 10 <= gameH) {
            mouse.body.y += 10;
        }
        else {
            mouse.body.y = gameH;
        }
        stay = '  10';
    }
    else if(act == 13) {
        if (mouse.body.y - 10 >= 0) {
            mouse.body.y -= 10;
        }
        else {
            mouse.body.y = 0;
        }
        stay = '  10';
    }
    else if(act == 14) {
        if (mouse.body.x + 1 <= gameW) {
            mouse.body.x += 1;
        }
        else {
            mouse.body.x = gameW;
        }
        stay = ' 1';
    }
    else if(act == 15) {
        if (mouse.body.x - 1 >= 0) {
            mouse.body.x -= 1;
        }
        else {
            mouse.body.x = 0;
        }
        stay = ' 1';
    }
    else if(act == 16) {
        if (mouse.body.y + 1 <= gameH) {
            mouse.body.y += 1;
        }
        else {
            mouse.body.y = gameH;
        }
        stay = ' 1';
    }
    else if(act == 17) {
        if (mouse.body.y - 1 >= 0) {
            mouse.body.y -= 1;
        }
        else {
            mouse.body.y = 0;
        }
        stay = ' 1';
    }
}


function ballHit (body, bodyB, shapeA, shapeB, equation) {

    //  The block hit something.
    //  
    //  This callback is sent 5 arguments:
    //  
    //  The Phaser.Physics.P2.Body it is in contact with. *This might be null* if the Body was created directly in the p2 world.
    //  The p2.Body this Body is in contact with.
    //  The Shape from this body that caused the contact.
    //  The Shape from the contact body.
    //  The Contact Equation data array.
    //  
    //  The first argument may be null or not have a sprite property, such as when you hit the world bounds.
    if (body)
    {
        result = 'You last hit: ' + body.sprite.key;
        if (body.sprite.key == 'target') {
            score += 1;
            rreward = 700;
        }
        else {
            rreward = 0;
        }
    }
    else
    {
        result = 'You last hit: The wall :)';
        rreward = -1;
    }

}


function update() {



    // organ.body.rotateLeft(200);
    line.setTo(organ.x, organ.y, mouse.x, mouse.y);
    s = [organ.x, organ.y, ball.x, ball.y, www.x, www.y, mouse.x, mouse.y, www.body.velocity.x, www.body.velocity.y,  ball.body.velocity.x, ball.body.velocity.y];
    var action = agent.act(s);
    agentMove(action);
    time += 1;

    cartDistance = Phaser.Math.distance(ball.x, ball.y, www.x, www.y);
    if (cartDistance < lastDistance) {
        d=(lastDistance - cartDistance)*0.009;
        reward = d;//5+d;
    }
    else {
        reward = -5;
    }
    if (rreward) {
        reward += rreward;
    }
    agent.learn(reward);

    lastDistance = cartDistance;

}

function preRender() {

    if (line)
    {
        line.setTo(organ.x, organ.y, mouse.x, mouse.y);
    }

}

function render() {

    game.debug.text(ball.body.angle, 32, 160);
    game.debug.text(www.body.angle, 32, 192);
    game.debug.text(stay, 32, 128);
    game.debug.text(stay, 32, 128);
    game.debug.text(reward, 32, 96);
    game.debug.text(score, 32, 32);
    game.debug.text(time, 96, 32);
    game.debug.geom(line);

}

