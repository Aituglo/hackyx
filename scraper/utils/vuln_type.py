import re

vulnerability_keywords = {
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
}

security_headers = [
    "X-XSS-Protection"
]

def identify_vulnerability_type(title, content):
    # Vérifier d'abord dans le titre
    for vuln_type, keywords in vulnerability_keywords.items():
        for keyword in keywords:
            if re.search(r'\b' + re.escape(keyword) + r'\b', title, re.IGNORECASE):
                return vuln_type

    # Vérifier dans le contenu, en excluant les faux positifs liés aux headers de sécurité
    for vuln_type, keywords in vulnerability_keywords.items():
        for keyword in keywords:
            if re.search(r'\b' + re.escape(keyword) + r'\b', content, re.IGNORECASE):
                if not any(header in content for header in security_headers):
                    return vuln_type
    return "Unknown"

# Extract CVE number
def extract_cve_numbers(title, text):
    cve_pattern = r"CVE-\d{4}-\d{4,7}"
    cve_numbers = re.findall(cve_pattern, title)
    if cve_numbers:
        return list(set(cve_numbers))
    else:
        cve_numbers = re.findall(cve_pattern, text)
        if cve_numbers:
            return list(set(cve_numbers))
    return ['NA']