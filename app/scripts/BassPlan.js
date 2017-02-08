class BassPlan {
  constructor(opts) {

    this.position = opts.position;
    this.sens = opts.sens;

    var shape = new THREE.Shape();
    shape.moveTo( opts.start.x, opts.start.y );
    shape.lineTo( opts.moves[0], opts.moves[1] );
    shape.lineTo( opts.moves[2], opts.moves[3] );
    shape.lineTo( opts.moves[4], opts.moves[5] );


    var extrudeSettings = {
    	steps: 2,
    	amount: 4,
    	bevelEnabled: false
    };

    var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    var material = new THREE.MeshPhongMaterial( { color: 0xd34575 } );
    var bass = new THREE.Mesh( geometry, material ) ;
    if (this.sens) {
      bass.rotation.y = Math.PI/4;
    }else {
      bass.rotation.y = Math.PI/2;
    }

    bass.rotateX(opts.rotateX);
    bass.position.x = opts.x;

    this.group = new THREE.Group();
    this.group.add( bass );

  }


}

window.BassPlan = BassPlan
