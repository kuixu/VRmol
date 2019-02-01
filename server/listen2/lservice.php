<?php


$lang = $_POST['lang'];
$audio = $_POST['audio'];


$file_name='x.base64';

file_put_contents("static-data/".$file_name, $audio);
exec("python sr.py ".$lang, $result);

$trans = array('baidu' => $result[0], 'xunfei' =>$result[1],'caozuo' => $result[2]);
echo json_encode($trans);
?>