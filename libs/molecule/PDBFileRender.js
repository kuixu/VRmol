/**
 * Created by Kui XU on 2017/07/08.
 */
var container;
var camera, scene, renderer, statsVR;
var splineCamera, parent ,group;
var cameraEye, menu_panel;
var binormal = new THREE.Vector3();
var normal = new THREE.Vector3();
var scale = 4;
var controls, controller1, controller2,vrEffect, vrControls;

var raycasterFor3;
var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;
var raycaster, intersected = [];
var tempMatrix = new THREE.Matrix4();

// add more 3 lights
var lightType = 0;
// controls type
var controlsType = 2;
//
var showMenu =false;

//======= Travel in the VR =======
var curve0, train0;

var position0 = new THREE.Vector3();
var tangent0 = new THREE.Vector3();

var lookAt0 = new THREE.Vector3();

var velocity0 = 0;
var progress0 = 0;

var prevTime0 = performance.now();
//================================
var tmpTime = 0;

var ThumbpadAxes = [];
var id = 0;
function onAxisChanged(event){
    var controller = event.target;
    ThumbpadAxes = event.axes;
}

function onMenuUp(event){
    //var controller = event.target;
}

function onMenuDown(event){
    if(PDB.TravelMode){
        PDB.render.changeToVrMode(PDB.MODE_VR,false);
    }else{
       if (!PDB.isShowMenu) {
            PDB.isShowMenu=true;
            PDB.render.showMenu();
            PDB.painter.showMenu(PDB.MENU_TYPE_CURRENT);
        }else{
            PDB.isShowMenu=false;
            PDB.render.hideMenu();
        }
    }
  PDB.render.clearGroupIndex(PDB.GROUP_INFO);
}


var action=0 ;
function onThumbpadUp(event){
    //console.log('onThumbpadUp');
    var pad = event.target;
    window.clearInterval(id);
    PDB.ROTATION_START_FLAG = false;
	
}

function onThumbpadDown(event){
    //console.log('onThumbpadDown');
    var controller = event.target;
	x=ThumbpadAxes[0];
	y=ThumbpadAxes[1];
    if((y<=-0.5 &&  x >= -0.5 && x <= 0) ||(y<=-0.5 &&  x <= 0.5 && x >= 0)){
		action=1;
    }else if((y>= 0.5 &&  x >= -0.5 &&x <= 0) ||(y >= 0.5 && x <= 0.5 && x >= 0)){
		action=2;
    }else if((x<=-0.5 && y >= -0.5 && y <= 0) || (x<=-0.5 && y <= 0.5 && y >= 0)){
		action=3;
    }else if((x>= 0.5 && y >= -0.5 && y <= 0) || (x>= 0.5 && y <= 0.5 && y >= 0)){
		action=4;
    }
	
	switch (action){
		case 0:

			break;
		case 1:
			id =self.setInterval("PDB.painter.near()",20);
			break;
		case 2:
		    id =self.setInterval("PDB.painter.far()",20);
			break;
		case 3:
			PDB.ROTATION_DIRECTION = 0;
	    PDB.ROTATION_START_FLAG= true;
			break;
		case 4:
		    PDB.ROTATION_DIRECTION = 1;
	    PDB.ROTATION_START_FLAG= true;
		    break;
	}
}

function dealwithMenu(object) {
    if(object=== undefined || object.userData=== undefined){
        return;
    }
    var groupindex = "";
    if(object.userData.group!== undefined){
        groupindex = object.userData["group"];
    }else{
        return;
    }

    if(object.name!== undefined){
        if(groupindex == PDB.GROUP_KEYBOARD ){
            PDB.painter.showInput(object.name);
        }
    }
    var curr_reptype="";
    if(object.userData.reptype!== undefined &&  object.userData.reptype!== ""){
        curr_reptype = object.userData.reptype;
    }else{
        return;
    }

    switch(groupindex){
        case PDB.GROUP_MENU:
            if(!PDB.isShowMenu){
                PDB.render.showMenu();
            }else{
                PDB.render.hideSubMenu();
                PDB.MENU_TYPE_CURRENT = curr_reptype;
                PDB.painter.showMenu(curr_reptype);
            }
            break;
        case PDB.GROUP_MENU_MAIN:
            PDB.config.mainMode = curr_reptype;
            PDB.controller.refreshGeometryByMode(curr_reptype);
            onMenuDown();
            break;
        case PDB.GROUP_MENU_HET:
            PDB.config.hetMode = curr_reptype;
            PDB.controller.refreshGeometryByMode(curr_reptype);
            onMenuDown();
            break;
        case PDB.GROUP_MENU_LABEL:
            PDB.trigger = PDB.TRIGGER_EVENT_LABEL;
            PDB.selection_mode = object.userData.reptype;
            onMenuDown();
            break;
        case PDB.GROUP_MENU_TRAVEL:
            onMenuDown();
			PDB.CHANGESTYLE = 6;
            PDB.render.changeToVrMode(PDB.MODE_TRAVEL_VR,true);
            PDB.painter.showResidueByThreeTravel();
            break;
        case PDB.GROUP_MENU_EX_HET:
            var type = object.userData.reptype;
            switch (type){
                case 0:
                    PDB.isShowWater = false;
                    PDB.painter.showWater();
                    break;
                case PDB.HET_WATER:
                    PDB.isShowWater = true;
                    PDB.painter.showWater();
                    break;
            }
            onMenuDown();
            break;
        case PDB.GROUP_MENU_COLOR:
			if(object.userData.reptype=='Conservation'){
				var chain = "A";
				var url = PDB.CONSERVATION_URL+"&pdbid="+PDB.pdbId.toUpperCase()+"&chain="+chain;
				PDB.tool.ajax.get(url,function (text) {
					PDB.controller.clear(4,undefined);
					PDB.painter.showConservation(text);
					PDB.render.clearMain();
					PDB.controller.drawGeometry(PDB.config.mainMode);
					onMenuDown();
				});
			}else{
				PDB.controller.switchColorBymode(object.userData.reptype);
				onMenuDown();
			}


            break;
        case PDB.GROUP_MENU_MEASURE:
            PDB.controller.switchMeasureByMode(object.userData.reptype);
            onMenuDown();
            break;
        case PDB.GROUP_MENU_DRAG:
            var type = object.userData.reptype;
            if(type !== 0){
                PDB.controller.switchDragByMode(object.userData.reptype);
            }else {
                PDB.tool.backToInitialPositionForVr();
            }
            onMenuDown();
            break;
        case PDB.GROUP_MENU_FRAGMENT:
            PDB.selection_mode = PDB.SELECTION_RESIDUE;
			// console.log(object.userData);
            PDB.controller.switchFragmentByMode(object.userData.reptype);
            onMenuDown();
            break;
        case PDB.GROUP_MENU_SURFACE:
            var type = object.userData.reptype;
            switch (type){
                case 0:
                    PDB.GROUP[PDB.GROUP_SURFACE].visible = false;
                    PDB.render.clearGroupIndex(PDB.GROUP_SURFACE);
                    break;
                case 1:
                    PDB.GROUP[PDB.GROUP_SURFACE].visible = true;
                    PDB.controller.refreshSurface(PDB.config.surfaceMode,1,PDB.SURFACE_OPACITY,PDB.SURFACE_WIREFRAME);
                    break;
                case 2:
                    PDB.GROUP[PDB.GROUP_SURFACE].visible = true;
                    PDB.controller.refreshSurface(PDB.config.surfaceMode,2,PDB.SURFACE_OPACITY,PDB.SURFACE_WIREFRAME);
                    break;
                case 3:
                    PDB.GROUP[PDB.GROUP_SURFACE].visible = true;
                    PDB.controller.refreshSurface(PDB.config.surfaceMode,3,PDB.SURFACE_OPACITY,PDB.SURFACE_WIREFRAME);
                    break;
                case 4:
                    PDB.GROUP[PDB.GROUP_SURFACE].visible = true;
                    PDB.controller.refreshSurface(PDB.config.surfaceMode,4,PDB.SURFACE_OPACITY,PDB.SURFACE_WIREFRAME);
                    break;
                case 5:
                    PDB.controller.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,1.0,PDB.SURFACE_WIREFRAME);
                    break;
                case 6:
                    PDB.controller.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,0.9,PDB.SURFACE_WIREFRAME);
                    break;
                case 7:
                    PDB.controller.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,0.8,PDB.SURFACE_WIREFRAME);
                    break;
                case 8:
                    PDB.controller.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,0.7,PDB.SURFACE_WIREFRAME);
                    break;
                case 9:
                    PDB.controller.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,0.6,PDB.SURFACE_WIREFRAME);
                    break;
                case 10:
                    PDB.controller.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,0.5,PDB.SURFACE_WIREFRAME);
                    break;
                case 11:
                    PDB.controller.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,PDB.SURFACE_OPACITY,!PDB.SURFACE_WIREFRAME);
                    break;
            }
            onMenuDown();
            break;
        case PDB.GROUP_MENU_MUTATION:
            var type = object.userData.reptype;
            var mutationType = 1;
            switch (type){
                case 1:
                    PDB.render.clearGroupIndex(PDB.GROUP_MUTATION);
                    break;
                case 2:
                    mutationType = 2;
                    PDB.tool.ajax.get("http://files.rcsb.org/view/1mbs.pdb",function (text) {
                        PDB.controller.clear(4,undefined);
                        PDB.painter.showMutation(PDB.mutation);
                    });
                    break;
                case 3:
                    mutationType = 3;
                    PDB.tool.ajax.get("http://files.rcsb.org/view/1mbs.pdb",function (text) {
                        PDB.controller.clear(4,undefined);
                        PDB.painter.showMutation(PDB.mutation);
                    });
                    break;
                case 4:
                    mutationType = 4;
                    PDB.tool.ajax.get("http://files.rcsb.org/view/1mbs.pdb",function (text) {
                        PDB.controller.clear(4,undefined);
                        PDB.painter.showMutation(PDB.mutation);
                    });
                    break;
            }
            onMenuDown();
            break;
        case PDB.GROUP_MENU_ROTATION:
            var type = object.userData.reptype;
            switch (type){
                case 1:
                    PDB.ROTATION_START_FLAG= false;
                    break;
                case 2:
                    PDB.ROTATION_DIRECTION = 0;
                    PDB.ROTATION_START_FLAG= true;
                    break;
                case 3:
                    PDB.ROTATION_DIRECTION = 1;
                    PDB.ROTATION_START_FLAG= true;
                    break;
            }
            onMenuDown();
            break;
		case PDB.GROUP_MENU_DIRECTION:
            PDB.MOVE_DIRECTION = object.userData.reptype;
            onMenuDown();
            break;	
        case PDB.GROUP_MENU_DRUG:
            var type = object.userData.reptype;
            PDB.loader.loadDrug("DB04464",function () {
                PDB.painter.showHet('DB04464');
                onMenuDown();
            });
            break;
        case PDB.GROUP_MENU_DENSITYMAP:
            var type = object.userData.reptype;
            PDB.render.clear(2);
            if(e.target.checked){
                PDB.SHOWSOLID = true;
                if(PDB.EMMAP){

                    if(PDB.SHOWSILICE){
                        PDB.painter.showMapSlices(PDB.EMMAP,PDB.THRESHOLD,PDB.SLICE,PDB.DIMENSION);
                    }
                    PDB.painter.showMapSolid(PDB.EMMAP,PDB.THRESHOLD);
                }else{
                    var url = "http://localhost/data/emd_1001.map.gz";
                    EmMapParser.loadMap('1001','map-local',function (emmap) {

                        PDB.EMMAP = emmap;
                        // PDB.THRESHOLD = 150;
                        // PDB.SLICE = 300;

                        PDB.MAP_SCOPE={x:emmap.header.NC,y:emmap.header.NR,z:emmap.header.NS};
                        PDB.THRESHOLD=(emmap.header.max-emmap.header.mean)/2;
                        PDB.SLICE = Math.floor(emmap.header.NS/2);
                        PDB.painter.showMapSolid(emmap,PDB.THRESHOLD);
                        PDB.painter.showMapSlices(emmap,PDB.THRESHOLD,PDB.SLICE,PDB.DIMENSION);
                        var showThreshold = document.getElementById("showThreshold");
                        var showSlice = document.getElementById("showSlice");
                        showThreshold.max = Number(emmap.header.max);
                        showThreshold.min = Number(emmap.header.min);
                        //showSlice.max = Number(emmap.header.NS);
                        showSlice.min = 1;
                        switch(PDB.DIMENSION){
                            case PDB.DIMENSION_X:
                                showSlice.max = Number(emmap.header.NC);
                                break;
                            case PDB.DIMENSION_Y:
                                showSlice.max = Number(emmap.header.NR);
                                break;
                            case PDB.DIMENSION_Z:
                                showSlice.max = Number(emmap.header.NS);
                                break;
                        }
                        onMenuDown();
                    });
                }
            }else{

                PDB.SHOWSOLID = false;
                if(PDB.SHOWSILICE){
                    PDB.painter.showMapSlices(PDB.EMMAP,PDB.THRESHOLD,PDB.SLICE,PDB.DIMENSION);
                }
                onMenuDown();
            }
            break;
        case PDB.GROUP_MENU_CONSERVATION:
            var type = object.userData.reptype;
            var chain = "A";
            var url = PDB.CONSERVATION_URL+"&pdbid="+PDB.pdbId.toUpperCase()+"&chain="+chain;
            PDB.tool.ajax.get(url,function (text) {
                PDB.controller.clear(4,undefined);
                PDB.painter.showConservation(text);
                PDB.render.clearMain();
                PDB.controller.drawGeometry(PDB.config.mainMode);
                onMenuDown();
            });
            break;
        case PDB.GROUP_MENU_HBOND:
            var type = object.userData.reptype;
            switch (type){
                case PDB.BOND_TYPE_NONE:
                    PDB.render.clearGroupIndex(PDB.GROUP_BOND);
                    break;
                case PDB.BOND_TYPE_SSBOND:
                    PDB.render.clearGroupIndex(PDB.GROUP_BOND);
                    PDB.painter.showBond(PDB.BOND_TYPE_SSBOND);
                    break;
                case PDB.BOND_TYPE_COVALENT:
                    PDB.render.clearGroupIndex(PDB.GROUP_BOND);
                    PDB.painter.showBond(PDB.BOND_TYPE_COVALENT);
                    break;
                case PDB.BOND_TYPE_HBOND:
                    PDB.render.clearGroupIndex(PDB.GROUP_BOND);
                    PDB.painter.showBond(PDB.BOND_TYPE_HBOND);
                    break;
            }
            onMenuDown();
            break;
    }
}

function onTriggerDown( event ) {
	//console.log("onTriggerDown");
    var controller = event.target;
    var intersections = getIntersections( controller );
    if ( intersections.length <= 0 ) {
        return;
    }
    tempMatrix.getInverse( controller.matrixWorld );
    var intersection = intersections[ 0 ];
    var object = intersection.object;
    var pos    = intersection.pos;
	
    // ================================ Deal with Menu ===
    if(PDB.isShowMenu){
        dealwithMenu(object);
    }else{
        // ================================ Deal with Selection mode ===
        switch (PDB.selection_mode){
            case PDB.SELECTION_MODEL:
                break;
            case PDB.SELECTION_MAIN:
                break;
            case PDB.SELECTION_HET:
                break;
            case PDB.SELECTION_CHAIN:
                if(object.userData.presentAtom !== undefined){
                    PDB.painter.showChainInfo(object.userData.presentAtom);
                }
                break;
            case PDB.SELECTION_DRUG:
                if(object.userData.presentAtom !== undefined){
                    PDB.painter.showChainInfo(object.userData.presentAtom);
                }
                break;
            case PDB.SELECTION_RESIDUE:
                if(object.userData.presentAtom !== undefined){
                    //PDB.painter.showResidueInfo(object.userData.presentAtom);
                    //PDB.painter.showResidueInfoPos(object.userData.presentAtom, pos);
                    atom = object.userData.presentAtom;
                    atom["pos_curr"] = pos;
                    PDB.painter.showAtomInfo(atom);
                    if(PDB.trigger === PDB.TRIGGER_EVENT_FRAGMENT){
						// console.log(object);
                        PDB.fragmentArray.push(object);
                    }
                }
                break;
            case PDB.SELECTION_ATOM:
                if(object.userData.presentAtom !== undefined){
                    atom = object.userData.presentAtom;
                    atom["pos_curr"] = pos;
                    PDB.painter.showAtomInfo(atom);
                    if(PDB.trigger === PDB.TRIGGER_EVENT_DISTANCE || PDB.trigger === PDB.TRIGGER_EVENT_ANGLE){
                        if(PDB.distanceArray.length > 0) {
                            if(!PDB.tool.equalAtom(PDB.distanceArray[PDB.distanceArray.length-1],atom)){
                                PDB.distanceArray.push(atom);
                            }
                        }else{
                            PDB.distanceArray.push(atom);
                        }
                    }
                }
                break;
            case PDB.SELECTION_OBJECT:
                objectTrans(controller, object);
                break;

        }

        // ================================ Deal with Trigger mode ===
        switch (PDB.trigger){
            case PDB.TRIGGER_EVENT_DRAG:
                objectTrans(controller, object);
                break;
        }
    }

}
function onTriggerUp( event ) {
	//console.log("onTriggerUp");
    switch (PDB.selection_mode){
        case PDB.SELECTION_MODEL:
            break;
        case PDB.SELECTION_MAIN:
            break;
        case PDB.SELECTION_HET:
            break;
        case PDB.SELECTION_CHAIN:
            PDB.render.clearGroupIndex(PDB.GROUP_INFO);
            break;
        case PDB.SELECTION_DRUG:
            PDB.render.clearGroupIndex(PDB.GROUP_INFO);
            break;
        case PDB.SELECTION_RESIDUE:
            PDB.render.clearGroupIndex(PDB.GROUP_INFO);
            break;
        case PDB.SELECTION_ATOM:
            PDB.render.clearGroupIndex(PDB.GROUP_INFO);
            break;
        case PDB.SELECTION_OBJECT:
            break;

    }


    //
    var controller = event.target;
    if ( controller.userData!== undefined && controller.userData.selected !== undefined ) {
        var intersections = controller.userData.selected;
        var object =intersections;
        objectDeTrans(controller, object);
        controller.userData.selected = undefined;
    }

    switch (PDB.trigger){
        case PDB.GROUP_MENU_DRAG:

            break;
        case PDB.TRIGGER_EVENT_DISTANCE:
            if(PDB.distanceArray.length === 2){
                var locationStart = PDB.distanceArray[0];
                var locationEnd = PDB.distanceArray[1];
                PDB.painter.showDistance(locationStart,locationEnd);
                PDB.distanceArray = [];
            }
            break;
        case PDB.TRIGGER_EVENT_ANGLE:
            if(PDB.distanceArray.length === 2){
                var locationStart = PDB.distanceArray[0];
                var locationEnd = PDB.distanceArray[1];
                PDB.painter.showDistance(locationStart,locationEnd);
            }else if(PDB.distanceArray.length === 3){
                var locationStart = PDB.distanceArray[1];
                var locationEnd = PDB.distanceArray[2];
                PDB.painter.showDistance(locationStart,locationEnd);
                var anglePoint = locationStart;
                var edgePoint1 = PDB.distanceArray[0];
                var edgePoint2 = locationEnd;
                var anglePointPos = [anglePoint.pos_curr.x,anglePoint.pos_curr.y,anglePoint.pos_curr.z];
                var edgePoint1Pos = [edgePoint1.pos_curr.x,edgePoint1.pos_curr.y,edgePoint1.pos_curr.z];
                var edgePoint2Pos = [edgePoint2.pos_curr.x,edgePoint2.pos_curr.y,edgePoint2.pos_curr.z];
                var ms = PDB.tool.getAngleMeasurement(anglePointPos,edgePoint1Pos,edgePoint2Pos);
                //var labelPos = new THREE.Vector3(ms.label_xyz[0],ms.label_xyz[1],ms.label_xyz[2]);
                var labelPos = locationStart.pos_curr;
                PDB.drawer.drawText(PDB.GROUP_MAIN,labelPos,
                    ms.result,"",anglePoint.color,180);
                PDB.distanceArray = [];
            }
            break;
        case PDB.TRIGGER_EVENT_ATOM:
            var controller = event.target;
            if ( controller.userData.selected !== undefined ) {
                var object = controller.userData.selected;
                PDB.tool.colorIntersectObjectBlue(object,0);
                //PDB.GROUP[PDB.GROUP_MAIN].add( object );
                controller.userData.selected = undefined;
            }
            break;
        case PDB.TRIGGER_EVENT_FRAGMENT:
            var controller = event.target;
            if ( controller.userData.selected !== undefined ) {
                var object = controller.userData.selected;
                PDB.tool.colorIntersectObjectBlue(object,0);
                PDB.GROUP[PDB.GROUP_MAIN].add( object );
                controller.userData.selected = undefined;
            }
            if(PDB.fragmentArray.length === 2){
                var startAtom = PDB.fragmentArray[0];
                var endAtom = PDB.fragmentArray[1];
                if(startAtom.name <= endAtom.name){
                    PDB.controller.fragmentPainter(startAtom.name,endAtom.name,PDB.fragmentMode);
                }else{
                    PDB.controller.fragmentPainter(endAtom.name,startAtom.name,PDB.fragmentMode);
                }
                PDB.fragmentArray = [];
            }
            break;

        case PDB.TRIGGER_EVENT_LABEL:

            break;


    }


}
function objectTrans(controller, object){
    if(object!=undefined && (object.material!=undefined || object.type==="Group")){
        PDB.tool.colorIntersectObjectBlue(object,1);
        var groupindex = object.userData["group"];
        if(groupindex!=undefined){
            object.matrix.premultiply( tempMatrix );
            object.matrix.decompose( object.position, object.quaternion, object.scale );
            controller.add( object );
            controller.userData.selected = object;
        }
    }
}
function objectDeTrans(controller, object){

    if(object!=undefined && (object.material!=undefined || object.type==="Group")){
        object.matrix.premultiply( controller.matrixWorld );
        object.matrix.decompose( object.position, object.quaternion, object.scale );
        PDB.tool.colorIntersectObjectBlue(object,0);
        var groupindex = object.userData["group"];
        if(object.type!="Group"){
            if(groupindex!=undefined){
                console.log(groupindex); // || groupindex == PDB.GROUP_MENU
                PDB.GROUP[groupindex].add(object);
            }
        }else{
            scene.add(object);
        }
    }
}


function getIntersections( controller ) {
    tempMatrix.identity().extractRotation( controller.matrixWorld );
    raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
    raycaster.ray.direction.set( 0, 0, -1 ).applyMatrix4( tempMatrix );
    var inters = [];
    // if(PDB.trigger === PDB.TRIGGER_EVENT_DRAG){
    if(PDB.isShowMenu){
        var gIndexies = [PDB.GROUP_MENU_MAIN,PDB.GROUP_MENU_HET,PDB.GROUP_MENU_COLOR,PDB.GROUP_MENU_MEASURE,
            PDB.GROUP_MENU_DRAG,PDB.GROUP_MENU_FRAGMENT,PDB.GROUP_MENU,PDB.GROUP_MENU_LABEL,PDB.GROUP_MENU_EX_HET,
            PDB.GROUP_MENU_TRAVEL,PDB.GROUP_MENU_SURFACE,PDB.GROUP_MENU_MUTATION,PDB.GROUP_MENU_ROTATION,
            PDB.GROUP_MENU_DRUG,PDB.GROUP_MENU_HBOND,PDB.GROUP_MENU_CONSERVATION,PDB.GROUP_MENU_DENSITYMAP,
			PDB.GROUP_MENU_DIRECTION,PDB.GROUP_KEYBOARD];
        for (var i = gIndexies.length -1; i >=0; i--) {
            if( !PDB.GROUP[gIndexies[i]].visible)continue;
            var tmp_inters = raycaster.intersectObjects( PDB.GROUP[gIndexies[i]].children );
            for (var j=0; j < tmp_inters.length; j++) {
                inters.push(tmp_inters[j] );
            }
        }
    }else{
        switch(PDB.selection_mode){
            case PDB.SELECTION_MODEL:
                for(var i in PDB.GROUP_STRUCTURE_INDEX){
                    inters.push({"object":PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]]});
                }
                break;
            case PDB.SELECTION_MAIN:
                for(var i in PDB.GROUP_MAIN_INDEX){
                    inters.push({"object":PDB.GROUP[PDB.GROUP_MAIN_INDEX[i]]});
                }
                break;
            case PDB.SELECTION_HET:
                // inters.push({"object":PDB.GROUP[PDB.GROUP_HET]});
                var gIndexies = PDB.GROUP_HET_INDEX;
                for (var key in gIndexies) {
                    var groupindex = gIndexies[key];
                    if (!PDB.GROUP[groupindex].visible)continue;
                    var tmp_inters = raycaster.intersectObjects(PDB.GROUP[groupindex].children);
                    if (tmp_inters.length <= 0)continue;
                    object = tmp_inters[0].object;
                    if (object.name != undefined && object.name != "" && object.userData.presentAtom !== undefined) {
                        inters.push({"object": PDB.GROUP[groupindex]});
                    }
                }
                break;
            case PDB.SELECTION_CHAIN:
                var gIndexies = PDB.GROUP_STRUCTURE_INDEX;
                for (var key in gIndexies) {
                    var groupindex = gIndexies[key];
                    if (!PDB.GROUP[groupindex].visible)continue;
                    var tmp_inters = raycaster.intersectObjects(PDB.GROUP[groupindex].children);
					
                    if (tmp_inters.length <= 0)continue;
                    object = tmp_inters[0].object;
                    if (object.name != undefined && object.name != "" && object.userData.presentAtom !== undefined) {
                        inters.push({"object": PDB.GROUP[groupindex],"pos":tmp_inters[0].point});
                    }
                }
                break;
            case PDB.SELECTION_DRUG:
                //var gIndexies = PDB.GROUP_STRUCTURE_INDEX;
                //for (var key in gIndexies) {
                var groupindex = PDB.GROUP_DRUG;
                if (!PDB.GROUP[groupindex].visible)break;
                var tmp_inters = raycaster.intersectObjects(PDB.GROUP[groupindex].children);
                if (tmp_inters.length <= 0)break;
                object = tmp_inters[0].object;
                if (object.name != undefined && object.name != "" && object.userData.presentAtom !== undefined) {
                    inters.push({"object": PDB.GROUP[groupindex]});
                }
                //}
                break;
            case PDB.SELECTION_RESIDUE:
                var gIndexies = PDB.GROUP_STRUCTURE_INDEX;
                for (var i = gIndexies.length -1; i >=0; i--) {
                    if( !PDB.GROUP[gIndexies[i]].visible)continue;
                    var tmp_inters = raycaster.intersectObjects( PDB.GROUP[gIndexies[i]].children );
                    if(tmp_inters.length<=0)continue;
                    object=tmp_inters[0].object;
                    point=tmp_inters[0].point;
                    if(object.name!=undefined&& object.name!=""&& object.userData.presentAtom !== undefined){
                        if(object.userData.reptype==="tube"){
                            if(object.userData.realtype!==undefined&& object.userData.realtype==="arrow"){
                                console.log(object.userData);
                            }
                            var atomObjects = PDB.GROUP[gIndexies[i]].getChildrenByName( object.userData.presentAtom.id );
                            for (var a=0; a < atomObjects.length; a++) {
                                    //atomObjects[a].position.copy(point);
                                    //object.userData.presentAtom["pos_curr"] =point;
                                    inters.push({"object": atomObjects[a], "pos":point} );
                            }
                        }else{
                            var resAtoms= PDB.tool.getMainResAtomsByAtom(object.userData.presentAtom);
                            for(var k =0 ;k<resAtoms.length;k++){
                                var atomObjects = PDB.GROUP[gIndexies[i]].getChildrenByName( resAtoms[k].id );
                                for (var a=0; a < atomObjects.length; a++) {
                                    //atomObjects[a].position.copy(point);
                                    //object.userData.presentAtom["pos_curr"] =point;
                                    inters.push({"object": atomObjects[a], "pos":point} );
                                }
                            }
                        }
                    }
                }
                break;
            case PDB.SELECTION_ATOM:
                var gIndexies = PDB.GROUP_STRUCTURE_INDEX;
                for (var i = gIndexies.length -1; i >=0; i--) {
                    if( !PDB.GROUP[gIndexies[i]].visible)continue;
                    var tmp_inters = raycaster.intersectObjects( PDB.GROUP[gIndexies[i]].children );
                    if(tmp_inters.length<=0)continue;
                    j=0;
                    var object=tmp_inters[j].object;
                    var point=tmp_inters[0].point;
					
					inters.push({"object": object, "pos":point} );
                    
                }
                break;
            case PDB.SELECTION_OBJECT:
                for(var i in PDB.GROUP_STRUCTURE_INDEX){
                    var group= PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]];
                    var tmp_inters = raycaster.intersectObjects( group.children );
                    for (var j=0; j < tmp_inters.length; j++) {
                        inters.push( tmp_inters[j] );
                    }
                }
                break;
        }
    }
    return inters;
}

function intersectObjects( controller ) {
	if ( controller.userData.selected !== undefined ) return;
	
    var line = controller.getObjectByName( 'line' );
    var intersections = getIntersections( controller );
    if ( intersections!=undefined &&intersections.length > 0 ) {
        var intersection = intersections[ 0 ];
        if(intersection.type==="Group") {
            line.scale.z = intersection.children[0].distance;
        }else{
            line.scale.z = intersection.distance;
        }

        for(var i = 0 ; i< intersections.length ; i++) {
            var intersection = intersections[ i ];
            var object = intersection.object;
            intersected.push( object );
            PDB.tool.colorIntersectObjectRed(object,1);
        }

    } else {
        line.scale.z = 10;
    }

}

function cleanIntersected() {
    while ( intersected.length ) {
        var object = intersected.pop();
        PDB.tool.colorIntersectObjectRed(object,0);
        //PDB.render.clearGroupIndex(PDB.GROUP_INFO);
    }

}

function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

PDB.render = {
    animationView:false,
    currentNodeIndex:0,
    init : function(){
       //  //if(PDB.pdbId=="4pyp"){
       //ss     document.getElementById('player').play();
       // // }
        scene = new THREE.Scene();
        raycasterFor3 = new THREE.Raycaster();
        container = document.createElement( 'div' );
        document.body.appendChild( container );
        camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 0.1, 50000 );
        camera.position.set( PDB.cameraPosition.x, PDB.cameraPosition.y, PDB.cameraPosition.z );
        scene.background = new THREE.Color( 0x000000 );
        scene.add( camera );
        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        console.log("lightType:"+lightType);

        this.addLightsByType(lightType);


        for (var i = 0; i < PDB.GROUP_COUNT; i++) {
            PDB.GROUP[i]= new THREE.Group();
            PDB.GROUP[i].userData["group"] = i;
            scene.add(PDB.GROUP[i]);
        }

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        container.appendChild( renderer.domElement );
        //renderer.vr.enabled = true;
        //renderer.vr.standing = true;


        if(controlsType==0){
            controls = new THREE.TrackballControls( camera, renderer.domElement );
            controls.minDistance = 10;
            controls.maxDistance = 50000;
        }else if(controlsType==1){
            stats = new Stats();
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.right = '0px';
            stats.domElement.style.left = 'inherit';
            container.appendChild( stats.dom );
            controls = new THREE.OrbitControls( camera );
            controls.target.set( 0, 0, 0 );
            controls.update();
        }else{
            controls = new THREE.OrbitControls( camera, renderer.domElement );
        }


        window.addEventListener( 'resize',  this.onWindowResize, false );
    },
    initVR0:function(){
        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x808080 );
        scene.add( new THREE.HemisphereLight( 0x808080, 0x606060 ) );
        // Camera
        camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 0.1, 50000 );
        scene.add( camera );
        // Group
        for (var i = 0; i < PDB.GROUP_COUNT; i++) {
            PDB.GROUP[i]= new THREE.Group();
            PDB.GROUP[i].userData["group"] = i;
            scene.add(PDB.GROUP[i]);
        }

        this.addLightsByType(lightType);

        container = document.createElement( 'div' );
        document.body.appendChild( container );

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        container.appendChild( renderer.domElement );
        renderer.vr.enabled = true;
        renderer.vr.standing = true;
        //vr
        vrControls = new THREE.VRControls( camera );
        vrEffect = new THREE.VREffect( renderer );
        // vive controllers
        tempMatrix = new THREE.Matrix4();
        // controllers
        controller1 = new THREE.ViveController( 0 );
        for (var i=0;i<4;i++){
            controller1 = new THREE.ViveController( i );
            if(controller1.visible){
               break;
            }
        }

        controller1.standingMatrix = renderer.vr.getStandingMatrix();
        controller1.addEventListener( 'triggerdown', onTriggerDown );
        controller1.addEventListener( 'triggerup', onTriggerUp );
        controller1.addEventListener( 'menuup', onMenuUp );
        controller1.addEventListener( 'menudown', onMenuDown );
        controller1.addEventListener( 'thumbpadup', onThumbpadUp );
        controller1.addEventListener( 'thumbpaddown', onThumbpadDown );
        controller1.addEventListener( 'axischanged', onAxisChanged );
        scene.add( controller1 );

        var loader = new THREE.OBJLoader();
        loader.setPath( 'models/obj/vive-controller/' );
        loader.load( 'vr_controller_vive_1_5.obj', function ( object ) {
            var loader = new THREE.TextureLoader();
            loader.setPath( 'models/obj/vive-controller/' );
            var controller = object.children[ 0 ];
            controller.material.map = loader.load( 'onepointfive_texture.png' );
            controller.material.specularMap = loader.load( 'onepointfive_spec.png' );
            controller1.add( object.clone() );
            // controller2.add( object.clone() );
        } );

        var geometry = new THREE.Geometry();
        geometry.vertices.push( new THREE.Vector3( 0, 0,  0 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 0, -1 ) );

        var line = new THREE.Line( geometry );
        line.name = 'line';
        line.scale.z = 5;

        controller1.add( line.clone() );
        // controller2.add( line.clone() );

        raycaster = new THREE.Raycaster();

        WEBVR.getVRDisplay( function ( display ) {
            renderer.vr.setDevice( display );
            document.body.appendChild( WEBVR.getButton( display, renderer.domElement ) );
            if(PDB.pdbId=="4pyp"){
                document.getElementById('player').play();
            }
        } );
    },
	initVR:function(){
        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x808080 );
        scene.add( new THREE.HemisphereLight( 0x808080, 0x606060 ) );
        // Camera
        camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 0.1, 50000 );
		camera.position.copy(new THREE.Vector3(0,0,0));
		//camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 50 );
        scene.add( camera );
		//stats
		statsVR = new StatsVR(scene, camera);
        // Group
        for (var i = 0; i < PDB.GROUP_COUNT; i++) {
            PDB.GROUP[i]= new THREE.Group();
            PDB.GROUP[i].userData["group"] = i;
            scene.add(PDB.GROUP[i]);
        }

        this.addLightsByType(lightType);

        container = document.createElement( 'div' );
        document.body.appendChild( container );

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        container.appendChild( renderer.domElement );
        renderer.vr.enabled = true;
        //renderer.vr.standing = true;
        //vr
		document.body.appendChild( WEBVR.createButton( renderer ) );
		// controllers
		// Microsoft
		
		//controller1 = renderer.vr.getController( 0 );
		//controller1.addEventListener( 'selectstart', onSelectStart );
		//controller1.addEventListener( 'selectend', onSelectEnd );
		//vrControls = new THREE.VRControls( camera );
        //vrEffect = new THREE.VREffect( renderer );
		
		//vive
		//controller1 = new THREE.ViveController( 0 );
		// general
		//thumbstick 
		//thumbpad
		//menu
		//trigger
		//grip
		window.addEventListener( 'vr controller connected', function( event ){
			controller1 = event.detail;
			console.log("style:"+controller1.style+" "+controller1.gamepad.hand);
			console.log(controller1);
			//controller1 = new THREE.VRController( 0 );
			controller1.standingMatrix = renderer.vr.getStandingMatrix();
			controller1.addEventListener('thumbstick touch began', function (event) {
				//console.log("thumbstick touch began");
				//onThumbpadDown(event);
            })
			controller1.addEventListener('thumbstick touch ended', function (event) {
				//console.log("thumbstick touch end");
				//onThumbpadUp(event);
            })
			controller1.addEventListener('thumbpad touch began', function (event) {
				//console.log("thumbpad touch began");
				//onThumbpadDown(event);
            })
			controller1.addEventListener('thumbpad touch ended', function (event) {
				//console.log("thumbpad touch end");
				//onThumbpadUp(event);
            })
			controller1.addEventListener('thumbpad press began', function (event) {
				//console.log("thumbpad press began");
				onThumbpadDown(event);
            })
			controller1.addEventListener('thumbpad press ended', function (event) {
				//console.log("thumbpad press end");
				onThumbpadUp(event);
            })
			// Trigger (vive and microsoft ok)
			controller1.addEventListener( 'primary press began', function( event ){
                onTriggerDown(event);
			})
			// Trigger (vive and microsoft ok)
			controller1.addEventListener( 'primary press ended', function( event ){
                onTriggerUp(event);
			})
			// menu (vive and microsoft ok)
			controller1.addEventListener( 'menu press began', function( event ){
                onMenuDown(event);
			})
			// menu (vive and microsoft ok)
			controller1.addEventListener( 'menu press ended', function( event ){
                onMenuUp(event);
			})
			controller1.addEventListener( 'thumbstick axes changed', function( event ){
				//console.log("thumbstick axes end");
                onAxisChanged(event);
				//onThumbpadDown(event)
			})
			controller1.addEventListener( 'thumbpad axes changed', function( event ){
                onAxisChanged(event);
			})
			controller1.addEventListener( 'primary axes changed', function( event ){
                onAxisChanged(event);
			})
		
			scene.add( controller1 );
			var objname = 'vr_controller_vive_1_5.obj';
			var path = 'models/obj/vive-controller/' ;
			if (controller1.style==="microsoft"){
				objname = controller1.gamepad.hand+'.obj';
			    path = 'models/obj/microsoft-controller/' ;
			}
			var loader = new THREE.OBJLoader();
			loader.setPath( path );
			
			loader.load( objname, function ( object ) {
				var loader = new THREE.TextureLoader();
				loader.setPath( path);
				var controller = object.children[ 0 ];
				if (controller1.style==="microsoft"){
					console.log("onepointfive_texture png")
				}else{
					controller.material.map = loader.load( 'onepointfive_texture.png' );
					controller.material.specularMap = loader.load( 'onepointfive_spec.png' );
				}
				controller1.add( object.clone() );
				//controller2.add( object.clone() );
			} );
	
			// helpers
			var geometry = new THREE.BufferGeometry();
			geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
			geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );
			var material = new THREE.LineBasicMaterial( { vertexColors: true, linewidth: 2, blending: THREE.AdditiveBlending } );
			var line = new THREE.Line( geometry, material );
			line.name = 'line';
			line.scale.z = 5;
			controller1.add( line.clone() );
			//controller2.add( line.clone() );
		});
	
		raycaster = new THREE.Raycaster();
		//
		window.addEventListener( 'resize', onWindowResize, false );
		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
		}
        
    },
    changeToThreeMode:function (mode,travelMode) {
		var scope = this;

        PDB.mode = mode;
        PDB.TravelMode = travelMode;
        scope.removeCamera(scene);
        camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 0.1, 50000 );
        camera.position.set( 0, 0, 300 );
        scene.background = new THREE.Color( 0x000000 );
        scene.add( camera );
        console.log("lightType:"+lightType);
        //render
        scope.clearRender();
        scope.generateRender();
        //all the group position back the initial location
        PDB.tool.backToInitialPositonForDesktop();
        console.log("lightType:"+lightType);
        this.addLightsByType(lightType);

        if(controlsType==0){
            controls = new THREE.TrackballControls( camera, renderer.domElement );
            controls.minDistance = 10;
            controls.maxDistance = 50000;
        }else if(controlsType==1){
            stats = new Stats();
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.right = '0px';
            stats.domElement.style.left = 'inherit';
            container.appendChild( stats.dom );
            controls = new THREE.OrbitControls( camera );
            controls.target.set( 0, 0, 0 );
            controls.update();
        }else{
            controls = new THREE.OrbitControls( camera, renderer.domElement );
        }

        if(PDB.TravelMode === true){
            scope.openTrackMode();
        }else{
            PDB.controller.refreshGeometryByMode(PDB.config.mainMode);
            PDB.controller.refreshGeometryByMode(PDB.config.hetMode);
        }

    },
    changeToThreeMode0:function (mode,travelMode) {
        var scope = this;
        if(PDB.mode !== mode){

            PDB.mode = mode;
            PDB.TravelMode = travelMode;
            scope.removeCamera(scene);
            camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 0.1, 50000 );
            camera.position.set( 0, 0, 300 );
            scene.background = new THREE.Color( 0x000000 );
            scene.add( camera );
            console.log("lightType:"+lightType);
            //render
            scope.clearRender();
            scope.generateRender();
            //all the group position back the initial location
            PDB.tool.backToInitialPositonForDesktop();
            console.log("lightType:"+lightType);
            this.addLightsByType(lightType);
            if(controlsType==0){
                controls = new THREE.TrackballControls( camera, renderer.domElement );
                controls.minDistance = 10;
                controls.maxDistance = 50000;
            }else if(controlsType==1){
                stats = new Stats();
                stats.domElement.style.position = 'absolute';
                stats.domElement.style.right = '0px';
                stats.domElement.style.left = 'inherit';
                container.appendChild( stats.dom );
                controls = new THREE.OrbitControls( camera );
                controls.target.set( 0, 0, 0 );
                controls.update();
            }else{
                controls = new THREE.OrbitControls( camera, renderer.domElement );
            }

            if(PDB.TravelMode === true){
                scope.openTrackMode();
            }else{
                PDB.controller.refreshGeometryByMode(PDB.config.mainMode);
                PDB.controller.refreshGeometryByMode(PDB.config.hetMode);
            }
        }
    },

    changeToVrMode:function (mode,travelMode) {
        if(PDB.mode !== mode){
			var scope = this;
            PDB.mode = mode;
            PDB.TravelMode = travelMode;
            scope.clearStructure();
            scope.removeCamera(scene);

            scope.initVR();

            if(PDB.TravelMode === true){
                // PDB.controller.refreshGeometryByMode(PDB.TUBE);
                scope.openTrackMode();
            }else{
                PDB.controller.refreshGeometryByMode(PDB.config.mainMode);
                PDB.controller.refreshGeometryByMode(PDB.config.hetMode);
            }
        }
    },
    openTrackMode:function () {

        PDB.parent = new THREE.Object3D();
        scene.add( PDB.parent );

        splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );
        PDB.parent.add( splineCamera );

        var light = new THREE.PointLight( 0xffffff,  1, 0);
        light.position.copy( splineCamera.position );
        //camera.add( light );
        splineCamera.add( light );

        cameraEye = new THREE.Mesh( new THREE.SphereGeometry( 5 ), new THREE.MeshBasicMaterial( { color: 0xdddddd } ) );
        //PDB.parent.add( cameraEye );
		// console.log(PDB.TravelGeometry);
        if (PDB.TravelGeometry!="") {
            var time = Date.now();
            var looptime = 200 * 1000;
            var t = ( time % looptime ) / looptime;

            var pos = PDB.TravelGeometry.parameters.path.getPointAt( t );
            pos.multiplyScalar( PDB.TravelScale );

            // interpolation

            var segments = PDB.TravelGeometry.tangents.length;
            var pickt = t * segments;
            var pick = Math.floor( pickt );
            var pickNext = ( pick + 1 ) % segments;
            if(typeof binormal != THREE.Vector3){
                binormal = new THREE.Vector3();
            }
            if(typeof normal != THREE.Vector3){
                normal = new THREE.Vector3();
            }
            binormal.subVectors( PDB.TravelGeometry.binormals[ pickNext ], PDB.TravelGeometry.binormals[ pick ] );
            binormal.multiplyScalar( pickt - pick ).add( PDB.TravelGeometry.binormals[ pick ] );

            var dir = PDB.TravelGeometry.parameters.path.getTangentAt( t );
            var offset = 5;

            normal.copy( binormal ).cross( dir );

            // we move on a offset on its binormal
            pos.add( normal.clone().multiplyScalar( offset ) );

            splineCamera.position.copy( pos );
            cameraEye.position.copy( pos );

            // using arclength for stablization in look ahead
            var lookAt = PDB.TravelGeometry.parameters.path.getPointAt( ( t + 5 / PDB.TravelGeometry.parameters.path.getLength() ) % 1 ).multiplyScalar( PDB.TravelScale);

            // camera orientation 2 - up orientation via normal
            //if ( ! params.lookAhead ) lookAt.copy( pos ).add( dir );
            splineCamera.matrix.lookAt( splineCamera.position, lookAt, normal );
            splineCamera.rotation.setFromRotationMatrix( splineCamera.matrix, splineCamera.rotation.order );
            //cameraHelper.update();
            //params.animationView === true ? splineCamera : camera
        }

    },
    addLightsByType :function(lightType){
        if (lightType ==0){
            var light = new THREE.DirectionalLight( 0xffffff, 1.2 );
            light.position.copy( camera.position );
            camera.add( light );
        }else if (lightType ==1){
            var light = new THREE.DirectionalLight( 0xffffff );
            light.position.set( 0, 6, 0 );
            light.castShadow = true;
            light.shadow.camera.top = 2;
            light.shadow.camera.bottom = -2;
            light.shadow.camera.right = 2;
            light.shadow.camera.left = -2;
            light.shadow.mapSize.set( 4096, 4096 );
            scene.add( light );
        }else if (lightType ==2){
            var lights = [];
            lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
            lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
            lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

            lights[ 0 ].position.set( 0, 200, 0 );
            lights[ 1 ].position.set( 100, 200, 100 );
            lights[ 2 ].position.set( - 100, - 200, - 100 );

            scene.add( lights[ 0 ] );
            scene.add( lights[ 1 ] );
            scene.add( lights[ 2 ] );
        }else if(lightType ==3){
            particleLight = new THREE.Mesh( new THREE.SphereBufferGeometry( 0, 0, 0 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
            scene.add( particleLight );
            // Lights
            scene.add( new THREE.AmbientLight( 0x222222 ) );
            var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
            directionalLight.position.set( 1, 1, 1 ).normalize();
            scene.add( directionalLight );

            var pointLight = new THREE.PointLight( 0xffffff, 2, 800 );
            particleLight.add( pointLight );
        }
    },
    render : function(){
        if (PDB.mode === PDB.MODE_VR || PDB.mode === PDB.MODE_TRAVEL_VR){
            //if(controller1!=undefined){controller1.update();}
            //controller2.update();
			THREE.VRController.update();
            //vrControls.update();
			// statsVR.msStart();
            // statsVR.update();
			// statsVR.setCustom1("x:" + camera.position.x.toFixed(2));
            // statsVR.setCustom2("y:" + camera.position.y.toFixed(2));
            // statsVR.setCustom3("z:" + camera.position.z.toFixed(2));
			if(menu_panel!=undefined){
				menu_panel.lookAt( camera.position );
			}

            cleanIntersected();
            if(controller1!=undefined){intersectObjects( controller1 );}
            //intersectObjects( THREE.VRController.prototype );

            if (PDB.TravelMode === true && PDB.TravelGeometry!=="") {

                var time = Date.now();
                var looptime = 200 * 1000;
                var t = ( time % looptime ) / looptime;

                var pos = PDB.TravelGeometry.parameters.path.getPointAt( t );
                pos.multiplyScalar( PDB.TravelScale );

                // interpolation

                var segments = PDB.TravelGeometry.tangents.length;
                var pickt = t * segments;
                var pick = Math.floor( pickt );
                var pickNext = ( pick + 1 ) % segments;
                if(typeof binormal != THREE.Vector3){
                    binormal = new THREE.Vector3();
                }
                if(typeof normal != THREE.Vector3){
                    normal = new THREE.Vector3();
                }
                binormal.subVectors( PDB.TravelGeometry.binormals[ pickNext ], PDB.TravelGeometry.binormals[ pick ] );
                binormal.multiplyScalar( pickt - pick ).add( PDB.TravelGeometry.binormals[ pick ] );

                var dir = PDB.TravelGeometry.parameters.path.getTangentAt( t );
                var offset = 10;

                normal.copy( binormal ).cross( dir );

                // we move on a offset on its binormal

                pos.add( normal.clone().multiplyScalar( offset ) );

                PDB.parent.position.copy( pos );
                //cameraEye.position.copy( pos );

                // using arclength for stablization in look ahead

                var lookAt = PDB.TravelGeometry.parameters.path.getPointAt( ( t + 5 / PDB.TravelGeometry.parameters.path.getLength() ) % 1 ).multiplyScalar( PDB.TravelScale);

                // camera orientation 2 - up orientation via normal
                //if ( ! params.lookAhead ) lookAt.copy( pos ).add( dir );
                // PDB.parent.matrix.lookAt( PDB.parent.position, lookAt, normal );
                // PDB.parent.rotation.setFromRotationMatrix( PDB.parent.matrix, PDB.parent.rotation.order );

                PDB.parent.matrix.lookAt( PDB.parent.position, lookAt, normal );
                PDB.parent.rotation.setFromRotationMatrix( PDB.parent.matrix, PDB.parent.rotation.order );

                //cameraEye.matrix.lookAt( cameraEye.position, lookAt, normal );
                //cameraEye.rotation.setFromRotationMatrix( cameraEye.matrix, cameraEye.rotation.order );

                //cameraHelper.update();
                //params.animationView === true ? splineCamera : camera
                //renderer.render( scene, splineCamera );

                //renderer.render( scene, splineCamera );
                camera =splineCamera;

                //
                //camera.position.copy(pos);
                //renderer.render( scene, camera );

                //vrEffect.render( scene, camera );
            }
			// else{
                // vrEffect.render( scene, camera );
            // }
            //camera.updateProjectionMatrix();
			renderer.render( scene, camera );
			//statsVR.msEnd();

        }else if(PDB.mode === PDB.MODE_THREE || PDB.MODE_TRAVEL_THREE){
            if (PDB.TravelMode === true && PDB.TravelGeometry!="") {
                var time = Date.now();
                var looptime = 200 * 1000;
                var t = ( time % looptime ) / looptime;

                var pos = PDB.TravelGeometry.parameters.path.getPointAt( t );
                pos.multiplyScalar( PDB.TravelScale );

                // interpolation

                var segments = PDB.TravelGeometry.tangents.length;
                var pickt = t * segments;
                var pick = Math.floor( pickt );
                var pickNext = ( pick + 1 ) % segments;
                if(typeof binormal != THREE.Vector3){
                    binormal = new THREE.Vector3();
                }
                if(typeof normal != THREE.Vector3){
                    normal = new THREE.Vector3();
                }
                binormal.subVectors( PDB.TravelGeometry.binormals[ pickNext ], PDB.TravelGeometry.binormals[ pick ] );
                binormal.multiplyScalar( pickt - pick ).add( PDB.TravelGeometry.binormals[ pick ] );

                var dir = PDB.TravelGeometry.parameters.path.getTangentAt( t );
                var offset = 10;

                normal.copy( binormal ).cross( dir );

                // we move on a offset on its binormal

                pos.add( normal.clone().multiplyScalar( offset ) );

                splineCamera.position.copy( pos );
                cameraEye.position.copy( pos );

                // using arclength for stablization in look ahead

                var lookAt = PDB.TravelGeometry.parameters.path.getPointAt( ( t + 5 / PDB.TravelGeometry.parameters.path.getLength() ) % 1 ).multiplyScalar( PDB.TravelScale);

                // camera orientation 2 - up orientation via normal

                //if ( ! params.lookAhead ) lookAt.copy( pos ).add( dir );
                splineCamera.matrix.lookAt( splineCamera.position, lookAt, normal );
                splineCamera.rotation.setFromRotationMatrix( splineCamera.matrix, splineCamera.rotation.order );

                //cameraHelper.update();
                //params.animationView === true ? splineCamera : camera
                renderer.render( scene, splineCamera );
            }else{
                raycasterFor3.setFromCamera( mouse, camera );
                var allObjs = [];
                var groupMain = PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[PDB.GROUP_MAIN]];
                var groupHet = PDB.GROUP[PDB.GROUP_HET];
                var groupMutation = PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[PDB.GROUP_MUTATION]];
                if(groupMain != undefined && groupMain.children.length > 0 ){
                    for (var i =0 ; i<groupMain.children.length;i++){
                        allObjs.push(groupMain.children[i]);
                    }
                }
                if(groupHet!=undefined && groupHet.children.length > 0 ){
                    for (var i =0 ; i<groupHet.children.length;i++){
                        allObjs.push(groupHet.children[i]);
                    }
                }
                if(groupMutation!=undefined && groupMutation.children.length > 0 ){
                    for (var i =0 ; i<groupMutation.children.length;i++){
                        allObjs.push(groupMutation.children[i]);
                    }
                }
                var intersects = raycasterFor3.intersectObjects( allObjs );
                if ( intersects.length > 0 ) {
                    if ( INTERSECTED != intersects[ 0 ].object ) {
                        PDB.render.clearGroupIndex(PDB.GROUP_INFO);
                        if ( INTERSECTED && INTERSECTED.material != undefined && INTERSECTED.material.emissive!= undefined)
                        {
                            INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
                        }
                        INTERSECTED = intersects[ 0 ].object;
                        if(INTERSECTED.material != undefined && INTERSECTED.material.emissive!= undefined){
                            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                            INTERSECTED.material.emissive.setHex( 0xff0000 );
                        }
                        if(INTERSECTED.userData.presentAtom != undefined){
                            // PDB.painter.showAtomLabel(INTERSECTED.userData.presentAtom);
                            var atom  = INTERSECTED.userData.presentAtom;
                            var message = atom.chainname.toUpperCase() +"."
                                + atom.resname.substring(0,1).toUpperCase()+ atom.resname.substring(1) + "."+ atom.resid
                                +"."+atom.name.substring(0,1).toUpperCase()+atom.name.substring(1);
                            var pos =  PDB.tool.getAtomInfoPosition(atom.pos_centered,camera.position);
                            PDB.drawer.drawTextForDesktop(PDB.GROUP_INFO,pos,
                                message,"",atom.color,180);
                        }
                        if(INTERSECTED.userData.mutation!=undefined ){
                            // PDB.painter.showAtomLabel(INTERSECTED.userData.presentAtom);
                        }
                    }
                } else {
                    if ( INTERSECTED && INTERSECTED.material != undefined && INTERSECTED.material.emissive!= undefined)
                    {
                        INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
                    }
                    INTERSECTED = null;
                    PDB.render.clearGroupIndex(PDB.GROUP_INFO);
                }
                renderer.render( scene, camera );
            }
            camera.updateProjectionMatrix();
            controls.update();
        }
        //mutation effect
        if(PDB.GROUP[PDB.GROUP_MUTATION] !== undefined && PDB.GROUP[PDB.GROUP_MUTATION].children.length > 0){
            var time = Date.now();
            if(time - tmpTime >= 500){
                PDB.GROUP[PDB.GROUP_MUTATION].visible = !PDB.GROUP[PDB.GROUP_MUTATION].visible;
                tmpTime = time;
            }
        }

        //rotation effect
        if(PDB.ROTATION_START_FLAG){
            PDB.tool.rotation(PDB.GROUP_STRUCTURE_INDEX,PDB.ROTATION_DIRECTION);
        }
        //demo
        // PDB.render.showDemo();
    },
    showDemo : function () {
        if(PDB.DEMO.FLAG){
            var time = Date.now();//
            if(time - PDB.DEMO.LAST_EXE_TIME >= 8000 && PDB.DEMO.INDEX!=PDB.DEMO.PRE_INDEX){

                console.log(PDB.DEMO.INDEX);
                console.log("start----");
                PDB.DEMO.PRE_INDEX = PDB.DEMO.INDEX;
                switch (PDB.DEMO.INDEX){
                    case 0 :
                        PDB.config.mainMode = PDB.SPHERE;
                        PDB.controller.refreshGeometryByMode(PDB.config.mainMode);
                        break;
                    case 1 :
                        PDB.config.mainMode = PDB.TUBE;
                        PDB.controller.refreshGeometryByMode(PDB.config.mainMode);
                        break;
                    case 2 :
                        PDB.config.mainMode = PDB.RIBBON_ELLIPSE;
                        PDB.controller.refreshGeometryByMode(PDB.config.mainMode);
                        break;
                    case 3 :
                        PDB.config.hetMode = PDB.HET_SPHERE;
                        PDB.controller.refreshGeometryByMode(PDB.config.hetMode);
                        break;
                    case 4 :
                        PDB.config.hetMode = PDB.HET_BALL_ROD;
                        PDB.controller.refreshGeometryByMode(PDB.config.hetMode);
                        break;
                    case 5 :
                        PDB.controller.clear(4,undefined);
                        PDB.CONFIG.startSegmentSurfaceID=0;
                        PDB.CONFIG.endSegmentSurfaceID=0;
                        PDB.SURFACE_WIREFRAME = true;
                        PDB.SURFACE_OPACITY = 0.5;
                        PDB.SURFACE_TYPE = 1;
                        PDB.controller.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,PDB.SURFACE_OPACITY,PDB.SURFACE_WIREFRAME);
                        break;
                    case 6 :
                        PDB.controller.clear(4,undefined);
                        PDB.SURFACE_WIREFRAME = false;
                        PDB.SURFACE_OPACITY = 0.6;
                        PDB.SURFACE_TYPE = 3;
                        PDB.controller.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,PDB.SURFACE_OPACITY,PDB.SURFACE_WIREFRAME);
                        break;
                    case 7 :
                        //hide surface
                        PDB.GROUP[PDB.GROUP_SURFACE].visible = false;
                        PDB.controller.switchColorBymode(602);
                        break;
                    case 8 :
                        PDB.controller.switchColorBymode(603);
                        break;
                    case 9 :
                        PDB.controller.switchColorBymode(606);
                        break;
                    case 10 :
                        PDB.controller.switchColorBymode(609);
                        break;
                    case 11 :
                        PDB.render.clear(3);
                        var startid= PDB.tool.getFirstAtomByResidueId(10, "a")[1];
                        var endid= PDB.tool.getLastAtomByResidueId(80, "a")[1];
                        PDB.controller.fragmentPainter(startid, endid,"Rectangle");
                        break;
                    case 12 :
                        PDB.render.clear(3);
                        var startid= PDB.tool.getFirstAtomByResidueId(50, "a")[1];
                        var endid= PDB.tool.getLastAtomByResidueId(55, "a")[1];
                        PDB.SURFACE_OPACITY = 0.7;
                        PDB.controller.fragmentPainter(startid, endid,"Surface");
                        break;
                    case 13 :
                        //hide surface
                        PDB.GROUP[PDB.GROUP_SURFACE].visible = false;
                        //show mutation
                        PDB.controller.clear(4,undefined);
                        PDB.painter.showMutation(PDB.mutation);
                        break;
                    case 14 :
                        //hide surface
                        PDB.GROUP[PDB.GROUP_SURFACE].visible = false;
                        //hide mutation
                        PDB.render.clearGroupIndex(PDB.GROUP_MUTATION);

                        var locationStart = PDB.tool.getMainAtom(PDB.pdbId,700);
                        locationStart.pos_curr = locationStart.pos_centered;
                        var locationEnd = PDB.tool.getMainAtom(PDB.pdbId,750);
                        locationEnd.pos_curr = locationEnd.pos_centered;
                        PDB.painter.showDistance(locationStart,locationEnd);

                        break;
                    case 15 :
                        PDB.render.clearGroupIndex(PDB.GROUP_INFO);
                        PDB.controller.clear(4,undefined);
                        PDB.DEMO.INDEX = -1;
                        break;
                }
                PDB.DEMO.INDEX = PDB.DEMO.INDEX+1;
                //PDB.DEMO.PRE_INDEX =
                PDB.DEMO.LAST_EXE_TIME = time = Date.now();
                console.log("end----");
            }

        }
    },
    animate : function(){
		// if(PDB.mode === PDB.MODE_VR||PDB.mode === PDB.MODE_THREE){
			// if((PDB.cameraPosition.x!=camera.position.x||PDB.cameraPosition.y!=camera.position.y||PDB.cameraPosition.y!=camera.position.y)){

			// }
			// console.log(PDB.GeoCenterOffset);
			// console.log(camera.position);
		// }

        if(PDB.mode === PDB.MODE_VR || PDB.mode === PDB.MODE_TRAVEL_VR){
            //zdw vr mode
			// 86 mode
            //vrControls.update();
            //PDB.render.render();
            //vrEffect.requestAnimationFrame( PDB.render.animate );
			renderer.setAnimationLoop( PDB.render.render );
        }else if(PDB.mode === PDB.MODE_THREE || PDB.MODE_TRAVEL_THREE){
            //zdw three mode
            PDB.render.render();
            requestAnimationFrame( PDB.render.animate );
        }
		//
		var offset = camera.position;		
		var movenlength = Math.sqrt(Math.pow(offset.x-PDB.offset.x,2)+Math.pow(offset.y-PDB.offset.y,2)+Math.pow(offset.z-PDB.offset.z,2));			
		if(movenlength>0.01){//0.01值可以调整，以适应不同的眼镜移动灵敏度
			var vec = {x:offset.x - PDB.offset.x,y:offset.y - PDB.offset.y,z:offset.z - PDB.offset.z}
			PDB.tool.getRealVectorForRepeatPainter(vec);			
		}
		PDB.offset = offset.clone();
    },
    onWindowResize : function(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );

        // zwd
        // if (PDB.VRMode) {
        //     vrEffect.setSize( window.innerWidth, window.innerHeight );
        // }
    },
    hideMenu : function(){
        PDB.render.clearGroupIndex(PDB.GROUP_MENU);
        PDB.render.clearGroupIndex(PDB.GROUP_KEYBOARD);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_MAIN);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_LABEL);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_TRAVEL);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_EX_HET);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_HET);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_COLOR);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_MEASURE);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_DRAG);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_FRAGMENT);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_SURFACE);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_MUTATION);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_ROTATION);
		PDB.render.clearGroupIndex(PDB.GROUP_MENU_DIRECTION);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_DRUG);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_DENSITYMAP);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_CONSERVATION);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_HBOND);
        PDB.render.clearGroupIndex(PDB.GROUP_INPUT);
        PDB.render.showStructure();

    },
    hideSubMenu : function(){
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_MAIN);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_HET);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_LABEL);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_TRAVEL);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_SURFACE);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_MUTATION);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_ROTATION);
		PDB.render.clearGroupIndex(PDB.GROUP_MENU_DIRECTION);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_DRUG);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_DENSITYMAP);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_CONSERVATION);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_HBOND);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_EX_HET);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_COLOR);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_MEASURE);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_DRAG);
        PDB.render.clearGroupIndex(PDB.GROUP_MENU_FRAGMENT);
    },
    showMenu : function(){
        PDB.painter.showKeyboard();
        PDB.painter.showMenu(PDB.MENU_TYPE_FIRST);
        menu_panel = new THREE.Object3D();
        scene.add(menu_panel);
        menu_panel.add(PDB.GROUP[PDB.GROUP_MENU]);
        menu_panel.add(PDB.GROUP[PDB.GROUP_KEYBOARD]);
        menu_panel.add(PDB.GROUP[PDB.GROUP_MENU_MAIN]);
        menu_panel.add(PDB.GROUP[PDB.GROUP_MENU_LABEL]);
        menu_panel.add(PDB.GROUP[PDB.GROUP_MENU_EX_HET]);
        menu_panel.add(PDB.GROUP[PDB.GROUP_MENU_TRAVEL]);
        menu_panel.add(PDB.GROUP[PDB.GROUP_MENU_SURFACE]);
        menu_panel.add(PDB.GROUP[PDB.GROUP_MENU_MUTATION]);
        menu_panel.add(PDB.GROUP[PDB.GROUP_MENU_ROTATION]);
		menu_panel.add(PDB.GROUP[PDB.GROUP_MENU_DIRECTION]);
        menu_panel.add(PDB.GROUP[PDB.GROUP_MENU_DRUG]);
        menu_panel.add(PDB.GROUP[PDB.GROUP_MENU_DENSITYMAP]);
        menu_panel.add(PDB.GROUP[PDB.GROUP_MENU_CONSERVATION]);
        menu_panel.add(PDB.GROUP[PDB.GROUP_MENU_HBOND]);

        menu_panel.add(PDB.GROUP[PDB.GROUP_MENU_HET]);
        menu_panel.add(PDB.GROUP[PDB.GROUP_MENU_COLOR]);
        menu_panel.add(PDB.GROUP[PDB.GROUP_MENU_MEASURE]);
        menu_panel.add(PDB.GROUP[PDB.GROUP_MENU_DRAG]);
        menu_panel.add(PDB.GROUP[PDB.GROUP_MENU_FRAGMENT]);
        menu_panel.add(PDB.GROUP[PDB.GROUP_INPUT]);
       
		menu_panel.position.set( 0, 0, -3 );

        showMenu=true;

        PDB.render.hideStructure();
    },
    hideStructure : function(){
        for(var i in PDB.GROUP_STRUCTURE_INDEX){
            PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].visible=false;
        }
    },
    showStructure : function(){
        for(var i in PDB.GROUP_STRUCTURE_INDEX){
            PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].visible=true;
        }
    },
    clearStructure : function(){
		for(var i = 0;i<PDB.GROUP_STRUCTURE_INDEX.length;i++){
			this.clearGroupIndex(PDB.GROUP_STRUCTURE_INDEX[i]);
		}

        PDB.parent="";
    },
    clearMain : function(){
		for(var i = 0;i<PDB.GROUP_MAIN_INDEX.length;i++){
			this.clearGroupIndex(PDB.GROUP_MAIN_INDEX[i]);
		}
    },
    clearGroup:function(group){
        if(group != undefined && group.children.length > 0){
           group.children = [];
        }
    },
    clearGroupIndex0:function(group){
        if(PDB.GROUP[group] != undefined && PDB.GROUP[group].children.length > 0){
            PDB.GROUP[group].children = [];
        }
    },
    clearGroupIndex:function(groupIndex){
		

        if(PDB.GROUP[groupIndex] != undefined && PDB.GROUP[groupIndex].children.length > 0){
            var children = PDB.GROUP[groupIndex].children;
            for (var i = 0;i<children.length;i++){
                if(children[i] instanceof THREE.Mesh){
                    var meshObj = children[i];
                    if(meshObj.geometry){
                        meshObj.geometry.dispose();
                    }
                    if(meshObj.material && meshObj.material.dispose){
                        meshObj.material.dispose();
                    }
                    delete(meshObj);
					meshObj = undefined;
                }
            }
            PDB.GROUP[groupIndex].children = [];
        }
    },
    clear:function(mode){
        THREE.Cache.clear();
        switch ( mode ) {
            case 0:
                for(var i in PDB.GROUP_MAIN_INDEX){
                    PDB.render.clearGroupIndex(PDB.GROUP_MAIN_INDEX[i]);
                }
                break;
            case 1:
                PDB.render.clearGroupIndex(PDB.GROUP_HET);
                break;
            case 2:
                for(var i in PDB.GROUP_STRUCTURE_INDEX){
                    PDB.render.clearGroupIndex(PDB.GROUP_STRUCTURE_INDEX[i]);
                }
                PDB.TravelGeometry="";

                if(scene !== undefined && scene.children.length > 0){
                   scene.children.forEach(function(object){
                       if(object instanceof THREE.Mesh){
                           scene.remove(object);
                       }
                   })
                }
                break;
            case 3:
                PDB.render.clearGroupIndex(PDB.GROUP_SURFACE);
            case 4:
                PDB.render.clearGroupIndex(PDB.GROUP_MUTATION);
                break;
            case 5:
                PDB.render.clearGroupIndex(PDB.GROUP_SLICE);
                var rightMenu = document.getElementById("rightmenu");
                if(rightMenu){
                    rightMenu.innerHTML="";
                }
                break;
        }
    },
    generateRender : function () {
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        container.appendChild( renderer.domElement );
        renderer.vr.enabled = true;
        renderer.vr.standing = true;


    },
    clearRender : function () {
        if(container.children.length > 0){
            container.removeChild(container.childNodes[0]);
        }
        //delete Enter vr/exit vr button
        if(document.body.childNodes.length > 0){
            var obj = document.body.childNodes[document.body.childNodes.length -1 ];
            if(obj.innerHTML ==="ENTER VR" || obj.innerHTML ==="EXIT VR"){
                document.body.removeChild(obj);
            }
        }
        if(PDB.parent instanceof THREE.Object3D && PDB.parent.children.length > 0){
            var size =  PDB.parent.children.length;
            var deleteArray = [];
            for(var i =0 ; i<size ; i++){
                deleteArray.push(PDB.parent.children[i]);
            }
            deleteArray.forEach(function (obj) {
                PDB.parent.remove(obj);
            })
        }
    },
    removeCamera:function (scene) {
        var count = scene.children.length;
        var deleteArray = [];
        for(var i=0 ; i < count ; i++ ){
            var obj = scene.children[i];
            if(obj instanceof THREE.PerspectiveCamera){
                deleteArray.push(obj);
            }
            if(obj instanceof THREE.PerspectiveCamera){
                deleteArray.push(obj);
            }
            if(obj instanceof THREE.HemisphereLight){
                deleteArray.push(obj);
            }
            if(obj instanceof THREE.PointLight){
                deleteArray.push(obj);
            }
            if(obj instanceof THREE.ViveController){
                deleteArray.push(obj);
            }
        }
        deleteArray.forEach(function (obj) {
            scene.remove(obj);
        })

    },
    exportToObj:function() {
        var exporter = new THREE.OBJExporter();
        var result = exporter.parse( scene );
        //console.log(result);
        var f = PDB.pdbId+".obj";

        PDB.tool.writeTextFile(f, result);
    }

};
