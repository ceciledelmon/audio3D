class Ring {
  constructor(opts) {

    this.up = opts.up;

    var geometry = new THREE.CylinderGeometry( 120, 120, 2, 4 );
    //var geometry = new THREE.TorusGeometry( 120, 4, 4, 4 );
    var material = new THREE.MeshBasicMaterial( { color: 0xFFABE5 } );
    this.ringShape = new THREE.Mesh( geometry, material );

        // edges geometry
    var geometry = new THREE.EdgesGeometry( this.ringShape.geometry ); // or WireframeGeometry
    var material = new THREE.LineBasicMaterial( { color: 0xF6FCAE, linewidth: 0.5 } );
    var edges = new THREE.LineSegments( geometry, material );
    this.ringShape.add( edges ); // add wireframe as a child of the parent mesh

    //this.ringShape.rotation.x = Math.PI/2;

    if (this.up) {
      this.ringShape.rotation.y = opts.rotation;
      var base = 28;
    }else {
      this.ringShape.rotation.y = -opts.rotation;
      var base = -28;
    }
    this.ringShape.position.set(0, base, 0);


  }
  update(opts){
    if (this.up) {
      this.ringShape.rotation.y = opts.rotation;
      this.ringShape.position.y += 0.5;
    }else {
      this.ringShape.rotation.y = -opts.rotation;
      this.ringShape.position.y -= 0.5;
    }
    this.ringShape.scale.set(this.ringShape.scale.x - 0.0033,this.ringShape.scale.y - 0.0033,this.ringShape.scale.z - 0.0033);
  }
  reinit(opts){
    this.up = opts.up;
    this.ringShape.scale.set(1,1,1);
    if (this.up) {
      this.ringShape.rotation.y = opts.rotation;
      var base = 28;
    }else {
      this.ringShape.rotation.y = -opts.rotation;
      var base = -28;
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
