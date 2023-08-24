<?php

/**
 * Plugin Name: SkyLimitVDBible
 * Description: Displays the bible text and provides search capability
 * Version: 1.1
 * Requires at least: 6.2
 * Requires PHP: 7.0
 * Author: Sky Limit Media
 * Author URI: https://www.skylimitmedia.com/
 * Text Domain: Bible
 */
?>
<?php

#region data class initialization
require_once("services/slBible.php");
$slBible = new SlBible(
    $books = json_decode(file_get_contents(plugin_dir_url(__FILE__) . "src/data/books.json"), true),
    $bible_text = json_decode(file_get_contents(plugin_dir_url(__FILE__) . "src/data/bibleText.json"), true),
);
#endregion

#region Create pages: text - search on registery
function slb_create_bible_pages()
{
    // If bible text page does not exist, create it
    if (!get_page_by_path("الكتاب-المقدس")) {
        // Create the page object
        $bible_text_page = array(
            'post_title' => 'الكتاب المقدس',
            'post_content' => "<!-- wp:shortcode -->
        [slb_display_bible]
        <!-- /wp:shortcode -->",
            'post_status' => 'publish',
            'post_type' => 'page',
        );

        // Insert the page into the database
        $bible_text_page_id = wp_insert_post($bible_text_page);
    }

    // If bible search page does not exist, create it
    if (!get_page_by_path("بحث-في-الكتاب-المقدس")) {
        $bible_search_page = array(
            'post_title'     => "بحث في الكتاب المقدس",
            'post_content' => "<!-- wp:shortcode -->
        [slb_display_bible]
        <!-- /wp:shortcode -->",
            'post_status' => 'publish',
            'post_type' => 'page',
        );

        // Insert the page into the database
        $bible_search_page_id = wp_insert_post($bible_search_page);
    }
}
register_activation_hook(__FILE__, 'slb_create_bible_pages');
#endregion

#region Text Display using shortcode
function slb_display_bible()
{
    global $slBible;

    #region Prepare html
    $text_html = "خطأ في عنوان الصفحة";

    if (sizeof($slBible->selected_text) !== 0) {
        // Remove the above page error message before looping
        $text_html = "";

        foreach ($slBible->selected_text as $verse) {
            if (isset($verse["title"])) {
                if ($verse["v"] !== 1) {
                    $text_html .= "<hr>";
                }
                $title = $verse["title"];
                $text_html .= "<h2 class='slb-h2 slb-p'>$title</h2>";
            }

            if ($slBible->verse !== 0 && $slBible->verse === $verse["v"]) {
                $text_html .= "<p id='verse' class='slb-selected-verse'><span style='padding-inline-end: 5px' class='slb-p'>{$verse["v"]}.</span><span class='slb-p'>{$verse['text']}</span></p>";
            } else {
                $text_html .= "<p><span style='padding-inline-end: 5px' class='slb-p'>{$verse["v"]}.</span><span class='slb-p'>{$verse['text']}</span></p>";
            }
        }
    }
    #endregion Prepare text html

    #region Render
    ob_start();
    $_SESSION["text_html"] = $text_html;
    $_SESSION["error"] = sizeof($slBible->selected_text) === 0;
    include('templates/slb-bible-text.php');
    include('templates/slb-spinner.php');

    $page_content = ob_get_clean();

    if (urldecode($GLOBALS["pagename"]) === "الكتاب-المقدس")
        return $page_content;
    else {
        ob_start();
        include('templates/slb-spinner.php');

        $page_content = ob_get_clean();

        return "{$page_content}<div id='slb-react'></div>";
    }
    #endregion render
}
add_shortcode('slb_display_bible', 'slb_display_bible');
#endregion Text Display

#region add meta tags
function slb_add_meta_tags()
{
    global $slBible;

    $meta_description = "استكشف الكتاب المقدس بالتشكيل وبدون التشكيل، العهد الجديد، اقرأ ";

    if ($slBible->selected_book["testament"] === "old") {
        $meta_description .= "سفر ";
    }

    $meta_description .= "{$slBible->book_name} أصحاح {$slBible->chapter}، مع تفسير مفصل وشامل لمحتوى الانجيل والكتاب المقدس";


    if (
        is_singular() &&
        (has_shortcode($GLOBALS['post']->post_content, 'slb_display_bible'))
    ) {
        echo "<meta name='description' content='$meta_description'>";
        echo '<meta name="keywords" content="الكتاب المقدس">';
    }
}
add_action('wp_head', 'slb_add_meta_tags');

#endregion add meta tags

#region update html document title
function slb_change_page_title($title)
{
    global $slBible;

    if (urldecode($GLOBALS["pagename"]) === "الكتاب-المقدس") {
        $title = $slBible->title;
    }

    return $title;
}
add_filter('pre_get_document_title', 'slb_change_page_title');
#endregion update post title

#region update post title
function slb_change_post_title($post_data)
{
    // isset is due to error of wordpress undefined global variable $pagename
    if (isset($GLOBALS["pagename"]) && urldecode($GLOBALS["pagename"]) === "الكتاب-المقدس") {
        global $slBible;

        $post_data->post_title = $slBible->title;
    }
}

add_action('the_post', 'slb_change_post_title');
#endregion update post title

#region add scripts
function slb_add_scripts()
{
    global $slBible;
    $page_name = urldecode($GLOBALS["pagename"]);
    $plugin_dir = plugin_dir_url(__FILE__);

    if (
        has_shortcode($GLOBALS['post']->post_content, 'slb_display_bible')
    ) {
        // global
        wp_enqueue_style('slbCssGlobalCss', $plugin_dir . 'styles/slb-styles.css', null, false);

        // spinner
        wp_enqueue_style('slbSpinnerCss', $plugin_dir . 'styles/slb-spinner.css', null, false);
        wp_enqueue_script('slbMainJs', $plugin_dir . 'scripts/slbMain.js', array('wp-element'), false, true);
        wp_localize_script("slbMainJs", "slbMainJsObject", ["title" => $slBible->title]);

        // build
        wp_enqueue_script('slbBuildJs', $plugin_dir . 'build/index.js', array('wp-element'), false, true);
        wp_localize_script("slbBuildJs", "slbBuildObject", ["pageName" => $page_name]);

        // Bible Text
        if ($page_name === "الكتاب-المقدس")
            wp_enqueue_script('slbAccentjs', $plugin_dir . 'scripts/slbAccent.js', null, false, true);
    }
}
add_action('wp_enqueue_scripts', 'slb_add_scripts');
#endregion add scripts
?>