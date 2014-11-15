<?php

function getLaureates()
{
  # Base URL for the API
  $url  = 'http://api.nobelprize.org/v1/laureate.json';
  # List Nobel Prizes in Medicine from 1990 to 1994
  //$url .= '?bornCountry=russia';

  # Retreieve the result from the API using CURL
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL,$url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
  $string = curl_exec($ch);
  curl_close($ch);
  return $string;
}

function getLaureatesByCountry($country)
{
  # Base URL for the API
  $url  = 'http://api.nobelprize.org/v1/laureate.json';
  # List Nobel Prizes in Medicine from 1990 to 1994
  $url .= '?bornCountry='.$country;

  # Retreieve the result from the API using CURL
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL,$url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
  $string = curl_exec($ch);
  curl_close($ch);
  return $string;
}


echo getLaureates();

?>