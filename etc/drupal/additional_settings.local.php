<?php

// Configure config split directory.
$config['config_split.config_split.whitelist']['status'] = TRUE;
$config['config_split.config_split.blacklist']['status'] = TRUE;
$config['config_split.config_split.local']['status'] = TRUE;
$config['config_split.config_split.dev']['status'] = FALSE;
$config['config_split.config_split.staging']['status'] = FALSE;
$config['config_split.config_split.live']['status'] = FALSE;
// Setup config directory.
$config_directories['sync'] = '../config/sync';
// Setup private files folder.
$settings['file_private_path'] = '../private/files';
// Skip file permissions hardening on local.
$settings['skip_permissions_hardening'] = TRUE;

/**
 * Enable local development services.
 */
$settings['container_yamls'][] = DRUPAL_ROOT . '/sites/development.services.yml';
$settings['container_yamls'][] = DRUPAL_ROOT . '/sites/environments/local.services.yml';

/**
 * Memcache configuration
 *
 * Uncomment ONLY when memcache module is installed!
 * If Memcache is installed, also uncomment the lock service in local.services.yml!
 */
//$settings['cache']['default'] = 'cache.backend.memcache';
//$settings['cache']['bins']['form'] = 'cache.backend.database';
//$settings['memcache']['key_prefix'] = 'PROJECTNAME_ENVIRONMENT';
