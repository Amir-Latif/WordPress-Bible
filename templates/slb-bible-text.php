<h1><?php echo $_SESSION["title"] ?></h1>
<div class="slb-app">
    <div class="slb-bible-container">
        <div id="slb-react"></div>

        <?php if (!$_SESSION["error"]) include("slb-text-details.php") ?>

        <div class="slb-text-container">
            <?php echo $_SESSION['text_html'] ?>
        </div>

        <?php if (!$_SESSION["error"]) include("slb-text-details.php") ?>

    </div>
</div>