<?php

function block_styles_manager_editor_assets() {
	// Make paths variables so we don't write em twice ;)
	$block_path = '/assets/js/app.js';
	$style_path = '/assets/css/style.css';

	// Enqueue the bundled block JS file
	wp_enqueue_script(
		'block-styles-manager-js',
		_get_plugin_url() . $block_path,
		[ 'wp-i18n', 'wp-element', 'wp-plugins', 'wp-edit-post', 'wp-editor', 'wp-data', 'wp-components' ],
		filemtime( _get_plugin_directory() . $block_path )
	);

	// Enqueue optional editor only styles
	wp_enqueue_style(
		'block-styles-manager-editor-css',
		_get_plugin_url() . $style_path,
		[ ],
		filemtime( _get_plugin_directory() . $style_path )
	);
}
add_action( 'enqueue_block_editor_assets', 'block_styles_manager_editor_assets' );
