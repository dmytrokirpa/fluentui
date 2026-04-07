/**
 * Per-document singleton that manages a single <style> element used by all
 * CSS Anchor Positioning manager instances.  Rules are keyed by anchor name so
 * multiple concurrent instances on the same page never conflict.
 *
 * Each anchor instance may need multiple CSS rules (e.g. @position-try + main rule).
 * We track a contiguous block of rule indices per anchor name.
 */

interface StyleSheetManager {
  /** Insert one or more CSS rules (separated by newlines) for the given anchor name. */
  insert(anchorName: string, cssText: string): void;
  remove(anchorName: string): void;
}

/**
 * Split a composite CSS string into individual top-level rules.
 * Handles both @at-rules with blocks and regular rules.
 */
function splitCSSRules(cssText: string): string[] {
  const rules: string[] = [];
  let depth = 0;
  let start = 0;

  for (let i = 0; i < cssText.length; i++) {
    const ch = cssText[i];
    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        const rule = cssText.slice(start, i + 1).trim();
        if (rule) {
          rules.push(rule);
        }
        start = i + 1;
      }
    }
  }

  return rules;
}

function createStyleSheetManager(doc: Document): StyleSheetManager {
  const styleEl = doc.createElement('style');
  styleEl.setAttribute('data-fui-anchor-styles', '');
  doc.head.appendChild(styleEl);
  const sheet = styleEl.sheet!;

  // Map from anchorName → [startIndex, count] — the contiguous block of rules in the sheet
  const ruleBlockMap = new Map<string, { start: number; count: number }>();

  return {
    insert(anchorName: string, cssText: string): void {
      if (ruleBlockMap.has(anchorName)) {
        this.remove(anchorName);
      }

      const individualRules = splitCSSRules(cssText);
      const startIndex = sheet.cssRules.length;

      for (const rule of individualRules) {
        try {
          sheet.insertRule(rule, sheet.cssRules.length);
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn('[usePositioning]: Failed to insert CSS rule:', rule, e);
          }
        }
      }

      ruleBlockMap.set(anchorName, { start: startIndex, count: individualRules.length });
    },

    remove(anchorName: string): void {
      const block = ruleBlockMap.get(anchorName);
      if (!block) {
        return;
      }
      ruleBlockMap.delete(anchorName);

      // Delete rules from last to first to preserve indices during deletion
      for (let i = block.start + block.count - 1; i >= block.start; i--) {
        sheet.deleteRule(i);
      }

      // Shift all blocks that started after the deleted block
      ruleBlockMap.forEach((otherBlock, key) => {
        if (otherBlock.start > block.start) {
          ruleBlockMap.set(key, { start: otherBlock.start - block.count, count: otherBlock.count });
        }
      });
    },
  };
}

const managers = new WeakMap<Document, StyleSheetManager>();

export function getStyleSheetManager(doc: Document): StyleSheetManager {
  let manager = managers.get(doc);
  if (!manager) {
    manager = createStyleSheetManager(doc);
    managers.set(doc, manager);
  }
  return manager;
}
