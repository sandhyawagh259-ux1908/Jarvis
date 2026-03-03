window.addEventListener("load", windowLoadHandler, false);

var sphereRad = 180;
var radius_sp = 1;

function windowLoadHandler() {
  canvasApp();
}

function canvasSupport() {
  return !!document.createElement("canvas").getContext;
}

function canvasApp() {
  if (!canvasSupport()) return;

  var theCanvas = document.getElementById("canvasOne");
  var context = theCanvas.getContext("2d");

  var displayWidth;
  var displayHeight;
  var projCenterX;
  var projCenterY;

  var timer;
  var wait;
  var count;
  var numToAddEachFrame;
  var particleList;
  var recycleBin;
  var particleAlpha;
  var r, g, b;
  var fLen;
  var m;
  var zMax;
  var turnAngle;
  var turnSpeed;
  var sphereCenterX, sphereCenterY, sphereCenterZ;
  var particleRad;
  var zeroAlphaDepth;
  var randAccelX, randAccelY, randAccelZ;
  var gravity;
  var rgbString;

  var p, nextParticle;
  var sinAngle, cosAngle;
  var rotX, rotZ;
  var depthAlphaFactor;
  var i, theta, phi, x0, y0, z0;

  /* =======================
     ✅ RESIZE CANVAS (ADDED)
     ======================= */
  function resizeCanvas() {
    theCanvas.width = window.innerWidth;
    theCanvas.height = window.innerHeight;
    displayWidth = theCanvas.width;
    displayHeight = theCanvas.height;
    projCenterX = displayWidth / 2;
    projCenterY = displayHeight / 2;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  init();

  function init() {
    wait = 1;
    count = wait - 1;
    numToAddEachFrame = 12;

    r = 0;
    g = 120;
    b = 255;
    particleAlpha = 1;
    rgbString = `rgba(${r},${g},${b},`;

    fLen = 320;
    zMax = fLen - 2;

    particleList = {};
    recycleBin = {};

    randAccelX = 0.1;
    randAccelY = 0.1;
    randAccelZ = 0.1;

    gravity = 0;
    particleRad = 2;

    sphereCenterX = 0;
    sphereCenterY = 0;
    sphereCenterZ = -3 - sphereRad;

    zeroAlphaDepth = -750;

    turnSpeed = (2 * Math.PI) / 1800;
    turnAngle = 0;

    timer = setInterval(onTimer, 1000 / 60);
  }

  function onTimer() {
    count++;
    if (count >= wait) {
      count = 0;
      for (i = 0; i < numToAddEachFrame; i++) {
        theta = Math.random() * 2 * Math.PI;
        phi = Math.acos(Math.random() * 2 - 1);

        x0 = sphereRad * Math.sin(phi) * Math.cos(theta);
        y0 = sphereRad * Math.sin(phi) * Math.sin(theta);
        z0 = sphereRad * Math.cos(phi);

        var p = addParticle(
          x0,
          y0,
          sphereCenterZ + z0,
          0.002 * x0,
          0.002 * y0,
          0.002 * z0
        );

        p.attack = 50;
        p.hold = 50;
        p.decay = 100;
        p.initValue = 0;
        p.holdValue = particleAlpha;
        p.lastValue = 0;
        p.stuckTime = 90 + Math.random() * 20;
        p.accelX = 0;
        p.accelY = gravity;
        p.accelZ = 0;
      }
    }

    turnAngle = (turnAngle + turnSpeed) % (2 * Math.PI);
    sinAngle = Math.sin(turnAngle);
    cosAngle = Math.cos(turnAngle);

    context.clearRect(0, 0, displayWidth, displayHeight);

    p = particleList.first;
    while (p != null) {
      nextParticle = p.next;
      p.age++;

      if (p.age > p.stuckTime) {
        p.velX += randAccelX * (Math.random() * 2 - 1);
        p.velY += randAccelY * (Math.random() * 2 - 1);
        p.velZ += randAccelZ * (Math.random() * 2 - 1);
        p.x += p.velX;
        p.y += p.velY;
        p.z += p.velZ;
      }

      rotX = cosAngle * p.x + sinAngle * (p.z - sphereCenterZ);
      rotZ = -sinAngle * p.x + cosAngle * (p.z - sphereCenterZ) + sphereCenterZ;

      m = radius_sp * fLen / (fLen - rotZ);
      p.projX = rotX * m + projCenterX;
      p.projY = p.y * m + projCenterY;

      depthAlphaFactor = 1 - rotZ / zeroAlphaDepth;
      depthAlphaFactor = Math.max(0, Math.min(1, depthAlphaFactor));

      context.shadowBlur = 15;
      context.shadowColor = "rgba(0,150,255,0.9)";
      context.fillStyle = rgbString + depthAlphaFactor + ")";

      context.beginPath();
      context.arc(p.projX, p.projY, m * particleRad, 0, Math.PI * 2);
      context.fill();

      p = nextParticle;
    }
  }

  function addParticle(x0, y0, z0, vx0, vy0, vz0) {
    var newParticle = {};
    newParticle.x = x0;
    newParticle.y = y0;
    newParticle.z = z0;
    newParticle.velX = vx0;
    newParticle.velY = vy0;
    newParticle.velZ = vz0;
    newParticle.age = 0;

    if (!particleList.first) {
      particleList.first = newParticle;
      newParticle.next = null;
      newParticle.prev = null;
    } else {
      newParticle.next = particleList.first;
      particleList.first.prev = newParticle;
      particleList.first = newParticle;
      newParticle.prev = null;
    }

    return newParticle;
  }
}