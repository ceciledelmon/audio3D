class Ring {
  constructor(opts) {

    this.up = opts.up;

    var geometry = new THREE.TorusGeometry( 120, 4, 4, 4 );
    var material = new THREE.MeshBasicMaterial( { color: 0xCCE8AB } );
    this.ringShape = new THREE.Mesh( geometry, material );


    this.ringShape.rotation.x = Math.PI/2;

    if (this.up) {
      this.ringShape.rotation.z = -opts.rotation;
      var base = 25;
    }else {
      this.ringShape.rotation.z = opts.rotation;
      var base = -25;
    }
    this.ringShape.position.set(0, base, 0);


  }
  update(opts){
    if (this.up) {
      this.ringShape.rotation.z = -opts.rotation;
      this.ringShape.position.y += 0.5;
    }else {
      this.ringShape.rotation.z = opts.rotation;
      this.ringShape.position.y -= 0.5;
    }
    this.ringShape.scale.set(this.ringShape.scale.x - 0.0033,this.ringShape.scale.y - 0.0033,this.ringShape.scale.z - 0.0033);
  }
  reinit(opts){
    this.up = opts.up;
    this.ringShape.scale.set(1,1,1);
    if (this.up) {
      this.ringShape.rotation.z = -opts.rotation;
      var base = 25;
    }else {
      this.ringShape.rotation.z = opts.rotation;
      var base = -25;
    }
    this.ringShape.position.set(0, base, 0);
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
