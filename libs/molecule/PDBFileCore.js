/**
 * Created by Kui Xu on 2017/6/27.
 * mail: xukui.cs@gmail.com
 */
var PDB ;
var ServerType = 2;

var SERVERURL = "http://localhost:8080/vrmol";
if(ServerType ===1){
    SERVERURL= "http://localhost/";
}else if(ServerType ===2){
    SERVERURL= "https://vrmol.net";
}
var API_URL = "https://vrmol.life.tsinghua.edu.cn";
var API_URL_EMMAP = "https://vrmol.net/server/api_em.php?pdbid=";
PDB = {
  DOCKING_POS_START: {x:0,
		y:0,
		z:0,
	},
  DEBUG_MODE:0,
	bigmodel:19, // show out of sphericcal view
	smallmodel:20, // hide out of sphericcal view
	loadType:19, // out of sphericcal view
	map_step:2, // default:4, 4,2,1
  map_surface_show:0 ,// 0,no; 1,yes
  HOLDERTIME:100,
	rotateAngleThreshold:0.005,
	nowRotateAngle:0,
	rotateAxis:{x:0,y:0,z:0},
	rotateAxisAngle:{x:0,y:0,z:0},
	zTemp : 0,
	//residue drawing style：undefined,0-->no group, 1-->generate and show, 2-->hide group
	residueGroup_undefined:0,
	residueGroup_show:1,
	residueGroup_hide:2,
	residueGroup_low:3,
	residueGroupObject:{},
	initVRShowThreshold:35,//VR init distance
	initDesktopShowThreshold:1000,//Desktop distance
	cameraPosition:{//camera position
		x:0,
		y:0,
		z:300
	},
	initChainNumThreshold:5,//<=2 SSE, >2 line
  structureSizeLevel:0,
	pptShow:false,
	panelShow:1,
	isShowSurface:0,
  VRMode:false,
  mode:0, //0 three mode; 1 vr mode; 2 travel mode
  isShowMenu:false,
  distanceArray:[],
  fragmentList:{},
  fragmentArray:[],
  editingArray:[],
  isShowKeyboard:false,
  selection_mode:105,
  selection_mode_pre:105,
  //pdb id in VR
  pdbVrId:"",
  trigger:6,
  //Travel the tube
  parent:"",
  TravelMode:false,
  TravelGeometry:"",
  VRTravelGeometry:"",
  VRTraveMesh:"",
  MarchingCubes:"",
  fragmentMode:"Flat",
  isShowWater: false,
  isShowAxis: false,
  ROTATION_START_FLAG: false,
  ROTATION_DIRECTION:1, //0 left 1 right
  ROTATION_AXIS:1, //1 x, 2 y, 3 z
  ROTATION_TASK_ID:0,//taskID
  MOVE_DIRECTION:2, //1 +  2 -
  MOVE_AXIS:3, //1 y,  2 x, 3 z
  MOVE_TASK_ID:0,
	PLANE:{a:0,b:0,c:0,d:0},
  TravelScale:6,
  currentType: 1,
  //tubeResidue:[],
  label_type:100,  //100 All the models,104 By Chain 105 By Residue 106.By Atom
  cartoonsheet:0,
  isAnimate:false,
  tubeSSE:[],
  GeoCenterOffset:"" ,
  mutation:'{"code":1,"data":{"mutations":[{"id":"832951","v_class":"Missense_Mutation","v_type":"SNP","g_change":"g.chr11:111779667C>G","p_change":"p.E117Q","disease":"UCEC","pos":"117"},{"id":"832952","v_class":"Missense_Mutation","v_type":"SNP","g_change":"g.chr11:111781056G>A","p_change":"p.R107C","disease":"UCEC","pos":"107"},{"id":"832953","v_class":"Silent","v_type":"SNP","g_change":"g.chr11:111781108G>T","p_change":"p.L89L","disease":"UCEC","pos":"89"},{"id":"79882","v_class":"Silent","v_type":"SNP","g_change":"g.chr11:111779560G>A","p_change":"p.V152V","disease":"SKCM","pos":"152"},{"id":"118368","v_class":"Missense_Mutation","v_type":"SNP","g_change":"g.chr11:111782377A>C","p_change":"p.F24L","disease":"SKCM","pos":"24"},{"id":"390477","v_class":"Silent","v_type":"SNP","g_change":"g.chr11:111782347C>T","p_change":"p.E34E","disease":"STAD","pos":"34"},{"id":"646695","v_class":"Missense_Mutation","v_type":"SNP","g_change":"g.chr11:111779603G>A","p_change":"p.S138L","disease":"LUAD","pos":"138"}],"chains":["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X"],"pdbid":"2YGD","dataset":"tcga"},"message":"success"}',
  MUTATION_URL: API_URL + "/server/api.php?taskid=10",
  SHOW_MUTATION_WHEN_SWITCH_VR_MENU:1,
  CONSERVATION_URL: API_URL + "/server/api.php?taskid=11",
  DRUG_URL: SERVERURL + "/data/DB04464.pdb",
  // DRUG_URL: API_URL + "/server/api.php?taskid=12",
  currentUrl: "data/aaa.pdb",
  remoteUrl: [ 'https://files.rcsb.org/view/',  'https://www.rcsb.org/pdb/files/', SERVERURL + '/data/' ],
  drugPDBUrl: [ SERVERURL + '/data/','https://www.drugbank.ca/structures/small_molecule_drugs/'],
  pdbId:"1cbs",
  pdburl:"",
  molecules : {
      "aaa": "aaa.pdb",
      "bbb": "bbb.pdb",
      "5ftm": "5ftm.pdb",
      "1mbs": "remote.pdb",
      "aspirin": "aspirin.pdb"
  },
  //Mode
  MODE_THREE:0, MODE_VR:1, MODE_TRAVEL_THREE:2,MODE_TRAVEL_VR:3,
  // Group
  GROUP:{},
  GROUP_STRUCTURE_INDEX:[],GROUP_MAIN_INDEX:[], GROUP_HET_INDEX:[],  GROUP_MENU_INDEX:[],GROUP_SURFACE_INDEX:[],
  GROUP_MUTATION_INDEX:[],

  GROUP_COUNT:45, GROUP_MAIN:0, GROUP_HET:1, GROUP_WATER:2,GROUP_LABEL:3,GROUP_INFO:4,
  GROUP_KEYBOARD:5,GROUP_INPUT:6,GROUP_CHAIN:7,GROUP_TRAVEL:8, GROUP_MENU:9,GROUP_MENU_MAIN:10,GROUP_MENU_HET:11,
  GROUP_MENU_COLOR:12,GROUP_MENU_MEASURE:13, GROUP_MENU_MODE:14,GROUP_MENU_DRAG:15,GROUP_MENU_FRAGMENT:16,
  GROUP_MENU_LABEL:17,GROUP_MENU_EX_HET:18, GROUP_MENU_TRAVEL:19,GROUP_MENU_SURFACE:20,GROUP_SURFACE:21,
  GROUP_MUTATION:22,GROUP_MENU_ROTATION:23,GROUP_MENU_MUTATION:24,GROUP_MENU_DRUG:25, GROUP_DRUG:26,GROUP_MENU_HBOND:27,
  GROUP_MENU_CONSERVATION:28,GROUP_MENU_DENSITYMAP:29,GROUP_SLICE:30,GROUP_SURFACE_HET:31,GROUP_BOND:32,GROUP_MENU_DIRECTION:33,
  GROUP_MAP:34,GROUP_MENU_OUTBALL:35,GROUP_BOX_HELPER:36,GROUP_AXIS:37,GROUP_MENU_EXPORT:38,GROUP_MENU_SPEECH:39,GROUP_DOCKING:40,
  GROUP_MENU_EDITING:41,GROUP_VR_MENU_DRUG:42,GROUP_VR_MENU_DOCKING:43,GROUP_VR_MENU_SWITCH:44,
  MENU_TYPE_FIRST:0,MENU_TYPE_MAIN:1,MENU_TYPE_LIGAND:2,MENU_TYPE_COLOR:3,MENU_TYPE_DRAG:4,MENU_TYPE_MEASURE:5,
  MENU_TYPE_FRAGMENT:6,MENU_TYPE_LABEL:7,MENU_TYPE_EX_HET:8,MENU_TYPE_TRAVEL:9,MENU_TYPE_SURFACE:10,MENU_TYPE_MUTATION:11,
  MENU_TYPE_ROTATION:12,MENU_TYPE_DRUG:13,MENU_TYPE_HBOND:14,MENU_TYPE_CONSERVATION:15,MENU_TYPE_DENSITYMAP:16,MENU_TYPE_DIRECTION:17,
  MENU_TYPE_CURRENT:1,MENU_TYPE_OUTBALL:18,MENU_TYPE_OUTSHOW:19,MENU_TYPE_OUTHIDE:20,MENU_TYPE_EXPORT:21,MENU_TYPE_SPEECH:22,
  MENU_TYPE_EDITING:23,
  // representation Mode
  HIDE : 0,  LINE : 1, DOT : 2,BACKBONE : 3,  SPHERE: 4,STICK : 5, BALL_AND_ROD : 6,
  TUBE : 7,  RIBBON_FLAT:8, RIBBON_ELLIPSE:9, RIBBON_RECTANGLE:10, RIBBON_STRIP:11,
  RIBBON_RAILWAY:12, CARTOON_SSE:13, SURFACE:14,
  HET:50, HET_LINE:51, HET_SPHERE:52, HET_STICK:53, HET_BALL_ROD:54,HET_WATER:55,HET_IRON:56,

  CHANGESTYLE:0,// 0-->(default),1-->fragment,2-->chain,3-->sseType,4-->residueType,5--> travel+three（ranx add 7 selected style）3-->residue
  DRAWSTYLE_DEFAULT:0,DRAWSTYLE_FRAGMENT:1,DRAWSTYLE_CHAIN:2,DRAWSTYLE_SSETYPE:3,DRAWSTYLE_RESIDUETYPE:4,DRAWSTYLE_TRAVELTHREE:5,

  // selection
  SELECTION_MODEL:100, SELECTION_MAIN_HET:101,SELECTION_MAIN:102, SELECTION_HET:103,
  SELECTION_CHAIN:104, SELECTION_RESIDUE:105, SELECTION_ATOM:106, SELECTION_OBJECT:107,
  SELECTION_MENU:108,SELECTION_DRUG:109,SELECTION_DRUG_LIST: 110,

  //fragment mode
  FRAGMENT_MODE_TUBE:"Tube", FRAGMENT_MODE_RECTANGLE:"Rectangle", FRAGMENT_MODE_ELLIPSE:"Ellipse", FRAGMENT_MODE_STRIP:"Strip",
  FRAGMENT_MODE_RAILWAY:"Railway", FRAGMENT_MODE_FLAT:"Flat",
  // Label
  LABEL_TYPE:701,
  LABEL_ID: 700, LABEL_NAME : 701, //LABEL_AREA_NONE : 700,
  LABEL_AREA_ATOM : 701,  LABEL_AREA_BACKBONE : 702,
  LABEL_AREA_RESIDUE : 703, LABEL_AREA_CHAIN : 704, LABEL_AREA_MOL : 705,

  LABEL_ATOM_NAME : 711, LABEL_ATOM_ID : 712, LABEL_ATOM_NAME_AND_ID : 713,
  LABEL_ELEMENT : 721, LABEL_ELEMENT_AND_ID : 722,
  LABEL_RESIDUE_NAME : 731, LABEL_RESIDUE_ID : 732, LABEL_RESIDUE_NAME_AND_ID : 733,
  LABEL_CHAIN_ID : 741, LABEL_CHAIN_AND_RESIDUE : 742, LABEL_CHAIN_AND_RESIDUE_ID : 743, LABEL_MIX : 744,
  LABEL_OCCUPANCY : 751, LABEL_B_FACTOR : 752, LABEL_VDW_RADIUS : 753,
  TRIGGER_EVENT_DRAG:1,TRIGGER_EVENT_DISTANCE:2,TRIGGER_EVENT_ANGLE:3,TRIGGER_EVENT_ATOM:4,TRIGGER_EVENT_FRAGMENT:5,
  TRIGGER_EVENT_LABEL:6,TRIGGER_EVENT_EDITING:7,
	CONFIG_LOW:{
    sphere_width:8,sphere_height:4,stick_sphere_w:4,ballrod_sphere_w:4, water_sphere_w: 8, stick_radius:3,retangle_height:0.2,
    retangle_width:1,ellipse_radius:0.21,ellipse_radius_multiple:5, flat_HIGH:0.001,flat_width:1,strip_radius:0.2,strip_ex:9,
    tubesegment:5,defaultColor:0xa345, railway_radius:0.1,railway_gui:9,tube_radius:0.2,startSegmentSurfaceID:0, endSegmentSurfaceID:0
	},
	CONFIG_HIGH:{
    sphere_width:20,sphere_height:20,stick_sphere_w:12,ballrod_sphere_w:12, water_sphere_w: 16, stick_radius:15,retangle_height:0.2,
    retangle_width:1,ellipse_radius:0.21,ellipse_radius_multiple:5, lat_HIGH:0.001,flat_width:1,strip_radius:0.2,strip_ex:9,tubesegment:15,
    defaultColor:0xa345, railway_radius:0.1,railway_gui:9,tube_radius:0.2,startSegmentSurfaceID:0, endSegmentSurfaceID:0
	},
  EMMAP_CONFIG:{
    MIN_THRESHOLD:0,MAX_THRESHOLD:100,CURR_THRESHOLD:100,FIRST_EMMAP_ID:"",CURRENT_EMMAP_ID:"",MIN_SLICE:0,MAX_SLICE:100,CURR_SLICE:0,
  },
  LINK_CONFIG:{
    DRUG_BANK:"https://www.drugbank.ca/drugs/",
    BINDINGDB:"http://www.bindingdb.org/uniport/",
    CHEMBL:"https://www.ebi.ac.uk/chembldb/target/inspect/",
    GUIDETOPHARMACOLOGY:"http://www.guidetopharmacology.org/GRAC/ObjectDisplayForward?objectId=",
    SWISSLIPIDS:"http://www.swisslipids.org/#/entity/",
    EMMAP:"https://www.ebi.ac.uk/pdbe/entry/emdb/",
  },
  DRUBDB_URL : {
    'drugbank':SERVERURL+"/data/drugbank/",
    //'drugbank':"https://www.drugbank.ca/structures/small_molecule_drugs/",
    'bindingdb':"http://www.bindingdb.org/uniport/"        ,
    'chembl':"https://www.ebi.ac.uk/chembldb/target/inspect/",
    'guidetopharmacology':"http://www.guidetopharmacology.org/GRAC/ObjectDisplayForward?objectId="        ,
    'swisslipids':"http://www.swisslipids.org/#/entity/",
    'docking':""
  },
  DOCKING_URL: API_URL +"/server/autodock/autodock.php",
  // docking var
  DIMENSION:0,
  DIMENSION_X:0,
  DIMENSION_Y:1,
  DIMENSION_Z:2,
  MAP_SCOPE:{x:0,y:0,z:0},
  DRUG_MODE_CONFIG:{
    x_c:10,
    y_c:10,
    z_c:10,
    x_s:10,
    y_s:10,
    z_s:10,
    DRUG_BANK:"drugbank",
    BINDING_DB:"bindingdb",
    CHEMBL:"chembl",
    GUIDETOPHARMACOLOGY:"guidetopharmacology",
    SWISSLIPIDS:"swisslipids",
    Detail_URL:{
      'drugbank':"https://www.drugbank.ca/drugs/",
      'bindingdb':"http://www.bindingdb.org/uniport/"        ,
      'chembl':"https://www.ebi.ac.uk/chembldb/target/inspect/",
      'guidetopharmacology':"http://www.guidetopharmacology.org/GRAC/ObjectDisplayForward?objectId="        ,
      'swisslipids':"http://www.swisslipids.org/#/entity/",
    },
  },
  SHOWSOLID : true,
  SHOWSILICE : true,
  //bond type
  BOND_TYPE:0,
  BOND_TYPE_NONE:0,
  BOND_TYPE_SSBOND:1,
  BOND_TYPE_COVALENT:2,
  BOND_TYPE_HBOND:3,
  ZOOM_STEP:0.5,
	ZOOM_TIMES:1,
  //surface setting
  SURFACE_TYPE:1,
  CURRENT_SURFACE_TYPE:1,
  SURFACE_OPACITY:1.0,
  SURFACE_WIREFRAME:false,

  // var in demo
  DEMO: {
    INDEX:0,
    PRE_INDEX:-1,
    FUNCTION:[],
    LAST_EXE_TIME:Date.now(),
    FLAG:false,
    ID:0
  },
  EMMAP:{
    DATA:{},
    TYPE : 0,
    FIRST_ID:0,
    MIN_SLICE:0,
    MAX_SLICE:0,
    SHOW_SLICE:false,
    SHOW_MAP:true
  }
}

PDB.config = {
  mainMode :     PDB.CARTOON_SSE,
  hetMode :      PDB.HET_BALL_ROD,
  surfaceMode :  PDB.SURFACE,
  selectedDrug : 'DB04464',
  panelOpen :    1,
  panelClose :   0,
  openSurface :  1
}
