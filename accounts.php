<?php
session_start();
$user = $_SESSION['user'];
if (!$user) {
  require('authroize.php');
}

?>
<title>Time Prime</title>
<link rel="shortcut icon" href="images/logo_icon.svg" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="js/jquery-3.3.1.min.js"></script>
<link type="text/css" rel="stylesheet" href="css/styles.css"  media="screen,projection"/>
<style>
  body {
    display:flex;
    height:100%;
    width:100%;
    margin:0;
    padding:0;
    overflow:hidden;
    flex-flow:column nowrap;
    justify-content:center;
    align-content:center;
    align-items:center;
  }

  .user-info {
    position:absolute;
    left:2rem;
    top:1rem;
    font-size:0.8rem;
  }

  .account-container {
    overflow:auto;
    max-height:90%;
    min-width:300px;
    background-color:rgb(240,240,240);
    box-shadow:0 1px 3px 0 rgba(0,0,0,0.45);
    border-radius:8px;
  }

  .account-container .title {
    text-align: center;
    font-size:2rem;
    padding: 1rem 0;
    border-bottom: 1px solid rgb(200,200,200);
  }

  .account-container .account {
    padding:0.75rem 0;
    text-align:center;
    transition:0.3s ease;
    position:relative;
  }
  .account-container .account:last-child {border-radius: 0 0 8px 8px;}
  .account-container .account:hover {
    background-color:rgb(200,200,200);
    box-shadow: inset 0 4px 30px -12px black;
  }

  .account-container .account .product {
    max-width:30%;
    height:auto;
  }

  .account-container .account .tag {
    position: absolute;
    top: 15%;
    left: 57%;
    font-size:10px;
    text-transform:uppercase;
    padding: 0.15rem 0.5rem;
    border-radius: 10px;
  }
  .account-container .account .tag.bc3 {background-color:#ec7a3c;color:white;}
  .account-container .account .tag.basecamp {background-color:white;color:black;}

  .account_name {color:black;}
</style>

<div class="user-info">
  <div><?php echo $user->identity->first_name . ' ' . $user->identity->last_name; ?></div>
  <div><?php echo $user->identity->email_address; ?></div>
</div>
<p style="font-size:0.8rem;color:rgb(200,200,200);">Choose an account to track your time.</p>
<div class="account-container">
  <div class="title">Basecamp</div>
  <?php
    foreach($user->accounts as $account) {
      if ($account->product == 'bc3') {
  ?>

  <div class="account">
    <a href="<?php echo 'index.php?url=' . $account->href . '&account_name=' . $account->name; ?>">
      <img class="product" src="images/product-<?php echo $account->product; ?>.svg" />
      <span class="tag <?php echo $account->product; ?>"><?php echo $account->product; ?></span>
      <h6 class="account_name"><?php echo $account->name; ?></h6>
    </a>
  </div>

  <?php
      }
    }
  ?>
</div>
