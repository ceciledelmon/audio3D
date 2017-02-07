var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1500 );

camera.position.z = 600;
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

var geometry = new THREE.ConeBufferGeometry( 120, 150, 4 );
var material = new THREE.MeshPhongMaterial( {color: 0x6D7DFD} );
var cylinder = new THREE.Mesh( geometry, material );
var cylinder2 = new THREE.Mesh( geometry, material );
scene.add( cylinder );
cylinder.position.set(0, -100, 0);
cylinder2.position.set(0, 100, 0);
cylinder.rotateX(Math.PI);
scene.add( cylinder2 );

var usedRings = [];
var pausedRings = [];

var geometry = new THREE.BoxBufferGeometry( 100, 100, 100 );
var edges = new THREE.EdgesGeometry( geometry );
var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
//scene.add( line );

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

function launchRing() {
	if(pausedRings.length == 0){
		var ring = new Ring({});
		scene.add( ring.ringShape );
	}else{
		var ring = pausedRings[0];
		pausedRings.splice(0,1);
		ring.reinit();
	}
	usedRings.push(ring);
}

function render() {
	requestAnimationFrame( render );

  now = Date.now()
  deltaTime =  now - lastTime
  lastTime = now

	for (var ring of usedRings) {
		if (ring.ringShape.scale.x > 0) {
			ring.update();
		}else{
			pausedRings.push(ring);
			usedRings.splice(ring, 1);
		}
	}

	cylinder.rotation.y += 0.005;
  //cylinder2.rotation.y += 0.005;

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

	if (freq2 > 40 && usedRings.length < 60) {
		launchRing();
		console.log(">>"+usedRings.length+"   //   "+pausedRings.length);
	}
  // console.log("1 >>" + freq1);
  //console.log("2 >>" + freq2);
  // console.log("3 >>" + freq3);
  // console.log("4 >>" + freq4);
  // console.log("5 >>" + freq5);
  // console.log("6 >>" + freq6);
  // console.log("7 >>" + freq7);

  //camera.position.y += Math.cos(now*0.001) * 3;
  //camera.position.z += (freq3 - previous) * 2;
  //previous = freq3;
  //position.add( velocity * deltaTime/expectedFPS )

	renderer.render( scene, camera );
}

debug();
render();

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
