<?php
  require('oauth_client.php');
  require('oauth_http.php');

  date_default_timezone_set("America/Indiana/Indianapolis");
  $client = new oauth_client_class;
  $client->server = '37Signals';
  $client->debug = false;
  $client->debug_http = true;

  // Real
  // $client->redirect_uri = 'http://abange.lodgedesign.us/time_js/index.php';
  // $client->client_id = '4899c025e1e35dc1877db4987ddb08b82806e82a';
  // $application_line = __LINE__;
  // $client->client_secret = '71fabd9ac919e33946014ee1d75fa9978121fc56';

  // Development
  $client->redirect_uri = 'http://localhost:8888/';
  $client->client_id = 'd0817166f8dd996eb948dc129e16bd15b26b0caf';
  $application_line = __LINE__;
  $client->client_secret = '12ca77d505bb777a4eee9e5a3436436fb291a488';



  if(strlen($client->client_id) == 0
  || strlen($client->client_secret) == 0)
    die('Please go to 37Signals Integrate new application page '.
      'https://integrate.37signals.com/apps/new and in the line '.$application_line.
      ' set the client_id to Client ID and client_secret with Client secret. '.
      'The site domain must have the same domain of '.$client->redirect_uri);

  /* API permissions
   */
  $client->scope = '';
  if(($success = $client->Initialize()))
  {
    if(($success = $client->Process()))
    {
      if(strlen($client->authorization_error))
      {
        $client->error = $client->authorization_error;
        $success = false;
      }
      elseif(strlen($client->access_token))
      {
        $success = $client->CallAPI(
          'https://launchpad.37signals.com/authorization.json',
          'GET', array(), array('FailOnAccessError'=>true), $user);
          // var_dump($user);
      }
    }
    $success = $client->Finalize($success);
  } else {
    echo "Client was not initialized <br/>";
  }
  if($client->exit)
    exit;
  if($success)
  {
    $user_id = $user->identity->id;

    foreach($user->accounts as $account) {
      if($account->id=="3715639") {
        $ACCOUNT_ID = $account->id;
      }
    }
    $url = 'https://3.basecampapi.com/' . $ACCOUNT_ID;

  } else {
    echo "Success variable is not defined";
  }

?>
