-- Add comprehensive educational content
INSERT INTO educational_content (title, content, category_id, content_type, difficulty_level, tags, estimated_reading_time, slug) 
VALUES 
-- Web Security Fundamentals
('Advanced Phishing Detection Techniques', 
'{
  "introduction": "Master advanced techniques for identifying sophisticated phishing attacks",
  "sections": [
    {
      "title": "URL Analysis Techniques",
      "content": "Learn to examine URL structure, domain registration patterns, and redirect chains to identify malicious links."
    },
    {
      "title": "Email Header Analysis", 
      "content": "Understand how to read email headers, verify sender authenticity, and identify spoofed domains."
    },
    {
      "title": "Social Engineering Indicators",
      "content": "Recognize psychological manipulation tactics used in phishing campaigns and urgent action requests."
    }
  ],
  "checklist": [
    "Always verify sender through alternate communication channel",
    "Check for misspellings in sender domain names", 
    "Hover over links to preview destination before clicking",
    "Be suspicious of urgent requests for sensitive information"
  ],
  "quiz": [
    {
      "question": "What is the most reliable way to verify a suspicious email?",
      "options": ["Click the verification link", "Contact sender via phone/alternate method", "Forward to IT", "Reply asking for confirmation"],
      "correct": 1,
      "explanation": "Always verify through a separate communication channel to avoid falling for sophisticated phishing."
    }
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Web Security' LIMIT 1),
'article', 'intermediate', 
ARRAY['phishing', 'email-security', 'social-engineering'], 
12, 'advanced-phishing-detection'),

-- Password Security
('Enterprise Password Management', 
'{
  "introduction": "Implement robust password policies and management for organizations",
  "sections": [
    {
      "title": "Password Policy Development",
      "content": "Create comprehensive password policies that balance security with usability for your organization."
    },
    {
      "title": "Multi-Factor Authentication Implementation",
      "content": "Deploy MFA solutions across your organization using hardware tokens, authenticator apps, and biometrics."
    },
    {
      "title": "Password Manager Deployment",
      "content": "Select and implement enterprise password managers with proper integration and user training."
    }
  ],
  "steps": [
    "Audit current password practices across organization",
    "Develop comprehensive password policy document", 
    "Select appropriate password manager solution",
    "Implement multi-factor authentication requirements",
    "Train employees on password security best practices",
    "Monitor compliance and security metrics",
    "Regular security audits and policy updates"
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Identity Security' LIMIT 1),
'tutorial', 'advanced',
ARRAY['passwords', 'enterprise-security', 'mfa'], 
15, 'enterprise-password-management'),

-- Malware Prevention  
('Malware Analysis and Prevention', 
'{
  "introduction": "Comprehensive guide to identifying, analyzing, and preventing malware infections",
  "sections": [
    {
      "title": "Malware Classification",
      "content": "Understand different types of malware: viruses, trojans, ransomware, spyware, and their characteristics."
    },
    {
      "title": "Static and Dynamic Analysis",
      "content": "Learn techniques for analyzing suspicious files without executing them and safe sandboxing methods."
    },
    {
      "title": "Prevention Strategies", 
      "content": "Implement layered security approaches including endpoint protection, network monitoring, and user education."
    }
  ],
  "checklist": [
    "Keep all software and systems updated",
    "Use enterprise-grade endpoint protection",
    "Implement application whitelisting where possible",
    "Regular backup verification and testing",
    "Employee training on malware recognition",
    "Network segmentation and monitoring"
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Malware Defense' LIMIT 1),
'article', 'advanced',
ARRAY['malware', 'endpoint-security', 'analysis'], 
18, 'malware-analysis-prevention'),

-- Privacy Protection Advanced
('Advanced Privacy Protection Techniques',
'{
  "introduction": "Master advanced techniques for protecting personal and organizational privacy online",
  "sections": [
    {
      "title": "Digital Footprint Minimization",
      "content": "Learn to reduce your digital footprint through strategic social media management and data minimization practices."
    },
    {
      "title": "VPN and Tor Usage",
      "content": "Understand when and how to use VPNs and Tor for enhanced privacy, including proper configuration and limitations."
    },
    {
      "title": "Encrypted Communications",
      "content": "Implement end-to-end encrypted messaging, email, and file sharing solutions for sensitive communications."
    }
  ],
  "quiz": [
    {
      "question": "Which provides better anonymity for most users?",
      "options": ["VPN only", "Tor only", "VPN + Tor together", "Neither provides real anonymity"],
      "correct": 2,
      "explanation": "Using VPN and Tor together provides the strongest privacy protection by hiding your traffic from both your ISP and Tor entry nodes."
    }
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Privacy Protection' LIMIT 1),
'article', 'advanced',
ARRAY['privacy', 'vpn', 'encryption', 'anonymity'], 
20, 'advanced-privacy-techniques'),

-- Security Awareness Training
('Security Awareness Training Program',
'{
  "introduction": "Design and implement effective security awareness training for organizations",
  "sections": [
    {
      "title": "Training Program Design",
      "content": "Create engaging and effective security training programs tailored to different organizational roles and risk levels."
    },
    {
      "title": "Simulated Phishing Campaigns",
      "content": "Implement and manage simulated phishing campaigns to test and improve employee awareness."
    },
    {
      "title": "Measuring Training Effectiveness",
      "content": "Use metrics and KPIs to measure the success of security awareness programs and identify areas for improvement."
    }
  ],
  "steps": [
    "Conduct security awareness baseline assessment",
    "Identify key security topics relevant to organization",
    "Develop engaging training content and materials",
    "Implement phishing simulation campaigns",
    "Track completion rates and quiz scores",
    "Measure real-world security incident reduction",
    "Continuous improvement based on results"
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Security Awareness' LIMIT 1),
'tutorial', 'intermediate',
ARRAY['training', 'awareness', 'phishing-simulation'], 
16, 'security-awareness-training'),

-- Incident Response
('Cybersecurity Incident Response Plan',
'{
  "introduction": "Develop comprehensive incident response capabilities for cybersecurity threats",
  "sections": [
    {
      "title": "Incident Response Framework",
      "content": "Establish NIST-based incident response framework with clear roles, responsibilities, and escalation procedures."
    },
    {
      "title": "Digital Forensics Basics",
      "content": "Learn fundamental digital forensics techniques for evidence collection and analysis during security incidents."
    },
    {
      "title": "Recovery and Lessons Learned",
      "content": "Implement effective recovery procedures and conduct post-incident reviews to improve future response."
    }
  ],
  "checklist": [
    "Establish incident response team with defined roles",
    "Create incident classification and severity levels", 
    "Develop communication plans and templates",
    "Implement logging and monitoring capabilities",
    "Regular incident response drills and tabletop exercises",
    "Legal and regulatory compliance considerations",
    "Vendor and third-party incident procedures"
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Incident Response' LIMIT 1),
'article', 'advanced',
ARRAY['incident-response', 'forensics', 'recovery'], 
22, 'incident-response-plan');