// =====================
// parse api parameter
// =====================

var kv = {};
if ( location.search ) {
    var q = location.search.slice(1).split('&');
    q.forEach(function(k_v) {
        var k_v_array = k_v.split('=');
        kv[k_v_array[0]] = decodeURIComponent(k_v_array[1]);
    });
    var surfaceOpc,surfaceType,surfaceMode,showSurface,colorMode,rotation,travel,tcga,vmode;
    w3m_isset(kv.id) ? PDB.pdbId = kv.id : void(0);
    w3m_isset(kv.panelShow) ? PDB.panelShow = parseInt(kv.panelShow) : void(0);
    w3m_isset(kv.mainMode) ? PDB.config.mainMode = parseInt(kv.mainMode) : void(0);
    w3m_isset(kv.rotation) ? rotation = parseInt(kv.rotation) : void(0);


    w3m_isset(kv.showSurface) ? showSurface = parseInt(kv.showSurface) : void(0);
    w3m_isset(kv.surfaceType) ? surfaceType = parseInt(kv.surfaceType) : void(0);
    w3m_isset(kv.surfaceOpc) ? surfaceOpc = Number(kv.surfaceOpc) : void(0);

    w3m_isset(kv.colorMode) ? colorMode = parseInt(kv.colorMode) : void(0);

    w3m_isset(kv.travel) ? travel = parseInt(kv.travel) : void(0);

    w3m_isset(kv.tcga) ? tcga = parseInt(kv.tcga) : void(0);

    w3m_isset(kv.vmode) ? vmode = kv.vmode:"vr" ;

    if(PDB.panelShow==PDB.config.panelOpen){
        var panels = document.getElementsByClassName("panel");
        panels.searchDiv.style.display='block';
        panels.topmenu.style.display='block';
        panels.info.style.display='block';
    }else if(PDB.panelShow==PDB.config.panelClose){
        var panels = document.getElementsByClassName("panel");
        panels.searchDiv.style.display='none';
        panels.topmenu.style.display='none';
        panels.info.style.display='none';
    }

    if(surfaceOpc&&!isNaN(surfaceOpc)){
        PDB.SURFACE_OPACITY =surfaceOpc;
    }
    if(surfaceType&&!isNaN(surfaceType)){
        PDB.SURFACE_TYPE = surfaceType;
    }
    if(!isNaN(showSurface)){
        PDB.isShowSurface = showSurface;
    }

    if(!isNaN(colorMode)){
        w3m.config.color_mode_main = colorMode;
        for ( var i in w3m.mol ) {
            w3m.tool.updateMolColorMap(i);
        }
    }
    if(rotation==0){
        PDB.ROTATION_DIRECTION = 0;
        PDB.ROTATION_START_FLAG= true;
    }else if(rotation==1){
        PDB.ROTATION_DIRECTION = 1;
        PDB.ROTATION_START_FLAG= true;
    }
    if(travel==1){
        PDB.TravelMode = true;
    }

    if(tcga==1) {
        var url = PDB.MUTATION_URL + "&pdbid=" + PDB.pdbId.toUpperCase() + "&ds=tcga";
        PDB.tool.ajax.get(url, function (text) {
            PDB.controller.clear(4, undefined);
            PDB.painter.showMutation(text);
        })
    }


    switch (vmode){
        case "desktop":
            PDB.mode=PDB.MODE_THREE;
            break;
        case "vr":
            PDB.mode=PDB.MODE_VR;
            break;
        case "travel":
            PDB.mode=PDB.MODE_TRAVEL_THREE;
            PDB.TravelMode = true;
            break;
        case "travelvr":
            PDB.mode=PDB.MODE_VR;
            PDB.TravelMode = true;
            break;
    }


    /*if ( w3m_isset(kv.config) ) {
     var cf = JSON.parse(kv.config);
     for ( var i in cf ) {
     w3m.config[i] = cf[i];
     }
     }
     if ( w3m_isset(kv.color) ) {
     var rgb = JSON.parse(kv.color);
     for ( var i in rgb ) {
     w3m.rgb[i] = rgb[i];
     }
     }*/
}
//	PDB.mode=PDB.MODE_VR;
PDB.controller.init();
PDB.CHANGESTYLE = PDB.DRAWSTYLE_FRAGMENT;
PDB.CONFIG = PDB.CONFIG_HIGH;
PDB.controller.requestRemote(PDB.pdbId);

PDB.controller.switchColorBymode("607");
//PDB.trigger = PDB.TRIGGER_EVENT_DRAG;
//PDB.selection_mode= PDB.SELECTION_DRUG;



function endRecord(){
    p=endrecording();
    p.then(
        result => voiceOperation(result), // shows "done!" after 1 second
        error => alert(error) // doesn't run
    );
    // console.log(a)
}

//
function voiceOperation(code) {
    switch (code) {
        case 73:
            PDB.controller.startRotation(1,1);
            break;
        case 74:
            PDB.controller.startRotation(1,0);
            break;
        case 701:
            PDB.controller.cancelRotation();
            break;
        case 4:
            break;
        case 5:
            break;
        case 6:
            break;
        case 7:
            break;
        case 8:
            break;
        case 9:
            break;
        case 10:
            break;
        case 11:
            break;
        case 12:
            break;
        case 13:
            break;
        case 14:
            break;
        case 15:
            break;
        case 16:
            break;
        case 17:
            break;
        case 18:
            break;
        case 19:
            break;
        case 20:
            break;
        case 21:
            break;
        case 22:
            break;
        case 23:
            break;
        case 24:
            break;
    }
}
