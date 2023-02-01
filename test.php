<?php

$data = $_COOKIE['data'];

function parseJson($json)
{
  $arr = json_decode($json, true);
   
  if($arr === null && json_last_error() !== JSON_ERROR_NONE) {
    // print_r('false');
    return false;
  } else {
    // print_r('true');
    return true;
  }
}

parseJson($data);

?>