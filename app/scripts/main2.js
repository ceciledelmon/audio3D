var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.z = 10;
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

debug();

var geometry = new THREE.BufferGeometry();
var vertices = new Float32Array( [
    -0.5,  -0.5, 0,
    0.5, -0.5, 0,
    0, 0.5, 0
] );
var indices = new Uint32Array( [
    0, 1, 2
] );
var colors = new Float32Array( indices.length * 3 );
for ( var i = 0, i3 = 0, len = indices.length; i < len; i++, i3 += 3 ) {
    colors[ i3 + 0 ] = Math.random();
    colors[ i3 + 1 ] = Math.random();
    colors[ i3 + 2 ] = Math.random();
}
geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
geometry.addAttribute('position', new THREE.BufferAttribute( vertices, 3 ) );

geometry.setIndex(  new THREE.BufferAttribute( indices, 1 ) );

var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );

// var cylinder = new THREE.Mesh( geometry, material );
// scene.add( cylinder );


var vertexShader =
"attribute vec3 color;\n"+
"varying vec4 vColor;\n"+
"void main() {\n" +
"    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);\n" +
"    vColor = vec4(color, 1.0);\n"+
"}";

var fragmentShader =
"varying vec4 vColor;\n"+
"void main() {\n" +
"    gl_FragColor = vColor;\n" +

"}";

var material = new THREE.ShaderMaterial({
    uniforms: {
        color: { value: new THREE.Color( 0xffff00 ) },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
} );

var triangle = new THREE.Mesh( geometry, material );
scene.add( triangle );


var now = Date.now();
var lastTime = now;
var deltaTime = 16;
var expectedFPS = 1000 / 60; // 60 fps

function render() {
	requestAnimationFrame( render );

  now = Date.now()
  deltaTime =  now - lastTime
  lastTime = now

  //triangle.position.x = Math.cos()

	renderer.render( scene, camera );
}
render();



function debug() {
  var min = 0.01
  var max = 100

  var axis = {
    x: new THREE.Mesh(new THREE.BoxGeometry(max,min,min), new THREE.LineBasicMaterial({color: '#ff0000'})),
    y: new THREE.Mesh(new THREE.BoxGeometry(min,max,min), new THREE.LineBasicMaterial({color: '#00ff00'})),
    z: new THREE.Mesh(new THREE.BoxGeometry(min,min,max), new THREE.LineBasicMaterial({color: '#0000ff'})),
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
