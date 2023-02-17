<?php 
header("Access-Control-Allow-Origin: *");

if(isset($_POST['url'])) {
  $url = $_POST['url'];
  $tagArr = [];
  $return = [];
  $page_content = file_get_contents($url);

  $regex = "/{engrid_data~\[([\w-]+)\]~?\[?(.+?)?\]?}/i";
  preg_match_all($regex, $page_content, $tagArr);

  if(isset($tagArr[1])) {
    echo json_encode($tagArr);
  } else {
    echo "";
  }
} 