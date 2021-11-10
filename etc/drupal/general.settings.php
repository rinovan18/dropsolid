<?php

define('ROCKETSHIP_PROJECT_NAME', FALSE);

// Ignore front-end folders.
$settings['file_scan_ignore_directories'] = [
  'node_modules',
  'bower_components',
];

// Setup config directory.
$settings['config_sync_directory'] = '../config/sync';
// Setup private files folder.
$settings['file_private_path'] = '../private/files';

// Load specific environment services file.
if (file_exists(DRUPAL_ROOT . '/sites/environments/' . ROCKETSHIP_PROJECT_ENVIRONMENT . '.services.yml')) {
  $settings['container_yamls'][] = DRUPAL_ROOT . '/sites/environments/' . ROCKETSHIP_PROJECT_ENVIRONMENT . '.services.yml';
}

// Memcache configuration.
// Fill in the constants after installing the module.
// Check for PHP Memcached libraries.
$memcache_exists = extension_loaded('memcache');
$memcached_exists = extension_loaded('memcached');
if (($memcache_exists || $memcached_exists) && ROCKETSHIP_MEMCACHE_READY_FOR_USE && ROCKETSHIP_PROJECT_NAME && ROCKETSHIP_PROJECT_ENVIRONMENT) {
  // Use memcache's lock service.
  $settings['container_yamls'][] = DRUPAL_ROOT . '/sites/environments/memcache.services.yml';
  // Set backends to use memcache.
  $settings['cache']['default'] = 'cache.backend.memcache';
  $settings['cache']['bins']['form'] = 'cache.backend.database';
  $settings['memcache']['key_prefix'] = ROCKETSHIP_PROJECT_NAME . '_' . ROCKETSHIP_PROJECT_ENVIRONMENT;
  // Enable stampede protection.
  $settings['memcache']['stampede_protection'] = TRUE;
  // Enable compression for PHP 7.
  if ($memcached_exists && PHP_VERSION_ID >= 70000) {
    $settings['memcache']['options'][Memcached::OPT_COMPRESSION] = TRUE;
  }
}

// Varnish Purge Rocketship setup.
if (ROCKETSHIP_PURGE_READY_FOR_USE && ROCKETSHIP_PROJECT_NAME && ROCKETSHIP_PROJECT_ENVIRONMENT) {
  $config['dropsolid_purge.config'] = [
    'site_name' => ROCKETSHIP_PROJECT_NAME,
    'site_environment' => ROCKETSHIP_PROJECT_ENVIRONMENT,
    'site_group' => "DropsolidSolutions",
    'loadbalancers' => [
      'varnish' => [
        'ip' => '127.0.0.1',
        'protocol' => 'http',
        'port' => '88',
      ],
    ],
  ];
}

