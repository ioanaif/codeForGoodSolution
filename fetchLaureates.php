<?php

function getLaureatesJSONby($value)
{
# Base URL for the API
$url  = 'http://api.nobelprize.org/v1/prize.json';
# List Nobel Prizes in Medicine from 1990 to 1994
$url .= $value;

# Retreieve the result from the API using CURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
$string = curl_exec($ch);
curl_close($ch);

# Read the JSON output into an associative array
$result  = json_decode($string, true);

return $string;
}

function getLaureatesJSONbyCategory($value)
{
 return getLaureatesJSONby('?category='.$value);
}

function getLaureatesJSONbyCountry($value)
{
 return getLaureatesJSONby('?country='.$value);
}

echo getLaureatesJSONbyCategory('literature');
//echo getLaureatesJSONbyCountry('russia');

?>