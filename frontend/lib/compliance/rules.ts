// lib/compliance/rules.ts
// Deterministic regex-based rules for sensitive data detection
// This does NOT guarantee legal compliance — it only surfaces risk indicators

export interface ComplianceRule {
  name: string;
  regex: RegExp;
  message: string;
}

export const RULES: ComplianceRule[] = [
  {
    name: "Email address",
    regex: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/gi,
    message: "⚠️ Email address detected — treat as personal data"
  },
  {
    name: "Phone number",
    regex: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    message: "⚠️ Phone number detected — verify consent before storing"
  },
  {
    name: "Aadhaar-like pattern",
    regex: /\b\d{4}\s?\d{4}\s?\d{4}\b/g,
    message: "⚠️ 12-digit pattern detected — may be Aadhaar (highly sensitive)"
  },
  {
    name: "PAN-style identifier",
    regex: /\b[A-Z]{5}\d{4}[A-Z]\b/g,
    message: "⚠️ PAN-like pattern detected — Indian tax identifier (sensitive)"
  },
  {
    name: "Credit card pattern",
    regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
    message: "⚠️ Credit card pattern detected — payment data (highly sensitive)"
  },
  {
    name: "API key / token pattern",
    regex: /\b(?:sk|pk|api|token|key)[-_]?[A-Za-z0-9]{20,}\b/gi,
    message: "⚠️ API key/token pattern detected — credential leak risk"
  },
  {
    name: "Long alphanumeric string",
    regex: /\b[A-Za-z0-9]{32,}\b/g,
    message: "⚠️ Long token-like string detected — may be sensitive credential"
  }
];
