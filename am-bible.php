<?php

/**
 * Plugin Name: Bible
 * Description: Displays the bible text and provides search capability
 * Version: 1.0
 * Requires at least: 6.2
 * Requires PHP: 7.0
 * Author: Amir Latif
 * Author URI: https://amir-latif.github.io/portfolio/
 * Text Domain: WordPress Plugins
 */
?>
<?php

#region Create pages: text - search
function amb_create_bible_pages()
{
    // If bible text page does not exist, create it
    if (!get_page_by_path("الكتاب-المقدس")) {
        // Create the page object
        $bible_text_page = array(
            'post_title' => 'الكتاب المقدس',
            'post_content' => "<!-- wp:shortcode -->
        [amb_display_bible]
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
        [amb_display_bible]
        <!-- /wp:shortcode -->",
            'post_status' => 'publish',
            'post_type' => 'page',
        );

        // Insert the page into the database
        $bible_search_page_id = wp_insert_post($bible_search_page);
    }
}
register_activation_hook(__FILE__, 'amb_create_bible_pages');
#endregion

#region Text Display
function amb_display_bible()
{
    // TODO Add meta for each page
    /*
      <meta name="description" content="Free Web tutorials">
  <meta name="keywords" content="HTML, CSS, JavaScript">
    */
    return "<div id='amb-react'></div>";
}
add_shortcode('amb_display_bible', 'amb_display_bible');
#endregion Text Display

function amb_add_scripts()
{
    if (
        is_singular() &&
        (has_shortcode($GLOBALS['post']->post_content, 'amb_display_bible'))
    ) {
        wp_enqueue_style('ambCss', plugin_dir_url(__FILE__) . 'build/index.css', null, time());
        wp_enqueue_script('ambJs', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-element'), time(), true);
        wp_localize_script("ambJs", "wpObject", ["pageName" => $GLOBALS["pagename"]]);
    }
}
add_action('wp_enqueue_scripts', 'amb_add_scripts');

?>