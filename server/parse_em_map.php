<?php
/**
 * Created by Kui Xu on 2019/6/7.
 * mail: xukui.cs@gmail.com
 */
// API URL: http://www.ebi.ac.uk/pdbe/api/pdb/entry/summary/6qw6
function get_content($URL){
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_URL, $URL);
  $data = curl_exec($ch);
  curl_close($ch);
  return $data;
}
function parse_em_map($pdbid){
  // $pdbid="6qw6";
  $pdb_api = "https://www.ebi.ac.uk/pdbe/api/pdb/entry/summary/".$pdbid;
  // var_dump($pdb_api);
  // var_dump(get_content($pdb_api));
  $result  = get_content($pdb_api);
  // var_dump(file_get_contents($pdb_api));
  // $result  = file_get_contents($pdb_api);
  //var_dump("EBI:".$result);
  $obj     = json_decode($result, true);
  //var_dump($pdbid);
  //var_dump($obj);
  $method = $obj[$pdbid][0]['experimental_method_class'];
  // var_dump($method );
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
     $msgArray = array('code'=>0, 'message'=>'no fitted PDB '.$pdbid.' in current EM DataBase.');
  }
  return $msgArray;
}
//$a=parse_em_map("5ftm");
// $a=parse_em_map("1cbs");
// var_dump($a);
?>
