<?php

/**
 * @file
 * Post update functions for Views.
 */

use Drupal\Core\Config\Entity\ConfigEntityUpdater;
use Drupal\views\ViewsConfigUpdater;

/**
 * Implements hook_removed_post_updates().
 */
function views_removed_post_updates() {
  return [
    'views_post_update_update_cacheability_metadata' => '9.0.0',
    'views_post_update_cleanup_duplicate_views_data' => '9.0.0',
    'views_post_update_field_formatter_dependencies' => '9.0.0',
    'views_post_update_taxonomy_index_tid' => '9.0.0',
    'views_post_update_serializer_dependencies' => '9.0.0',
    'views_post_update_boolean_filter_values' => '9.0.0',
    'views_post_update_grouped_filters' => '9.0.0',
    'views_post_update_revision_metadata_fields' => '9.0.0',
    'views_post_update_entity_link_url' => '9.0.0',
    'views_post_update_bulk_field_moved' => '9.0.0',
    'views_post_update_filter_placeholder_text' => '9.0.0',
    'views_post_update_views_data_table_dependencies' => '9.0.0',
    'views_post_update_table_display_cache_max_age' => '9.0.0',
    'views_post_update_exposed_filter_blocks_label_display' => '9.0.0',
    'views_post_update_make_placeholders_translatable' => '9.0.0',
    'views_post_update_limit_operator_defaults' => '9.0.0',
    'views_post_update_remove_core_key' => '9.0.0',
  ];
}

/**
 * Update field names for multi-value base fields.
 */
function views_post_update_field_names_for_multivalue_fields(&$sandbox = NULL) {
  /** @var \Drupal\views\ViewsConfigUpdater $view_config_updater */
  $view_config_updater = \Drupal::classResolver(ViewsConfigUpdater::class);
  $view_config_updater->setDeprecationsEnabled(FALSE);
  \Drupal::classResolver(ConfigEntityUpdater::class)->update($sandbox, 'view', function ($view) use ($view_config_updater) {
    return $view_config_updater->needsMultivalueBaseFieldUpdate($view);
  });
}

/**
 * Clear errors caused by relationships to configuration entities.
 */
function views_post_update_configuration_entity_relationships() {
  // Empty update to clear Views data.
}

/**
 * Clear caches due to removal of sorting for global custom text field.
 */
function views_post_update_remove_sorting_global_text_field() {
  // Empty post-update hook.
}

/**
 * Add administrative theme option for views with page displays.
 */
function views_post_update_enforce_admin_theme() {
  $config_factory = \Drupal::configFactory();
  foreach ($config_factory->listAll('views.view.') as $name) {
    $view = $config_factory->getEditable($name);
    $changed = FALSE;
    foreach ($view->get('display') as $display_id => $display) {
      // Deal only with page displays.
      if ($display['display_plugin'] === 'page') {
        $trail = "display.$display_id.display_options.always_use_admin_theme";
        $view->set($trail, FALSE)->save();
        $changed = TRUE;
      }
    }
    if ($changed) {
      $view->save();
    }
  }
}
