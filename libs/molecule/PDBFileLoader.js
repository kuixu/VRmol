/**
 * Created by zhangdawei on 2017/6/27.
 */
/**
 * Created by zhangdawei on 2017/5/25.
 * 与数据相关的方法都集中该对象中
 */
PDB.loader = {
    load: function ( name,callBack) {
        var scope = this;
        w3m.ajax.get(name, function(text) {
            w3m.tool.clear();
            w3m.config.rep_mode_main = PDB.config.mainMode;
            w3m.config.rep_mode_het = PDB.config.hetMode;
            w3m.pdb(text);
            scope.dealwithBigPDB();
            
            //获取中心点偏移量
            scope.getCenterOffset();
            //各个模型数据加载
            w3m.api.switchRepModeMain(w3m.LINE);
            w3m.api.switchRepModeMain(w3m.BACKBONE);
            w3m.api.switchRepModeMain(w3m.CUBE);
            w3m.api.switchRepModeMain(w3m.CARTOON);
            w3m.api.switchRepModeHet(w3m.LINE);

            PDB.GROUP_STRUCTURE_INDEX=[];
            PDB.GROUP_MAIN_INDEX = [];
            PDB.GROUP_HET_INDEX =[];

            for(var chain in w3m.mol[PDB.pdbId].chain){
                var gindex = "chain_"+chain;
                var first_atomid = PDB.tool.getFirstAtomIdByChain(chain);
                PDB.GROUP[gindex] = new THREE.Group();
                PDB.GROUP[gindex].name = chain;
                PDB.GROUP[gindex].userData["group"] = gindex;
                PDB.GROUP[gindex].userData["presentAtom"] = PDB.tool.getMainAtom(PDB.pdbId, first_atomid);
				if(!PDB.pptShow){
					scene.add(PDB.GROUP[gindex]);
				}                
                PDB.GROUP_MAIN_INDEX.push(gindex);
                PDB.GROUP_STRUCTURE_INDEX.push(gindex);
            }
            PDB.GROUP_MAIN_INDEX.push(PDB.GROUP_MAIN);
            PDB.GROUP_HET_INDEX.push(PDB.GROUP_HET);
            PDB.GROUP_HET_INDEX.push(PDB.GROUP_WATER);
            PDB.GROUP_SURFACE_INDEX.push(PDB.GROUP_SURFACE);
            PDB.GROUP_MUTATION_INDEX.push(PDB.GROUP_MUTATION);
            //Structure
            PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_MAIN);
            PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_WATER);
            PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_HET);
            PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_INFO);
            PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_SURFACE);
            PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_MUTATION);
            PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_DRUG);
            PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_SLICE);
            PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_BOND);
            //回调函数
            callBack();
        });
    },
    loadFromDisk: function ( file,callBack) {
        var scope = this;
        w3m.tool.clear();
        w3m.config.rep_mode_main = PDB.config.mainMode;
        w3m.config.rep_mode_het = PDB.config.hetMode;
        PDB.pdbId = file.name.split(".")[0];
        w3m.file.get(file, function(response) {
            text = response;
            w3m.pdb(text);
            scope.dealwithBigPDB();
            //获取中心点偏移量
            scope.getCenterOffset();
            //各个模型数据加载
            w3m.api.switchRepModeMain(w3m.LINE);
            w3m.api.switchRepModeMain(w3m.BACKBONE);
            w3m.api.switchRepModeMain(w3m.CUBE);
            w3m.api.switchRepModeMain(w3m.CARTOON);
            w3m.api.switchRepModeHet(w3m.LINE);

            PDB.GROUP_STRUCTURE_INDEX=[];
            PDB.GROUP_MAIN_INDEX = [];
            PDB.GROUP_HET_INDEX =[];

            for(var chain in w3m.mol[PDB.pdbId].chain){
                var gindex = "chain_"+chain;
                var first_atomid = PDB.tool.getFirstAtomIdByChain(chain);
                PDB.GROUP[gindex] = new THREE.Group();
                PDB.GROUP[gindex].name = chain;
                PDB.GROUP[gindex].userData["group"] = gindex;
                PDB.GROUP[gindex].userData["presentAtom"] = PDB.tool.getMainAtom(PDB.pdbId, first_atomid);
                if(!PDB.pptShow){
                    scene.add(PDB.GROUP[gindex]);
                }
                PDB.GROUP_MAIN_INDEX.push(gindex);
                PDB.GROUP_STRUCTURE_INDEX.push(gindex);
            }
            PDB.GROUP_MAIN_INDEX.push(PDB.GROUP_MAIN);
            PDB.GROUP_HET_INDEX.push(PDB.GROUP_HET);
            PDB.GROUP_HET_INDEX.push(PDB.GROUP_WATER);
            PDB.GROUP_SURFACE_INDEX.push(PDB.GROUP_SURFACE);
            PDB.GROUP_MUTATION_INDEX.push(PDB.GROUP_MUTATION);
            //Structure
            PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_MAIN);
            PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_WATER);
            PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_HET);
            PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_INFO);
            PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_SURFACE);
            PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_MUTATION);
            PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_DRUG);
            PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_SLICE);
            PDB.GROUP_STRUCTURE_INDEX.push(PDB.GROUP_BOND);
            //回调函数
            callBack();
        });
    },
    loadDrug: function ( drugname,callBack) {
        var scope = this;
        w3m.ajax.getDrug(drugname, function(text) {
            w3m.tool.clear();
            w3m.pdb(text, drugname);
            w3m.mol[drugname].drug=true;


            //回调函数
            callBack();
        });
    },
    clear : function(){
        // reset
        w3m.global.limit = {
            x : [], y : [], z : [],
            b_factor : [ 0.0, 0.0 ],
            b_factor_backbone : [ 0.0, 0.0 ]
        };
        w3m.global.average = {
            b_factor : [ 0, 0 ],
            b_factor_backbone : [ 0, 0 ]
        };
        w3m.global.fragment = [];
        // mol
        w3m.mol = {} ;		
        PDB.GeoCenterOffset = "";      
		PDB.fragmentList = {};        
    },
    getCenterOffset : function(){
        limit = w3m.global.limit;
        x = -(limit.x[0]+limit.x[1])/2 ;
        y = -(limit.y[0]+limit.y[1])/2 ;
        z = -(limit.z[0]+limit.z[1])/2 ;

        var offset = new THREE.Vector3(x,y,z);
        PDB.GeoCenterOffset = offset;
        return offset;
    },
    dealwithBigPDB : function(){
        var mainAtomCount = w3m.mol[PDB.pdbId].atom['main'].length;
        console.log("MainAtomCount:"+mainAtomCount);
        if(mainAtomCount<2000){
            PDB.structureSizeLevel=0;
        }else if(mainAtomCount<6000){
            PDB.structureSizeLevel=1;
        }else if(mainAtomCount<10000){
            PDB.structureSizeLevel=2;
        }else {
            PDB.structureSizeLevel=3;
        }

        // switch(PDB.structureSizeLevel){
            // case 0:
                // break;
            // case 1:
                // PDB.CONFIG.sphere_width=20;
                // PDB.CONFIG.sphere_height=16;
                // PDB.CONFIG.stick_radius =15;
                // // PDB.config.mainMode = PDB.LINE;
                // // w3m.config.rep_mode_main = PDB.config.mainMode;
                // break;
            // case 2:
                // PDB.CONFIG.sphere_width=12;
                // PDB.CONFIG.sphere_height=8;
                // PDB.CONFIG.stick_radius =10;
                // // PDB.config.mainMode = PDB.LINE;
                // // w3m.config.rep_mode_main = PDB.config.mainMode;
                // break;
            // case 3:
                // PDB.CONFIG.sphere_width=8;
                // PDB.CONFIG.sphere_height=4;
                // PDB.CONFIG.stick_radius =6;
                // // PDB.config.mainMode = PDB.LINE;
                // // w3m.config.rep_mode_main = PDB.config.mainMode;
                // break;
        // }
    }
}