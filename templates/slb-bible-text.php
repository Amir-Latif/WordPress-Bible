<div class="slb-app">
    <main class="slb-bible-container">
        <div id="slb-react"></div>

        <?php if(!$_SESSION["error"]) include("slb-text-details.php") ?>

        <div class="slb-text-container">
            <?php echo $_SESSION['text_html'] ?>
        </div>

        <?php if(!$_SESSION["error"]) include("slb-text-details.php") ?>

    </main>
</div>