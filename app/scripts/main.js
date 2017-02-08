var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1500 );

camera.position.z = 800;
camera.lookAt(scene.position);

var clock = new THREE.Clock();

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
//renderer.setClearColor( 0xffffff, 1 );
document.body.appendChild( renderer.domElement );

// Controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.addEventListener( 'change', render ); // remove when using animation loop
// enable animation loop when using damping or autorotation
//controls.enableDamping = true;
//controls.dampingFactor = 0.25;
controls.enableZoom = true;

// White directional light at half intensity shining from the top.
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8);
scene.add( directionalLight );
directionalLight.position.set(300,0,300);

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );


//pyramides

var geometry = new THREE.ConeBufferGeometry( 120, 150, 4 );
var material = new THREE.MeshPhongMaterial( {color: 0x6D7DFD, shading:THREE.FlatShading} );
var cylinder = new THREE.Mesh( geometry, material );
var cylinder2 = new THREE.Mesh( geometry, material );
scene.add( cylinder );
cylinder.position.set(0, -100, 0);
cylinder2.position.set(0, 100, 0);
cylinder2.rotation.y = Math.PI/4;
cylinder.rotateX(Math.PI);
scene.add( cylinder2 );

var planes = [];
//1 ere face pyramide

var options = {
  'start': {
    x: -80,
    y: 100,
  },
  'moves': [0, 260, 80, 100, -50, 100] ,
  'rotateX': -0.6,
  'x': 0,
  'position': 0,
  'sens': 0,
}

var plane1 = new BassPlan(options);
scene.add( plane1.group );
planes.push(plane1);

//2 eme face pyramide

var options2 = {
  'start': {
    x: -80,
    y: 100,
  },
  'moves': [0, 260, 80, 100, -50, 100] ,
  'rotateX': 0.6,
  'x': -600,
  'position': 1,
  'sens': 0,
}
var plane2 = new BassPlan(options2);
scene.add( plane2.group );
planes.push(plane2);
//3 eme face pyramide

var options3 = {
  'start': {
    x: -80,
    y: 50,
  },
  'moves': [0, 210, 80, 50, -50, 50] ,
  'rotateX': Math.PI+0.6,
  'x': 0,
  'position': 1,
  'sens': 1,
}
var plane3 = new BassPlan(options3);
scene.add( plane3.group );
planes.push(plane3);

var options4 = {
  'start': {
    x: -80,
    y: 50,
  },
  'moves': [0, 210, 80, 50, -50, 50] ,
  'rotateX': Math.PI-0.6,
  'x': 0,
  'position': 0,
  'sens': 1,
}
var plane4 = new BassPlan(options4);
scene.add( plane4.group );
planes.push(plane4);



var geometry = new THREE.BoxBufferGeometry( 100, 100, 100 );
var edges = new THREE.EdgesGeometry( geometry );
var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
//scene.add( line );

//real shit starts here

var usedRings = [];
var pausedRings = [];

var audioFactor = 300;
var freq1, freq2, freq3, freq4, freq5, freq6, freq7, freq8, freqTriangle;
var resonanceFreq1 = 1;
var resonanceFreq2 = 1;
var resonanceFreq3 = 1;
var resonanceFreq4 = 1;
var resonanceFreq5 = 1;
var resonanceFreq6 = 1;

var now = Date.now();
var lastTime = now;
var deltaTime = 16;
var expectedFPS = 1000 / 60; // 60 fps

addSpectrumVisualiser();

AudioManager.start({
    microphone: false,
    track: '/sounds/nu'
});

var previous = 100;

function launchRing(up) {
  if (up) {
    var options = {
      'rotation': cylinder2.rotation.y,
      'up': up,
    }
  }else {
    var options = {
      'rotation': cylinder.rotation.y,
      'up': up,
    }
  }
	if(pausedRings.length == 0){
		var ring = new Ring(options);
		scene.add( ring.ringShape );
	}else{
		var ring = pausedRings[0];
		pausedRings.splice(0,1);
		ring.reinit(options);
	}
	usedRings.push(ring);
}


function render() {
	requestAnimationFrame( render );

  now = Date.now()
  deltaTime =  now - lastTime
  lastTime = now

	for (var ring in usedRings) {
		if (usedRings[ring].ringShape.scale.x > 0) {
      if (usedRings[ring].up) {
        usedRings[ring].update({'rotation': cylinder2.rotation.y});
      }else {
        usedRings[ring].update({'rotation': cylinder.rotation.y});
      }

		}else{
			pausedRings.push(usedRings[ring]);
			usedRings.splice(ring, 1);
		}
	}

  updateFrequencyData();
  drawSpectrum(10);

  freq1 = getFreqRange(10, 20)*resonanceFreq1;
  freq2 = getFreqRange(20, 30)*resonanceFreq2;
  freqTriangle = getFreqRange(45, 55)*resonanceFreq3;
  freq3 = getFreqRange(85, 110)*resonanceFreq3;
  freq4 = getFreqRange(120, 140)*resonanceFreq4;
  freq5 = getFreqRange(140, 155)*resonanceFreq5;
  freq6 = getFreqRange(155, 190)*resonanceFreq6;
  freq7 = getFreqRange(191, 250)*resonanceFreq6;
  var limit = 100
	if (freq1 > limit && usedRings.length < limit) {
		launchRing(true);
		// console.log("UP >>"+usedRings.length+"   //   "+pausedRings.length);
	}
  if (freq2 > limit-20 && usedRings.length < limit) {
    launchRing(false);
    //console.log("DOWN >>"+usedRings.length+"   //   "+pausedRings.length);
  }
  // console.log("DOWN >>"+usedRings.length+"   //   "+pausedRings.length);
  // console.log("1 >>" + freq1);
  //console.log("2 >>" + freq2);
  // console.log("3 >>" + freq3);
  // console.log("4 >>" + freq4);
  // console.log("5 >>" + freq5);
  // console.log("6 >>" + freq6);
  // console.log("7 >>" + freq7);


  //console.log(">> "+cylinder.rotation.y+"    >>"+cylinder2.rotation.y+" >>");
  for (var plane of planes) {
    if (plane.position) {
      var frequence = -freq3;
    }else {
      var frequence = freq3;
    }
    if (plane.sens) {
      var rotation = cylinder2.rotation.y;

      plane.group.rotation.y -= 0.005;
      if (plane.position) {
        frequence = -frequence;
        plane.group.position.x = Math.cos(rotation)*((300*(frequence/100+1)));
        plane.group.position.z = Math.sin(rotation)*((300*(frequence/100+1)));
        plane.group.position.y = -(100*(Math.abs(frequence)/100));
      }else {
        plane.group.position.x = -Math.cos(rotation)*((300*(frequence/100+1)));
        plane.group.position.z = -Math.sin(rotation)*((300*(frequence/100+1)));
        plane.group.position.y = -(100*(Math.abs(frequence)/100));
      }

    }else {
      var rotation = -cylinder.rotation.y;
      plane.group.rotation.y += 0.005;
      plane.group.position.x = Math.cos(rotation)*((300*(frequence/100+1)));
      plane.group.position.z = Math.sin(rotation)*((300*(frequence/100+1)));
      plane.group.position.y = (100*(Math.abs(frequence)/100));
    }


  }

  updateRotation(cylinder);
  updateRotation(cylinder2)

  //camera mouvement
  // camera.position.y += Math.cos(now*0.001) * 3;
  // camera.position.z += (freq3 - previous) * 2;
  // previous = freq3;
  //position.add( velocity * deltaTime/expectedFPS )

	renderer.render( scene, camera );
}

function updateRotation(shape) {
  if (shape.rotation.y < Math.PI * 2) {
    shape.rotation.y += 0.005;
  }else{
    shape.rotation.y = 0;
  }
}

//debug();
render();
setInterval(function(){
    //console.log(usedRings.length,pausedRings.length);
},500)
function debug() {
  var min = 0.01
  var max = 600

  var axis = {
    x: new THREE.Mesh(new THREE.BoxGeometry(max,min,min), new THREE.LineBasicMaterial({color: '#ff0000', linewidth: 14})),
    y: new THREE.Mesh(new THREE.BoxGeometry(min,max,min), new THREE.LineBasicMaterial({color: '#00ff00', linewidth: 14})),
    z: new THREE.Mesh(new THREE.BoxGeometry(min,min,max), new THREE.LineBasicMaterial({color: '#0000ff', linewidth: 14})),
  }

  axis.x.position.x = max / 2
  axis.x.position.y = min / 2
  axis.x.position.z = min / 2

  axis.y.position.x = min / 2
  axis.y.position.y = max / 2
  axis.y.position.z = min / 2

  axis.z.position.x = min / 2
  axis.z.position.y = min / 2
  axis.z.position.z = max / 2

  scene.add(axis.x)
  scene.add(axis.y)
  scene.add(axis.z)
}
