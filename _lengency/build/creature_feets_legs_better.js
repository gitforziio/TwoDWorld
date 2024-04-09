
var shouldReword;

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
//          VARS
//-----------------------------------------------------------

//var jonitforce = 999999999999;
var jonitforce = 99999999;


//-----------------------------------------------------------
//          FUNCTIONS
//-----------------------------------------------------------

function footStand(foot) {
    foot.mainpart.body.static = true;
}
function footRest(foot) {
    foot.mainpart.body.static = false;
}
function footRotateLeft(foot) {
    foot.mainpart.body.static = true;
    foot.mainpart.body.rotateLeft(5000);
    foot.mainpart.body.static = false;
}
function footRotateRight(foot) {
    foot.mainpart.body.static = true;
    foot.mainpart.body.rotateRight(5000);
    foot.mainpart.body.static = false;
}


//-----------------------------------------------------------
//          CLASSES
//-----------------------------------------------------------

function makeCircleTex(diameter, fillC, fillA, lineW, lineC, lineA) {
    g = game.add.graphics(0,0);
    g.lineStyle(lineW, lineC, lineA);
    g.beginFill(fillC, fillA);
    g.drawCircle(-gameW, -gameH, diameter);
    g.endFill();
    tex = {};
    tex.diameter = diameter;
    tex.radius = diameter/2;
    tex.texture = g.generateTexture();
    g.visible = false;
    return tex;
}

function makeBarTex(height, fillC, fillA, lineW, lineC, lineA) {
    g = game.add.graphics(0,0);
    g.lineStyle(lineW, lineC, lineA);
    g.beginFill(fillC, fillA);
    g.drawRect(-gameW, -gameH, 2, height);
    g.endFill();
    tex = {};
    tex.height = height;
    tex.texture = g.generateTexture();
    g.visible = false;
    return tex;
}

function computeCircleMass(radius) {
    s = Math.pow(radius,2);
    mass = Math.ceil(s/10);
    return mass;
}

function makeCircleSprite(tex, key) {
    sp = game.add.sprite(gameW/2, gameH/2, tex.texture);
    game.physics.p2.enable([ sp ], true);
    sp.body.setCircle(tex.radius);
    sp.body.mass = computeCircleMass(tex.radius);
    //sp.body.static = true;
    sp.key = key||'nokey';
    sp.tex = tex;
    return sp;
}

function makeBarSprite(tex, key) {
    sp = game.add.sprite(gameW/2, gameH/2, tex.texture);
    game.physics.p2.enable([ sp ], true);
    //sp.body.setRect(tex.height);
    sp.body.mass = Math.ceil(tex.height*2/10);
    //sp.body.static = true;
    sp.key = key||'nokey';
    sp.tex = tex;
    return sp;
}


function makeTorsoAgentPart(diameter, fillC, fillA, lineW, lineC, lineA) {
    torsoTex = makeCircleTex(diameter, fillC, fillA, lineW, lineC, lineA);
    torso = makeCircleSprite(torsoTex);
    torsojointTex = makeCircleTex(10, fillC, fillA, lineW, lineC, lineA);
    torsojoint1 = makeCircleSprite(torsojointTex);
    torsojoint2 = makeCircleSprite(torsojointTex);
    torsojoint3 = makeCircleSprite(torsojointTex);
    torsojoint4 = makeCircleSprite(torsojointTex);
    torsojoint5 = makeCircleSprite(torsojointTex);

    var r=diameter/2+torsojointTex.radius;
    var pi=Math.PI;

    game.physics.p2.createLockConstraint(torso, torsojoint1, [r*Math.cos(4/3*pi), r*Math.sin(4/3*pi)], (4/3)*Math.PI, jonitforce);
    game.physics.p2.createLockConstraint(torso, torsojoint2, [r*Math.cos(5/3*pi), r*Math.sin(5/3*pi)], (5/3)*Math.PI, jonitforce);
    game.physics.p2.createLockConstraint(torso, torsojoint3, [r*Math.cos(1/2*pi), r*Math.sin(1/2*pi)], (1/2)*Math.PI, jonitforce);
    game.physics.p2.createLockConstraint(torso, torsojoint4, [r*Math.cos(1/6*pi), r*Math.sin(1/6*pi)], (1/6)*Math.PI, jonitforce);
    game.physics.p2.createLockConstraint(torso, torsojoint5, [r*Math.cos(5/6*pi), r*Math.sin(5/6*pi)], (5/6)*Math.PI, jonitforce);

    // torso.body.static = false;
    // torsojoint1.body.static = false;
    // torsojoint2.body.static = false;
    // torsojoint3.body.static = false;
    // torsojoint4.body.static = false;
    // torsojoint5.body.static = false;

    torsoAgentPart = {};
    torsoAgentPart.mainpart = torso;
    torsoAgentPart.joint = new Array();
    torsoAgentPart.joint[1] = torsojoint1;
    torsoAgentPart.joint[2] = torsojoint2;
    torsoAgentPart.joint[3] = torsojoint3;
    torsoAgentPart.joint[4] = torsojoint4;
    torsoAgentPart.joint[5] = torsojoint5;

    return torsoAgentPart;
}


function makeFootAgentPart(diameter, fillC, fillA, lineW, lineC, lineA) {
    footTex = makeCircleTex(diameter, fillC, fillA, lineW, lineC, lineA);
    foot = makeCircleSprite(footTex);
    footjointTex = makeCircleTex(10, fillC, fillA, lineW, lineC, lineA);
    footjoint1 = makeCircleSprite(footjointTex);
    //footjoint2 = makeCircleSprite(footjointTex);

    game.physics.p2.createLockConstraint(foot, footjoint1, [0, diameter/2+footjointTex.radius], (1/2)*Math.PI, jonitforce);
    //game.physics.p2.createLockConstraint(foot, footjoint2, [0, -diameter/2-footjointTex.radius], (3/2)*Math.PI, jonitforce);

    foot.body.static = false;
    footjoint1.body.static = false;
    //footjoint2.body.static = false;

    footAgentPart = {};
    footAgentPart.mainpart = foot;
    footAgentPart.joint = new Array();
    footAgentPart.joint[1] = footjoint1;
    //footAgentPart.joint[2] = footjoint2;

    return footAgentPart;
}

function makeBarAgentPart(height, fillC, fillA, lineW, lineC, lineA) {
    barTex = makeBarTex(height, fillC, fillA, lineW, lineC, lineA);
    bar = makeBarSprite(barTex);
    barjointTex = makeCircleTex(10, fillC, fillA, lineW, lineC, lineA);
    barjoint1 = makeCircleSprite(barjointTex);
    barjoint2 = makeCircleSprite(barjointTex);

    game.physics.p2.createLockConstraint(bar, barjoint1, [0, height/2+barjointTex.radius], (1/2)*Math.PI, jonitforce);
    game.physics.p2.createLockConstraint(bar, barjoint2, [0, -height/2-barjointTex.radius], (3/2)*Math.PI, jonitforce);
    //game.physics.p2.createRevoluteConstraint(bar, [bar.x, bar.y], barjoint1, [barjoint1.x,barjoint1.y], jonitforce);
    //game.physics.p2.createRevoluteConstraint(bar, [bar.x, bar.y], barjoint2, [barjoint2.x,barjoint2.y], jonitforce);

    bar.body.static = false;
    barjoint1.body.static = false;
    barjoint2.body.static = false;

    barAgentPart = {};
    barAgentPart.mainpart = bar;
    barAgentPart.joint = new Array();
    barAgentPart.joint[1] = barjoint1;
    barAgentPart.joint[2] = barjoint2;
    return barAgentPart;
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

    game.stage.disableVisibilityChange=true;


    //  Enable p2 physics
    game.physics.startSystem(Phaser.Physics.P2JS);

    torso = makeTorsoAgentPart(50, 0xff0000, 1, 1, 0xff0000, 0.5);

    foot1 = makeFootAgentPart(20, 0x00ff00, 1, 1, 0x00ff00, 0.5);
    foot2 = makeFootAgentPart(20, 0x00ff00, 1, 1, 0x00ff00, 0.5);
    foot4 = makeFootAgentPart(25, 0x0000ff, 1, 1, 0x0000ff, 0.5);
    foot5 = makeFootAgentPart(25, 0x0000ff, 1, 1, 0x0000ff, 0.5);
    game.physics.p2.createLockConstraint(torso.joint[1], foot1.joint[1], [foot1.joint[1].tex.radius+torso.joint[1].tex.radius, 0], (1)*Math.PI, jonitforce);
    game.physics.p2.createLockConstraint(torso.joint[2], foot2.joint[1], [foot2.joint[1].tex.radius+torso.joint[2].tex.radius, 0], (1)*Math.PI, jonitforce);
    game.physics.p2.createLockConstraint(torso.joint[4], foot4.joint[1], [foot4.joint[1].tex.radius+torso.joint[4].tex.radius, 0], (1)*Math.PI, jonitforce);
    game.physics.p2.createLockConstraint(torso.joint[5], foot5.joint[1], [foot5.joint[1].tex.radius+torso.joint[5].tex.radius, 0], (1)*Math.PI, jonitforce);

    mouseTex = makeCircleTex(25, 0xffff00, 1, 1, 0xffffff, 1);
    mouse = makeCircleSprite(mouseTex, 'mouse');
    game.physics.p2.createLockConstraint(mouse, torso.joint[3], [torso.joint[3].tex.diameter, 0], (1)*Math.PI, jonitforce);
    mouse.body.static = false;
    mouse.body.x = 1;



    wwwTex = makeCircleTex(50, 0xffffff, 1, 1, 0x000000, 1);
    www = makeCircleSprite(wwwTex, 'target');
    www.body.static = false;


    //  Check for the block hitting another object
    mouse.body.onBeginContact.add(mouseHit, this);

    //game.input.addMoveCallback(move, this);


}

// function move(pointer, x, y, isDown) {

//     mouse.body.x = x;
//     mouse.body.y = y;
//     line.setTo(organ.x, organ.y, mouse.x, mouse.y);

// }




var foot1moveForward = false;
var foot2moveForward = false;
var foot1moveBackward = false;
var foot2moveBackward = false;

var foot4rotateLeft = false;
var foot5rotateLeft = false;
var foot4rotateRoght = false;
var foot5rotateRight = false;

function makemovement() {
    if (foot1moveForward) {
        foot1.mainpart.body.moveForward(300);
    }
    if (foot2moveForward) {
        foot2.mainpart.body.moveForward(300);
    }
    if (foot1moveBackward) {
        foot1.mainpart.body.moveBackward(300);
    }
    if (foot2moveBackward) {
        foot2.mainpart.body.moveBackward(300);
    }
    if (foot4rotateLeft) {
        foot4.mainpart.body.rotateLeft(700);
    }
    if (foot5rotateLeft) {
        foot5.mainpart.body.rotateLeft(700);
    }
    if (foot4rotateRoght) {
        foot4.mainpart.body.rotateRight(700);
    }
    if (foot5rotateRight) {
        foot5.mainpart.body.rotateRight(700);
    }
}

function agentMove(act) {
    foot1moveForward = false;
    foot2moveForward = false;
    foot1moveBackward = false;
    foot2moveBackward = false;
    foot4rotateLeft = false;
    foot5rotateLeft = false;
    foot4rotateRoght = false;
    foot5rotateRight = false;
    if (act == 1) {
        foot1moveForward = true;
    }
    else if (act == 2) {
        foot1moveBackward = true;
    }
    else if (act == 3) {
        foot2moveForward = true;
    }
    else if (act == 4) {
        foot2moveBackward = true;
    }
    else if (act == 5) {
        foot1moveForward = true;
        foot2moveForward = true;
    }
    else if (act == 6) {
        foot1moveBackward = true;
        foot2moveBackward = true;
    }
    else if (act == 7) {
        foot1moveForward = true;
        foot2moveBackward = true;
    }
    else if (act == 8) {
        foot1moveBackward = true;
        foot2moveForward = true;
    }
    else if (act == 9) {
        foot4rotateLeft = true;
    }
    else if (act == 10) {
        foot4rotateRoght = true;
    }
    else if (act == 11) {
        foot5rotateLeft = true;
    }
    else if (act == 12) {
        foot5rotateRight = true;
    }
    else if (act == 13) {
        foot4rotateLeft = true;
        foot5rotateLeft = true;
    }
    else if (act == 14) {
        foot4rotateRoght = true;
        foot5rotateRight = true;
    }
    else if (act == 15) {
        foot4rotateLeft = true;
        foot5rotateRight = true;
    }
    else if (act == 16) {
        foot4rotateRoght = true;
        foot5rotateLeft = true;
    }
    else {
        stay='none';
    }
    makemovement();
}


function wwwMove(act) {
    if (0 <= act <= 0.2) {
        www.body.moveForward(80);
    }
    else if (0.2 < act <= 0.4) {
        www.body.moveForward(80);
    }
    else if (0.4 < act <= 0.6) {
        www.body.rotateLeft(80);
    }
    else if (0.6 < act <= 0.8) {
        www.body.rotateRight(80);
    }
    else {
    }
}


function mouseHit (body, bodyB, shapeA, shapeB, equation) {

    shouldReword = true;

    rreward = 0;
    if (body)
    {
        if (body.sprite.key == 'target') {
            score += 1;
            rreward = 200;
            agent.learn(rreward);
        }
        else {
            rreward = 0;
        }
    }
    else
    {
        rreward = -10;
        if (action) {
            agent.learn(rreward);
        }
    }

}

var d = 0.001;

function update() {

    wwwMove(Math.random());

    cartDistance = Math.round(Phaser.Math.distance(mouse.x, mouse.y, www.x, www.y))/10;

    rrreward = 0;
    if (1.01*cartDistance < lastDistance) {
        shouldReword = true;
        rrreward = 10;//1;//d;
    }
    else if (cartDistance > 1*lastDistance) {
        shouldReword = true;
        rrreward = -5;//1;//d;
    }
    else {
        rrreward = 0//-1;
    }
    // if (cartDistance < lastDistance) {
    //     d=(lastDistance - cartDistance)*0.1;
    //     rrreward = 10;//d;
    // }
    // else {
    //     rrreward = 0;
    // }

    s1=torso.mainpart.tex.radius;
    s2=torso.mainpart.body.angle;
    s3=Phaser.Math.distance(torso.mainpart.body.x, torso.mainpart.body.y, foot4.mainpart.body.x, foot4.mainpart.body.y);
    s4=Phaser.Math.angleBetween(torso.mainpart.body.x, torso.mainpart.body.y, foot4.mainpart.body.x, foot4.mainpart.body.y);
    s5=Phaser.Math.distance(torso.mainpart.body.x, torso.mainpart.body.y, foot5.mainpart.body.x, foot5.mainpart.body.y);
    s6=Phaser.Math.angleBetween(torso.mainpart.body.x, torso.mainpart.body.y, foot5.mainpart.body.x, foot5.mainpart.body.y);
    s7=Phaser.Math.distance(torso.mainpart.body.x, torso.mainpart.body.y, foot1.mainpart.body.x, foot1.mainpart.body.y);
    s8=Phaser.Math.angleBetween(torso.mainpart.body.x, torso.mainpart.body.y, foot1.mainpart.body.x, foot1.mainpart.body.y);
    s9=Phaser.Math.distance(torso.mainpart.body.x, torso.mainpart.body.y, foot2.mainpart.body.x, foot2.mainpart.body.y);
    s10=Phaser.Math.angleBetween(torso.mainpart.body.x, torso.mainpart.body.y, foot2.mainpart.body.x, foot2.mainpart.body.y);
    s11=Phaser.Math.distance(torso.mainpart.body.x, torso.mainpart.body.y, mouse.body.x, mouse.body.y);
    s12=Phaser.Math.angleBetween(torso.mainpart.body.x, torso.mainpart.body.y, mouse.body.x, mouse.body.y);
    s13=Phaser.Math.distance(www.body.x, www.body.y, mouse.body.x, mouse.body.y);
    s14=Phaser.Math.angleBetween(www.body.x, www.body.y, mouse.body.x, mouse.body.y);
    s15=torso.mainpart.body.x;
    s16=torso.mainpart.body.y;
    s17=gameW;
    s18=gameH;

    s = [s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14,s15,s16,s17,s18];

    var action = agent.act(s);
    agentMove(action);
    time += 1;

    reward = 0;//30-0.1*cartDistance;
    if(rreward){
        reward += rreward;
    }
    if(rrreward){
        reward += rrreward;
    }

    if (shouldReword) {
        agent.learn(reward);
    }

    lastDistance = cartDistance;
    rreward = 0;

    shouldReword = false;

}

function preRender() {
}

function render() {

    game.debug.text("score = "+score, 32, 32);
    //game.debug.text(s4+"  "+s6+"  "+s8+"  "+s10, 32, 64);
    if (shouldReword) {
        game.debug.text(reward, 32, 96);
    }
    game.debug.text(shouldReword, 32, 128);
    game.debug.text(time, 32, 160);

}

