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

        
		//switch Mode of show on big Structure
		
		var c_isLow = document.getElementById("isLow");
		
		
		c_isLow.addEventListener( 'click', function(e) {
            //PDB.render.changeToThreeMode(PDB.MODE_THREE,false);
			//console.log(this.checked);
			if(this.checked){
				PDB.loadType = PDB.bigmodel;
			}else if(!this.checked){
				PDB.loadType = PDB.smallmodel;
			}			
			PDB.render.clear(2);
            scope.refreshGeometryByMode(PDB.config.mainMode);
            
        } );
		
		
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
            vrMode.style.display = "none";
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
            this.style.display = "none";
            //PDB.render.changeToVrMode(PDB.MODE_VR,false);
            window.location.href="index.html?vmode=vr";
            //document.querySelector("#vrMode").checked=true;
            //document.querySelector("#vrMode").checked=true;
        } );

        vrWithTravel.addEventListener( 'click', function(e) {
            PDB.render.changeToVrMode(PDB.MODE_TRAVEL_VR,true);
            PDB.painter.showResidueByThreeTravel();
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
			PDB.painter.showWater();
            scope.drawGeometry(PDB.config.hetMode);
        } );

        var b_showAxis = document.getElementById("showAxis");

        b_showAxis.addEventListener( 'click', function(e) {
            if(e.target.checked){
                PDB.tool.showAxis(true);
            }else{
                PDB.tool.showAxis(false);
            }
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
            //var url = "https://vr.zhanglab.net/server/api.php?taskid=13&pdbid=5ftm";
            // if(ServerType!==2){
                // url=SERVERURL+"/data/map01.json";
            // }
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
                var isJson = PDB.tool.isJsonString(text);
				if(!isJson){
				    PDB.tool.printProgress("the response text is not a json string");
				    return;
                }
                var jsonObj = JSON.parse(text);
                if(jsonObj.code === 1 && jsonObj.data !== undefined){
                    PDB.tool.createDensityMapPanel(jsonObj);
					
					var mapserver = "map-local";
					//if(ServerType!==2){
					//    mapserver = "map-local";
					//}
					scope.emmapLoad(PDB.EMMAP.FIRST_ID, mapserver,function (emmap) {
						var middleSlice = Math.floor((PDB.EMMAP.MIN_SLICE+PDB.EMMAP.MAX_SLICE)/2);
						// PDB.painter.showMapSurface(emmap,emmap.threshold,false);
						// PDB.render.clearStructure();
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
						
						PDB.tool.changeDensityMapRangeValue(emmap);
					})
                }else{
                    PDB.tool.printProgress(jsonObj.message);
				}
            })
        });

        var input = document.getElementById("search_text");
        input.value = PDB.pdbId ;

		var b_hide      = document.getElementById( "b_hide" );
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
		
		
		
		var editResidue = document.getElementById("editResidue");	
		var segmentholder = document.getElementById("segmentholder");
		var closeeditResidue = document.getElementById("closeeditResidue");
		var b_show_editResidue   = document.getElementById( "b_show_editResidue" );
		

		closeeditResidue.addEventListener( 'click', function() {
			
			segmentholder.style.display = "none";
			editResidue.style.display = "none";
		} );
		
		
		
		b_show_editResidue.addEventListener( 'click', function(e){
			segmentholder.style.display = "block";
			editResidue.style.display = "block";
		});
		
		
		
		
		var b_replace = document.getElementById( "b_replace" );
		
		b_replace.addEventListener( 'click', function(e) {
			PDB.GROUP_ONE_RES = 37;
			//初始化
			if(!PDB.GROUP[PDB.GROUP_ONE_RES]){
				PDB.GROUP[PDB.GROUP_ONE_RES] = new THREE.Group();
			}else{
				PDB.GROUP[PDB.GROUP_ONE_RES].children = [];
			}
			var groupa = "chain_"+chain_replace.value;
			var groupb;
			if(PDB.GROUP[groupa+"_low"]){
				groupb = groupa+"_low";
			}
			
			var residue_replace = document.getElementById( "residue_replace" );
			//console.log();
			
			var allResidue = document.getElementById( "allResidue" );
			var segmentholder = document.getElementById("segmentholder");
			var editResidue = document.getElementById("editResidue");			
			var resName = allResidue.value;
			if(w3m.mol[resName]){
				PDB.painter.showRes_Ball_Rod(resName);
				//PDB.GROUP[groupa].add(PDB.GROUP[PDB.GROUP_ONE_RES]);
				segmentholder.style.display = "none";
				editResidue.style.display = "none";
				var xyz = residue_replace.selectedOptions[0].xyz;
				var resid = residue_replace.value;
			
				var t = new THREE.Vector3(xyz[0],xyz[1],xyz[2]);			
				PDB.GROUP[PDB.GROUP_ONE_RES].position.copy(t);	
				
				
				
				if(PDB.GROUP[groupa]){
					for(var i in PDB.GROUP[groupa].children){
						var _resid_ = PDB.GROUP[groupa].children[i].userData.presentAtom.resid;
						if(_resid_==resid){
							PDB.GROUP[groupa].remove(PDB.GROUP[groupa].children[i]);
							//PDB.GROUP[groupa].children
							break;
						}
					}
				}
				
				
				if(groupb&&PDB.GROUP[groupb]){
					if(PDB.GROUP[groupb]){
						for(var i in PDB.GROUP[groupb].children){
							var _resid_ = PDB.GROUP[groupb].children[i].userData.presentAtom.resid;
							if(_resid_==resid){
								PDB.GROUP[groupb].remove(PDB.GROUP[groupb].children[i]);
								//PDB.GROUP[groupa].children
								break;
							}
						}
					}
				}
				
				
				
				
				for(var i in PDB.GROUP[PDB.GROUP_ONE_RES].children){
					var obj = PDB.GROUP[PDB.GROUP_ONE_RES].getObjectById(PDB.GROUP[PDB.GROUP_ONE_RES].children[i].id);
					 PDB.GROUP[groupa].add( obj);
				}
				if(groupb&&PDB.GROUP[groupb]){
					for(var i in PDB.GROUP[PDB.GROUP_ONE_RES].children){
						var obj = PDB.GROUP[PDB.GROUP_ONE_RES].getObjectById(PDB.GROUP[PDB.GROUP_ONE_RES].children[i].id);
						 PDB.GROUP[groupb].add( obj);
					}
				}
				
				
				PDB.GROUP[PDB.GROUP_ONE_RES].children = [];
			}else{
				PDB.loader.loadResidue(resName, function () {									
					PDB.painter.showRes_Ball_Rod(resName);
					//PDB.GROUP[groupa].add(PDB.GROUP[PDB.GROUP_ONE_RES]);
					segmentholder.style.display = "none";
					editResidue.style.display = "none";
					
					
					var xyz = residue_replace.selectedOptions[0].xyz;
					var resid = residue_replace.value;				
					var t = new THREE.Vector3(xyz[0],xyz[1],xyz[2]);			
					PDB.GROUP[PDB.GROUP_ONE_RES].position.copy(t);					
					var caidpo = new THREE.Vector3(0,0,0);
					if(PDB.GROUP[groupa]){
						for(var i in PDB.GROUP[groupa].children){
							var _resid_ = PDB.GROUP[groupa].children[i].userData.presentAtom.resid;
							if(_resid_==resid){
								caidpo.copy(PDB.GROUP[groupa].children[i].userData.presentAtom.pos_centered);
								PDB.GROUP[groupa].remove(PDB.GROUP[groupa].children[i]);								
								break;
							}
						}
					}
					
					
					
					
					//console.log(caidpo);
					//获取相对向量
					var xdpo = {};
					for(var i in PDB.GROUP[PDB.GROUP_ONE_RES].children){
						var obj = PDB.GROUP[PDB.GROUP_ONE_RES].getObjectById(PDB.GROUP[PDB.GROUP_ONE_RES].children[i].id);
						if(PDB.GROUP[PDB.GROUP_ONE_RES].children[i].userData.presentAtom.name == 'ca'){							
							var po = PDB.GROUP[PDB.GROUP_ONE_RES].children[i].position;
							xdpo.x = caidpo.x - po.x;
							xdpo.y = caidpo.y - po.y;
							xdpo.z = caidpo.z - po.z;							
							break;
						}						
						//PDB.GROUP[groupa].add( obj);
					}
					//console.log(xdpo);
					for(var i in PDB.GROUP[PDB.GROUP_ONE_RES].children){
						var obj = PDB.GROUP[PDB.GROUP_ONE_RES].getObjectById(PDB.GROUP[PDB.GROUP_ONE_RES].children[i].id);
						obj.position.copy(new THREE.Vector3(obj.position.x+xdpo.x,obj.position.y+xdpo.y,obj.position.z+xdpo.z));
						PDB.GROUP[groupa].add( obj);
					}
					
					if(groupb&&PDB.GROUP[groupb]){
						for(var i in PDB.GROUP[PDB.GROUP_ONE_RES].children){
							var obj = PDB.GROUP[PDB.GROUP_ONE_RES].getObjectById(PDB.GROUP[PDB.GROUP_ONE_RES].children[i].id);
							obj.position.copy(new THREE.Vector3(obj.position.x+xdpo.x,obj.position.y+xdpo.y,obj.position.z+xdpo.z));
							PDB.GROUP[groupb].add( obj);
						}
					}
					
					
					PDB.GROUP[PDB.GROUP_ONE_RES].children = [];
				});
			}
			
			
		});

		b_hide.addEventListener( 'click', function(e) {
			//console.log(e.target.innerText);
			if(e.target.innerText=='Hide'){
				var residueData = w3m.mol[PDB.pdbId].residueData;
				for(var chain in residueData){
					PDB.GROUP['chain_'+chain].visible = false;
					if(PDB.structureSizeLevel>1){
						PDB.GROUP['chain_'+chain+'_low'].visible = false;
					}

				}
				PDB.GROUP[PDB.GROUP_HET].visible = false;
				PDB.render.hideStructure();
				e.target.innerText='Show';
			}else if(e.target.innerText=='Show'){
				var residueData = w3m.mol[PDB.pdbId].residueData;
				for(var chain in residueData){
					PDB.GROUP['chain_'+chain].visible = true;
					if(PDB.structureSizeLevel>1){
						PDB.GROUP['chain_'+chain+'_low'].visible = true;
					}

				}
				PDB.GROUP[PDB.GROUP_HET].visible = true;
                PDB.render.showStructure();
				e.target.innerText='Hide';
			}
			
		   
        } );
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

        var h_hide      = document.getElementById( "h_hide" );
        var h_line      = document.getElementById( "h_line" );
        var h_sphere    = document.getElementById( "h_sphere" );
        var h_stick     = document.getElementById( "h_stick" );
        var h_ballrod   = document.getElementById( "h_ballrod" );
        h_hide.addEventListener( 'click', function(e) {
            //console.log(e.target.innerText);
            if(e.target.innerText=='Hide'){
                PDB.GROUP[PDB.GROUP_HET].visible = false;
                e.target.innerText='Show';
            }else if(e.target.innerText=='Show'){
                PDB.GROUP[PDB.GROUP_HET].visible = true;
                e.target.innerText='Hide';
            }


        } );
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
			var surfaceGroup = PDB.GROUP[PDB.GROUP_SURFACE];
			if(surfaceGroup === undefined ||(surfaceGroup !== undefined && surfaceGroup.children.length === 0 )){
				return;
			}
            scope.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,1.0,PDB.SURFACE_WIREFRAME);
        } );
        surfaceOpacity2.addEventListener( 'click', function() {
			var surfaceGroup = PDB.GROUP[PDB.GROUP_SURFACE];
			if(surfaceGroup === undefined ||(surfaceGroup !== undefined && surfaceGroup.children.length === 0 )){
				return;
			}
            scope.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,0.9,PDB.SURFACE_WIREFRAME);
        } );
        surfaceOpacity3.addEventListener( 'click', function() {
			var surfaceGroup = PDB.GROUP[PDB.GROUP_SURFACE];
			if(surfaceGroup === undefined ||(surfaceGroup !== undefined && surfaceGroup.children.length === 0 )){
				return;
			}
            scope.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,0.8,PDB.SURFACE_WIREFRAME);
        } );
        surfaceOpacity4.addEventListener( 'click', function() {
			var surfaceGroup = PDB.GROUP[PDB.GROUP_SURFACE];
			if(surfaceGroup === undefined ||(surfaceGroup !== undefined && surfaceGroup.children.length === 0 )){
				return;
			}
            scope.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,0.7,PDB.SURFACE_WIREFRAME);
        } );
        surfaceOpacity5.addEventListener( 'click', function() {
			var surfaceGroup = PDB.GROUP[PDB.GROUP_SURFACE];
			if(surfaceGroup === undefined ||(surfaceGroup !== undefined && surfaceGroup.children.length === 0 )){
				return;
			}
            scope.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,0.6,PDB.SURFACE_WIREFRAME);
        } );
        surfaceOpacity6.addEventListener( 'click', function() {
			var surfaceGroup = PDB.GROUP[PDB.GROUP_SURFACE];
			if(surfaceGroup === undefined ||(surfaceGroup !== undefined && surfaceGroup.children.length === 0 )){
				return;
			}
            scope.refreshSurface(PDB.config.surfaceMode,PDB.SURFACE_TYPE,0.5,PDB.SURFACE_WIREFRAME);
        } );


        var wireFrame   = document.getElementById( "wireFrame" );
        wireFrame.addEventListener( 'click', function(event) {
			var surfaceGroup = PDB.GROUP[PDB.GROUP_SURFACE];
			if(surfaceGroup === undefined ||(surfaceGroup !== undefined && surfaceGroup.children.length === 0 )){
				return;
			}
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
            PDB.label_type = PDB.SELECTION_MODEL;
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
            PDB.label_type = PDB.SELECTION_CHAIN;
        } );
        selResidue.addEventListener( 'click', function() {
            PDB.label_type = PDB.SELECTION_RESIDUE;
        } );
        selAtom.addEventListener( 'click', function() {
            PDB.label_type = PDB.SELECTION_ATOM;
        } );



        //=============================== EXPORT =======================
        //
        var b_export_scene = document.getElementById("b_export_scene");
        b_export_scene.addEventListener( 'click', function() {
            //console.log(document.getElementById( "exportType" ).value);
			
			PDB.render.exportToObj(document.getElementById( "exportType" ).value);


            // worker.addEventListener('message', function(e) {
            //    console.log(e.data);
            // }, false);


            // var exporter = new THREE.OBJExporter();
            // var result = exporter.parse( scene );
            // console.log(result.length);
            // var f = PDB.pdbId+".obj";

            // worker.postMessage({'cmd': 'start', 'msg': 'Hi', 'filename':f,'data':result});
        } );
		var b_export_pdb = document.getElementById("b_export_pdb");
		 b_export_pdb.addEventListener( 'click', function(e) {			
			w3m.ajax.get(PDB.pdbId, function(text) {			
				//w3m.tool.clear();
				PDB.exportPdb = true;
				w3m.config.rep_mode_main = PDB.config.mainMode;
				w3m.config.rep_mode_het = PDB.config.hetMode;
				w3m.pdb(text);
			});
		 });
         //=============================== trigger =======================
        //
        //trigger mode
        var distance     = document.getElementById( "triggerDistance" );
        var angle     = document.getElementById( "triggerAngle" );
		var isHide     = document.getElementById( "isHide" );
        distance.addEventListener( 'click', function(e) {
            PDB.selection_mode = PDB.SELECTION_ATOM;
            PDB.trigger = PDB.TRIGGER_EVENT_DISTANCE;
        } );

        angle.addEventListener( 'click', function(e) {
            PDB.selection_mode = PDB.SELECTION_ATOM;
            PDB.trigger = PDB.TRIGGER_EVENT_ANGLE;
        } );
		
		isHide.addEventListener( 'click', function(e) {
			if(e.target.checked){
				PDB.GROUP[PDB.GROUP_MAIN].visible = false;
			}else{
				PDB.GROUP[PDB.GROUP_MAIN].visible = true;
			}
           
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
                    if(color_mode !== "610"){
                        scope.switchColorBymode(color_mode);
                    }else{
                        var chain = "A";
                        var url = PDB.CONSERVATION_URL+"&pdbid="+PDB.pdbId.toUpperCase()+"&chain="+chain;
                        if(ServerType != 2){
                            url = SERVERURL+"/data/conservation.json";
                        }
                        PDB.tool.ajax.get(url,function (text) {
                            PDB.controller.clear(4,undefined);
                            PDB.painter.showConservation(text);
                            PDB.render.clearMain();
                            PDB.controller.drawGeometry(PDB.config.mainMode);
                        })
                    }
                } );
            }

        }


        // selection model
        // var dragModel    = document.getElementById( "dragModel" );
        // var dragMainHet  = document.getElementById( "dragMainHet" );
        // var dragMain     = document.getElementById( "dragMain" );
		var dragReset      = document.getElementById( "dragReset" );
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
		dragReset.addEventListener( 'click', function() {
            PDB.tool.backToInitialPositonForDesktop();
        } );
        dragHet.addEventListener( 'click', function() {
			PDB.controller.switchDragByMode(PDB.SELECTION_HET);
        } );
        dragChain.addEventListener( 'click', function() {
			PDB.controller.switchDragByMode(PDB.SELECTION_CHAIN);
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
        var showMutationTable = document.getElementById("showMutationTable");

        mutationTCGA.addEventListener( 'click', function() {
            var url = PDB.MUTATION_URL+"&pdbid="+PDB.pdbId.toUpperCase()+"&ds=tcga";
            if(ServerType !== 2){
                url = SERVERURL+"/data/mutation.json";
            }
            PDB.tool.ajax.get(url,function (text) {
                PDB.controller.clear(4,undefined);
                PDB.painter.showMutation(text);
                PDB.tool.showMutationTable(false,text);
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

        showMutationTable.addEventListener( 'click', function() {
            if(this.checked){
                document.getElementById("rightmenu").hidden=false;
            }else{
                document.getElementById("rightmenu").hidden=true;
            }
        } );

        //============================rotation==========================
        //rotation
        var rotationSwitch = document.getElementById("rotationSwitch");
        var rotationLeft = document.getElementById("rotationCounterclockwise");
        var rotationRight = document.getElementById("rotationClockwise");

        rotationSwitch.addEventListener( 'click', function() {
            PDB.controller.cancelRotation();
        } );
        rotationLeft.addEventListener( 'click', function() {
            var val = $('input[name="rotateAxis"]:checked').val();
            PDB.controller.cancelRotation();
            PDB.controller.startRotation(Number(val),1);
        } );
        rotationRight.addEventListener( 'click', function() {
            var val = $('input[name="rotateAxis"]:checked').val();
            PDB.controller.cancelRotation();
            PDB.controller.startRotation(Number(val),0);
        } );


        // var showDemo   = document.getElementById( "showDemo" );
        // showDemo.addEventListener( 'click', function(event) {
            // if(event.target.checked !== undefined){
                // PDB.DEMO.FLAG =  event.target.checked;
                // if(PDB.DEMO.FLAG){
                    // PDB.DEMO.ID = self.setInterval(PDB.render.showDemo,21);
                // }else{
                    // window.clearInterval(PDB.DEMO.ID);
                // }
            // }
        // } );
        // if(PDB.DEMO.FLAG){
            // PDB.DEMO.ID = self.setInterval(PDB.render.showDemo,21);
        // }

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

        //=============================== Drug Design =======================
		//=======add randomMigration
		 var showBoxHelper = document.getElementById("showBoxHelper");
        showBoxHelper.addEventListener( 'click', function(e) {
		 	if(this.checked){
		 		if(PDB.GROUP[PDB.GROUP_BOX_HELPER]){
					PDB.GROUP[PDB.GROUP_BOX_HELPER].visible = true;
				}
		 	}else{
		 		if(PDB.GROUP[PDB.GROUP_BOX_HELPER]){
					PDB.GROUP[PDB.GROUP_BOX_HELPER].visible = false;
				}
		 	}
		 });
		//=======add randomMigration
		 var randomMigration = document.getElementById("randomMigration");
		 randomMigration.addEventListener( 'click', function(e) {
		 	if(this.checked){
		 		PDB.DRUGMOVE = true;
		 		PDB.drugMoveTime = new Date();
		 	}else{
		 		PDB.DRUGMOVE = false;
		 	}
		 });

        //hide drug
        var hideDrug = document.getElementById("hideDrug");
        hideDrug.addEventListener( 'click', function(e) {
            if(this.checked){
                PDB.GROUP[PDB.GROUP_DRUG].visible= false;
            }else{
                PDB.GROUP[PDB.GROUP_DRUG].visible= true;
            }
        });


        var b_load_drug = document.getElementById("b_load_drug");
        b_load_drug.addEventListener( 'click', function() {

            var url = SERVERURL+"/server/api.php?taskid=12&pdbid="+PDB.pdbId.toUpperCase();
            //url = "http://vr.zhanglab.net/server/api.php?taskid=12&pdbid="+PDB.pdbId.toUpperCase();
            if(ServerType!==2){
                url = SERVERURL+"/data/drug.json";
            }
            PDB.tool.ajax.get(url,function (text) {
                var jsonObj = JSON.parse(text);

                if(jsonObj.code === 1 && jsonObj.data !== undefined){
                    //生成面板
                    var rightMenuDiv = document.getElementById("rightmenu");
                    rightMenuDiv.hidden=false;
                    rightMenuDiv.style.overflowY ="hidden";
                    rightMenuDiv.innerHTML="<label>Box Helper Limit</label><br/><span class=\"xyz_min_max\"><label>x:</label><input id=\"x_min\"/>~<input id=\"x_max\"/><br/><label>y:</label><input id=\"y_min\"/>~<input id=\"y_max\"/><br/><label>z:</label><input id=\"z_min\"/>~<input id=\"z_max\"/><br/></span>";
					
					var helperLab = PDB.tool.generateLabel(rightMenuDiv,"Box Helper Limit","");
					
					$("#x_min").val(w3m.global.limit.x[0]);
					$("#x_max").val(w3m.global.limit.x[1]);
					$("#y_min").val(w3m.global.limit.y[0]);
					$("#y_max").val(w3m.global.limit.y[1]);
					$("#z_min").val(w3m.global.limit.z[0]);
					$("#z_max").val(w3m.global.limit.z[1]);
					
					$(".xyz_min_max input").bind('change',function(e){
						if($(this).val()!=null&&!isNaN(Number($(this).val()))){
							var x_min = $("#x_min").val()==""?w3m.global.limit.x[0]:Number($("#x_min").val());
							var x_max = $("#x_max").val()==""?w3m.global.limit.x[1]:Number($("#x_max").val());
							var y_min = $("#y_min").val()==""?w3m.global.limit.y[0]:Number($("#y_min").val());
							var y_max = $("#y_max").val()==""?w3m.global.limit.y[1]:Number($("#y_max").val());
							var z_min = $("#z_min").val()==""?w3m.global.limit.z[0]:Number($("#z_min").val());
							var z_max = $("#z_max").val()==""?w3m.global.limit.z[1]:Number($("#z_max").val());							
							var limit = {
								x:w3m.global.limit.x,
								y:w3m.global.limit.y,
								z:w3m.global.limit.z
							};							
							if(!isNaN(x_min)){
								limit.x[0] = x_min;								
							}
							if(!isNaN(x_max)){
								limit.x[1] = x_max;								
							}
							if(!isNaN(y_min)){
								limit.y[0] = y_min;								
							}
							if(!isNaN(y_max)){
								limit.y[1] = y_max;								
							}
							if(!isNaN(z_min)){
								limit.z[0] = z_min;								
							}
							if(!isNaN(z_max)){
								limit.z[1] = z_max;								
							}
							//console.log(limit);
							PDB.render.clearGroupIndex(PDB.GROUP_BOX_HELPER);
							PDB.painter.showBoxHelper(limit);
							PDB.tool.generateDrugMigrationPath(limit);
						}
					});
					
					
					
					
                    var titleLab = PDB.tool.generateLabel(rightMenuDiv,"Drug List","");
                    var span = PDB.tool.generateSpan(rightMenuDiv,"menuSpan","rightsubmenu");
                    var bindingdb = jsonObj.data[0].bindingdb;
                    PDB.controller.LoadDrugDetails(span,PDB.DRUG_MODE_CONFIG.BINDING_DB,bindingdb);


                    var chembl = jsonObj.data[0].chembl;
                    PDB.controller.LoadDrugDetails(span,PDB.DRUG_MODE_CONFIG.CHEMBL,chembl);


                    var swisslipids = jsonObj.data[0].swisslipids;
                    PDB.controller.LoadDrugDetails(span,PDB.DRUG_MODE_CONFIG.SWISSLIPIDS,swisslipids);

                    var guidetopharmacology = jsonObj.data[0].guidetopharmacology;
                    PDB.controller.LoadDrugDetails(span,PDB.DRUG_MODE_CONFIG.GUIDETOPHARMACOLOGY,guidetopharmacology);


                    var drugbank = jsonObj.data[0].drugbank;
                    PDB.controller.LoadDrugDetails(span,PDB.DRUG_MODE_CONFIG.DRUG_BANK,drugbank);
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
                    PDB.loader.loadDrug(drugId,dbname, function () {
                        w3m.mol[drugId].drug = true;
                        PDB.render.clearGroupIndex(PDB.GROUP_DRUG);
                        PDB.painter.showHet(drugId);

						//====add the random migration path and scope
						PDB.tool.generateDrugMigrationPath();
                        PDB.GROUP[PDB.GROUP_DRUG].visible = true;
                    });
                });
                PDB.tool.generateALink(span, "link" + i, "Detail", PDB.DRUG_MODE_CONFIG.Detail_URL[dbname] + drugids[i], "");
                PDB.tool.generateDocklingLink(span, "link" + i, "docking", drugids[i], dbname);
                span.appendChild(document.createElement("br"));
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
            //if(ServerType!==2){
            //    mapserver = "map-local";
            //}
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
		// console.log(mode);
    },
    fragmentPainter : function(startId,endId,selectedMode){
		var reptype = 0;
        var selectRadius = 0;
		
		if(selectedMode ==="Rectangle"){
            selectRadius = 0;
			reptype = PDB.RIBBON_RECTANGLE;
        }else if(selectedMode ==="Tube"){
            selectRadius = PDB.CONFIG.tube_radius;
			reptype = PDB.TUBE;
        }else if(selectedMode ==="Ellipse"){
            selectRadius = PDB.CONFIG.ellipse_radius;
			reptype = PDB.RIBBON_ELLIPSE;
        }else if(selectedMode=="Strip"){
            selectRadius = PDB.CONFIG.strip_radius;
			reptype = PDB.RIBBON_STRIP;
        }else if(selectedMode=="Railway"){
            selectRadius = PDB.CONFIG.railway_radius;
			reptype = PDB.RIBBON_RAILWAY;
        }else if(selectedMode=="Flat"){
            selectRadius = 0;
			reptype = PDB.RIBBON_FLAT;
        }else if(selectedMode=="Sphere"){
			reptype = PDB.SPHERE;
		}else if(selectedMode=="Backbone"){
			reptype = PDB.BACKBONE;
		}else if(selectedMode=="Line"){
			reptype = PDB.LINE;
		}else if(selectedMode=="Sticks"){
			reptype = PDB.STICK;
		}else if(selectedMode=="BallRod"){
			reptype = PDB.BALL_AND_ROD;
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
            // PDB.CONFIG.startSegmentID = startId;
            // PDB.CONFIG.endSegmentID = endId;
            // PDB.painter.showSegmentByStartEnd(PDB.CONFIG.startSegmentID,PDB.CONFIG.endSegmentID,selectedMode,selectRadius);
			
			//新模式,每个residue设置属性：------fragment
			
			var startAtom = PDB.tool.getMainAtom(PDB.pdbId,startId);
			var endAtom = PDB.tool.getMainAtom(PDB.pdbId,endId);
			if(startAtom.chainname==endAtom.chainname){
				var obj = {
					start 	 : w3m.mol[PDB.pdbId].residueData[startAtom.chainname][startAtom.resid],
					end		 : w3m.mol[PDB.pdbId].residueData[startAtom.chainname][endAtom.resid],
					issel	 : true,
					reptype  : reptype
				};
				PDB.fragmentList = {
					0:obj
				};
				console.log(PDB.fragmentList);
				PDB.painter.showFragmentsResidues();
			}
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
		// PDB.fragmentList = {};
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
					scope.initSelectedPanel(PDB.DRAWSTYLE_FRAGMENT);
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
	initReplaceResidue : function(chain){
		var residue_replace = document.getElementById("residue_replace");		
		residue_replace.innerHTML="";	
		var atoms = w3m.mol[PDB.pdbId].atom.main;
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
			if(chain==chainName&&atomName=='ca'){				
				var newOption = document.createElement("option");
				newOption.innerHTML = residueID+":"+residueName;
				newOption.value = residueID;
				newOption.xyz= xyz;
				newOption.caid= atomId;				
				residue_replace.appendChild(newOption);
			}
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
		var chain_replace = document.getElementById("chain_replace");
		var chainarray = Object.keys(w3m.mol[PDB.pdbId].chain);
		chainIDSelect.innerHTML = "";
		chain_replace.innerHTML = "";
		for(var i in chainarray){
			var newOption = document.createElement("option");
			newOption.innerHTML = chainarray[i];
			newOption.value = chainarray[i];
			chainIDSelect.appendChild(newOption);
			
			var newOption1 = document.createElement("option");
			newOption1.innerHTML = chainarray[i];
			newOption1.value = chainarray[i];
			chain_replace.appendChild(newOption1);
		}
		chainIDSelect.addEventListener( 'change', function(e) {
			var chainName = chainIDSelect.value;
			scope.initSartAndSelect(chainName);
		} );
		this.initSartAndSelect(chainarray[0]);
		chain_replace.addEventListener( 'change', function(e) {
			var chainName = chain_replace.value;
			scope.initReplaceResidue(chainName);
		} );
		//初始化所有替换氨基酸名字
		var allResidue = document.getElementById("allResidue");
		for(var i in w3m.mol[PDB.pdbId].residueTypeList){
			var resName = w3m.mol[PDB.pdbId].residueTypeList[i];
			var newOption = document.createElement("option");
			newOption.innerHTML = resName;
			newOption.value = resName;
			allResidue.appendChild(newOption);
		}		
		this.initReplaceResidue(chainarray[0]);
	},
    requestRemote : function(name){
        console.log("controller.requestRemote:"+name);
		
		//清空链上residue缓存信息		
		
		if(PDB.residueGroupObject){
			delete PDB.residueGroupObject;
			PDB.residueGroupObject = {};
		}
		// console.log(PDB.residueGroupObject);		
		PDB.CHANGESTYLE = 0;//切换mode，放弃fragment
        var scope = this;
        var input = document.getElementById("search_text");
        input.value = name;
        if(name.indexOf("http://") != -1){
            name = name.substr(name.lastIndexOf("/")+1);
            name = name.replace(".pdb","");
        }else {
            PDB.pdbId = name.toLowerCase();
        }
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
			
			if(PDB.mode===PDB.MODE_VR){
				PDB.tool.matchSurfaceAndMainGroupLocationForVR(PDB.GROUP[PDB.GROUP_SURFACE],PDB.GROUP[PDB.GROUP_MAIN]);
			}else{
				PDB.tool.backToInitialPositonForDesktop();
			}
            
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
    },
    startRotation: function (axis,direction) {
        window.clearInterval(PDB.ROTATION_TASK_ID);
        PDB.ROTATION_DIRECTION=direction;
        PDB.ROTATION_AXIS=axis;
        PDB.ROTATION_START_FLAG = true;
        PDB.ROTATION_TASK_ID =self.setInterval("PDB.painter.rotate()",20);
    },
    cancelRotation:function () {
        PDB.ROTATION_START_FLAG = false;
        window.clearInterval(PDB.ROTATION_TASK_ID);
    },
    startMotion: function (axia,direction) {
        window.clearInterval(PDB.MOVE_TASK_ID);
        PDB.MOVE_AXIS = axia;
        PDB.MOVE_DIRECTION =direction;
        if(PDB.MOVE_DIRECTION === 1){
            PDB.MOVE_TASK_ID =self.setInterval("PDB.painter.near()",20);
        }else if(PDB.MOVE_DIRECTION === 2) {
            PDB.MOVE_TASK_ID =self.setInterval("PDB.painter.far()",20);
        }
    },
    cancelMotion: function () {
        window.clearInterval(PDB.MOVE_TASK_ID);
    }
};
