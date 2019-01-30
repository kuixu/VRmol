<?php

$lang = $_POST['lang'];
$audio = $_POST['audio'];

file_put_contents("x.base64", $audio);
exec("python3 sr.py ".$lang, $result);
#var_dump($result);
$trans = array('baidu' => $result[0], 'xunfei' =>$result[1],'caozuo' => $result[2]);
echo json_encode($trans);
?>
