<?php

namespace Drupal\layout_builder\EventSubscriber;

use Drupal\block_content\Access\RefinableDependentAccessInterface;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Block\BlockPluginInterface;
use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Render\Element;
use Drupal\Core\Render\PreviewFallbackInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\layout_builder\Access\LayoutPreviewAccessAllowed;
use Drupal\layout_builder\Event\SectionComponentBuildRenderArrayEvent;
use Drupal\layout_builder\LayoutBuilderEvents;
use Drupal\views\Plugin\Block\ViewsBlock;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Builds render arrays and handles access for all block components.
 *
 * @internal
 *   Tagged services are internal.
 */
class BlockComponentRenderArray implements EventSubscriberInterface {

  use StringTranslationTrait;

  /**
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;

  /**
   * Creates a BlockComponentRenderArray object.
   *
   * @param \Drupal\Core\Session\AccountInterface $current_user
   *   The current user.
   */
  public function __construct(AccountInterface $current_user) {
    $this->currentUser = $current_user;
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events[LayoutBuilderEvents::SECTION_COMPONENT_BUILD_RENDER_ARRAY] = ['onBuildRender', 100];
    return $events;
  }

  /**
   * Builds render arrays for block plugins and sets it on the event.
   *
   * @param \Drupal\layout_builder\Event\SectionComponentBuildRenderArrayEvent $event
   *   The section component render event.
   */
  public function onBuildRender(SectionComponentBuildRenderArrayEvent $event) {
    $block = $event->getPlugin();
    if (!$block instanceof BlockPluginInterface) {
      return;
    }

    // Set block access dependency even if we are not checking access on
    // this level. The block itself may render another
    // RefinableDependentAccessInterface object and need to pass on this value.
    if ($block instanceof RefinableDependentAccessInterface) {
      $contexts = $event->getContexts();
      if (isset($contexts['layout_builder.entity'])) {
        if ($entity = $contexts['layout_builder.entity']->getContextValue()) {
          if ($event->inPreview()) {
            // If previewing in Layout Builder allow access.
            $block->setAccessDependency(new LayoutPreviewAccessAllowed());
          }
          else {
            $block->setAccessDependency($entity);
          }
        }
      }
    }

    // Only check access if the component is not being previewed.
    if ($event->inPreview()) {
      $access = AccessResult::allowed()->setCacheMaxAge(0);
    }
    else {
      $access = $block->access($this->currentUser, TRUE);
    }

    $event->addCacheableDependency($access);
    if ($access->isAllowed()) {
      $event->addCacheableDependency($block);

      // @todo Revisit after https://www.drupal.org/node/3027653, as this will
      //   provide a better way to remove contextual links from Views blocks.
      //   Currently, doing this requires setting
      //   \Drupal\views\ViewExecutable::$showAdminLinks() to false before the
      //   Views block is built.
      if ($block instanceof ViewsBlock && $event->inPreview()) {
        $block->getViewExecutable()->setShowAdminLinks(FALSE);
      }

      $content = $block->build();

      // We don't output the block render data if there are no render elements
      // found, but we want to capture the cache metadata from the block
      // regardless.
      $event->addCacheableDependency(CacheableMetadata::createFromRenderArray($content));

      $is_content_empty = Element::isEmpty($content);
      $is_placeholder_ready = $event->inPreview() && $block instanceof PreviewFallbackInterface;
      // If the content is empty and no placeholder is available, return.
      if ($is_content_empty && !$is_placeholder_ready) {
        return;
      }

      $build = [
        // @todo Move this to BlockBase in https://www.drupal.org/node/2931040.
        '#theme' => 'block',
        '#configuration' => $block->getConfiguration(),
        '#plugin_id' => $block->getPluginId(),
        '#base_plugin_id' => $block->getBaseId(),
        '#derivative_plugin_id' => $block->getDerivativeId(),
        '#weight' => $event->getComponent()->getWeight(),
        '#contextual_links' => isset($content['#contextual_links']) ? $content['#contextual_links'] : [],
      ];

      if (!$is_content_empty) {
        // Place the $content returned by the block plugin into a 'content'
        // child element, as a way to allow the plugin to have complete control
        // of its properties and rendering (for instance, its own #theme)
        // without conflicting with the properties used above, or alternate ones
        // used by alternate block rendering approaches in contributed modules.
        // However, the use of a child element is an implementation detail of
        // this particular block rendering approach. Semantically, the content
        // returned by the block plugin, and in particular, #attributes is
        // information about the entire block. Therefore, we must move this
        // property from $content and merge them into the top-level element.
        if (isset($content['#attributes'])) {
          $build['#attributes'] = $content['#attributes'];
          unset($content['#attributes']);
        }
      }

      $build['content'] = $content;

      if ($event->inPreview()) {
        if ($block instanceof PreviewFallbackInterface) {
          $preview_fallback_string = $block->getPreviewFallbackString();
        }
        else {
          $preview_fallback_string = $this->t('"@block" block', ['@block' => $block->label()]);
        }
        // @todo Use new label methods so
        //   data-layout-content-preview-placeholder-label doesn't have to use
        //   preview fallback in https://www.drupal.org/node/2025649.
        $build['#attributes']['data-layout-content-preview-placeholder-label'] = $preview_fallback_string;

        if ($is_content_empty && $is_placeholder_ready) {
          $build['content']['#markup'] = $this->t('Placeholder for the @preview_fallback', ['@preview_fallback' => $block->getPreviewFallbackString()]);
        }
      }

      $event->setBuild($build);
    }
  }

}
