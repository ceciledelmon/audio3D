class Ring {
  constructor(opts) {
    var geometry = new THREE.TorusGeometry( 120, 4, 4, 4 );
    var material = new THREE.MeshBasicMaterial( { color: 0xCCE8AB } );
    this.ringShape = new THREE.Mesh( geometry, material );
    //var vector = new THREE.Vector3( 0, 0, 1 );
    //vector.applyQuaternion( this.ringShape.quaternion );

    this.ringShape.rotateX(Math.PI/2);
    this.ringShape.position.set(0, 25, 0);

  }
  update(){
    //this.ringShape.rotation.z -= 0.005;
  	this.ringShape.position.y += 0.5;
    this.ringShape.scale.set(this.ringShape.scale.x - 0.0033,this.ringShape.scale.y - 0.0033,this.ringShape.scale.z - 0.0033);
  }
  reinit(){
    this.ringShape.scale.set(1,1,1);
    this.ringShape.position.set(0, 25, 0);
  }
  getRandomColor() {
  //var letters = '0123456789ABCDEF';
  var letters = '0123456789ABCDEF';
  var color = '0x';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

}

window.Ring = Ring
