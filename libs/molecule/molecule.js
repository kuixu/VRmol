/**
 * Created by zhangdawei on 2017/5/25.
 */

// vr 可用提示
if ( WEBVR.isAvailable() === false ) {
    document.body.appendChild( WEBVR.getMessage() );
}

var camera, scene, renderer, labelRenderer;
var controls;
var vrEffect, vrControls;
var root;
var visualizationType = 2;

var MOLECULES = {
    "aaa": "aaa.pdb",
    "bbb": "bbb.pdb",
    "5ftm": "5ftm.pdb",
    "1mbs": "remote.pdb",
    "aspirin": "aspirin.pdb"
};
var loader = new THREE.PDBLoader();
var menu = document.getElementById( "menu" );
init();
animate();
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 10, 50000 );
    camera.position.z = 1000;
    scene.add( camera );
    var light = new THREE.DirectionalLight( 0xffffff, 0.8 );
    light.position.set( 1, 1, 1 );
    scene.add( light );
    var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light.position.set( -1, -1, 1 );
    scene.add( light );
    root = new THREE.Group();
    scene.add( root );
    //
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0x050505 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById( 'container' ).appendChild( renderer.domElement );
    //vr
    vrControls = new THREE.VRControls( camera );
    vrEffect = new THREE.VREffect( renderer );
    WEBVR.getVRDisplay( function ( display ) {
        document.body.appendChild( WEBVR.getButton( display, renderer.domElement ) );
    } );
    //vr
    //labelRenderer = new THREE.CSS2DRenderer();
    //labelRenderer.setSize( window.innerWidth, window.innerHeight );
    //labelRenderer.domElement.style.position = 'absolute';
    //labelRenderer.domElement.style.top = '0';
    //labelRenderer.domElement.style.pointerEvents = 'none';
    //document.getElementById( 'container' ).appendChild( labelRenderer.domElement );
    //
    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.minDistance = 500;
    controls.maxDistance = 2000;
    //
    loadMolecule( "data/aaa.pdb" );
    createMenu();
    //
    window.addEventListener( 'resize', onWindowResize, false );
    w3m.api.init();
}
//
function generateButtonCallback( url ) {
    return function ( event ) {
        loadMolecule( url );
    }
}
function createMenu() {
    for ( var m in MOLECULES ) {
        var button = document.createElement( 'button' );
        button.innerHTML = m;
        menu.appendChild( button );
        var url = "data/" +  MOLECULES[ m ];
        button.addEventListener( 'click', generateButtonCallback( url ), false );
    }

    var b_a = document.getElementById( "b_a" );
    var b_b = document.getElementById( "b_b" );
    var b_ab = document.getElementById( "b_ab" );
    b_a.addEventListener( 'click', function() { visualizationType = 0; showAtoms() } );
    b_b.addEventListener( 'click', function() { visualizationType = 1; showBonds() } );
    b_ab.addEventListener( 'click', function() { visualizationType = 2; showAtomsBonds() } );
}
//
function loadMolecule( url ) {
    while ( root.children.length > 0 ) {
        var object = root.children[ 0 ];
        object.parent.remove( object );
    }
    loader.load( url,w3m.LINE, function ( geometry, geometryBonds, json ) {
        initShowAtomsAndBonds(geometry,geometryBonds,json);
        //initShowTube(geometry,geometryBonds,json);
    }, function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
        }
    }, function ( xhr ) {
    } );
}

function initShowTube(geometry, geometryBonds, json ){
    var positions = geometry.getAttribute( 'position' );
    var pipes = [];
    for ( var i = 0; i < positions.count; i ++ ) {
        var position = new THREE.Vector3(positions.getX( i ),positions.getY( i ),positions.getZ( i ));
        pipes.push(position);
    }
    var pipeSpline = new THREE.CatmullRomCurve3(pipes);
    var material = new THREE.MeshLambertMaterial( { color: 0xff00ff } );
    var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.3, wireframe: true, transparent: true } );
    var tubeGeometry = new THREE.TubeBufferGeometry( pipeSpline,500, 2, 12, true);
    var group = THREE.SceneUtils.createMultiMaterialObject( tubeGeometry, [ material, wireframeMaterial ] );
    scene.add( group );
}

/**
 * 初始化展示球棍模型
 * @param geometry
 * @param geometryBonds
 * @param json
 */
function initShowAtomsAndBonds(geometry, geometryBonds, json )
{
    var boxGeometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
    var sphereGeometry = new THREE.IcosahedronBufferGeometry( 1, 2 );
    var offset = geometry.center();
    geometryBonds.translate( offset.x, offset.y, offset.z );
    var positions = geometry.getAttribute( 'position' );
    var colors = geometry.getAttribute( 'color' );
    var position = new THREE.Vector3();
    var color = new THREE.Color();
    for ( var i = 0; i < positions.count; i ++ ) {
        position.x = positions.getX( i );
        position.y = positions.getY( i );
        position.z = positions.getZ( i );
        color.r = colors.getX( i );
        color.g = colors.getY( i );
        color.b = colors.getZ( i );
        var element = geometry.elements[ i ];
        var material = new THREE.MeshPhongMaterial( { color: color } );
        var object = new THREE.Mesh( sphereGeometry, material );
        object.name = "atom";
        object.position.copy( position );
        object.position.multiplyScalar( 75 );
        object.scale.multiplyScalar( 25 );
        root.add( object );
        var atom = json.atoms[ i ];
        var text = document.createElement( 'div' );
        text.className = 'label';
        text.style.color = 'rgb(' + atom[ 3 ][ 0 ] + ',' + atom[ 3 ][ 1 ] + ',' + atom[ 3 ][ 2 ] + ')';
        text.textContent = atom[ 4 ];
        var label = new THREE.CSS2DObject( text );
        label.position.copy( object.position );
        root.add( label );
    }
    positions = geometryBonds.getAttribute( 'position' );
    var start = new THREE.Vector3();
    var end = new THREE.Vector3();
    for ( var i = 0; i < positions.count; i += 2 ) {
        start.x = positions.getX( i );
        start.y = positions.getY( i );
        start.z = positions.getZ( i );
        end.x = positions.getX( i + 1 );
        end.y = positions.getY( i + 1 );
        end.z = positions.getZ( i + 1 );
        start.multiplyScalar( 75 );
        end.multiplyScalar( 75 );
        var object = new THREE.Mesh( boxGeometry, new THREE.MeshPhongMaterial( 0xffffff ) );
        object.name = "bond";
        object.position.copy( start );
        object.position.lerp( end, 0.5 );
        object.scale.set( 5, 5, start.distanceTo( end ) );
        object.lookAt( end );
        root.add( object );
    }
    render();
}
//显示原子
function showAtoms() {
    for ( var i = 0; i < root.children.length; i ++ ) {
        var object = root.children[ i ];
        if ( object instanceof THREE.Mesh && object.name === "atom") {
            object.visible = true;
        } else if(object instanceof THREE.Mesh && object.name === "bond"){
            object.visible = false;
        }
    }
}

//显示边
function showBonds() {
    for ( var i = 0; i < root.children.length; i ++ ) {
        var object = root.children[ i ];
        if ( object instanceof THREE.Mesh && object.name === "atom") {
            object.visible = false;
        } else if(object instanceof THREE.Mesh && object.name === "bond"){
            object.visible = true;
        }
    }
}

//显示原子+边
function showAtomsBonds() {
    for ( var i = 0; i < root.children.length; i ++ ) {
        var object = root.children[ i ];
        if ( object instanceof THREE.Mesh ) {
            object.visible = true;
        }
    }
}

//
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    //labelRenderer.setSize( window.innerWidth, window.innerHeight );
    vrEffect.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    controls.update();
    vrControls.update();
    var time = Date.now() * 0.0004;
    root.rotation.x = time;
    root.rotation.y = time * 0.7;
    render();
    vrEffect.requestAnimationFrame( animate );
}

function render() {
    vrEffect.render( scene, camera );
    //labelRenderer.render( scene, camera );
}

function adjust(){
    //new THREE.TubeBufferGeometry
    //THREE.CatmullRomCurve3
}