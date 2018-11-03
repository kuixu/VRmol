/**
 * Created by admin on 2017/7/15.
 */
PDB.tool = {

    getValue : function (param,defaultVal) {
        if(param !== undefined && param !== null && param !==""){
            return param;
        }else {
            return defaultVal;
        }
    },
    midPoint : function (point1,point2) {
        return new THREE.Vector3((point1.x+point2.x)/2, (point1.y+point2.y)/2, (point1.z+point2.z)/2);
    },
    MaxEdge : function(){
        var limit = w3m.global.limit;
        var xedge = limit.x[1] - limit.x[0];
        var yedge = limit.y[1] - limit.y[0];
        var zedge = limit.z[1] - limit.z[0];
        var medge = xedge >yedge ?xedge:yedge;
        return medge >zedge ?medge:zedge;
    },
    getMainAtom : function(molid, id){
        var scope = this;
        var atom = w3m.mol[molid].atom.main[id];
        if(atom !== undefined){
            return scope.getAtomById(molid, atom, 'main');
        }
        return undefined;
    },
	// before sphere visualization 2018-08-16
    rotation0:function (groupIndexs,type) {
        if(type === 0){
            groupIndexs.forEach(function (index) {
                var group = PDB.GROUP[index];
                if(group!== undefined){
                    // var time = Date.now() * 0.0004;
                    // group.rotation.y = -time;
                    group.rotation.y = group.rotation.y - 0.005;
                }
            })
        }else if(type ===1){
            groupIndexs.forEach(function (index) {
                var group = PDB.GROUP[index];
                if(group!== undefined){
                    // var time = Date.now() * 0.0004;
                    // group.rotation.y = time;
                    group.rotation.y = group.rotation.y + 0.005;
                }
            })
        }
    },
    getMainResAtomsByAtom : function(atom){
        var key = atom.chainname+"_"+atom.resid;
        var molid =PDB.pdbId;
        var scope = this;
        var atoms = new Array();
        var id = atom.id;
        while(id--&&id>0){
            var newAtom =scope.getMainAtom(molid,id);
            if(newAtom === undefined){
                break;
            }
            var newKey = newAtom.chainname+"_"+newAtom.resid;
            if(key===newKey){
                atoms.push(newAtom);
            }else{
                break;
            }
        }
        id = atom.id;
        atoms.push(atom);
        while(id++&&id<w3m.mol[molid].atom.main.length){
            var newAtom =scope.getMainAtom(molid,id);
            if(newAtom === undefined){
                break;
            }
            var newKey = newAtom.chainname+"_"+newAtom.resid;
            if(key===newKey){
                atoms.push(newAtom);
            }else{
                break;
            }
        }
        return atoms;
    },
    getMainChainAtomsByAtom : function(atom){
        var key = atom.chainname;
        var molid =PDB.pdbId;
        var scope = this;
        var atoms = new Array();
        var id = atom.id;
        while(id--&&id>0){
            var newAtom =scope.getMainAtom(molid,id);
            if(newAtom === undefined){
                break;
            }
            var newKey = newAtom.chainname;
            if(key===newKey){
                atoms.push(newAtom);
            }else{
                break;
            }
        }
        id = atom.id;
        atoms.push(atom);
        while(id++&&id<w3m.mol[molid].atom.main.length){
            var newAtom =scope.getMainAtom(molid,id);
            if(newAtom === undefined){
                break;
            }
            var newKey = newAtom.chainname;
            if(key===newKey){
                atoms.push(newAtom);
            }else{
                break;
            }
        }
        return atoms;
    },
    getHetAtom : function(molid, id){
        var scope = this;
        var atom = w3m.mol[molid].atom.het[id];
        if(atom !== undefined){
            return scope.getAtomById(molid,atom,'het');
        }else{
            return scope.getMainAtom(molid, id);
        }
        return undefined;
    },
    getAtomById : function(molid, atom,structure){
        var scope = this;
        var atomID = atom[1];
        var atomName = atom[2];
        var residueName = atom[3];
        var chainName = atom[4];
        var residueID = atom[5];
        var xyz = atom[6];
        var b_factor = atom[7];
        var coe = atom[8];
        var atomType = atom[9];



        var radius = w3m.geometry["radius"][atomType] ;

        var pos = new THREE.Vector3(xyz[0],xyz[1],xyz[2]);
        // Center the geometry
        var offset = PDB.GeoCenterOffset;
        var pos_centered = new THREE.Vector3(
            xyz[0]+offset.x,
            xyz[1]+offset.y,
            xyz[2]+offset.z);
        //var color_index = w3m.mol[PDB.pdbId].color_real[atomID];//取得{r:*g:*,b:*}格式的颜色
        var color = scope.getColorByIndex(molid, atomID,structure);

        var atomObj = {id: atomID, name: atomName, resname:residueName,
            chainname:chainName, resid: residueID, pos: pos,
            pos_centered:pos_centered, bfactor:b_factor,coe:coe,
            type:atomType, radius :radius,color: color};

        return atomObj;
    },
    equalAtom:function (atom1,atom2) {
        if(atom1.id === atom2.id){
            return true;
        }
        return false;
    },
    getColorByAtomType : function(atomType){
        var X_color_index = w3m.color['element'][atomType];
        var X_color = w3m.rgb[X_color_index];
        var color = new THREE.Color(X_color[0],X_color[1],X_color[2]);
        return color;
    },
    getColorByIndex : function(molid,id,structure){
		var rId = w3m.mol[molid].color[structure][id];
		if(rId){
			var C_color = w3m.rgb[rId][0],
            N_color = w3m.rgb[rId][1],
            O_color = w3m.rgb[rId][2];
			return new THREE.Color(C_color,N_color, O_color);
		}else{
			return new THREE.Color("#ccc");
		}
        
    },
	getColorByColorIndex : function(colorIndex){
        var X_color = w3m.rgb[colorIndex];
        var color = new THREE.Color(X_color[0],X_color[1],X_color[2]);
        return color;
    },
    getMaterialsByAtomId : function(id){
        var colorId = w3m.mol[PDB.pdbId].color['main'][id];
        //if(materialsId[colorId]==undefined){
        var tc = PDB.tool.getColorByIndex(id,'main');
        return new THREE.MeshPhongMaterial({ color:tc });

        //}
    },
    writeTextFile : function(afilename, output)
    {
        var outfile = new debugout();
        outfile.logFilename = afilename;
        outfile.log(output);
        //outfile.log("By xukui from ZhangLab in Tsinghua Univ.");
        outfile.downloadLog();
      // var txtFile =new File(["foo"],afilename);
      // txtFile.writeln(output);
      // txtFile.close();
    },
    showMask : function () {
        var scope = this;
        var height = document.body.scrollHeight;
        var width = document.body.scrollWidth;
        var weChatMask = document.getElementById("weChatMask");
        weChatMask.style.display="block";
        weChatMask.style.position="absolute";
        weChatMask.style.display="block";
        weChatMask.style.zIndex = "8888";
        weChatMask.style.width=width+"px";
        weChatMask.style.height=height+"px";
        weChatMask.style.background="white";
        weChatMask.style.opacity="0.5";
        var evt = event || window.event;
        var event = scope.getMousePos(evt);
        var weChatPop = document.getElementById("weChatPop");
        weChatPop.style.top= (event.y-400)+"px";
        weChatPop.style.left= (event.x+200)+"px";
        weChatPop.style.display="block";
        weChatPop.style.zIndex = "9999";
        weChatPop.style.opacity="1";
    },
    hideMask : function () {
        var weChatMask = document.getElementById("weChatMask");
        var weChatPop = document.getElementById("weChatPop");
        weChatMask.style.display="none";
        weChatPop.style.display="none";
    },
    getFirstAtomIdByChain: function(chainName){
        var first_resid = Object.keys(w3m.mol[PDB.pdbId].rep[chainName])[0];
        return this.getFirstAtomByResidueId(first_resid, chainName)[0];

    },
	getFirstAtomByResidueId : function(residueId,chainName){
		var atoms = w3m.mol[PDB.pdbId].atom.main;
		var atom = [];
		for(var atomId in atoms){
			if(atoms[atomId][4]==chainName){
				var p_residueId = atoms[atomId][5];
				if(residueId == p_residueId){
					atom = atoms[atomId];
					break;
				}
			}
		}
		return atom;
	},
	getLastAtomByResidueId : function(residueId,chainName){
		var atoms = w3m.mol[PDB.pdbId].atom.main;
		var atom = [];
		var pre_residueId= - 1;
		var p_residueId= - 1;
		for(var atomId in atoms){
			if(atoms[atomId][4]==chainName){
				p_residueId =  atoms[atomId][5];
				// if(atoms[atomId][5] == residueId){
				if(pre_residueId!=-1){
					if(residueId==pre_residueId&&pre_residueId!=p_residueId){
						atom = atoms[atomId-1];
						break;
					}
				}
				pre_residueId = atoms[atomId][5];
				// }
			}


		}
		return atom;
	},
	
    getCAAtomByLastAtomId : function(atomId){//α炭原子ID
        var atoms = w3m.mol[PDB.pdbId].atom.main;
        var atom = atoms[atomId];
        if(atom[2]==='ca'){
            return atom;
        }
        while(atomId--&&atomId>0){
            atom = atoms[atomId];
            if(atom===undefined)continue;
            if(atom[2]=='ca')break;
        }
        return atom;
    },
    getCAAtomByStartAtomId : function(atomId){//α炭原子ID
        var atoms = w3m.mol[PDB.pdbId].atom.main;
        var atom = atoms[atomId];
        if(atom[2]==='ca'){
            return atom;
        }
        while(atomId++&&atomId<Object.keys(atoms).length-1){
            atom = atoms[atomId];
            if(atom===undefined)continue;
            if(atom[2]=='ca')break;
        }
        return atom;
    },
    getCAAtomByResidueId : function(residueId,chainName){
        var scope = this;
        var atoms = w3m.mol[PDB.pdbId].atom.main;
        var atom = [];
        for(var atomId in atoms){
            if(atoms[atomId][4]==chainName.toLowerCase() || atoms[atomId][4]==chainName.toUpperCase()){
                var p_residueId = atoms[atomId][5];
                if(residueId == p_residueId && atoms[atomId][2] === "ca"){
                    atom = atoms[atomId];
                    break;
                }
            }
        }
        var atomObj = scope.getMainAtom(PDB.pdbId, atom[1]);
        return atomObj;
    },
    getMousePos : function(event){
        var e = event || window.event;
        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        var x = e.pageX || e.clientX + scrollX;
        var y = e.pageY || e.clientY + scrollY;
        return { 'x': x, 'y': y };
    },
    /**
     * 获取空间三个坐标点所成的角度
     * @param pointAngle 中心点
     * @param pointEdge1
     * @param pointEdge2
     * @returns {{}} 返回角度数
     */
    getAngleMeasurement : function (pointAngle,pointEdge1,pointEdge2) {
        var ms = {};
        var uAB = vec3.unit(vec3.point(pointAngle, pointEdge1)),
            uAC = vec3.unit(vec3.point(pointAngle, pointEdge2)),
            rad = vec3.rad(uAB, uAC, true),
            xyz = vec3.plus(pointAngle, vec3.plus(uAB, uAC));
        ms.result = math.rad2degree(rad);
        ms.label_xyz = xyz;
        return ms;
    },
    /**
     * 获取两个atom的中间点
     * @param preAtomId 前一个点的Atom ID
     * @param nextAtomId 后一个点的Atom ID
     * @returns {{}} 返回中间点坐标Vector3
     */
    getMidPoint : function (molid,preAtomId,nextAtomId) {
		var offset = PDB.GeoCenterOffset;//偏移量
        var preAtom = w3m.mol[molid].atom.main[preAtomId];
		var nextAtom = w3m.mol[molid].atom.main[nextAtomId];
		if(preAtom!=undefined&&nextAtom!=undefined){
			var pre = preAtom[6];
			var next = nextAtom[6];
			return new THREE.Vector3((pre[0]+next[0])/2+offset.x,(pre[1]+next[1])/2+offset.y,(pre[2]+next[2])/2+offset.z);
		}else return undefined;

    },
    getColorForPercentage: function(pct) {
        var percentColors = [
        { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
        { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
        { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } }
        ];
        for (var i = 1; i < percentColors.length - 1; i++) {
            if (pct < percentColors[i].pct) {
                break;
            }
        }
        var lower = percentColors[i - 1];
        var upper = percentColors[i];
        var range = upper.pct - lower.pct;
        var rangePct = (pct - lower.pct) / range;
        var pctLower = 1 - rangePct;
        var pctUpper = rangePct;
        var color = {
            r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
            g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
            b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
        };
        //return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
        return new THREE.Color(color.r, color.g, color.b);
        // or output as hex if preferred
    },
    colorIntersectObjectRed : function (obj,value) {
        if(obj.type==="Group"){
            for(var child in obj.children){
                PDB.tool.colorIntersectObjectRed(obj.children[child], value);
            }
        }else if(obj!=undefined && obj.material!=undefined){
            if(typeof(obj.material)==="object" && obj.material.emissive!=undefined){
                obj.material.emissive.r = value;
            }else if(obj.material.length!==undefined&&obj.material.length>=0 &&obj.material[0].emissive!=undefined){
                obj.material[0].emissive.r = value;
            }
        }
    },
    colorIntersectObjectBlue : function (obj,value) {
        if(obj.type==="Group"){
            for(var child in obj.children){
                PDB.tool.colorIntersectObjectBlue(obj.children[child], value);
            }
        }else if(obj!=undefined && obj.material!=undefined){
            if(typeof(obj.material)==="object" && obj.material.emissive!=undefined){
                obj.material.emissive.b = value;
            }else if(obj.material.length!==undefined&&obj.material.length>=0 &&obj.material[0].emissive!=undefined){
                obj.material[0].emissive.b = value;
            }
        }
    },
    colorIntersectObjectRed0 : function (obj,value) {
        if(obj.type==="Group"){
            for(var child in obj.children){
                PDB.tool.colorIntersectObjectRed(obj.children[child], value);
            }
        }else if(obj!=undefined && obj.material!=undefined
            && obj.material.emissive!=undefined){
            obj.material.emissive.r = value;
        }
    },
    colorIntersectObjectBlue0 : function (obj,value) {
        if(obj.type==="Group"){
            for(var child in obj.children){
                PDB.tool.colorIntersectObjectBlue(obj.children[child], value);
            }
        }else if(obj!=undefined && obj.material!=undefined
            && obj.material.emissive!=undefined){
            obj.material.emissive.b = value;
        }
    },
    ajax: (function() {
        var io        = new XMLHttpRequest(),
            id        = '',
            url       = '',
            url_index = 0,
            callback  = null;
        io.onprogress = function() {

        }
        io.onload = function() {
            if ( this.status == 200 ) {
                callback(io.responseText);
            } else {
                if ( w3m_isset(PDB.remoteUrl[++url_index]) ) {
                    this.get(id, callback);
                } else {
                    url_index = 0;
                }
            }
        }
        io.onabort = function() {
            url_index = 0;
        },
        io.ontimeout = function() {
            if ( w3m_isset(PDB.remoteUrl[++url_index]) ) {
                this.get(id, callback);
            } else {
                url_index = 0;
            }
        },
        io.onerror = function() {
            url_index = 0;
        },
        io.get = function(url, fn) {
            callback = fn;
            this.open('GET', url, true);
            this.send();
        }
        return io;
    })(),
    checkPointOfSpecialPlane: function (point) {
       var plane = PDB.PLANE;
        var result = plane.a*point.x+plane.a*point.x+plane.b*point.y+plane.c*point.z+plane.d;
        if(result === 0){
            return true;
        }
        return false;
    },
    generatePlane: function(point1,point2,point3){
        var a, b, c,d;
        a = ( (point2.y-point1.y)*(point3.z-point1.z)-(point2.z-point1.z)*(point3.y-point1.y) );
        b = ( (point2.z-point1.z)*(point3.x-point1.x)-(point2.x-point1.x)*(point3.z-point1.z) );
        c = ( (point2.x-point1.x)*(point3.y-point1.y)-(point2.y-point1.y)*(point3.x-point1.x) );
        d = ( 0-(a*point1.x+b*point1.y+c*point1.z) );
        PDB.PLANE = {a:a,b:b,c:c,d:d};
    },
    isBonded:function(at1,at2){
        var minlength2 = 0.5 * 0.5;
        var maxlength2 = 1.9 * 1.9;
        var maxlength_sbond2 = 2.2 * 2.2;
        var maxlength_hbond2 = 3.5 * 3.5;
        var d2 = (at2.pos.x - at1.pos.x)*(at2.pos.x - at1.pos.x) + (at2.pos.y - at1.pos.y)*(at2.pos.y - at1.pos.y) + (at2.pos.z - at1.pos.z)*(at2.pos.z - at1.pos.z);

        if (at1.name === 'sg' && at2.name === 'sg' && d2 < maxlength_sbond2) {
            return PDB.BOND_TYPE_SSBOND;
        }
        else if ( minlength2 < d2 && d2 < maxlength2) {
            return PDB.BOND_TYPE_COVALENT;
        }
        else if ( (at1.name === 'o' && at2.name === 'n' && d2 < maxlength_hbond2 )
            || (at1.name === 'n' && at2.name === 'o' && d2 < maxlength_hbond2 )
            || (at1.name === 'o' && at2.name === 'o' && d2 < maxlength_hbond2 )
            || (at1.name === 'n' && at2.name === 'n' && d2 < maxlength_hbond2 ) ) {
            return PDB.BOND_TYPE_HBOND;
        }
        else {
            return PDB.BOND_TYPE_NONE;
        }
    },
    backToInitialPositionForVr:function () {
        for(var i in PDB.GROUP_STRUCTURE_INDEX){
            PDB.GROUP[PDB.GROUP_STRUCTURE_INDEX[i]].position.copy(new THREE.Vector3(0,0,0));
        }
		var offset = camera.position;
		for(var chain in PDB.residueGroupObject){
			for(var resid in PDB.residueGroupObject[chain]){
				var caid = w3m.mol[PDB.pdbId].residueData[chain][resid].caid;
				var pos = PDB.tool.getMainAtom(PDB.pdbId,caid).pos_centered;
				PDB.residueGroupObject[chain][resid].vector = {x:pos.x-offset.x,y:pos.y-offset.y,z:pos.z-offset.z};
			}
        }
        			
		
		for(var resid in w3m.mol[PDB.pdbId].residueData){
			PDB.GROUP['chain_'+resid].position.copy(new THREE.Vector3(0,0,0));
			PDB.GROUP['chain_'+resid].rotation.set(0,0,0);
		}
		
		PDB.painter.repeatPainter();
		
    },
    generateButton:function (parent,text,value,className) {
        var b_ = document.createElement("button");
        b_.innerHTML = text;
        b_.value = value;
        b_.className=className;
        parent.appendChild(b_);
        return b_;
    },
    generateColorPanel:function (parent) {
        var input = document.createElement("input");
        input.className = "simple_color";
        input.value = "#3366cc";
        parent.appendChild(input);
    },
    generateLabel:function (parent,text,className) {
        var b_ = document.createElement("label");
        b_.innerHTML = text;
        b_.className=className;
        parent.appendChild(b_);
        parent.appendChild(document.createElement("br"));
    },
    generateSpan:function (parent,id,className) {
        var span = document.createElement("span");
        span.className=className;
        span.id = id;
        parent.appendChild(span);
        parent.appendChild(document.createElement("br"));
        return span;
    },
    generateALink:function (parent,id,text,link,className) {
        var aLink = document.createElement("a");
        var node = document.createTextNode(text);
        aLink.appendChild(node);
        aLink.setAttribute("href",link);
        aLink.setAttribute("target","_blank");
        aLink.className=className;
        aLink.id = id;
        parent.appendChild(aLink);
        parent.appendChild(document.createElement("br"));
        return aLink;
    },
	setFaceColor : function(geometry, posObj){
		var f0 = (posObj.y* posObj.width+posObj.x)*2;
		var f1 = f0+1;
		geometry.faces[f0].materialIndex = posObj.colorIndex;
		geometry.faces[f1].materialIndex = posObj.colorIndex;
	},
    toHumanByte: function(limit){
        var size = "";
        if( limit < 0.1 * 1024 ){ //如果小于0.1KB转化成B
            size = limit.toFixed(2) + "B";
        }else if(limit < 0.1 * 1024 * 1024 ){//如果小于0.1MB转化成KB
            size = (limit / 1024).toFixed(2) + "KB";
        }else if(limit < 0.1 * 1024 * 1024 * 1024){ //如果小于0.1GB转化成MB
            size = (limit / (1024 * 1024)).toFixed(2) + "MB";
        }else{ //其他转化成GB
            size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
        }

        var sizestr = size + "";
        var len = sizestr.indexOf("\.");
        var dec = sizestr.substr(len + 1, 2);
        if(dec == "00"){//当小数点后为00时 去掉小数部分
            return sizestr.substring(0,len) + sizestr.substr(len + 3,2);
        }
        return sizestr;
    },
    setProgressBar : function(value, max){
        var progress = document.getElementById("progress");
        progress.value= value;
        progress.max=max;
    },
    printProgress: function(msg){
        var progmsg = document.getElementById("progmsg");
        progmsg.innerHTML=msg;
    },
    getValueByPercent:function (min,max,percent) {
        return ((max - min)/100)*percent + min;
    },
    getPercentByValue:function (min,max,curr) {
        var perValue = (max - min)/100;
        return Math.floor((curr - min)/perValue);
    },
    backToInitialPositonForDesktop:function(){
        camera.position.set(PDB.cameraPosition.x, PDB.cameraPosition.y, PDB.cameraPosition.z);
    },
    getAtomInfoPosition:function (formPos,toPos) {
        var x = (3*formPos.x+toPos.x)/4;
        var y = (3*formPos.y+toPos.y)/4;
        var z = (3*formPos.z+toPos.z)/4;
        return new THREE.Vector3(x,y,z);
    },
    createDensityMapPanel:function(jsonObj){
        if(jsonObj.code === 1 && jsonObj.data !== undefined){
            var scope = this;
            var rightMenuDiv = document.getElementById("rightmenu");
            rightMenuDiv.innerHTML="";
            var titleLab = PDB.tool.generateLabel(rightMenuDiv,"Density Map List","");
            var menuSpan = PDB.tool.generateSpan(rightMenuDiv,"menuSpan","rightsubmenu");
            var menuSpan1 = PDB.tool.generateSpan(rightMenuDiv,"menuSpan1","rightsubmenu");
            var data = jsonObj.data;
            if(PDB.EMMAP.FIRST_ID === 0 && data.length > 0){
                PDB.EMMAP.FIRST_ID = data[0];
            }
            var color = PDB.tool.generateColorPanel(rightMenuDiv);
            $('.simple_color').simpleColor({
                onSelect: function(hex, element) {
                    var mapSurfaceGroup = PDB.GROUP[PDB.GROUP_MAP];
                    if(mapSurfaceGroup !== undefined && mapSurfaceGroup.children.length > 0
                        && mapSurfaceGroup.children[0] instanceof THREE.Mesh && PDB.EMMAP.TYPE !== 0){
                        var mesh = PDB.GROUP[PDB.GROUP_MAP].children[0];
                        if(mesh.material !== undefined){
                            mesh.material.color = new THREE.Color("#"+hex);
                        }
                    }
                }
            });
            for (var i in data){
                PDB.tool.generateButton(menuSpan,data[i],data[i],"rightLabelPDB");
                PDB.tool.generateALink(menuSpan,"mapLink"+i,"Detail",PDB.LINK_CONFIG.EMMAP+data[i],"");
            }
            menuSpan1.innerHTML='<input class="labelPDB" id="solidMap" name="mapType" checked="checked"   type="radio" title="Map Type"/>  <label class="label"  for="solidMap"> Solid </label>   <BR/>'+
                '<input class="labelPDB" id="surfaceMap" name="mapType"  type="radio" title="Map Type"/>  <label class="label"  for="surfaceMap"> Surface </label>   <BR/>'+
                '<input class="labelPDB" id="meshMap" name="mapType"  type="radio" title="Map Type"/>  <label class="label"   for="meshMap"> Mesh </label>   <BR/>'+
                '<input class="labelPDB" type="checkbox" id="showSlice"><label class="label" for="showSlice"  > Show/Hide Slice </label> <BR/>' +
                '<input class="labelPDB" type="checkbox" checked id="showMap"><label class="label" for="showMap" > Show/Hide Map </label> <BR/><BR/>' +
                '<label class="label"> Step Option </label><BR/>'+
                '<input class="labelPDB" id="step1" name="stepOption"  type="radio" title="Map Type"/>  <label class="label" for="threeMode"> 1.x </label>'+
                '<input class="labelPDB" id="step2" name="stepOption"  checked="checked" type="radio" title="Map Type"/>  <label class="label" for="threeMode"> 2.x </label>'+
                '<input class="labelPDB" id="step4" name="stepOption"  type="radio" title="Map Type"/>  <label class="label" for="threeMode"> 4.x </label> <BR/><BR/>'+
                '<label class="label"> Threshold Range </label><BR/> <input type="range" id="thresholdRange" title="Change the value of threshold" style="width: 180px;" name="" min="1" max="100" /><BR/>'+
                '<label class="label" id="minThresHold" style="margin-left: 0px;padding-left: 0px;float: left;width: 60;text-align: left">0</label><label class="label" id="currThresHold" style="width: 60px;text-align: center">50</label><label class="label" style="width: 60px;text-align: right;" id="maxThresHold">100</label><BR/>'+
                '<label class="label"> Slice Range </label><BR/> <input type="range" id="sliceRange" title="Change the value of slice" style="width: 180px;" name="" /><BR/> ' +
                '<label class="label" id="minSlice" style="margin-left: 0px;padding-left: 0px;float: left">0</label><label class="label" id="currSlice" style="margin-left: 35px;">50</label><label class="label" style="margin-left: 35px;" id="maxSlice">100</label><BR/>'+
                '<select id="dimension"> <option value="0" checked>x</option> <option value="1" checked>y</option> <option value="2" checked>z</option> </select> <label class="label"> Dimension </label><BR/>';

            var solidMap = document.getElementById("solidMap");
            solidMap.addEventListener( 'click', function(e){
                PDB.render.clearGroupIndex(PDB.GROUP_MAP);
                PDB.EMMAP.TYPE= 0;
                PDB.map_surface_show = 0;
                if(PDB.EMMAP.DATA){
                    var thresholdObj = document.getElementById("currThresHold");
                    PDB.painter.showMapSolid(PDB.EMMAP.DATA,Number(thresholdObj.innerHTML));
                }
            });
            var surfaceMap = document.getElementById("surfaceMap");
            surfaceMap.addEventListener( 'click', function(e){
                PDB.EMMAP.TYPE= 1;
                if(PDB.map_surface_show === 0){
                    PDB.render.clearGroupIndex(PDB.GROUP_MAP);
                    if(PDB.EMMAP.DATA){
                        var thresholdObj = document.getElementById("currThresHold");
                        PDB.painter.showMapSurface(PDB.EMMAP.DATA,Number(thresholdObj.innerHTML),false);
                    }
                }else {
                    var surfaceGroup = PDB.GROUP[PDB.GROUP_MAP];
                    if(surfaceGroup !== undefined && surfaceGroup.children.length > 0 && surfaceGroup.children[0] instanceof THREE.Mesh){
                        var mesh = PDB.GROUP[PDB.GROUP_MAP].children[0];
                        if(mesh.material !== undefined){
                            mesh.material.wireframe = false;
                        }
                    }
                }
                PDB.map_surface_show = 1;
            });

            var meshMap = document.getElementById("meshMap");
            meshMap.addEventListener( 'click', function(e){
                PDB.EMMAP.TYPE= 2;
                if(PDB.map_surface_show === 0){
                    PDB.render.clearGroupIndex(PDB.GROUP_MAP);
                    if(PDB.EMMAP.DATA){
                        var thresholdObj = document.getElementById("currThresHold");
                        PDB.painter.showMapSurface(PDB.EMMAP.DATA,Number(thresholdObj.innerHTML),true);
                    }
                }else {
                    var surfaceGroup = PDB.GROUP[PDB.GROUP_MAP];
                    if(surfaceGroup !== undefined && surfaceGroup.children.length > 0 && surfaceGroup.children[0] instanceof THREE.Mesh){
                        var mesh = PDB.GROUP[PDB.GROUP_MAP].children[0];
                        if(mesh.material !== undefined){
                            mesh.material.wireframe = true;
                        }
                    }
                }
                PDB.map_surface_show = 1;
            });

            //add step
            var step1 = document.getElementById("step1");
            step1.addEventListener( 'click', function(e){
                PDB.map_step=1;
				PDB.tool.showDestinyMap();
            });
            var step2 = document.getElementById("step2");
            step2.addEventListener( 'click', function(e){
                PDB.map_step=2;
				PDB.tool.showDestinyMap();
            });

            var step4 = document.getElementById("step4");
            step4.addEventListener( 'click', function(e){
                PDB.map_step=4;
				PDB.tool.showDestinyMap();
            });

            //显隐slice
            var showSlice  = document.getElementById("showSlice");
            showSlice.addEventListener('click',function (e) {
                PDB.render.clearGroupIndex(PDB.GROUP_SLICE);
                if(e.target.checked && PDB.EMMAP.DATA!== undefined){
                    PDB.EMMAP.SHOW_SLICE = true;
                    var value = Number(document.getElementById("sliceRange").value);
                    var currSlice = document.getElementById("currSlice");
                    currSlice.innerHTML= value;
                    var thresholdObj = document.getElementById("currThresHold");
                    var tvalue = Number(thresholdObj.innerHTML);
                    PDB.painter.showMapSlices(PDB.EMMAP.DATA,tvalue,value,PDB.DIMENSION);
                }else{
                    PDB.EMMAP.SHOW_SLICE = false;
                }
            });

            //显隐slice
            var showMap  = document.getElementById("showMap");
            showMap.addEventListener('click',function (e) {
                if(e.target.checked && PDB.EMMAP.DATA!== undefined){
                    PDB.EMMAP.SHOW_MAP = true;
                    var emmap = PDB.EMMAP.DATA;
                    var thresholdObj = document.getElementById("currThresHold");
                    var tvalue = Number(thresholdObj.innerHTML);
                    switch (PDB.EMMAP.TYPE){
                        case 0:
                            PDB.painter.showMapSolid(emmap,tvalue);
                            break;
                        case 1:
                            PDB.painter.showMapSurface(emmap,tvalue,false);
                            break;
                        case 2:
                            PDB.painter.showMapSurface(emmap,tvalue,true);
                    }
                }else{
                    PDB.render.clearGroupIndex(PDB.GROUP_MAP);
                    PDB.EMMAP.SHOW_MAP = false;
                }
            });

            //滑动slice控件调用的方法
            var sliceRange = document.getElementById("sliceRange");
            sliceRange.addEventListener( 'change', function(e){
                var emmap = PDB.EMMAP.DATA;
                var value = Number(e.target.value);
                PDB.render.clearGroupIndex(PDB.GROUP_SLICE);
                var currSlice = document.getElementById("currSlice");
                currSlice.innerHTML= value;
                if(PDB.EMMAP.SHOW_SLICE){
                    PDB.painter.showMapSlices(emmap,emmap.threshold,value,PDB.DIMENSION);
                }
            });
            var thresholdRange = document.getElementById("thresholdRange");
            thresholdRange.addEventListener( 'change', function(e){
                var emmap = PDB.EMMAP.DATA;
                if(emmap){
                    var value = Number(e.target.value);
                    var perValue = PDB.tool.getValueByPercent(emmap.header.min,emmap.header.max,value);
                    var currThresHold = document.getElementById("currThresHold");
                    currThresHold.innerHTML=perValue.toFixed(3);
                    if(PDB.EMMAP.SHOW_MAP){
                        PDB.render.clearGroupIndex(PDB.GROUP_MAIN);
                        switch (PDB.EMMAP.TYPE){
                            case 0:
                                PDB.painter.showMapSolid(emmap,perValue);
                                break;
                            case 1:
                                PDB.painter.showMapSurface(emmap,perValue,false);
                                break;
                            case 2:
                                PDB.painter.showMapSurface(emmap,perValue,true);
                        }
                    }
                }
            });

            var dimension = document.getElementById("dimension");
            dimension.addEventListener( 'change', function(e){
                var v = e.target.value;
                if(v){
                    v = Number(v);
                }
                PDB.DIMENSION = v;
                var emmap = PDB.EMMAP.DATA;
                if(emmap && PDB.EMMAP.SHOW_SLICE){
                    PDB.render.clearGroupIndex(PDB.GROUP_SLICE);
                    var sliceRange = document.getElementById("sliceRange");
                    sliceRange.min = 1;
                    switch(PDB.DIMENSION){
                        case PDB.DIMENSION_X:
                            sliceRange.max = Number(emmap.header.NC);
                            break;
                        case PDB.DIMENSION_Y:
                            sliceRange.max = Number(emmap.header.NR);
                            break;
                        case PDB.DIMENSION_Z:
                            sliceRange.max = Number(emmap.header.NS);
                            break;
                    }
                    var sliceRange = document.getElementById("sliceRange");
                    sliceRange.value = 1;
                    var minSlice = document.getElementById("minSlice");
                    minSlice.innerHTML= sliceRange.min;
                    var maxSlice = document.getElementById("maxSlice");
                    maxSlice.innerHTML= sliceRange.max;
                    var currSlice = document.getElementById("currSlice");
                    currSlice.innerHTML= sliceRange.value;
                    PDB.painter.showMapSlices(emmap,emmap.threshold,0,PDB.DIMENSION);
                }
            });
        }
    },
    showDestinyMap:function(){
		if(PDB.EMMAP.TYPE === 0){
			PDB.render.clearGroupIndex(PDB.GROUP_MAP);
			PDB.map_surface_show = 0;
			if(PDB.EMMAP.DATA){
				var thresholdObj = document.getElementById("currThresHold");
				PDB.painter.showMapSolid(PDB.EMMAP.DATA,Number(thresholdObj.innerHTML));
			}
		}else if(PDB.EMMAP.TYPE === 1){
			PDB.render.clearGroupIndex(PDB.GROUP_MAP);
			if(PDB.EMMAP.DATA){
				var thresholdObj = document.getElementById("currThresHold");
				PDB.painter.showMapSurface(PDB.EMMAP.DATA,Number(thresholdObj.innerHTML),false);
			}
			PDB.map_surface_show = 1;
		}else if(PDB.EMMAP.TYPE === 2){
			PDB.render.clearGroupIndex(PDB.GROUP_MAP);
			if(PDB.EMMAP.DATA){
				var thresholdObj = document.getElementById("currThresHold");
				PDB.painter.showMapSurface(PDB.EMMAP.DATA,Number(thresholdObj.innerHTML),true);
			}
			PDB.map_surface_show = 1;
		}
	},
    changeDensityMapRangeValue:function (emmap) {
        //threshold
        var thresholdRange = document.getElementById("thresholdRange");
        thresholdRange.value = PDB.tool.getPercentByValue(emmap.header.min,emmap.header.max,emmap.threshold);
        var minThresHold = document.getElementById("minThresHold");
        minThresHold.innerHTML=emmap.header.min.toFixed(3);
        var maxThresHold = document.getElementById("maxThresHold");
        maxThresHold.innerHTML=emmap.header.max.toFixed(3);
        var currThresHold = document.getElementById("currThresHold");
        currThresHold.innerHTML=emmap.threshold.toFixed(3);
        //slice
        var sliceRange = document.getElementById("sliceRange");

        sliceRange.min = PDB.EMMAP.MIN_SLICE;
        sliceRange.max = PDB.EMMAP.MAX_SLICE;
        sliceRange.value = PDB.EMMAP.MIN_SLICE;
        var minSlice = document.getElementById("minSlice");
        minSlice.innerHTML=PDB.EMMAP.MIN_SLICE;
        var maxSlice = document.getElementById("maxSlice");
        maxSlice.innerHTML=PDB.EMMAP.MAX_SLICE;
        var currSlice = document.getElementById("currSlice");
        currSlice.innerHTML= PDB.EMMAP.MIN_SLICE;
    },
	initChainNameFlag:function(chainName,isNomal,chainNum){
		// console.log(chainNum);
		//$("#chainNumThreshold").append("<button class=\"labelPDB chainBtn"+(isNomal?" chainSelected":"")+"\" name=\"chainName\" id=\"chain_"+chainName+"\">"+chainNum+":"+chainName+"</button>&nbsp;");

	},
	clearChainNameFlag:function(){
		//$("#chainNumThreshold").html("");
	},
	bindAllChainEvent:function(type,allChainNum){
		$(".chainBtn").bind('click',function(e){
			var chainInfo = $("#"+e.target.id).html().split(":");
			var chainNum = Number(chainInfo[0]);
			var chainName = chainInfo[1];
			if(chainNum>PDB.initChainNumThreshold){
				for(var i = 0;i<chainNum;i++){
					if($($(".chainBtn")[i]).hasClass('chainSelected')){
						continue;
					}else{
						//重新画未正常初始化的链
						// console.log("重新画"+);
						var chain_ = $(".chainBtn")[i].id;
						var chain = chain_.split("_")[1];
						PDB.render.clearGroupIndex(chain_);
						for(var resid in w3m.mol[PDB.pdbId].residueData[chain]){
							PDB.painter.showResidue(chain, resid, type, true);
						}
						$($(".chainBtn")[i]).addClass('chainSelected');
					}
				}
			}else if(chainNum<PDB.initChainNumThreshold){
				for(var i = PDB.initChainNumThreshold-1;i>chainNum-1;i--){
					if($($(".chainBtn")[i]).hasClass('chainSelected')){
						//重新画未正常初始化的链
						// console.log("重新画"+);
						var chain_ = $(".chainBtn")[i].id;
						var chain = chain_.split("_")[1];
						PDB.render.clearGroupIndex(chain_);
						for(var resid in w3m.mol[PDB.pdbId].residueData[chain]){
							PDB.painter.showResidue(chain, resid, PDB.LINE, true);
						}
						$($(".chainBtn")[i]).removeClass('chainSelected');
					}else{
						continue;
					}
				}
			}

			PDB.initChainNumThreshold = chainNum;
		})
	},
	getRealVectorForRepeatPainter:function(vec){
		for(var chain in PDB.residueGroupObject){
			for(var resid in PDB.residueGroupObject[chain]){
				PDB.residueGroupObject[chain][resid].vector.x -= vec.x;
				PDB.residueGroupObject[chain][resid].vector.y -= vec.y;
				PDB.residueGroupObject[chain][resid].vector.z -= vec.z;
			}
		}
		PDB.painter.repeatPainter();		
	},
	rotateAboutWorldAxis: function(vec,axis,angle){
		var rotationMatrix = new THREE.Matrix4();
		rotationMatrix.makeRotationAxis( axis.normalize(), angle );
		var currentPos = new THREE.Vector4(vec.x, vec.y, vec.z, 1);
		var newPos = currentPos.applyMatrix4(rotationMatrix);		
		return new THREE.Vector3(newPos.x,newPos.y,newPos.z);
		
	},
	freshAllResidueGroupObject: function(angle){		
		PDB.nowRotateAngle = PDB.nowRotateAngle+angle;
		if(Math.abs(PDB.nowRotateAngle)>=PDB.rotateAngleThreshold){
			var scope = this;
			var axis ;
			switch (PDB.ROTATION_AXIS){
				case 1:	
					PDB.rotateAxisAngle.x +=angle;
					axis = new THREE.Vector3(1,0,0);
					break;
				case 2:
					PDB.rotateAxisAngle.y +=angle;
					axis = new THREE.Vector3(0,1,0);
					break;
				case 3:
					PDB.rotateAxisAngle.z +=angle;
					axis = new THREE.Vector3(0,0,1);	
					break;				
			}
			for(var chain in PDB.residueGroupObject){
				for(var resid in PDB.residueGroupObject[chain]){
					var pos = camera.position;
					var obj = PDB.residueGroupObject[chain][resid].vector;
					// var vec = {
						// x:pos.x+obj.x,
						// y:pos.y+obj.y,
						// z:pos.z+obj.z
					// }
					var vec = {
						x:pos.x+obj.x-PDB.rotateAxis.x,
						y:pos.y+obj.y-PDB.rotateAxis.y,
						z:pos.z+obj.z-PDB.rotateAxis.z
					}					
					var nowp = scope.rotateAboutWorldAxis(vec,axis,PDB.nowRotateAngle);
					
					// PDB.residueGroupObject[chain][resid].vector.x = nowp.x;
					// PDB.residueGroupObject[chain][resid].vector.y = nowp.y;
					// PDB.residueGroupObject[chain][resid].vector.z = nowp.z;
					
					PDB.residueGroupObject[chain][resid].vector.x = (nowp.x-pos.x+PDB.rotateAxis.x);
					PDB.residueGroupObject[chain][resid].vector.y = (nowp.y-pos.y+PDB.rotateAxis.y);
					PDB.residueGroupObject[chain][resid].vector.z = (nowp.z-pos.z+PDB.rotateAxis.z);
				}
			}
			
			PDB.painter.repeatPainter();
			PDB.nowRotateAngle = 0;
		}
		
	},
	getVectorLength: function(vector){
		return Math.sqrt(Math.pow(vector.x,2)+Math.pow(vector.y,2)+Math.pow(vector.z,2));
	},
    //8. 对tool函数的rotation方法进行修改，添加旋转计算坐标逻辑，如下箭头指向行
	rotation:function (groupIndexs,type) {
		PDB.tool.rotation_y(groupIndexs,type);
	},
	rotation_x:function (groupIndexs,type) {
        var scope = this;
		if(type === 0){
            groupIndexs.forEach(function (index) {
                var group = PDB.GROUP[index];
                if(group!== undefined){
                    group.rotation.x = group.rotation.x - 0.005;					
                }
            });
			scope.freshAllResidueGroupObject(-0.005);//转动-0.005度<-------------
        }else if(type ===1){
            groupIndexs.forEach(function (index) {
                var group = PDB.GROUP[index];
                if(group!== undefined){
                    group.rotation.x = group.rotation.x + 0.005;
                }
            });
			scope.freshAllResidueGroupObject(0.005);//转动0.005度<---------------
        }
    },
	rotation_y:function (groupIndexs,type) {
        var scope = this;
		if(type === 0){
            groupIndexs.forEach(function (index) {
                var group = PDB.GROUP[index];
                if(group!== undefined){
                    group.rotation.y = group.rotation.y - 0.005;					
                }
            });
			scope.freshAllResidueGroupObject(-0.005);//转动-0.005度<-------------
        }else if(type ===1){
            groupIndexs.forEach(function (index) {
                var group = PDB.GROUP[index];
                if(group!== undefined){
                    group.rotation.y = group.rotation.y + 0.005;
                }
            });
			scope.freshAllResidueGroupObject(0.005);//转动0.005度<---------------
        }
    },
	rotation_z:function (groupIndexs,type) {
        var scope = this;
		if(type === 0){
            groupIndexs.forEach(function (index) {
                var group = PDB.GROUP[index];
                if(group!== undefined){
                    group.rotation.z = group.rotation.z - 0.005;					
                }
            });
			scope.freshAllResidueGroupObject(-0.005);//转动-0.005度<-------------
        }else if(type ===1){
            groupIndexs.forEach(function (index) {
                var group = PDB.GROUP[index];
                if(group!== undefined){
                    group.rotation.z = group.rotation.z + 0.005;
                }
            });
			scope.freshAllResidueGroupObject(0.005);//转动0.005度<---------------
        }
    },
	saveString :function( text, filename){
		var blob = new Blob( [ text ], { type: 'text/plain' } );
		var link = document.createElement( 'a' );
		link.style.display = 'none';
		document.body.appendChild( link ); // Firefox workaround, see #6594
		link.href = URL.createObjectURL( blob );
		link.download = filename || 'data.obj';
		link.click();
	}

}
