<?php

/**
 * @file
 * The additional settings for the staging environment.
 */

// Ignore front-end folders.
$settings['file_scan_ignore_directories'] = [
  'node_modules',
  'bower_components',
];

// Configure config split directory.
$config['config_split.config_split.whitelist']['status'] = TRUE;
$config['config_split.config_split.blacklist']['status'] = TRUE;
$config['config_split.config_split.local']['status'] = FALSE;
$config['config_split.config_split.dev']['status'] = FALSE;
$config['config_split.config_split.staging']['status'] = TRUE;
$config['config_split.config_split.live']['status'] = FALSE;
// Setup config directory.
$config_directories['sync'] = '../config/sync';
// Setup private files folder.
$settings['file_private_path'] = '../private/files';
// Ignore all non-default collections, meaning languages.
$config['config_ignore.settings']['ignored_config_entities'][9999] = 'collections.*';

/**
 * Memcache configuration.
 *
 * Uncomment ONLY when memcache module is installed!
 */
//$settings['cache']['default'] = 'cache.backend.memcache';
//$settings['cache']['bins']['form'] = 'cache.backend.database';
//$settings['memcache']['key_prefix'] = 'PROJECTNAME_ENVIRONMENT';
//$settings['container_yamls'][] = DRUPAL_ROOT . '/sites/environments/staging.services.yml';

/**
 * Varnish Purge setup.
 *
 * Add project name AND environment name to site_name before uncommenting this.
 */
//$config['dropsolid_purge.config']= [
//  'site_name' => "SITENAME",
//  'site_environment' => "staging",
//  'site_group' => "DropsolidSolutions",
//  'loadbalancers' => [
//    'varnish' => [
//      'ip' => '127.0.0.1',
//      'protocol' => 'http',
//      'port' => '88'
//    ],
//  ]
//];
