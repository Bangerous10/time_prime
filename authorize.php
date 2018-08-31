<?php
  require('oauth_client.php');
  require('oauth_http.php');

  date_default_timezone_set("America/Indiana/Indianapolis");
  $client = new oauth_client_class;
  $client->server = '37Signals';
  $client->debug = false;
  $client->debug_http = true;

  // Production
  // $client->redirect_uri = 'http://abange.lodgedesign.us/time_js/index.php';
  // $client->client_id = '4899c025e1e35dc1877db4987ddb08b82806e82a';
  // $client->client_secret = '71fabd9ac919e33946014ee1d75fa9978121fc56';

  // Development
  $client->redirect_uri = 'http://localhost:8888/';
  $client->client_id = 'd0817166f8dd996eb948dc129e16bd15b26b0caf';
  $client->client_secret = '12ca77d505bb777a4eee9e5a3436436fb291a488';

  if ($_GET['url']) {
    $url = $_GET['url'];
  }
  if ($_GET['account_name']) {
    $account_name = $_GET['account_name'];
  }


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
    session_start();
    $user_id = $user->identity->id;

    $accounts = array();

    foreach($user->accounts as $account) {
      array_push($accounts, $account);
    }

    if (!$url) {
      if (count($accounts) > 1) {
        $_SESSION['user'] = $user;
        header('Location: ' . $client->redirect_uri . 'accounts.php');
      //  header('Location: http://abange.lodgedesign.us/time_js/accounts.php');
      } else {
        $url = 'https://3.basecampapi.com/' . $accounts[0]->id;
        $account_name = $accounts[0]->name;
      }
    }

  } else {
    echo "Success variable is not defined";
  }

?>
