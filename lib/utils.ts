import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const vulnerabilityKeywords = {
  "SSRF": ["SSRF", "Server-Side Request Forgery"],
  "XSS": ["XSS", "Cross-Site Scripting"],
  "SQL Injection": ["SQL Injection", "SQLi"],
  "RCE": ["RCE", "Remote Code Execution"],
  "CSRF": ["CSRF", "Cross-Site Request Forgery"],
  "Directory/Path Traversal": ["Directory Traversal", "Path Traversal"],
  "Buffer Overflow": ["Buffer Overflow"],
  "Privilege Escalation": ["Privilege Escalation", "privescs"],
  "DoS": ["DoS", "Denial of Service"],
  "Smuggling": ["Smuggling"],
  "Takeover": ["takeover", "subdomain takeover", "dns takeover", "Taking over"],
  "Auth Bypass": ['Auth Bypass', 'Authentication Bypass'],
  "Android": ['Android'],
  "Cloud": ["Cloud"],
  "Bleed": ["Bleed"]
};

const securityHeaders = [
  "X-XSS-Protection"
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function identifyVulnerabilityType(title: string, content: string): string {
  for (const [vulnType, keywords] of Object.entries(vulnerabilityKeywords)) {
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(title)) {
        return vulnType;
      }
    }
  }

  for (const [vulnType, keywords] of Object.entries(vulnerabilityKeywords)) {
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(content) && !securityHeaders.some(header => content.includes(header))) {
        return vulnType;
      }
    }
  }

  return "Unknown";
}

export function extractCveNumbers(title: string, text: string): string[] {
  const cvePattern = /CVE-\d{4}-\d{4,7}/g;
  const titleMatches = title.match(cvePattern);
  const textMatches = text.match(cvePattern);

  const uniqueCves = new Set([...(titleMatches || []), ...(textMatches || [])]);
  return uniqueCves.size > 0 ? Array.from(uniqueCves) : ['NA'];
}