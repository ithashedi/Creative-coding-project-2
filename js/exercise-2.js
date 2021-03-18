// Define configurables
const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;
const SPEED = 0.01;

// Define global variables required for scene
let canvas, camera, scene, renderer, material, geometry, cube;

// -------------------------- Initialise ray caster---------------------------

// Global representing intersected object
let INTERSECTED;

// Define raycaster and vector representing mouse position
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// ------------------------------- Audio -------------------------------------

// Define audio context
const context = new AudioContext();

// One-liner to resume playback when user interacted with the page.
window.addEventListener('click', function() {
    context.resume().then(() => {
        Tone.start()
        let info = document.getElementById("info");
        info.style.display = "none";
    });
});

function initSynth() {
    /*  Initialise synth and define a loop.
        Loop won't start until Transport starts.
    */
    let synth = new Tone.AMSynth().toMaster();        
    const loopA = new Tone.Loop(time => {
        synth.triggerAttackRelease("g5", "2n", time);
    }, "4n").start(0);
}

function toggleLoop() {
    if (Tone.Transport.state == 'started' && INTERSECTED == null) {
        Tone.Transport.stop();
    } else if (Tone.Transport.state == 'stopped' && INTERSECTED) {
        Tone.Transport.start();        
    }    
}

// ---------------------------------------------------------------------------

// ----------------------------- Graphics ------------------------------------

function rotateObject(obj) {
    obj.rotation.x -= SPEED * 2;
    obj.rotation.y -= SPEED;
    obj.rotation.z -= SPEED * 3;
}

function onMouseMove( event ) {
/*  function calculates mouse position in normalized device 
    coordinates (-1 to +1) for both components 
*/
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

// ---------------------------------------------------------------------------

// ---------------------- Initialisation of the scene ------------------------

function init() {
    canvas = document.getElementById("canvas-container");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 1000 );
    renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(new THREE.Color(0x000000)); // set background colour
    renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
    geometry = new THREE.BoxGeometry(2, 2, 2);
    material = new THREE.MeshBasicMaterial( {color: '#00FF00'} );
	cube = new THREE.Mesh( geometry, material );        
	scene.add( cube );
    camera.position.z = 5;
    canvas.appendChild( renderer.domElement );
}

// ------------------------------ Animation loop -----------------------------

function animate() {

    renderer.render( scene, camera );

    // update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0 ) {
        if ( INTERSECTED != intersects[ 0 ].object ) {
            INTERSECTED = intersects[ 0 ].object;            
        }
    } else {
        INTERSECTED = null;
    }
    if (context.state == 'running') toggleLoop();

    rotateObject(cube);

    requestAnimationFrame( animate );                               
}            

// Calls onMouseMove in response to mousemove event
window.addEventListener( 'mousemove', onMouseMove, false );

init();
initSynth();
animate();
