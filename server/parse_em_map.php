<?php
/**
 * Created by Kui Xu on 2019/6/7.
 * mail: xukui.cs@gmail.com
 */
// API URL: http://www.ebi.ac.uk/pdbe/api/pdb/entry/summary/6qw6
function parse_em_map($pdbid){
  // $pdbid="6qw6";
  $pdb_api = "http://www.ebi.ac.uk/pdbe/api/pdb/entry/summary/".$pdbid;
  $result  = file_get_contents($pdb_api);
  $obj     = json_decode($result, true);
  #var_dump($obj);
  $method = $obj[$pdbid][0]['experimental_method_class'];
  if (in_array("em", $method)){
     $id = $obj[$pdbid][0]['related_structures'][0]['accession'];
     $id = str_replace("EMD-","", $id);
     $md = 'EM';
     $msgArray = array('code'=>1, 'data'=> [$id], 'method'=>$md, 'pdbid'=>$pdbid, 'message'=>'success');
  }elseif(in_array("x-ray", $method)){
     $id = $pdbid;
     $md = 'X-Ray';
     $msgArray = array('code'=>1, 'data'=> [$id], 'method'=>$md, 'pdbid'=>$pdbid, 'message'=>'success');
  }else{
     $id = '';
     $md = '';
     $msgArray = array('code'=>0, 'message'=>'no fitted PDB in current EMDB.');
  }
  return $msgArray;
}
// $a=parse_em_map("5ftm");
// var_dump($a);
?>
