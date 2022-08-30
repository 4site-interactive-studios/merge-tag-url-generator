<?php 
header("Access-Control-Allow-Origin: *");

if(isset($_POST['url'])) {
  $url = $_POST['url'];
  $tagArr = [];

  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  $output = curl_exec($ch);
  curl_close($ch);

  $return["output"] = $output;

  $regex = "/{engrid_data~\[([\w-]+)\]~?\[?(.+?)?\]?}/i";
  preg_match_all($regex, $output, $tagArr);

  if(isset($tagArr[1])) {
    echo json_encode($tagArr[1]);
  } else {
    echo "";
  }
} 