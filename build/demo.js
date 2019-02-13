

// draw agents sight
// for(var ei=0,ne=a.eyes.length;ei<ne;ei++) {
//   var e = a.eyes[ei];
//   var sr = e.sensed_proximity;
//   if(e.sensed_type === -1 || e.sensed_type === 0) {
//     ctx.strokeStyle = "rgb(200,200,200)"; // wall or nothing
//   }
//   if(e.sensed_type === 1) { ctx.strokeStyle = "rgb(255,150,150)"; } // apples
//   if(e.sensed_type === 2) { ctx.strokeStyle = "rgb(150,255,150)"; } // poison
//   ctx.beginPath();
//   ctx.moveTo(a.op.x, a.op.y);
//   ctx.lineTo(a.op.x + sr * Math.sin(a.oangle + e.angle),
//              a.op.y + sr * Math.cos(a.oangle + e.angle));
//   ctx.stroke();
// }



// ----------------------------------------------------
//                     Run Mode
// ----------------------------------------------------

var backgroundColor = '#ffffff';
var disableVisibilityChange = true;
var showBodyDebug = true;

var time = 0;

var gameW = 800;
var gameH = 600;

var worldW = 20480;
var worldH = 20480;

// ----------------------------------------------------
//                     Utilities
// ----------------------------------------------------

// A 2D vector utility
var Vec = function(x, y) {
    this.x = x;
    this.y = y;
}
Vec.prototype = {

    // utilities
    dist_from: function(v) { return Math.sqrt(Math.pow(this.x-v.x,2) + Math.pow(this.y-v.y,2)); },
    length: function() { return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2)); },
    
    // new vector returning operations
    add: function(v) { return new Vec(this.x + v.x, this.y + v.y); },
    sub: function(v) { return new Vec(this.x - v.x, this.y - v.y); },
    rotate: function(a) {  // CLOCKWISE
    return new Vec(this.x * Math.cos(a) + this.y * Math.sin(a), -this.x * Math.sin(a) + this.y * Math.cos(a));
    },

    // in place operations
    scale: function(s) { this.x *= s; this.y *= s; },
    normalize: function() { var d = this.length(); this.scale(1.0/d); }
}


// get option
var getopt = function(opt, field_name, default_value) {
    if(typeof opt === 'undefined') { return default_value; }
    return (typeof opt[field_name] !== 'undefined') ? opt[field_name] : default_value;
}

// computeCircleMass
var massOfCircle = function(radius) {return Math.ceil(Math.pow(radius,2)/10);}
var massOfBar = function(height, width) {return Math.ceil(height*width/10);}





// ----------------------------------------------------
//                     Varibles
// ----------------------------------------------------

var pi=Math.PI;


var default_joint_force = 9999999999;

// default graphic varibles
var default_line_width = 3;
var default_bar_width = 2;
var default_joint_diameter = 10;

var default_fill_color = 0xffffff;
var default_fill_alpha = 1;
var default_line_color = 0x000000;
var default_line_alpha = 0.5;

// default colorings
var default_coloring = {};
default_coloring.white = {
    fillC: 0xffffff,
    fillA: 1,
    lineC: 0x000000,
    lineA: 0.5,
}
default_coloring.black = {
    fillC: 0x000000,
    fillA: 1,
    lineC: 0xffffff,
    lineA: 0.5,
}
default_coloring.gray = {
    fillC: 0x888888,
    fillA: 1,
    lineC: 0x000000,
    lineA: 0.5,
}
default_coloring.grey = {
    fillC: 0x888888,
    fillA: 1,
    lineC: 0xffffff,
    lineA: 0.5,
}
default_coloring.red = {
    fillC: 0xff0000,
    fillA: 1,
    lineC: 0xff0000,
    lineA: 0.5,
}
default_coloring.green = {
    fillC: 0x00ff00,
    fillA: 1,
    lineC: 0x00ff00,
    lineA: 0.5,
}
default_coloring.blue = {
    fillC: 0x0000ff,
    fillA: 1,
    lineC: 0x0000ff,
    lineA: 0.5,
}
default_coloring.yellow = {
    fillC: 0xffff00,
    fillA: 1,
    lineC: 0xffff00,
    lineA: 0.5,
}
default_coloring.purple = {
    fillC: 0xff00ff,
    fillA: 1,
    lineC: 0xff00ff,
    lineA: 0.5,
}
default_coloring.cyan = {
    fillC: 0x00ffff,
    fillA: 1,
    lineC: 0x00ffff,
    lineA: 0.5,
}
default_coloring.default1 = default_coloring.red;
default_coloring.default2 = default_coloring.green;
default_coloring.default3 = default_coloring.blue;


// ----------------------------------------------------
//                  Maker Functions
// ----------------------------------------------------

var circleTex = function(diameter, lineW, coloring) {
    fillC = getopt(coloring, 'fillC', default_fill_color);
    fillA = getopt(coloring, 'fillA', default_fill_alpha);
    lineC = getopt(coloring, 'lineC', default_line_color);
    lineA = getopt(coloring, 'lineA', default_line_alpha);
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

var barTex = function(height, lineW, coloring, width) {
    fillC = getopt(coloring, 'fillC', default_fill_color);
    fillA = getopt(coloring, 'fillA', default_fill_alpha);
    lineC = getopt(coloring, 'lineC', default_line_color);
    lineA = getopt(coloring, 'lineA', default_line_alpha);
    width = width || default_bar_width;
    g = game.add.graphics(0,0);
    g.lineStyle(lineW, lineC, lineA);
    g.beginFill(fillC, fillA);
    g.drawRect(-gameW, -gameH, width, height);
    g.endFill();
    tex = {};
    tex.height = height;
    tex.width = width;
    tex.texture = g.generateTexture();
    g.visible = false;
    return tex;
}

var circleSprite = function(x, y, tex, key) {
    sp = game.add.sprite(x, y, tex.texture);
    game.physics.p2.enable([ sp ], showBodyDebug);
    sp.body.setCircle(tex.radius);
    sp.body.mass = massOfCircle(tex.radius);
    sp.body.static = true; //将身体组合之前，让它处于不受力的状态。
    sp.key = key || 'nokey';
    sp.tex = tex;
    return sp;
}

var barSprite = function(x, y, tex, key) {
    sp = game.add.sprite(x, y, tex.texture);
    game.physics.p2.enable([ sp ], showBodyDebug);
    sp.body.mass = massOfBar(tex.height, tex.width);
    sp.body.static = true; //将身体组合之前，让它处于不受力的状态。
    sp.key = key||'nokey';
    sp.tex = tex;
    return sp;
}


// ----------------------------------------------------
//                      BodyPart
// ----------------------------------------------------


function CircleBodyPart(name, diameter) {
    this.name = name;
    this.diameter = diameter;
    this.radius = diameter/2;
}
CircleBodyPart.prototype = {
    make: function(x, y, lineW, coloring, key) {
        this.tex = circleTex(this.diameter, lineW, coloring);
        this.sprite = circleSprite(x, y, this.tex, key);
        //this.sprite.body.static = false; //将身体组合之后，要从不受力状态恢复为受力状态。
    },
}



function CircleTorso(name, diameter, jointNum) {
    this.name = name;
    this.diameter = diameter;
    this.radius = diameter/2;
    this.jointNum = jointNum;
    this.joints = [];
    this.jointConstraints = [];
}
CircleTorso.prototype = {
    make: function(x, y, lineW, coloring, key) {
        this.tex = circleTex(this.diameter, lineW, coloring);
        this.sprite = circleSprite(x, y, this.tex, key);
        for (var i=0; i<this.jointNum; i++) {
            this.joints[i] = {};
            a = i * 2*pi/this.jointNum;
            a -= 0*pi/2;
            o = new Vec(x, y);
            v0 = new Vec(0, this.radius+default_joint_diameter/2);
            v1 = v0.rotate(a);
            v = v1.add(o);
            this.joints[i].tex = circleTex(default_joint_diameter, lineW, default_coloring.white);
            if (i===0) {this.joints[i].tex = circleTex(default_joint_diameter, lineW, default_coloring.gray);}
            this.joints[i].sprite = circleSprite(v.x, v.y, this.joints[i].tex, (key+'_joint_'+i));
            this.jointConstraints[i] = game.physics.p2.createLockConstraint(this.sprite, this.joints[i].sprite, [v1.x, v1.y], (pi-a), default_joint_force);
        }
        for (i in this.joints) {
            this.joints[i].sprite.body.static = false;
        }
        this.sprite.body.static = false; //将身体组合之后，要从不受力状态恢复为受力状态。
        this.mainjoint = this.joints[0];
    },
    setStatic: function(s) {
        this.sprite.body.static = s;
        this.mainjoint.sprite.body.static = s;
        for (var i=0; i<this.jointNum; i++) {
            this.joints[i].sprite.static = s;
        }
    }
}


function Chain(name, diameter, jointNum) {
    this.name = name;
    this.diameter = diameter;
    this.jointNum = jointNum;
    this.joints = [];
    this.jointConstraints = [];
}
Chain.prototype = {
    make: function(x, y, lineW, coloring, key) {
        this.tex = circleTex(this.diameter, lineW, default_coloring.red);
        this.sprite = circleSprite(x, y, this.tex, key);
        this.joints[0] = {};
        this.joints[0].tex = circleTex(default_joint_diameter, lineW, coloring);
        this.joints[0].sprite = circleSprite(x, y, this.joints[0].tex, (key+'_joint_0'));
        this.jointConstraints[0] = game.physics.p2.createLockConstraint(this.sprite, this.joints[0].sprite, [0, default_joint_diameter], 0, default_joint_force);
        for (var i=1; i<this.jointNum; i++) {
            this.joints[i] = {};
            this.joints[i].tex = circleTex(default_joint_diameter, lineW, coloring);
            this.joints[i].sprite = circleSprite(x, y+i*default_joint_diameter, this.joints[i].tex, (key+'_joint_'+i));
            this.jointConstraints[i] = game.physics.p2.createLockConstraint(this.joints[i-1].sprite, this.joints[i].sprite, [0, default_joint_diameter], 0, default_joint_force);
        }
        for (i in this.joints) {
            this.joints[i].sprite.body.static = false;
        }
        this.sprite.body.static = false; //将身体组合之后，要从不受力状态恢复为受力状态。 
        this.mainjoint = this.joints[this.joints.length-1];
    },
    setStatic: function(s) {
        this.sprite.body.static = s;
        this.mainjoint.sprite.body.static = s;
        for (var i=0; i<this.jointNum; i++) {
            this.joints[i].sprite.static = s;
        }
    }
}



// ----------------------------------------------------
//                    CreatureBody
// ----------------------------------------------------


function CreatureBody(name, torso) {
    this.name = name;
    this.torso = torso;
    this.parts = [torso];
    this.jointConstraints = [];
}
CreatureBody.prototype = {
    addpart: function(part,i) {
        for (x in this.parts) {
            this.parts[x].setStatic(true);
        }
        this.jointConstraints.push(game.physics.p2.createLockConstraint(this.torso.joints[i].sprite, part.mainjoint.sprite, [0, -(this.torso.joints[i].tex.radius+part.mainjoint.tex.radius)], 0, default_joint_force));
        this.parts.push(part);
        for (x in this.parts) {
            this.parts[x].setStatic(false);
        }
    }
}





// ----------------------------------------------------
//                      Phaser
// ----------------------------------------------------

var game = new Phaser.Game(gameW, gameH, Phaser.CANVAS, 'worldbox', { preload: preload, create: create, update: update, render: render });

function preload() {

    //  Enable p2 physics
    game.physics.startSystem(Phaser.Physics.P2JS);

    game.stage.backgroundColor = backgroundColor;
    game.stage.disableVisibilityChange = disableVisibilityChange;

}

function create() {
    game.world.setBounds(0, 0, worldW, worldH);

    ball = new CircleTorso('ball', 25, 5);
    ball.make(worldW/2, worldH/2, default_line_width, default_coloring.black, 'ball');
    chain1 = new Chain('chain', 6, 10);
    chain1.make(worldW/2, worldH/2, default_line_width, default_coloring.purple, 'chain');
    chain2 = new Chain('chain', 6, 10);
    chain2.make(worldW/2, worldH/2, default_line_width, default_coloring.purple, 'chain');
    chain3 = new Chain('chain', 6, 10);
    chain3.make(worldW/2, worldH/2, default_line_width, default_coloring.purple, 'chain');
    chain4 = new Chain('chain', 6, 10);
    chain4.make(worldW/2, worldH/2, default_line_width, default_coloring.purple, 'chain');
    chain5 = new Chain('chain', 6, 10);
    chain5.make(worldW/2, worldH/2, default_line_width, default_coloring.purple, 'chain');

    chainCreature = new CreatureBody('chainCreature',ball);
    chainCreature.addpart(chain1,0);
    chainCreature.addpart(chain2,1);
    chainCreature.addpart(chain3,2);
    chainCreature.addpart(chain4,3);
    chainCreature.addpart(chain5,4);


    game.camera.follow(ball.sprite);

}

function update() {
    time++;
}


function preRender() {
}

function render() {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.text(time, 32, gameH-32);

}















