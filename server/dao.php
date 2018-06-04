<?php

ini_set('memory_limit', '1024M');

        require_once('MysqlConn.php');

        $db=new DBconn();

        $TB_rri = 'datas_rri';
        $rri = 'rri';
        $human_clipdb = 'human_clipdb';
        $mouse_clipdb = 'mouse_clipdb';

        $human_pancan='human_pancan';
        $human_ucscSnp142 = 'human_ucscSnp142';
        $mouse_ucscSnp142 = 'mouse_ucscSnp142';


        $human_editing ='human_editing';
        $mouse_editing ='mouse_editing';

        $human_modification ='human_modification';
         $mouse_modification ='mouse_modification';


        $humanexp ='proteinaltasCellLine_human';
        $mouseexp ='expressionaltasCellLine_mouse';


	var_dump( autoname("human","U"));





        function autoname($species,$Gname){

                global $db;
                $query = "select ensembl_gene_name1 from ".$species."_gname where ensembl_gene_name1 like '".$Gname."%' order by ensembl_gene_name1 LIMIT 0,10";
                //echo $query;
                $result=$db->get_rows($query);
                //echo $result;
                $nameArr= array();
                foreach ($result as $obj) {
                    array_push($nameArr,$obj['ensembl_gene_name1']);
                }
                $response = $nameArr;
                //echo $response;
                if(is_array($response) ){
                        $msgArray = array('code'=>1, 'datas'=>$response, 'message'=>'success');
                }else{
                        $msgArray = array('code'=>0, 'datas'=>null, 'message'=>'noRNA');
                }
                return $msgArray;
        }

       function searchENid($ENid){

                global $db;
                global $TB_rri;
                $query = "select id,ensemblGeneId1,ensemblGeneName1,ensemblGeneId2,ensemblGeneName2,geneType1,geneType2,source,species,cellLine  from ".$TB_rri." where ensemblGeneId1 = '".$ENid."' or ensemblGeneId2 = '".$ENid."' LIMIT 0,1000";
                //$query = "select * from ".$TB_rri;
                //echo $query;
                $result=$db->get_rows($query);
                //$result = $db->query($query);
                //$resultArray = $result->fetchAll();
                //var_dump($result);
                 $response = $result;
                if(is_array($response) ){
                        $msgArray = array('code'=>1, 'data'=>$response, 'message'=>'success');
                }else{
                        $msgArray = array('code'=>0, 'data'=>null, 'message'=>'noRNA');
                }
                return $msgArray;
        }

function searchRRI($species,$Gname,$method){

                global $db;
                global $rri;
                //$result = $db->query($query);
                //$resultArray = $result->fetchAll();
                //var_dump($method);

                //$str="hello";
               //echo $str;
                $methods = split('_',$method);
                //var_dump($methods);

                #$sql = "";
                $sqlin = join("','",$methods);
                $sqlin ="('".$sqlin."')";
                //echo ($sqlin);
 

		// DISTINCT
                //$query = " (select  DISTINCT ensembl_gene_id2,ensembl_gene_name2,ensembl_gene_type2,method,species,cell_line  from ".$rri." where species = '".$species."' and ensembl_gene_name1 = '".$Gname."' and method in ".$sqlin.") union (select DISTINCT ensembl_gene_id1,ensembl_gene_name1,ensembl_gene_type1,method,species,cell_line  from ".$rri." where species = '".$species."' and ensembl_gene_name2 = '".$Gname."' and method in ".$sqlin.")";
                //$query = " (select  ensembl_gene_id2,ensembl_gene_name2,ensembl_gene_type2,method,species,cell_line  from ".$rri." where species = '".$species."' and ensembl_gene_name1 = '".$Gname."' and method in ".$sqlin.") union (select ensembl_gene_id1,ensembl_gene_name1,ensembl_gene_type1,method,species,cell_line  from ".$rri." where species = '".$species."' and ensembl_gene_name2 = '".$Gname."' and method in ".$sqlin.")";
		//$group_name= "`ensembl_gene_name2`_`ensembl_gene_type2`_`method`_`species`_`cell_line`";
		$group_name= "ensembl_gene_name2";
                $query = " (select  ensembl_gene_id2,ensembl_gene_name2,ensembl_gene_type2,method,species,cell_line  from ".$rri." where species = '".$species."' and ensembl_gene_name1 = '".$Gname."' and method in ".$sqlin."  group by " . $group_name.") union (select ensembl_gene_id1,ensembl_gene_name1,ensembl_gene_type1,method,species,cell_line  from ".$rri." where species = '".$species."' and ensembl_gene_name2 = '".$Gname."' and method in ".$sqlin." group by ".$group_name.")" ;
		
                echo $query;
                $result=$db->get_rows($query);

                $response = $result;


                $queryid = "(select ensembl_gene_id2,ensembl_gene_name2,ensembl_gene_type2,method,species,cell_line  from ".$rri." where species = '".$species."' and ensembl_gene_name2 = '".$Gname."') union (select ensembl_gene_id1,ensembl_gene_name1,ensembl_gene_type1,method,species,cell_line  from ".$rri." where species = '".$species."' and ensembl_gene_name1 = '".$Gname."') LIMIT 1";
                $resultid=$db->get_rows($queryid);
               


                $extradata = array('enid'=>$resultid[0][0], 'genename'=>$resultid[0][1],'genetype'=>$resultid[0][2],'source'=>$resultid[0][3],'species'=>$resultid[0][4],'celline'=>$resultid[0][5]);
                if(is_array($response) ){
                        //$msgArray = array('code'=>1, 'datas'=>$response, 'message'=>'success','extradata'=>$extradata);
                        $msgArray = array('code'=>1, 'datas'=>$response, 'message'=>'success','extradata'=>$extradata , 'debug'=>$query);
                }else{
                        $msgArray = array('code'=>0, 'datas'=>null, 'message'=>'noRNA');
                }
                return $msgArray;
        }
function searchGenename($species,$Gname){


                global $db;
                global $rri;


                //$query = " (select ensembl_gene_id2,ensembl_gene_name2,ensembl_gene_type2,method,species,cell_line  from ".$rri." where species = '".$species."' and ensembl_gene_name1 = '".$Gname."' ) union (select ensembl_gene_id1,ensembl_gene_name1,ensembl_gene_type1,method,species,cell_line  from ".$rri." where species = '".$species."' and ensembl_gene_name2 = '".$Gname."')";
                //echo $query;
 		//$group_name= "ensembl_gene_name2";
                $query ="(select pos2,genomic_context2,ensembl_gene_id1,ensembl_gene_name1,ensembl_gene_abstract_type1,pos1,genomic_context1,species,cell_line2,method,pubmed_id from ".$rri." where species = '".$species."' and ensembl_gene_name2 = '".$Gname."' group by ensembl_gene_name1 ) union (select pos1,genomic_context1,ensembl_gene_id2,ensembl_gene_name2,ensembl_gene_abstract_type2,pos2,genomic_context2,species,cell_line2,method,pubmed_id from ".$rri." where species = '".$species."' and ensembl_gene_name1 = '".$Gname."' group by ensembl_gene_name2 )";
//echo $query;               
                $result=$db->get_rows($query);
                $response = $result;




               /** $queryid = " select gene_id,tx_abstract_type,gene_loc,gene_name from geneinfo where species = '".$species."' and gene_name = '".$Gname."' LIMIT 1";
                $resultid=$db->get_rows($queryid);
                $extradata = array('enid'=>$resultid[0][0], 'genetype'=>$resultid[0][1],'gene_loc'=>$resultid[0][2],'gene_name'=>$resultid[0][3]);**/


                $queryid = " select gene_loc from geneinfo where species = '".$species."' and gene_name = '".$Gname."' LIMIT 1";
                $resultid=$db->get_rows($queryid);
                $extradata = array('gene_loc'=>$resultid[0][0]);

                //$querynum = "select count(species) from (select pos2,genomic_context2,ensembl_gene_id1,ensembl_gene_name1,pos1,genomic_context1,ensembl_gene_abstract_type1,species,cell_line2,method,pubmed_id from ".$rri." where species = '".$species."' and ensembl_gene_name2 = '".$Gname."' union select pos1,genomic_context1,ensembl_gene_id2,ensembl_gene_name2,pos2,genomic_context2,ensembl_gene_abstract_type2,species,cell_line2,method,pubmed_id from ".$rri." where species = '".$species."' and ensembl_gene_name1 = '".$Gname."') a";               
                //$resultnum=$db->get_rows($querynum);
                //$extranum = array('num'=>$resultnum[0][0]);
                $extranum = array('num'=>count($response));
              
                $querysum = "(select ensembl_gene_id1,ensembl_gene_abstract_type1,ensembl_gene_name1 from ".$rri." where species = '".$species."' and ensembl_gene_name1 = '".$Gname."') union (select ensembl_gene_id2,ensembl_gene_abstract_type2,ensembl_gene_name2 from ".$rri." where species = '".$species."' and ensembl_gene_name2 = '".$Gname."') LIMIT 1";                               
                $resultsum=$db->get_rows($querysum);
                $extrasum = array('enid'=>$resultsum[0][0], 'genetype'=>$resultsum[0][1],'gene_name'=>$resultsum[0][2]);

                
                if(is_array($response) ){
                        $msgArray = array('code'=>1, 'datas'=>$response, 'message'=>'success','extradata'=>$extradata,'extranum'=>$extranum,'extrasum'=>$extrasum);
                }else{
                        $msgArray = array('code'=>0, 'datas'=>null, 'message'=>'noRNA');
                }
                return $msgArray;
        }


function searchRBP($species,$Gname){

                global $db;

                $query = " select DISTINCT ".$species."_clipdb_gene_name,".$species."_clipdb_chr,".$species."_clipdb_start,".$species."_clipdb_end,pos_genomic_context,format(".$species."_clipdb_score2,3),`method(experiment)`,`method(computation)`,species,".$species."_clipdb_cell_line,species,pubmed_id from ".$species."_clipdb where ensembl_gene_name = '".$Gname."' ";
                //echo $query;
                $result=$db->get_rows($query);
                $response = $result;


                
                if(is_array($response) ){
                        $msgArray = array('code'=>1, 'datas'=>$response, 'message'=>'success');
                }else{
                        $msgArray = array('code'=>0, 'datas'=>null, 'message'=>'noRNA');
                }
                return $msgArray;


        }

function searchSNV($species,$Gname){

                global $db;


                $query = "select DISTINCT ".$species."_ucscSnp142_chr,".$species."_ucscSnp142_start,".$species."_ucscSnp142_end,pos_genomic_context,".$species."_ucscSnp142_ref_base,".$species."_ucscSnp142_alt_base,source,pubmed_id  from ".$species."_ucscSnp142 where ensembl_gene_name = '".$Gname."' ";
                $result=$db->get_rows($query);
                $response = $result;
                //$response;

                if(is_array($response) ){
                        $msgArray = array('code'=>1, 'datas'=>$response, 'message'=>'success');
                }else{
                        $msgArray = array('code'=>0, 'datas'=>null, 'message'=>'noRNA');
                }
                return $msgArray;

        }

 function searchhumanCancer($species,$Gname){

                global $db;
                global $human_pancan;

                $query = "select DISTINCT human_pancan_chr,human_pancan_start,human_pancan_end,pos_genomic_context,human_pancan_ref_base,human_pancan_alt_base,`cancer(full)`,source,pubmed_id from ".$human_pancan." where ensembl_gene_name = '".$Gname."' ";
                $result=$db->get_rows($query);
                $response = $result;

                if(is_array($response) ){
                        $msgArray = array('code'=>1, 'datas'=>$response, 'message'=>'success');
                }else{
                        $msgArray = array('code'=>0, 'datas'=>null, 'message'=>'noRNA');
                }
                return $msgArray;

        }
function searchEdit($species,$Gname){

                global $db;


                $query = "select DISTINCT type,editing_chr,editing_start,editing_end,pos_genomic_context,source,pubmed_id  from ".$species."_editing where ensembl_gene_name = '".$Gname."' ";
                $result=$db->get_rows($query);
                $response = $result;

                if(is_array($response) ){
                        $msgArray = array('code'=>1, 'datas'=>$response, 'message'=>'success');
                }else{
                        $msgArray = array('code'=>0, 'datas'=>null, 'message'=>'noRNA');
                }
                return $msgArray;
             
        }

function searchMod($species,$Gname){

                global $db;
                global $human_modification;
                global $mouse_modification;


                $query = "select DISTINCT  type,modification_chr,modification_start,modification_end,modification_strand,pos_genomic_context,source,pubmed_id from ".$species."_modification where ensembl_gene_name = '".$Gname."' ";
                $result=$db->get_rows($query);
                $response = $result;

                if(is_array($response) ){
                        $msgArray = array('code'=>1, 'datas'=>$response, 'message'=>'success');
                }else{
                        $msgArray = array('code'=>0, 'datas'=>null, 'message'=>'noRNA');
                }
                return $msgArray;


        }



function searchExp($species,$Gname){

                global $db;

  

                $query = "select * from POSTARTissue_".$species." where `GeneName`= '".$Gname."' ";
                $result=$db->get_rows($query);

                $response = $result;

                if(is_array($response) ){
                        $msgArray = array('code'=>1, 'datas'=>$response, 'message'=>'success');
                }else{
                        $msgArray = array('code'=>0, 'datas'=>null, 'message'=>'noRNA');
                }
                return $msgArray;
             
        }


?>

