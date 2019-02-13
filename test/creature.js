
function normalfun() {
  console.log('normalfun');
}

function OrganTypy(godcolor, initfun) {
  this.godcolor = godcolor;
  this.initfun = initfun;
}

brain = new OrganTypy([0,50,255],normalfun);
mouth = new OrganTypy([200,0,0],normalfun);
outph = new OrganTypy([200,0,0],normalfun);
stomach = new OrganTypy([255,255,50],normalfun);

function PartType(mainorgan, linkpoints, joints, organs) {
  this.mainorgan = mainorgan;
  this.linkpoints = linkpoints;
  this.joints = joints;
  this.organs = organs;
}

function MouthFoot_PT() {}
MouthFoot_PT.prototype = new PartType(landcatcher, [0], [90, 270], [brain, mouth]);

function OutphFoot_PT() {}
OutphFoot_PT.prototype = new PartType(landcatcher, [0], [90, 270], [stomach, outph]);

mouthfoot = new MouthFoot_PT(10);
outphfoot = new OutphFoot_PT(10);


function Link(startpoint, endpoint) {
  this.startpoint = startpoint;
  this.endpoint = endpoint;
}

var sampleLink = new Link(mouthfoot, outphfoot);


function BodyType(parts, links, partsizes, linklengthes) {
  this.parts = parts;
  this.links = links;
  this.partsizes = partsizes;
  this.linklengthes = linklengthes;
}

var sampleBodyType = new BodyType([mouthfoot, outphfoot], [sampleLink], [5, 5], [5]);


function CreatureType(bodytype) {
  this.bodytype = bodytype;
}

var sampleCreatureType = new CreatureType(sampleBodyType);





























