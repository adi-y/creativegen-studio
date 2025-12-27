// lib/compliance/scanner.ts
// Pure logic for compliance scanning
// NO React imports, NO DOM mutations, NO side effects (except dispatchCompliance)

import { RULES } from "./rules";

/**
 * Scans text for sensitive data patterns
 * @param text - The text content to scan
 * @returns Array of warning messages (deduplicated)
 */
export function scanCompliance(text: string): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const issues: string[] = [];
  const seenMessages = new Set<string>();

  for (const rule of RULES) {
    // Reset lastIndex to ensure consistent matching
    rule.regex.lastIndex = 0;

    if (rule.regex.test(text)) {
      // Deduplicate: only add if not already seen
      if (!seenMessages.has(rule.message)) {
        issues.push(rule.message);
        seenMessages.add(rule.message);
      }
    }

    // Reset again after test
    rule.regex.lastIndex = 0;
  }

  return issues;
}

/**
 * Helper to dispatch compliance results as a CustomEvent
 * @param text - The text content to scan
 */
export function dispatchCompliance(text: string): void {
  const issues = scanCompliance(text);

  // Dispatch event that CompliancePanel listens to
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("compliance-result", {
        detail: {
          list: issues,
          count: issues.length
        }
      })
    );
  }
}
