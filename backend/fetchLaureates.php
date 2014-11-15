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


if ($_POST['token'] == 'laureate') {
  echo json_encode(getLaureates());
  die();
}

if ($_POST['token'] == 'country') {

  echo json_encode(getLaureatesByCountry($_POST['country']));
  die();

}

echo "not ok";

/*
# Read the JSON output into an associative array
$result  = json_decode($string, true);

# Find out how many years that are listed
$numyears = count($result['prizes']);

for ($i = 0; $i < $numyears; $i++) {

# Print out the category and year
  $cat = $result['prizes'][$i]['category'];
  $year = $result['prizes'][$i]['year'];
  print "<b>$cat $year</b><br>\n";

# Find out how many laureates this category and year
  $numlaur = count($result['prizes'][$i]['laureates']);

  for ($j = 0; $j < $numlaur; $j++) {

#   Print out the names
    $firstname = $result['prizes'][$i]['laureates'][$j]['firstname'];
    $surname = $result['prizes'][$i]['laureates'][$j]['surname'];
    print "$firstname $surname <br>\n";

  }
  print "<br>\n";
}

function getLaureatesJSONby($value)
{
# Base URL for the API
$url  = 'http://api.nobelprize.org/v1/laureate.json';
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



# Base URL for the API
$url  = 'json_decode(json)';
# List Nobel Prizes in Medicine from 1990 to 1994
$url .= '?category=medicine&year=1990&yearto=1994';

# Retreieve the result from the API using CURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
$string = curl_exec($ch);
curl_close($ch);
*/
?>