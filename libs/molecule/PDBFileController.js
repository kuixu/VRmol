/**
 * Created by zhangdawei on 2017/6/27.
 */

// vr 可用提示
PDB.controller = {
    webvr : function(){
        WEBVR.checkAvailability().catch( function( message ) {
            document.body.appendChild( WEBVR.getMessageContainer( message ) );
        } );
    },
    init : function(){
        // this.webvr();
        this.createMenu();
        if(PDB.mode===PDB.MODE_VR){
            PDB.render.initVR();
        }else{
            PDB.render.init();
        }
    },
    createMenu : function(){
        var scope = this;

        //search button
        var b_search = document.getElementById("search_button");

        b_search.addEventListener( 'click', function() {
            var input = document.getElementById("search_text");
            if(input.value.length === 0){
                input.value = PDB.pdbId;
            }
            scope.requestRemote(input.value);
        } );

        //=============================== Mode for structure =======================
        //showing mode
        var vrMode     = document.getElementById( "vrMode" );
        var threeMode     = document.getElementById( "threeMode" );
        var threeWithTravel  = document.getElementById( "threeWithTravel" );
        var vrWithTravel  = document.getElementById( "vrWithTravel" );

        threeMode.addEventListener( 'click', function(e) {
            //PDB.render.changeToThreeMode(PDB.MODE_THREE,false);
            window.location.href="index.html?vmode=desktop";
        } );

        threeWithTravel.addEventListener( 'click', function(e) {
            PDB.CHANGESTYLE = 6;
            PDB.render.clearStructure();
            PDB.render.changeToThreeMode(PDB.MODE_TRAVEL_THREE,true);
            PDB.painter.showResidueByThreeTravel();

        } );

        vrMode.addEventListener( 'click', function(e) {
            //PDB.render.changeToVrMode(PDB.MODE_VR,false);
            window.location.href="index.html?vmode=vr";
            //document.querySelector("#vrMode").checked=true;
            //document.querySelector("#vrMode").checked=true;
        } );

        vrWithTravel.addEventListener( 'click', function(e) {
            PDB.render.changeToVrMode(PDB.MODE_TRAVEL_VR,true);
        } );

        //upload button
        var b_upload = document.getElementById("upload_button");

        b_upload.addEventListener( 'change', function() {
            if(this.files.length > 0){
                var file = this.files[0];
                if(file.name.endsWith("gz")){
                    w3m.file.getArrayBuffer(file,function (response) {
                        var mapId = file.name.split(".")[0];
                        PDB.controller.emmapLoadFromFile(response,"gz",function (emmap) {
                            PDB.render.clearGroupIndex(PDB.GROUP_MAIN);
                            PDB.render.clear(2);
                            PDB.EMMAP.TYPE = 1;
                            if(emmap){
                                switch (PDB.EMMAP.TYPE){
                                    case 0:
                                        PDB.painter.showMapSolid(emmap,emmap.threshold);
                                        break;
                                    case 1:
                                        PDB.painter.showMapSurface(emmap,emmap.threshold,false);
                                        break;
                                    case 2:
                                        PDB.painter.showMapSurface(emmap,emmap.threshold,true);
                                }
                            }
                        });
                    })
                }else if(file.name.endsWith("mrc")){
                    w3m.file.getArrayBuffer(file,function (response) {
                        var mapId = file.name.split(".")[0];
                        PDB.controller.emmapLoadFromFile(response,"mrc",function (emmap) {
                            PDB.render.clearGroupIndex(PDB.GROUP_MAIN);
                            PDB.render.clear(2);
                            PDB.EMMAP.TYPE = 1;
                            if(emmap){
                                switch (PDB.EMMAP.TYPE){
                                    case 0:
                                        PDB.painter.showMapSolid(emmap,emmap.threshold);
                                        break;
                                    case 1:
                                        PDB.painter.showMapSurface(emmap,emmap.threshold,false);
                                        break;
                                    case 2:
                                        PDB.painter.showMapSurface(emmap,emmap.threshold,true);
                                }
                            }
                        });
                    })
                }else{
                    console.log("controller.requestRemote"+name);
                    PDB.CHANGESTYLE = 0;//切换mode，放弃fragment
                    scope.clear(2,-1);
                    PDB.loader.clear();
                    PDB.loader.loadFromDisk(file,function () {
                        //赋值
                        var input = document.getElementById("search_text");
                        input.value = PDB.pdbId;
                        scope.drawGeometry(PDB.config.mainMode);
                        scope.drawGeometry(PDB.config.hetMode);
                        if(PDB.isShowSurface==PDB.config.openSurface){
                            scope.drawGeometry(PDB.config.surfaceMode);
                        }
                        scope.initFragmentSelect();
                        if(!PDB.isAnimate){
                            PDB.render.animate();
                            PDB.isAnimate=true;
                        }
                        if( PDB.TravelMode){
                            PDB.CHANGESTYLE = 6;
                            PDB.render.clearStructure();
                            PDB.render.changeToThreeMode(PDB.MODE_TRAVEL_THREE,true);
                            PDB.painter.showResidueByThreeTravel();
                        }
                    });
                }
            }
        } );

		var b_showWater = document.getElementById("showWater");

        b_showWater.addEventListener( 'click', function(e) {
			if(e.target.checked){
			   PDB.isShowWater = true;
			}else{
				PDB.isShowWater = false;
			}
            scope.drawGeometry(PDB.config.hetMode);
        } );
		//drugSurface
		
		var drugSurface = document.getElementById("drugSurface");
		drugSurface.addEventListener('click',function (e) {
			
			if(e.target.checked){
				PDB.painter.showDrugSurface(PDB.config.selectedDrug);
				// 
			}else{
				PDB.render.clearGroupIndex(PDB.GROUP_SURFACE_HET);
			}
		});
		
		
        var loadDensityMap = document.getElementById("loadDensityMap");
        loadDensityMap.addEventListener('click',function () {
            var url = SERVERURL+"/server/api.php?taskid=13&pdbid="+PDB.pdbId.toUpperCase();
            if(ServerType!==2){
                url=SERVERURL+"/data/map.json";
            }
            PDB.tool.ajax.get(url,function (text) {
                //PDB.render.clear(2);
				//生成Material 数组
				PDB.MATERIALLIST = [];				
				if(PDB.MATERIALLIST.length==0){
					for(var i = 1000;i<1100;i++){
						var material = new THREE.MeshPhongMaterial( { color: new THREE.Color(w3m.rgb[i][0],w3m.rgb[i][1],w3m.rgb[i][2]), wireframe: false, side: THREE.DoubleSide} );
						PDB.MATERIALLIST.push(material);
					}
				}
                //生成面板
                var jsonObj = JSON.parse(text);
                if(jsonObj.code === 1 && jsonObj.data !== undefined){
                    PDB.tool.createDensityMapPanel(jsonObj);
                }

                var mapserver = "map";
                if(ServerType!==2){
                    mapserver = "map-local";
                }
                scope.emmapLoad(PDB.EMMAP.FIRST_ID, mapserver,function (emmap) {
                    var middleSlice = Math.floor((PDB.EMMAP.MIN_SLICE+PDB.EMMAP.MAX_SLICE)/2);
                    // PDB.painter.showMapSurface(emmap,emmap.threshold,false);
                    switch (PDB.EMMAP.TYPE){
                        case 0:
                            PDB.painter.showMapSolid(emmap,emmap.threshold);
                            break;
                        case 1:
                            PDB.painter.showMapSurface(emmap,emmap.threshold,false);
                            break;
                        case 2:
                            PDB.painter.showMapSurface(emmap,emmap.threshold,true);
                    }
                    PDB.render.clearStructure();
                    PDB.tool.changeDensityMapRangeValue(emmap);
                })
            })
        });

        var input = document.getElementById("search_text");
        input.value = PDB.pdbId ;

        var b_line      = document.getElementById( "b_line" );
        var b_dot       = document.getElementById( "b_dot" );
        var b_backbone  = document.getElementById( "b_backbone" );
        var b_a         = document.getElementById( "b_a" );
        var b_b         = document.getElementById( "b_b" );
        var b_ab        = document.getElementById( "b_ab" );
        var b_tube      = document.getElementById( "b_tube" );
        var b_flat      = document.getElementById( "b_flat" );
        var b_ellipse   = document.getElementById( "b_ellipse" );
        var b_rectangle = document.getElementById( "b_rectangle" );
        var b_strip     = document.getElementById( "b_strip" );
        var b_railway   = document.getElementById( "b_railway" );
        var b_sse       = document.getElementById( "b_sse" );
        var b_surface   = document.getElementById( "b_surface" );


        b_line.addEventListener( 'click', function() {
            PDB.render.clear(5);
            PDB.config.mainMode = PDB.LINE;
            scope.refreshGeometryByMode(PDB.config.mainMode);
        } );
        b_dot.addEventListener( 'click', function() {
            PDB.render.clear(5);
            PDB.config.mainMode = PDB.DOT;
            scope.refreshGeometryByMode(PDB.config.mainMode);
        } );
        b_backbone.addEventListener( 'click', function() {
            PDB.render.clear(5);
            PDB.config.mainMode = PDB.BACKBONE;
            scope.refreshGeometryByMode(PDB.config.mainMode);
        } );
        b_a.addEventListener( 'click', function() {
            PDB.render.clear(5);
            PDB.config.mainMode = PDB.SPHERE;
            scope.refreshGeometryByMode(PDB.config.mainMode);
        } );
        b_b.addEventListener( 'click', function() {
            PDB.render.clear(5);
            PDB.config.mainMode = PDB.STICK;
            scope.refreshGeometryByMode(PDB.config.mainMode);
        } );
        b_ab.addEventListener( 'click', function() {
            PDB.render.clear(5);
            PDB.config.mainMode = PDB.BALL_AND_ROD;
            scope.refreshGeometryByMode(PDB.config.mainMode);
        } );
        b_tube.addEventListener( 'click', function() {
            PDB.render.clear(5);
            PDB.config.mainMode = PDB.TUBE;
            scope.refreshGeometryByMode(PDB.config.mainMode);
        } );
        b_flat.addEventListener( 'click', function() {
            PDB.render.clear(5);
            PDB.config.mainMode = PDB.RIBBON_FLAT;
            scope.refreshGeometryByMode(PDB.config.mainMode);
        } );
        b_ellipse.addEventListener( 'click', function() {
            PDB.render.clear(5);
            PDB.config.mainMode = PDB.RIBBON_ELLIPSE;
            scope.refreshGeometryByMode(PDB.config.mainMode);
        } );
        b_rectangle.addEventListener( 'click', function() {
            PDB.render.clear(5);
            PDB.config.mainMode = PDB.RIBBON_RECTANGLE;
            scope.refreshGeometryByMode(PDB.config.mainMode);
        } );
        b_strip.addEventListener( 'click', function() {
            PDB.render.clear(5);
            PDB.config.mainMode = PDB.RIBBON_STRIP;
            scope.refreshGeometryByMode(PDB.config.mainMode);
        } );
        b_railway.addEventListener( 'click', function() {
            PDB.render.clear(5);
            PDB.config.mainMode = PDB.RIBBON_RAILWAY;
            scope.refreshGeometryByMode(PDB.config.mainMode);
        } );
        b_sse.addEventListener( 'click', function() {
            PDB.render.clear(5);
            PDB.config.mainMode = PDB.CARTOON_SSE;
            scope.refreshGeometryByMode(PDB.config.mainMode);
        });

        var h_line      = document.getElementById( "h_line" );
        var h_sphere    = document.getElementById( "h_sphere" );
        var h_stick     = document.getElementById( "h_stick" );
        var h_ballrod   = document.getElementById( "h_ballrod" );
        h_line.addEventListener( 'click', function() {
            PDB.render.clear(5);
            PDB.config.hetMode = PDB.HET_LINE;
            scope.refreshGeometryByMode(PDB.config.hetMode);
        } );
        h_sphere.addEventListener( 'click', function() {
            PDB.render.clear(5);
            PDB.config.hetMode = PDB.HET_SPHERE;
            scope.refreshGeometryByMode(PDB.config.hetMode);
        } );
        h_stick.addEventListener( 'click', function() {
            PDB.render.clear(5);
            PDB.config.hetMode = PDB.HET_STICK;
            scope.refreshGeometryByMode(PDB.config.hetMode);
        } );
        h_ballrod.addEventListener( 'click', function() {
            PDB.render.clear(5);
            PDB.config.hetMode = PDB.HET_BALL_ROD;
            scope.refreshGeometryByMode(PDB.config.hetMode);
        } );

        //surface menu
        var surfaceVDW      = document.getElementById( "surfaceVDW" );
        var surfaceSE    = document.getElementById( "surfaceSE" );
        var surfaceSA     = document.getElementById( "surfaceSA" );
        var surfaceM   = document.getElementById( "surfaceM" );
        var surfaceN   = document.getElementById( "surfaceN" );
        surfaceVDW.addEventListener( 'click', function() {
            PDB.render.clear(5);
			PDB.CHANGESTYLE = 0;//切换mode，放弃fragment
            scope.refreshSurface(PDB.config.surfaceMode,1,PDB.SURFACE_OPACITY,PDB.SURFACE_WIREFRAME);
        } );
        surfaceSE.addEventListener( 'click', function() {
            PDB.render.clear(5);
			PDB.CHANGESTYLE = 0;//切换mode，放弃fragment
            scope.refreshSurface(PDB.config.surfaceMode,2,PDB.SURFACE_OPACITY,PDB.SURFACE_WIREFRAME);
        } );
        surfaceSA.addEventListener( 'click', function() {
            PDB.render.clear(5);
			PDB.CHANGESTYLE = 0;//切换mode，放弃fragment
            scope.refreshSurface(PDB.config.surfaceMode,3,PDB.SURFACE_OPACITY,PDB.SURFACE_WIREFRAME);
        } );
        surfaceM.addEventListener( 'click', function() {
            PDB.render.clear(5);
			PDB.CHANGESTYLE = 0;//切换mode，放弃fragment
            scope.refreshSurface(PDB.config.surfaceMode,4,PDB.SURFACE_OPACITY,PDB.SURFACE_WIREFRAME);
        } );
        surfaceN.addEventListener( 'click', function(event) {
            PDB.render.clear(5);
			PDB.CHANGESTYLE = 0;//切换mode，放弃fragment
            PDB.SURFACE_TYPE = 0;
            PDB.GROUP[PDB.GROUP_SURFACE].visible = false;
        } );

        var surfaceOpacity1      = document.getElementById( "surfaceOpacity1" );
        var surfaceOpacity2    = document.getElementById( "surfaceOpacity2" );
        var surfaceOpacity3     = document.getElementById( "surfaceOpacity3" );
        var surfaceOpacity4   = document.getElementById( "surfaceOpacity4" );
        var surfaceOpacity5   = document.getElementById( "surfaceOpacity5" );
        var surfaceOpacity6   = document.getElementById( "surfaceOpacity6" );
        surfaceOpacity1.addEventListener( 'click', function() {
            scope.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,1.0,PDB.SURFACE_WIREFRAME);
        } );
        surfaceOpacity2.addEventListener( 'click', function() {
            scope.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,0.9,PDB.SURFACE_WIREFRAME);
        } );
        surfaceOpacity3.addEventListener( 'click', function() {
            scope.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,0.8,PDB.SURFACE_WIREFRAME);
        } );
        surfaceOpacity4.addEventListener( 'click', function() {
            scope.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,0.7,PDB.SURFACE_WIREFRAME);
        } );
        surfaceOpacity5.addEventListener( 'click', function() {
            scope.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,0.6,PDB.SURFACE_WIREFRAME);
        } );
        surfaceOpacity6.addEventListener( 'click', function() {
            scope.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,0.5,PDB.SURFACE_WIREFRAME);
        } );


        var wireFrame   = document.getElementById( "wireFrame" );
        wireFrame.addEventListener( 'click', function(event) {
            if(event.target.checked !== undefined){
                scope.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,PDB.SURFACE_OPACITY,event.target.checked);
            }
        } );
        //surface menu

        // selection model
        var selModel    = document.getElementById( "selModel" );
        // var selMainHet  = document.getElementById( "selMainHet" );
        // var selMain     = document.getElementById( "selMain" );
        // var selHet      = document.getElementById( "selHet" );
        var selChain    = document.getElementById( "selChain" );
        var selAtom     = document.getElementById( "selAtom" );
        var selResidue  = document.getElementById( "selResidue" );

        selModel.addEventListener( 'click', function() {
            PDB.selection_mode = PDB.SELECTION_MODEL;
        } );
        // selMainHet.addEventListener( 'click', function() {
        //     PDB.selection_mode = PDB.SELECTION_MAIN_HET;
        // } );
        // selMain.addEventListener( 'click', function() {
        //     PDB.selection_mode = PDB.SELECTION_MAIN;
        // } );
        // selHet.addEventListener( 'click', function() {
        //     PDB.selection_mode = PDB.SELECTION_HET;
        // } );
        selChain.addEventListener( 'click', function() {
            PDB.selection_mode = PDB.SELECTION_CHAIN;
        } );
        selResidue.addEventListener( 'click', function() {
            PDB.selection_mode = PDB.SELECTION_RESIDUE;
        } );
        selAtom.addEventListener( 'click', function() {
            PDB.selection_mode = PDB.SELECTION_ATOM;
        } );



        //=============================== EXPORT =======================
        //
        var b_export_scene = document.getElementById("b_export_scene");
        b_export_scene.addEventListener( 'click', function() {
            PDB.render.exportToObj();
            

            // worker.addEventListener('message', function(e) {
            //    console.log(e.data);
            // }, false);


            // var exporter = new THREE.OBJExporter();
            // var result = exporter.parse( scene );
            // console.log(result.length);
            // var f = PDB.pdbId+".obj";

            // worker.postMessage({'cmd': 'start', 'msg': 'Hi', 'filename':f,'data':result});
        } );

         //=============================== trigger =======================
        //
        //trigger mode
        var distance     = document.getElementById( "triggerDistance" );
        var angle     = document.getElementById( "triggerAngle" );
        distance.addEventListener( 'click', function(e) {
            PDB.selection_mode = PDB.SELECTION_ATOM;
            PDB.trigger = PDB.TRIGGER_EVENT_DISTANCE;
        } );

        angle.addEventListener( 'click', function(e) {
            PDB.selection_mode = PDB.SELECTION_ATOM;
            PDB.trigger = PDB.TRIGGER_EVENT_ANGLE;
        } );

        //switch color  add color checkBox Listener ByClassName
        var updateColor = document.getElementsByClassName("updateColor");
        for(var i in updateColor){
            if(!isNaN(Number(i))){
                updateColor[i].addEventListener( 'click', function(e) {
                    for(var j in updateColor){//保证显示一个复选框
                        if(!isNaN(Number(j))){
                            if(e.target.id!=updateColor[j].id){
                                updateColor[j].checked = false;
                            }
                        }
                    }
                    var color_mode = e.target.getAttribute('color_mode');
                    scope.switchColorBymode(color_mode);
                } );
            }

        }


        // selection model
        // var dragModel    = document.getElementById( "dragModel" );
        // var dragMainHet  = document.getElementById( "dragMainHet" );
        // var dragMain     = document.getElementById( "dragMain" );
        var dragHet      = document.getElementById( "dragHet" );
        var dragChain    = document.getElementById( "dragChain" );

        // dragModel.addEventListener( 'click', function() {
        //     PDB.selection_mode = PDB.SELECTION_MODEL;
        // } );
        // dragMainHet.addEventListener( 'click', function() {
        //     PDB.selection_mode = PDB.SELECTION_MAIN_HET;
        // } );
        // dragMain.addEventListener( 'click', function() {
        //     PDB.selection_mode = PDB.SELECTION_MAIN;
        // } );
        dragHet.addEventListener( 'click', function() {
            PDB.selection_mode = PDB.SELECTION_HET;
        } );
        dragChain.addEventListener( 'click', function() {
            PDB.selection_mode = PDB.SELECTION_CHAIN;
        } );



        //get segment panel
		var closer = document.getElementById("closesegment");
		var segmentholder = document.getElementById("segmentholder");
		var segmentPanel = document.getElementById("segmentPanel");
		var b_show_segmenpanel = document.getElementById("b_show_segmenpanel");
		
		b_show_segmenpanel.addEventListener( 'click', function() {
			segmentholder.style.display = "block";
			segmentPanel.style.display = "block";
		} );
		
		closer.addEventListener( 'click', function() {
			segmentholder.style.display = "none";
			segmentPanel.style.display = "none";
		} );

        //============================Mutation==========================
		//mutation
        var mutationTCGA = document.getElementById("mutationTCGA");
        var mutationCCLE = document.getElementById("mutationCCLE");
        var mutationExAC = document.getElementById("mutationExAC");
        var mutationNone = document.getElementById("mutationNone");
        var dbSNP = document.getElementById("dbSNP");

        mutationTCGA.addEventListener( 'click', function() {
            var url = PDB.MUTATION_URL+"&pdbid="+PDB.pdbId.toUpperCase()+"&ds=tcga";
            PDB.tool.ajax.get(url,function (text) {
                PDB.controller.clear(4,undefined);
                PDB.painter.showMutation(text);
            })
        } );
        mutationCCLE.addEventListener( 'click', function() {
            var url = PDB.MUTATION_URL+"&pdbid="+PDB.pdbId.toUpperCase()+"&ds=ccle";
            PDB.tool.ajax.get(url,function (text) {
                PDB.controller.clear(4,undefined);
                PDB.painter.showMutation(text);
            })
        } );
        mutationExAC.addEventListener( 'click', function() {
            var url = PDB.MUTATION_URL+"&pdbid="+PDB.pdbId.toUpperCase()+"&ds=exac";
            PDB.tool.ajax.get(url,function (text) {
                PDB.controller.clear(4,undefined);
                PDB.painter.showMutation(text);
            })
        } );

         dbSNP.addEventListener( 'click', function() {
            var url = PDB.MUTATION_URL+"&pdbid="+PDB.pdbId.toUpperCase()+"&ds=dbsnp";
            PDB.tool.ajax.get(url,function (text) {
                PDB.controller.clear(4,undefined);
                PDB.painter.showMutation(text);
            })
        } );

        mutationNone.addEventListener( 'click', function() {
            PDB.controller.clear(4,undefined);
        } );

        //============================rotation==========================
        //rotation
        var rotationSwitch = document.getElementById("rotationSwitch");
        var rotationLeft = document.getElementById("rotationLeft");
        var rotationRight = document.getElementById("rotationRight");

        rotationSwitch.addEventListener( 'click', function() {
            PDB.ROTATION_START_FLAG= false;
        } );
        rotationLeft.addEventListener( 'click', function() {
            PDB.ROTATION_DIRECTION = 0;
            PDB.ROTATION_START_FLAG= true;
        } );
        rotationRight.addEventListener( 'click', function() {
            PDB.ROTATION_DIRECTION = 1;
            PDB.ROTATION_START_FLAG= true;
        } );


        var showDemo   = document.getElementById( "showDemo" );
        showDemo.addEventListener( 'click', function(event) {
            if(event.target.checked !== undefined){
                PDB.DEMO.FLAG =  event.target.checked;
                if(PDB.DEMO.FLAG){
                    PDB.DEMO.ID = self.setInterval(PDB.render.showDemo,21);
                }else{
                    window.clearInterval(PDB.DEMO.ID);
                }
            }
        } );
        if(PDB.DEMO.FLAG){
            PDB.DEMO.ID = self.setInterval(PDB.render.showDemo,21);
        }

        //bond event register
        var hideBond   = document.getElementById( "hideBond" );
        hideBond.addEventListener( 'click', function(event) {
            PDB.render.clearGroupIndex(PDB.GROUP_BOND);
        } );


        var showHBond   = document.getElementById( "showHBond" );
        showHBond.addEventListener( 'click', function(event) {
            PDB.render.clearGroupIndex(PDB.GROUP_BOND);
            PDB.painter.showBond(PDB.BOND_TYPE_HBOND);
        } );

        var showSSBond   = document.getElementById( "showSSBond" );
        showSSBond.addEventListener( 'click', function(event) {
            PDB.render.clearGroupIndex(PDB.GROUP_BOND);
            PDB.painter.showBond(PDB.BOND_TYPE_SSBOND);
        } );

        var showCovalent   = document.getElementById( "showCovalent" );
        showCovalent.addEventListener( 'click', function(event) {
            PDB.render.clearGroupIndex(PDB.GROUP_BOND);
            PDB.painter.showBond(PDB.BOND_TYPE_COVALENT);
        } );




        //=============================== Conservation data =======================
        //
        var b_load_conser = document.getElementById("b_load_conser");
        b_load_conser.addEventListener( 'click', function() {
            var chain = "A";
            var url = PDB.CONSERVATION_URL+"&pdbid="+PDB.pdbId.toUpperCase()+"&chain="+chain;
            PDB.tool.ajax.get(url,function (text) {
                PDB.controller.clear(4,undefined);
                PDB.painter.showConservation(text);
                PDB.render.clearMain();
                PDB.controller.drawGeometry(PDB.config.mainMode);
            })
        } );


        //=============================== Drug Design =======================
        //
        var b_load_drug = document.getElementById("b_load_drug");
        b_load_drug.addEventListener( 'click', function() {
            var url = SERVERURL+"/server/api.php?taskid=12&pdbid="+PDB.pdbId.toUpperCase();
            url = "http://vr.zhanglab.net/server/api.php?taskid=12&pdbid="+PDB.pdbId.toUpperCase();
            // if(ServerType!==2){
            //     url = SERVERURL+"/data/drug.json";
            // }
            PDB.tool.ajax.get(url,function (text) {
                var jsonObj = JSON.parse(text);
                if(jsonObj.code === 1 && jsonObj.data !== undefined){
                    //生成面板
                    var rightMenuDiv = document.getElementById("rightmenu");
                    rightMenuDiv.innerHTML="";
                    var titleLab = PDB.tool.generateLabel(rightMenuDiv,"DrugBank List","");
                    var span = PDB.tool.generateSpan(rightMenuDiv,"menuSpan","rightsubmenu");
                    var bindingdb = jsonObj.data[0].bindingdb;
                    PDB.controller.LoadDrugDetails(span,"bindingdb",bindingdb);


                    var chembl = jsonObj.data[0].chembl;
                    PDB.controller.LoadDrugDetails(span,"chembl",chembl);


                    var swisslipids = jsonObj.data[0].swisslipids;
                    PDB.controller.LoadDrugDetails(span,"swisslipids",swisslipids);

                    var guidetopharmacology = jsonObj.data[0].guidetopharmacology;
                    PDB.controller.LoadDrugDetails(span,"guidetopharmacology",guidetopharmacology);


                    var drugbank = jsonObj.data[0].drugbank;
                    PDB.controller.LoadDrugDetails(span,"drugbank",drugbank);


                }else {
					PDB.tool.printProgress(jsonObj.message);
                    // alert(jsonObj.message);
                }
            });
        } );
    },
    LoadDrugDetails : function (span,dbname,dbjson) {
        if(dbjson!== undefined && dbjson!== "" && dbjson!== "null") {
            PDB.tool.generateLabel(span, dbname, "");
            var drugids = dbjson.split(';');
            for (var i in drugids) {
                if (drugids[i] === "") {
                    continue;
                }
                PDB.tool.generateButton(span, drugids[i], drugids[i], "rightLabelPDB").addEventListener('click', function () {
                    var drugId = this.value;
                    PDB.config.selectedDrug = drugId;
                    PDB.loader.loadDrug(drugId, function () {
                        w3m.mol[drugId].drug = true;
                        PDB.render.clearGroupIndex(PDB.GROUP_DRUG);
                        PDB.painter.showHet(drugId);
                    });
                });
                PDB.tool.generateALink(span, "link" + i, "Detail", PDB.DRUBDB_URL[dbname] + drugids[i], "");
            }
        }
    },

    onKeyDown : function (event) {
        var scope = this;
        var e = event || window.event;
        if(e.keyCode == 13){
            var input = document.getElementById("search_text");
            if(input.value.length !== 4){
                input.value = PDB.pdbId;
            }
            scope.requestRemote(input.value);
        }
    },onLoadEMD: function (event) {
        var scope = this;
        var e = event || window.event;
        if(e.keyCode == 13){
            var input = document.getElementById("load_text");
            var mapserver = "map";
            if(ServerType!==2){
                mapserver = "map-local";
            }
            EmMapParser.loadMap(input.value, mapserver,function (emmap) {
                console.log("NC:"+emmap.header.NC);
                console.log("NR:"+emmap.header.NR);
                console.log("NS:"+emmap.header.NS);
                console.log(emmap.data.length);
            });
        }
    },
    emmapLoad:function (mapId,type,callBack) {
        EmMapParser.loadMap(mapId,type,function (emmap) {
            if(emmap.data !== undefined && emmap.data.length > 0){
                //setting
                PDB.EMMAP.DATA = emmap;
                PDB.EMMAP.MIN_SLICE = 1;

                var dimension = document.getElementById("dimension");
                PDB.DIMENSION = Number(dimension.value);
                switch(PDB.DIMENSION){
                    case PDB.DIMENSION_X:
                        PDB.EMMAP.MAX_SLICE = Number(emmap.header.NC);
                        break;
                    case PDB.DIMENSION_Y:
                        PDB.EMMAP.MAX_SLICE = Number(emmap.header.NR);
                        break;
                    case PDB.DIMENSION_Z:
                        PDB.EMMAP.MAX_SLICE = Number(emmap.header.NS);
                        break;
                }
                if(callBack !== undefined){
                    callBack(emmap);
                }
            }
        });
    },emmapLoadFromFile:function (response,type,callBack) {
        EmMapParser.loadMapFromFile(response,type,function (emmap) {
            if(emmap.data !== undefined && emmap.data.length > 0){
                //setting
                PDB.EMMAP.DATA = emmap;
                if(callBack !== undefined){
                    callBack(emmap);
                }
            }
        });
    },
    switchColorBymode : function(color_mode){
        var scope = this ;
        // PDB.loader.clear();
        w3m.config.color_mode_main = Number(color_mode);
        for ( var i in w3m.mol ) {
            w3m.tool.updateMolColorMap(i);
        }
        // w3m.api.refreshMain();
        PDB.render.clearMain();
        scope.drawGeometry(PDB.config.mainMode);
    },
    switchMeasureByMode :function (mode) {
        PDB.selection_mode = PDB.SELECTION_ATOM;
        PDB.trigger = mode;
    },
    switchDragByMode :function (mode) {
        PDB.trigger = PDB.TRIGGER_EVENT_DRAG;
        PDB.selection_mode = mode;
    },
    switchFragmentByMode :function (mode) {
        PDB.trigger = PDB.TRIGGER_EVENT_FRAGMENT;
        PDB.selection_mode = PDB.SELECTION_RESIDUE;
        PDB.fragmentMode = mode;
    },
    fragmentPainter : function(startId,endId,selectedMode){
        var selectRadius = 0;
		if(selectedMode ==="Rectangle"){
            selectRadius = 0;
        }else if(selectedMode ==="Tube"){
            selectRadius = PDB.CONFIG.tube_radius;
        }else if(selectedMode ==="Ellipse"){
            selectRadius = PDB.CONFIG.ellipse_radius;
        }else if(selectedMode=="Strip"){
            selectRadius = PDB.CONFIG.strip_radius;
        }else if(selectedMode=="Railway"){
            selectRadius = PDB.CONFIG.railway_radius;
        }else if(selectedMode=="Flat"){
            selectRadius = 0;
        }else if(selectedMode=="Surface"){
            selectRadius = 0;
        }
        if(selectedMode === "Surface"){
            PDB.CONFIG.startSegmentSurfaceID  = startId;
            PDB.CONFIG.endSegmentSurfaceID = endId;
            PDB.render.clear(4);
            PDB.painter.showSurface(PDB.CONFIG.startSegmentSurfaceID,PDB.CONFIG.endSegmentSurfaceID,true);
        }else{
            PDB.render.clear(0);
            PDB.CONFIG.startSegmentID = startId;
            PDB.CONFIG.endSegmentID = endId;
            PDB.painter.showSegmentByStartEnd(PDB.CONFIG.startSegmentID,PDB.CONFIG.endSegmentID,selectedMode,selectRadius);
        }
    },

	segmentSelectBindEvent : function(startPointDom,endPointDom){
		var scope = this; 
		var atomIDs = Object.keys(w3m.mol[PDB.pdbId].atom.main);
		var defaultStartAtom = w3m.mol[PDB.pdbId].atom.main[atomIDs[0]];
		//PDB.CONFIG.startSegmentID = defaultStartAtom[1];
		
		var defaultEndAtom = w3m.mol[PDB.pdbId].atom.main[atomIDs[atomIDs.length-1]];
		//PDB.CONFIG.endSegmentID = defaultEndAtom[1];
		
		var segmentholder = document.getElementById("segmentholder");
		var segmentPanel = document.getElementById("segmentPanel");	
			startPointDom.addEventListener( 'change', function(e) {
			var residueID = startPointDom.value;
			var chainName = document.getElementById("chainIDSelect").value;			
			var atom = PDB.tool.getFirstAtomByResidueId(residueID,chainName);
			//PDB.CONFIG.startSegmentID = atom[1];
		} );
		endPointDom.addEventListener( 'change', function(e) {
			var residueID = endPointDom.value;
			var chainName = document.getElementById("chainIDSelect").value;
			var atom = PDB.tool.getLastAtomByResidueId(residueID,chainName);			
			//PDB.CONFIG.endSegmentID = atom[1];			
		} );
		
		var b_addSelected = document.getElementById("addSelected");	
		var b_Confirm_fregment = document.getElementById("Confirm_fregment");	
		
		//所有的redio
		var r_selectedStyle = document.getElementsByName("selectedStyle");
		
		
		b_addSelected.addEventListener( 'click', function(e) {
			var style = 0;
			for(var i =0;i<r_selectedStyle.length;i++){
				if(r_selectedStyle[i].checked) {
					style = Number(r_selectedStyle[i].value);
					break;
				}
			}
			var s_chainIDSelect = document.getElementById("chainIDSelect");
			var s_startPoint = document.getElementById("startPoint");
			var s_endPoint = document.getElementById("endPoint");
			var s_selectedMode = document.getElementById("selectedMode");
			
			
			var s_sseTypeSelect = document.getElementById("sseTypeSelect");
			var s_residueTypeSelect = document.getElementById("residueTypeSelect");
			
			var residueType = w3m.mol[PDB.pdbId].residueTypeList[Number(s_residueTypeSelect.value)];
			
			
			//在选中氨基酸模式下 startPoint 为选中的氨基酸
			scope.addSelectedPanel(style,s_chainIDSelect.value,s_startPoint.value,s_endPoint.value,s_selectedMode.value,s_sseTypeSelect.value,residueType);
			scope.initSelectedPanel(style);
			
			
		});
		for(var i = 0;i<r_selectedStyle.length;i++){
			r_selectedStyle[i].addEventListener( 'click', function(e) {
				for(var j in w3m.mol[PDB.pdbId].residueData){
					for(var i in w3m.mol[PDB.pdbId].residueData[j]){
						w3m.mol[PDB.pdbId].residueData[j][i].issel = false;
					}
				}				
				document.getElementById("seletedPanel").innerHTML = '';
				//scope.initSelectedPanel(i+1);
			});
		}		
		
		b_Confirm_fregment.addEventListener( 'click', function(e) {
			segmentholder.style.display = "none";
			segmentPanel.style.display = "none";
			PDB.render.clear(0);
			scope.drawGeometry(PDB.config.mainMode);
		});
		
	},
	addSelectedPanel : function(changeStyle,chainId,startReId,endReId,reptype,sseType,residueType){
		var p_seletedPanel = document.getElementById("seletedPanel");
		switch(changeStyle){
			//case 0:break;
			case PDB.DRAWSTYLE_FRAGMENT ://fragment
				var obj = {
					start 	 : w3m.mol[PDB.pdbId].residueData[chainId][startReId],
					end		 : w3m.mol[PDB.pdbId].residueData[chainId][endReId],
					issel	 : true,
					reptype  : Number(reptype)
				};
				var fragmentList = PDB.fragmentList;
				var keys = Object.keys(fragmentList);
				if(keys.length==0){
					PDB.fragmentList[0] = obj;
				}else{
					if((chainId==PDB.fragmentList[keys[keys.length-1]].start.chain&&PDB.fragmentList[keys[keys.length-1]].start.id==startReId)&&(chainId==PDB.fragmentList[keys[keys.length-1]].end.chain&&PDB.fragmentList[keys[keys.length-1]].end.id==endReId)){
						return;
					}else{
						PDB.fragmentList[Number(keys[keys.length-1])+1] = obj;
					}
					
				}
				break;
			case PDB.DRAWSTYLE_CHAIN ://chain
				for(var i in w3m.mol[PDB.pdbId].residueData[chainId]){
					w3m.mol[PDB.pdbId].residueData[chainId][i].issel = true;
				}
				break;//residue
			// case 3:
				// // for(var i in w3m.mol[PDB.pdbId].residueData[chainId]){
					// // w3m.mol[PDB.pdbId].residueData[chainId][i].issel = false;
				// // }
				// w3m.mol[PDB.pdbId].residueData[chainId][startReId].issel = true;
				
				// break;
			case PDB.DRAWSTYLE_SSETYPE :
				sseType = Number(sseType);
				PDB.config.mainMode = PDB.CARTOON_SSE;
				for(var c in  w3m.mol[PDB.pdbId].residueData){
					var chainList =  w3m.mol[PDB.pdbId].residueData[c];
					for(var r in chainList){
						var residueObj = chainList[r];
						var sse = Math.floor(residueObj.sse/10);
						if(sse == sseType ){
							w3m.mol[PDB.pdbId].residueData[c][r].issel = true;
						}
					}
				}				
				break;
			case PDB.DRAWSTYLE_RESIDUETYPE :
				
				for(var c in  w3m.mol[PDB.pdbId].residueData){
					var chainList =  w3m.mol[PDB.pdbId].residueData[c];
					for(var r in chainList){
						var residueObj = chainList[r];
						var rname = residueObj.name;
						if(rname == residueType ){
							w3m.mol[PDB.pdbId].residueData[c][r].issel = true;
						}
					}
				}
				
				break;
		}
	},
	initSelectedPanel : function(changeStyle){
		PDB.CHANGESTYLE = changeStyle;
		var p_seletedPanel = document.getElementById("seletedPanel");
		p_seletedPanel.innerHTML = '';
		var html = "";
		switch(changeStyle){
			//case 0:break;
			case PDB.DRAWSTYLE_FRAGMENT ://fragment
				var fragmentList = PDB.fragmentList;
				for(fkey in fragmentList){					
					var start = fragmentList[fkey].start;
					var end = fragmentList[fkey].end;					
					html =  html+"<span id=\""+"f_"+fkey+"\" class=\"fragment\" attr=\"\">"+start.chain+"."+start.name+start.id+"~"+end.chain+"."+end.name+end.id+"<span class=\"fragmentdel\">X</span>&nbsp;</span>";
				}
				break;
			case PDB.DRAWSTYLE_CHAIN ://chain
				var temp = w3m.mol[PDB.pdbId].residueData;
				
				for(var chainid in temp){
					var lastrid = Object.keys(temp[chainid]);
					lastrid = lastrid[lastrid.length-1];
					var issel = true;
					for(var i in temp[chainid]){
						if(!temp[chainid][i].issel){
							issel = false;
							break;
						}
					}
					if(issel){
						html =  html+"<span id=\""+"ch_"+chainid+"\" class=\"fragment\" attr=\"\">《"+chainid+"》Chain<span class=\"fragmentdel\">X</span>&nbsp;</span>";
					}
				}
				break;//residue
			// case 3:
				// var temp = w3m.mol[PDB.pdbId].residueData;
				// for(var chainid in temp){					
					// for(var i in temp[chainid]){
						// if(temp[chainid][i].issel){
							// html =  html+"<span id=\""+"ch_"+chainid+"_re_"+i+"\" class=\"fragment\" attr=\"\">"+chainid+"."+temp[chainid][i].name+temp[chainid][i].id+"<span class=\"fragmentdel\">X</span>&nbsp;</span>";
						// }
					// }
				// }
				// break;
			case PDB.DRAWSTYLE_SSETYPE :
				var str = {};
				str[w3m.HELIX] = 'HELIX';
				str[w3m.LOOP]  = 'LOOP';
				str[w3m.SHEET] = 'SHEET';
				var obj = {};
				obj[w3m.HELIX] = 0;
				obj[w3m.LOOP]  = 0;
				obj[w3m.SHEET] = 0;
				for(var c in  w3m.mol[PDB.pdbId].residueData){
					var chainList =  w3m.mol[PDB.pdbId].residueData[c];
					for(var r in chainList){
						var residueObj = chainList[r];
						var sse = Math.floor(residueObj.sse/10);
						if(obj[sse]!=1){
							if(residueObj.issel){
								obj[sse] = 1;
							}
						}
						
					}
				}
				for(var i in obj){
					if(obj[i]==1){
						html =  html+"<span id=\""+"sse_"+i+"\" class=\"fragment\" attr=\"\">"+str[i]+"<span class=\"fragmentdel\">X</span>&nbsp;</span>";
					}					
				}				
				break;
			case PDB.DRAWSTYLE_RESIDUETYPE :
				var obj = {};
				for(var i in w3m.mol[PDB.pdbId].residueTypeList){
					obj[w3m.mol[PDB.pdbId].residueTypeList[i]] = 0;
				}
				for(var c in  w3m.mol[PDB.pdbId].residueData){
					var chainList =  w3m.mol[PDB.pdbId].residueData[c];
					for(var r in chainList){
						var residueObj = chainList[r];						
						if(obj[residueObj.name]!=1){
							if(residueObj.issel){
								obj[residueObj.name] = 1;
							}
						}
					}
				}
				for(var i in obj){
					if(obj[i]==1){
						html =  html+"<span id=\""+"res_"+i+"\" class=\"fragment\" attr=\"\">"+i+"<span class=\"fragmentdel\">X</span>&nbsp;</span>";
					}					
				}	
				break;
		}
		p_seletedPanel.innerHTML = html;
		
		this.bindSelectedAndDeleteSpan();
		
	},
	
	bindSelectedAndDeleteSpan : function(){
		var scope = this; 
		var fragmentSpan = document.getElementsByClassName("fragment");
		fragmentSpan.blink;
		for(var i=0;i<fragmentSpan.length;i++){
			fragmentSpan[i].addEventListener( 'click', function(e) {
				var id = e.target.id;
				var str = id.split("_");
				if(str.length==0)return;
				if(str.length==2&&str[0]=='f'){
				if(PDB.fragmentList[str[1]].issel){
						e.target.style.backgroundColor = '#9ebff0';
						PDB.fragmentList[str[1]].issel = false;
					}else{
						e.target.style.backgroundColor = '#293342';
						PDB.fragmentList[str[1]].issel = true;
					}
				}
			});
			
		}
		var fragmentdelSpan = document.getElementsByClassName("fragmentdel");
		for(var i=0;i<fragmentdelSpan.length;i++){
			fragmentdelSpan[i].addEventListener( 'click', function(e) {
				var id = e.target.parentNode.id;
				var str = id.split("_");
				if(str.length==0)return;
				if(str.length==2&&str[0]=='f'){
					delete PDB.fragmentList[str[1]];
					scope.initSelectedPanel(PDB.DRAWSTYLE_SSETYPE);
				}else if(str.length==2&&str[0]=='ch'){
					for(var i in w3m.mol[PDB.pdbId].residueData[str[1]]){
						w3m.mol[PDB.pdbId].residueData[str[1]][i].issel = false;
					}					
					scope.initSelectedPanel(PDB.DRAWSTYLE_CHAIN);
				}
				// else if(str.length==4){
					// w3m.mol[PDB.pdbId].residueData[str[1]][str[2]].issel = false;
					// scope.initSelectedPanel(3);
				// }
				else if(str.length==2&&str[0]=='sse'){
					var sseType = Number(str[1]);
					for(var c in  w3m.mol[PDB.pdbId].residueData){
						var chainList =  w3m.mol[PDB.pdbId].residueData[c];
						for(var r in chainList){
							var residueObj = chainList[r];
							var sse = Math.floor(residueObj.sse/10);
							if(sse == sseType ){
								w3m.mol[PDB.pdbId].residueData[c][r].issel = false;
							}
						}
					}	
					scope.initSelectedPanel(PDB.DRAWSTYLE_SSETYPE);
				}else if(str.length==2&&str[0]=='res'){
					var residueType = str[1];
					for(var c in  w3m.mol[PDB.pdbId].residueData){
						var chainList =  w3m.mol[PDB.pdbId].residueData[c];
						for(var r in chainList){
							var residueObj = chainList[r];
							if(residueObj.name == residueType ){
								w3m.mol[PDB.pdbId].residueData[c][r].issel = false;
							}
						}
					}
					scope.initSelectedPanel(PDB.DRAWSTYLE_RESIDUETYPE);
				}
			});
		}
	},
	initSartAndSelect :  function(chain){
		//init residueTypeSelect
		var residueTypeSelect = document.getElementById("residueTypeSelect");
		for(var i in w3m.mol[PDB.pdbId].residueTypeList){
			var resName = w3m.mol[PDB.pdbId].residueTypeList[i];
			var newOption = document.createElement("option");
			newOption.innerHTML = resName;
			newOption.value = i;
			residueTypeSelect.appendChild(newOption);
		}
		var startPoint = document.getElementById("startPoint");	
		startPoint.innerHTML = "";
		var endPoint = document.getElementById("endPoint");	
		endPoint.innerHTML = "";		
		var tempAllResidue = {};
		var atoms = w3m.mol[PDB.pdbId].atom.main;
		var selectedResidue = -1;
		for(var atomId in atoms){
			var atom = atoms[atomId];
			var atomName = atom[3];
			var atomName = atom[2];
			var residueName = atom[3];
			var chainName = atom[4];
			var residueID = atom[5];
			var xyz = atom[6];
			var b_factor = atom[7];
			var coe = atom[8];
			var atomType = atom[9];
			if(tempAllResidue[residueID]==undefined&&chain==chainName){
				selectedResidue++;
				tempAllResidue[residueID] = chainName;				
				var newOption = document.createElement("option");
				newOption.innerHTML = residueID+":"+residueName;
				newOption.value = residueID;
				if(selectedResidue==0){
					newOption.selected = 'selected';
				}
				startPoint.appendChild(newOption);
				
				newOption = document.createElement("option");
				newOption.innerHTML = residueID+":"+residueName;
				newOption.value = residueID;
				if(atoms[atomId+1]==undefined||(atoms[atomId+1]==undefined!=undefined&&atoms[atomId+1][4]!=chainName)){
					newOption.selected = 'selected';
				}
				endPoint.appendChild(newOption);
			}		
		}
		this.segmentSelectBindEvent(startPoint,endPoint);
	},
	initFragmentSelect : function(){
		var scope = this;
		var chainIDSelect = document.getElementById("chainIDSelect");	
		var chainarray = Object.keys(w3m.mol[PDB.pdbId].chain);
		chainIDSelect.innerHTML = "";
		for(var i in chainarray){			
			var newOption = document.createElement("option");
			newOption.innerHTML = chainarray[i];
			newOption.value = chainarray[i];
			chainIDSelect.appendChild(newOption);			
		}
		chainIDSelect.addEventListener( 'change', function(e) {
			var chainName = chainIDSelect.value;
			scope.initSartAndSelect(chainName);		
		} );
		this.initSartAndSelect(chainarray[0]);
		
	},
    requestRemote : function(name){
        console.log("controller.requestRemote:"+name);
		PDB.CHANGESTYLE = 0;//切换mode，放弃fragment
        var scope = this;
        var input = document.getElementById("search_text");
        input.value = name;
        
        PDB.pdbId = name.toLowerCase();
        scope.clear(2,-1);
        PDB.loader.clear();
        //PDB.currentType = -1;
        PDB.loader.load(name,function () {
            //PDB.painter.generateGroupPosition();			
            scope.drawGeometry(PDB.config.mainMode);
            scope.drawGeometry(PDB.config.hetMode);
			if(PDB.isShowSurface==PDB.config.openSurface){
				scope.drawGeometry(PDB.config.surfaceMode);				
			}
			scope.initFragmentSelect();
            if(!PDB.isAnimate){
                PDB.render.animate();
                PDB.isAnimate=true;
            }
            if( PDB.TravelMode===true && PDB.mode === PDB.MODE_TRAVEL_THREE){
                // PDB.render.changeToThreeMode(PDB.MODE_THREE,false);
                // PDB.render.changeToThreeMode(PDB.MODE_TRAVEL_THREE,true);
				PDB.CHANGESTYLE = 6;
				PDB.render.clearStructure();
				PDB.render.changeToThreeMode(PDB.MODE_TRAVEL_THREE,true);
				PDB.painter.showResidueByThreeTravel();
            }
        });

    },
    clear:function(mode, w3mtype){
        PDB.render.clear(mode); //0: main, 1: het, 2:all        
    },
    getLoadType: function(type){
        var loadType = w3m.LINE;
        switch ( type ) {
            case PDB.LINE              : loadType = w3m.LINE;      break;
            case PDB.DOT               : loadType = w3m.LINE;      break;
            case PDB.BACKBONE          : loadType = w3m.BACKBONE;  break;
            case PDB.STICK             : loadType = w3m.LINE;      break;
            //case PDB.SPHERE            : loadType = w3m.LINE;      break;
            case PDB.BALL_AND_ROD      : loadType = w3m.LINE;      break;
            case PDB.TUBE              : loadType = w3m.CUBE;      break;
            case PDB.RIBBON_FLAT       : loadType = w3m.CUBE;      break;
            case PDB.RIBBON_ELLIPSE    : loadType = w3m.CUBE;      break;
            case PDB.RIBBON_RECTANGLE  : loadType = w3m.CUBE;      break;
            case PDB.RIBBON_STRIP      : loadType = w3m.CUBE;      break;
            case PDB.RIBBON_RAILWAY    : loadType = w3m.CUBE;      break;
            case PDB.CARTOON_SSE       : loadType = w3m.CUBE;      break;
            case PDB.HET_LINE          : loadType = w3m.LINE;      break;
            //case PDB.HET_SPHERE        : loadType = w3m.TUBE;      break;
            case PDB.HET_STICK         : loadType = w3m.LINE;      break;
            case PDB.HET_BALL_ROD      : loadType = w3m.LINE;      break;
            default                    : loadType = w3m.LINE;
        }

        return loadType;
    },
    drawGeometry : function(type){
		if(w3m.mol[PDB.pdbId]==undefined) return;
		var scope = this;        
        console.log("sta: "+type+": "+new Date());        
       if(type>=PDB.HET){			
			PDB.painter.showHet(PDB.pdbId);    
		}else{
			if(PDB.CHANGESTYLE!=1&&PDB.CHANGESTYLE!=0&&PDB.CHANGESTYLE!=6){
				//进入根据氨基酸（issel）是否选中来判断颜色
				PDB.painter.showAllResiduesBySelect();            
			}else if(PDB.CHANGESTYLE==1){//有fragment的时候 
				PDB.painter.showFragmentsResidues();            

			}else if(PDB.CHANGESTYLE==0){			 //无任何模式下
				PDB.painter.showAllResidues(type);           
			}
		}
        console.log("end: "+type+": "+new Date());
        
    },
    refreshGeometryByMode : function(type){
        console.log("controller.refreshGeometryByMode");		
		PDB.CHANGESTYLE = 0;//切换mode，放弃fragment
        //默认都显示
        var loadType = this.getLoadType(type);
        var scope = this;
        // Main structure
        if(type < PDB.HET){
            PDB.GROUP[PDB.GROUP_HET].visible=true;
            this.clear(0,loadType);
            scope.drawGeometry(type);

        }else{
            this.clear(1,loadType);
            scope.drawGeometry(type);
        }
    },
    refreshSurface : function(structureType,surfaceType,opacity,wireframe){
        console.log("controller.refreshSurface:" + structureType );
        var scope = this;
        var changeSurfaceType = false;
        if(surfaceType !== undefined && surfaceType !== PDB.SURFACE_TYPE){
            changeSurfaceType = true;
        }
        PDB.SURFACE_OPACITY = PDB.tool.getValue(opacity,1.0);
        PDB.SURFACE_WIREFRAME = PDB.tool.getValue(wireframe,false);
        PDB.SURFACE_TYPE = PDB.tool.getValue(surfaceType,1);
        var surfaceGroup = PDB.GROUP[PDB.GROUP_SURFACE];
        if(surfaceGroup !== undefined && surfaceGroup.children.length > 0 && surfaceGroup.children[0] instanceof THREE.Mesh
            && !changeSurfaceType){
            var mesh = PDB.GROUP[PDB.GROUP_SURFACE].children[0];
            if(mesh.material !== undefined){
                mesh.material.opacity = PDB.SURFACE_OPACITY;
                mesh.material.wireframe = PDB.SURFACE_WIREFRAME;
            }
        }else {
            PDB.render.clearGroupIndex(PDB.GROUP_SURFACE);
            scope.drawGeometry(structureType);
        }
    },
    changePDBIDInVrMode : function(text){
        var scope = this;
        if(text=="<--"){
            if(PDB.pdbVrId.length>0)PDB.pdbVrId=PDB.pdbVrId.substring(0,PDB.pdbVrId.length-1);
        }else{
            PDB.pdbVrId=PDB.pdbVrId+text;
        }

        if(PDB.pdbVrId.length>=5){
            PDB.pdbVrId="";
        }

        console.log("showInput:"+PDB.pdbVrId);
        PDB.render.clearGroupIndex(PDB.GROUP_INPUT);
        var color  = 0xf345;
        var limit = w3m.global.limit;
        var x = limit.x[1]  + PDB.GeoCenterOffset.x ;
        var z = limit.z[1]  + PDB.GeoCenterOffset.z;
        var p = new THREE.Vector3(x*0.02+1.2, 1.5, z*0.02);
        PDB.painter.drawTextKB(PDB.GROUP_INPUT, p, "PDB: "+PDB.pdbVrId,PDB.pdbVrId,color, 135);
        if(PDB.pdbVrId.length==4){
            scope.requestRemote(PDB.pdbVrId);
        }
    }
};
