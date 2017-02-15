var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1500 );

camera.position.z = 700;
camera.lookAt(scene.position);

camera.position.y += 200;

var click = false;
document.body.addEventListener('click', function(){
  click = true;
})

var clock = new THREE.Clock();

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x1c1c1c, 1 );
document.body.appendChild( renderer.domElement );

// Controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;

// White directional light at half intensity shining from the top.
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8);
scene.add( directionalLight );
directionalLight.position.set(600,0,200);

var light = new THREE.HemisphereLight( 0xffffbb, 0xffffff, 0.5 );
scene.add( light );

//pyramides

var geometry = new THREE.ConeBufferGeometry( 120, 150, 4 );
var material = new THREE.MeshPhongMaterial( {color: 0xD89FFF, shading:THREE.FlatShading} );
var cylinder = new THREE.Mesh( geometry, material );
var cylinder2 = new THREE.Mesh( geometry, material );
addEdges(cylinder);
addEdges(cylinder2);
scene.add( cylinder );
cylinder.position.set(0, -100, 0);
cylinder2.position.set(0, 100, 0);
cylinder2.rotation.y = Math.PI/4;
cylinder.rotateX(Math.PI);
scene.add( cylinder2 );

function addEdges(mesh) {
  var geometry = new THREE.EdgesGeometry( mesh.geometry ); // or WireframeGeometry
  var material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 3 } );
  var edges = new THREE.LineSegments( geometry, material );
  mesh.add( edges ); // add wireframe as a child of the parent mesh
}

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



// now create the individual particles
var particles = [new THREE.TorusGeometry( 200, 10, 0.2, 200, Math.PI * 2),
                new THREE.TorusGeometry( 300, 10, 0.2, 200, Math.PI * 2),
                new THREE.TorusGeometry( 400, 10, 0.2, 200, Math.PI * 2),
                new THREE.TorusGeometry( 500, 10, 0.2, 200, Math.PI * 2),
                new THREE.TorusGeometry( 600, 10, 0.2, 200, Math.PI * 2),
                new THREE.TorusGeometry( 700, 10, 0.2, 200, Math.PI * 2),
                new THREE.TorusGeometry( 800, 10, 0.2, 200, Math.PI * 2),
                ];
var particleSystems = [];

var initialRotation = 0;

for (var i = 0; i < particles.length; i++) {
  createParticles(particles[i], i%2 === 0 ? true : false);
}
for (var i = 0; i < particleSystems.length; i++) {
  scene.add(particleSystems[i]);
}

function createParticles(particlesGeo, inverse) {
  // create the particle variables
  var color = inverse? 0xF6FCAE : 0xFFABE5;
  var pMaterial = new THREE.PointsMaterial({
        color: color,
        size: Math.random()*1+1,
        blending: THREE.AdditiveBlending,
        transparent: true
      });

  var vertices = particlesGeo.vertices;
  for( var v = 0; v < vertices.length; v++ ) {
  		vertices[v].x += (Math.random()*5);
  		vertices[v].x -= (Math.random()*5);
  		vertices[v].y += (Math.random()*200);
  		vertices[v].y -= (Math.random()*200);
  		vertices[v].z += (Math.random()*200);
  		vertices[v].z -= (Math.random()*200);
  }
  // create the particle system
  var particleSystem = new THREE.Points(
      particlesGeo,
      pMaterial);
  if (inverse) {
    particleSystem.inverse = true;
  }
  particleSystem.rotation.set(initialRotation, initialRotation, initialRotation);
  initialRotation += Math.PI/4;
  particleSystems.push(particleSystem);
}



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
    track: '/three-project/sounds/nu'
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

  freq1 = getFreqRange(10, 20)*resonanceFreq1;
  freq2 = getFreqRange(20, 30)*resonanceFreq2;
  freqTriangle = getFreqRange(45, 55)*resonanceFreq3;
  freq3 = getFreqRange(85, 110)*resonanceFreq3;
  freq4 = getFreqRange(120, 140)*resonanceFreq4;
  freq5 = getFreqRange(140, 155)*resonanceFreq5;
  freq6 = getFreqRange(155, 190)*resonanceFreq6;
  freq7 = getFreqRange(191, 250)*resonanceFreq6;
  var limit = 150
	if (freq1 > limit && usedRings.length < limit) {
		launchRing(true);
	}
  if (freq2 > limit-60 && usedRings.length < limit) {
    launchRing(false);
  }
  // console.log("DOWN >>"+usedRings.length+"   //   "+pausedRings.length);
  // console.log("1 >>" + freq1);
  //console.log("2 >>" + freq2);
  // console.log("3 >>" + freq3);
  // console.log("4 >>" + freq4);
   //console.log("5 >>" + freq5 + "     " + Math.log(freq5+1));
   //console.log("6 >>" + freq6);
   //console.log("7 >>" + freq7);


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


  for (var i = 0; i < particleSystems.length; i++) {
    if (particleSystems[i].inverse) {
      particleSystems[i].rotation.x += 0.001+0.0004*Math.log(freq5+1);
      particleSystems[i].rotation.z += 0.001+0.0004*Math.log(freq5+1);
      particleSystems[i].rotation.y += 0.001+0.0004*Math.log(freq5+1);
    }else {
      particleSystems[i].rotation.z -= 0.001+0.0004*Math.log(freq5+1);
      particleSystems[i].rotation.x -= 0.001+0.0004*Math.log(freq5+1);
      particleSystems[i].rotation.y -= 0.001+0.0004*Math.log(freq5+1);
    }
  }

  //camera mouvement
  if (click == false) {
    camera.position.x += Math.cos(clock.getElapsedTime())*2;
    camera.position.y += Math.cos(clock.getElapsedTime())/2;
    camera.position.z += Math.cos(clock.getElapsedTime())/2;
  }
  //camera.position.z += (freq3 - previous) * 2;
  //camera.position.y += (freq3 - previous) * 2;
  previous = freq3;
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

render();
