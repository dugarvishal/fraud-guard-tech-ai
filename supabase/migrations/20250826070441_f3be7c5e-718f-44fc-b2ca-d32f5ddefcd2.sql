-- Insert comprehensive educational content across all 6 categories with 3 difficulty levels

-- Data Protection Category Content
INSERT INTO educational_content (title, slug, content, category_id, content_type, difficulty_level, estimated_reading_time, tags) VALUES
-- Beginner Level
('Personal Data Protection Fundamentals', 'personal-data-protection-fundamentals', 
'{
  "introduction": "Understanding what personal data is and why protecting it matters in our digital world.",
  "sections": [
    {
      "title": "What is Personal Data?",
      "content": "Personal data includes any information that can identify you: name, email, phone number, location data, browsing history, and even your shopping preferences. Think of it as your digital fingerprint."
    },
    {
      "title": "Why Protection Matters",
      "content": "Unprotected personal data can lead to identity theft, financial fraud, privacy violations, and unwanted targeting by advertisers or malicious actors."
    },
    {
      "title": "Basic Protection Principles",
      "content": "Share minimally (only what''s necessary), review privacy settings regularly, use strong passwords, and be cautious about public Wi-Fi usage."
    }
  ],
  "quiz": [
    {
      "question": "Which of these is considered personal data?",
      "options": ["Your favorite color", "Your email address", "The weather", "Your pet''s name"],
      "correct": 1,
      "explanation": "Your email address can be used to identify you personally, making it personal data."
    }
  ],
  "checklist": [
    "Review privacy settings on social media accounts",
    "Use different passwords for different accounts",
    "Think before sharing personal information online",
    "Check what data apps collect before installing"
  ]
}', 
(SELECT id FROM educational_categories WHERE name = 'Data Protection'), 'article', 'beginner', 8, 
ARRAY['privacy', 'personal-data', 'basics', 'protection']),

('Secure File Sharing Tutorial', 'secure-file-sharing-tutorial',
'{
  "introduction": "Learn safe methods to share files without exposing sensitive information.",
  "sections": [
    {
      "title": "Choose Secure Platforms",
      "content": "Use encrypted services like Signal, ProtonDrive, or secure enterprise solutions instead of regular email attachments."
    },
    {
      "title": "Password Protection",
      "content": "Always password-protect sensitive documents before sharing. Use strong, unique passwords."
    },
    {
      "title": "Expiration Dates",
      "content": "Set expiration dates on shared links to limit access timeframes."
    }
  ],
  "steps": [
    "Choose an encrypted file sharing service",
    "Upload your file to the secure platform",
    "Set a strong password for the file",
    "Set an expiration date for the share link",
    "Share the link and password separately",
    "Verify the recipient received the file",
    "Delete the file from the platform when no longer needed"
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Data Protection'), 'tutorial', 'beginner', 10,
ARRAY['file-sharing', 'encryption', 'security', 'tutorial']),

('Daily Privacy Protection Checklist', 'daily-privacy-protection-checklist',
'{
  "introduction": "Essential daily habits to protect your personal information.",
  "checklist": [
    {
      "item": "Check privacy settings on new apps before using",
      "description": "Review what data the app collects and adjust permissions accordingly"
    },
    {
      "item": "Use private browsing for sensitive searches",
      "description": "Enable incognito/private mode when researching personal topics"
    },
    {
      "item": "Log out of accounts on shared devices",
      "description": "Always sign out completely from public or shared computers"
    },
    {
      "item": "Review recent account activity",
      "description": "Check login history on important accounts for suspicious activity"
    },
    {
      "item": "Update passwords regularly",
      "description": "Change passwords every 3-6 months, especially for financial accounts"
    }
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Data Protection'), 'checklist', 'beginner', 5,
ARRAY['daily-habits', 'privacy', 'checklist', 'protection']),

-- Intermediate Level Data Protection
('GDPR and Your Digital Rights', 'gdpr-digital-rights',
'{
  "introduction": "Understanding the General Data Protection Regulation and how it empowers you to control your personal data.",
  "sections": [
    {
      "title": "Key GDPR Rights",
      "content": "Right to access your data, right to rectification (correction), right to erasure (deletion), right to data portability, and right to object to processing."
    },
    {
      "title": "How to Exercise Your Rights",
      "content": "Contact organizations directly, submit formal requests in writing, specify which rights you''re exercising, and set reasonable deadlines for response."
    },
    {
      "title": "When Companies Must Comply",
      "content": "Organizations must respond within 30 days, provide clear explanations, and cannot charge fees for most requests."
    }
  ],
  "quiz": [
    {
      "question": "How long do companies have to respond to GDPR requests?",
      "options": ["7 days", "14 days", "30 days", "60 days"],
      "correct": 2,
      "explanation": "Under GDPR, organizations must respond to requests within 30 days (extendable to 60 days in complex cases)."
    }
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Data Protection'), 'article', 'intermediate', 12,
ARRAY['gdpr', 'rights', 'privacy-law', 'data-protection']),

-- Advanced Level Data Protection
('Enterprise Data Governance Framework', 'enterprise-data-governance',
'{
  "introduction": "Implementing comprehensive data governance strategies for organizations.",
  "sections": [
    {
      "title": "Data Classification Systems",
      "content": "Establish clear categories: Public, Internal, Confidential, and Restricted data with specific handling requirements for each level."
    },
    {
      "title": "Access Control Matrices",
      "content": "Define role-based access controls, implement principle of least privilege, and regularly audit access permissions."
    },
    {
      "title": "Data Lifecycle Management",
      "content": "Create policies for data collection, processing, storage, retention, and secure disposal across all organizational systems."
    }
  ],
  "case_study": {
    "title": "Healthcare Data Breach Prevention",
    "scenario": "A hospital implements comprehensive data governance after a near-miss incident",
    "outcome": "95% reduction in data exposure incidents through systematic governance implementation"
  }
}',
(SELECT id FROM educational_categories WHERE name = 'Data Protection'), 'article', 'advanced', 20,
ARRAY['enterprise', 'governance', 'compliance', 'data-lifecycle']);

-- Fake Apps Category Content
INSERT INTO educational_content (title, slug, content, category_id, content_type, difficulty_level, estimated_reading_time, tags) VALUES
-- Beginner Level
('App Store Safety Basics', 'app-store-safety-basics',
'{
  "introduction": "Learn how to safely download and verify mobile applications from official stores.",
  "sections": [
    {
      "title": "Official Store vs Third-Party",
      "content": "Always download from Google Play Store or Apple App Store. Avoid third-party app stores which may host malicious software."
    },
    {
      "title": "Reading App Reviews",
      "content": "Check recent reviews, look for patterns in complaints, and be suspicious of apps with only 5-star reviews or very few reviews."
    },
    {
      "title": "Developer Verification",
      "content": "Check the developer name, look for verified badges, and research the company behind the app."
    }
  ],
  "quiz": [
    {
      "question": "What''s the safest place to download mobile apps?",
      "options": ["Third-party websites", "Official app stores", "Email attachments", "Social media links"],
      "correct": 1,
      "explanation": "Official app stores like Google Play and Apple App Store have security screening processes."
    }
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Fake Apps'), 'article', 'beginner', 6,
ARRAY['app-store', 'mobile-security', 'verification', 'basics']),

('Verifying App Authenticity Tutorial', 'verifying-app-authenticity',
'{
  "introduction": "Step-by-step guide to verify if an app is legitimate before installation.",
  "steps": [
    "Search for the app in the official store",
    "Check the developer name and website",
    "Read recent user reviews carefully",
    "Verify the app permissions make sense",
    "Look up the app online for news or warnings",
    "Check the app''s update history",
    "Compare download numbers with similar apps",
    "Install only if everything checks out"
  ],
  "warning_signs": [
    "Developer name doesn''t match official company",
    "Excessive permissions requested",
    "Poor grammar in app description",
    "Very few downloads but claims to be popular",
    "Recent negative reviews about security"
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Fake Apps'), 'tutorial', 'beginner', 8,
ARRAY['verification', 'authenticity', 'mobile-apps', 'security']),

('Safe App Installation Checklist', 'safe-app-installation-checklist',
'{
  "introduction": "Essential checks before installing any mobile application.",
  "checklist": [
    {
      "item": "Verify app is from official store",
      "description": "Only download from Google Play Store or Apple App Store"
    },
    {
      "item": "Research the developer",
      "description": "Check if the developer is legitimate and has other apps"
    },
    {
      "item": "Read recent reviews",
      "description": "Focus on reviews from the last 30 days for current issues"
    },
    {
      "item": "Check permissions requested",
      "description": "Ensure permissions match the app''s stated functionality"
    },
    {
      "item": "Look for security warnings",
      "description": "Search online for any security alerts about the app"
    },
    {
      "item": "Verify app authenticity",
      "description": "Confirm this is the official app from the intended company"
    }
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Fake Apps'), 'checklist', 'beginner', 4,
ARRAY['installation', 'safety', 'mobile-security', 'checklist']);

-- Financial Fraud Category Content  
INSERT INTO educational_content (title, slug, content, category_id, content_type, difficulty_level, estimated_reading_time, tags) VALUES
-- Beginner Level
('Online Banking Safety Fundamentals', 'online-banking-safety',
'{
  "introduction": "Essential practices to protect yourself while banking online and using financial apps.",
  "sections": [
    {
      "title": "Secure Connection Basics",
      "content": "Always look for https:// and the padlock icon. Never access your bank account from public Wi-Fi or shared computers."
    },
    {
      "title": "Recognizing Fake Banking Sites",
      "content": "Bookmark your bank''s official website. Check the URL carefully - scammers use similar-looking domains like ''arnazonbank.com'' instead of ''amazon-bank.com''."
    },
    {
      "title": "Safe Banking Habits",
      "content": "Log out completely after each session, never save passwords on shared devices, and regularly monitor your account statements."
    }
  ],
  "quiz": [
    {
      "question": "What should you look for to ensure a banking website is secure?",
      "options": ["http:// in the URL", "https:// and padlock icon", "Lots of ads", "Social media links"],
      "correct": 1,
      "explanation": "HTTPS and the padlock icon indicate an encrypted, secure connection necessary for financial transactions."
    }
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Financial Fraud'), 'article', 'beginner', 7,
ARRAY['online-banking', 'financial-security', 'fraud-prevention', 'basics']),

('Secure Online Shopping Tutorial', 'secure-online-shopping',
'{
  "introduction": "Protect yourself while shopping online with these security practices.",
  "steps": [
    "Shop only on reputable websites with https:// encryption",
    "Use secure payment methods (credit cards, PayPal, not debit cards)",
    "Create unique passwords for shopping accounts",
    "Check seller reviews and ratings thoroughly",
    "Verify contact information and return policies",
    "Use secure networks (avoid public Wi-Fi for purchases)",
    "Monitor credit card statements regularly",
    "Keep receipts and confirmation emails"
  ],
  "red_flags": [
    "Prices that seem too good to be true",
    "No contact information or customer service",
    "Poor website design or broken English",
    "Requests for unusual payment methods",
    "No secure payment options available"
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Financial Fraud'), 'tutorial', 'beginner', 9,
ARRAY['online-shopping', 'e-commerce', 'payment-security', 'fraud-prevention']),

('Payment Security Basics Checklist', 'payment-security-basics',
'{
  "introduction": "Daily practices to keep your financial information secure.",
  "checklist": [
    {
      "item": "Use credit cards over debit cards online",
      "description": "Credit cards offer better fraud protection and dispute processes"
    },
    {
      "item": "Enable transaction alerts",
      "description": "Set up SMS or email alerts for all card transactions"
    },
    {
      "item": "Check statements weekly",
      "description": "Review all transactions for unauthorized charges"
    },
    {
      "item": "Use unique passwords for financial accounts",
      "description": "Never reuse banking passwords on other websites"
    },
    {
      "item": "Enable two-factor authentication",
      "description": "Add extra security layer to all financial accounts"
    },
    {
      "item": "Keep software updated",
      "description": "Update banking apps and browsers regularly for security patches"
    }
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Financial Fraud'), 'checklist', 'beginner', 5,
ARRAY['payment-security', 'financial-protection', 'fraud-prevention', 'daily-habits']);

-- Privacy & Security Category Content
INSERT INTO educational_content (title, slug, content, category_id, content_type, difficulty_level, estimated_reading_time, tags) VALUES
-- Beginner Level  
('Password Security Fundamentals', 'password-security-fundamentals',
'{
  "introduction": "Creating and managing strong passwords to protect your digital accounts.",
  "sections": [
    {
      "title": "What Makes a Strong Password",
      "content": "Use at least 12 characters, mix uppercase and lowercase letters, numbers, and symbols. Avoid dictionary words, personal information, and common patterns."
    },
    {
      "title": "Password Managers",
      "content": "Use tools like Bitwarden, 1Password, or LastPass to generate and store unique passwords for every account. You only need to remember one master password."
    },
    {
      "title": "Common Password Mistakes",
      "content": "Don''t reuse passwords across multiple sites, don''t write them down in plain text, and don''t share them via email or messages."
    }
  ],
  "quiz": [
    {
      "question": "What''s the minimum recommended length for a strong password?",
      "options": ["6 characters", "8 characters", "10 characters", "12 characters"],
      "correct": 3,
      "explanation": "12 characters is the current minimum recommendation for strong password security."
    }
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Privacy and Security'), 'article', 'beginner', 8,
ARRAY['passwords', 'authentication', 'security-basics', 'access-control']),

('Setting Up Two-Factor Authentication', 'setting-up-2fa',
'{
  "introduction": "Add an extra layer of security to your accounts with two-factor authentication.",
  "steps": [
    "Choose an authenticator app (Google Authenticator, Authy, Microsoft Authenticator)",
    "Log into the account you want to secure",
    "Navigate to security or privacy settings",
    "Look for ''Two-Factor Authentication'' or ''2FA'' option",
    "Select ''Authenticator App'' as your method",
    "Scan the QR code with your authenticator app",
    "Enter the 6-digit code from your app to verify",
    "Save backup codes in a secure location",
    "Test the setup by logging out and back in"
  ],
  "tips": [
    "Enable 2FA on your most important accounts first (email, banking, social media)",
    "Use an authenticator app rather than SMS when possible",
    "Keep backup codes in a safe place separate from your phone",
    "Consider using multiple devices for backup access"
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Privacy and Security'), 'tutorial', 'beginner', 10,
ARRAY['2fa', 'authentication', 'account-security', 'setup-guide']),

('Personal Security Hygiene Checklist', 'personal-security-hygiene',
'{
  "introduction": "Daily and weekly security practices to maintain your digital safety.",
  "checklist": [
    {
      "item": "Use unique passwords for each account",
      "description": "Never reuse passwords across multiple websites or services"
    },
    {
      "item": "Enable 2FA on important accounts",
      "description": "Add two-factor authentication to email, banking, and social media"
    },
    {
      "item": "Keep software updated",
      "description": "Install security updates for your operating system and apps"
    },
    {
      "item": "Use secure networks",
      "description": "Avoid public Wi-Fi for sensitive activities like banking"
    },
    {
      "item": "Regular security checkups",
      "description": "Review account activity and privacy settings monthly"
    },
    {
      "item": "Backup important data",
      "description": "Maintain secure backups of critical files and documents"
    }
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Privacy and Security'), 'checklist', 'beginner', 6,
ARRAY['security-hygiene', 'daily-habits', 'personal-security', 'best-practices']);

-- Social Engineering Category Content
INSERT INTO educational_content (title, slug, content, category_id, content_type, difficulty_level, estimated_reading_time, tags) VALUES
-- Beginner Level
('Understanding Manipulation Tactics', 'understanding-manipulation-tactics',
'{
  "introduction": "Recognize how social engineers exploit human psychology to gain unauthorized access to information.",
  "sections": [
    {
      "title": "Common Psychological Triggers",
      "content": "Urgency (''act now''), authority (''your boss needs this''), fear (''your account will be closed''), and curiosity (''you won''t believe this'') are frequently exploited."
    },
    {
      "title": "Trust Exploitation",
      "content": "Attackers build rapport, claim mutual connections, or impersonate trusted figures to lower your guard and extract information."
    },
    {
      "title": "Information Gathering",
      "content": "Social engineers collect personal details from social media, public records, and previous interactions to make their approaches more convincing."
    }
  ],
  "quiz": [
    {
      "question": "Which psychological trigger is most commonly used in social engineering?",
      "options": ["Humor", "Urgency", "Confusion", "Boredom"],
      "correct": 1,
      "explanation": "Urgency creates pressure to act quickly without thinking, making people more likely to comply with requests."
    }
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Social Engineering'), 'article', 'beginner', 9,
ARRAY['social-engineering', 'psychology', 'manipulation', 'awareness']),

('Recognizing Social Engineering Attempts', 'recognizing-social-engineering',
'{
  "introduction": "Learn to identify social engineering attacks before they succeed.",
  "steps": [
    "Pause and think when feeling pressured to act quickly",
    "Verify the identity of anyone requesting sensitive information",
    "Question requests that seem unusual or urgent",
    "Check with colleagues or supervisors before sharing company information",
    "Verify contact information through official channels",
    "Trust your instincts if something feels wrong",
    "Document suspicious contact attempts",
    "Report potential social engineering to security teams"
  ],
  "warning_signs": [
    "Urgent requests for sensitive information",
    "Claims of authority without proper verification",
    "Requests to bypass normal security procedures",
    "Emotional manipulation (guilt, fear, excitement)",
    "Unsolicited contact with personal questions"
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Social Engineering'), 'tutorial', 'beginner', 11,
ARRAY['recognition', 'social-engineering', 'defense', 'awareness']),

('Daily Social Engineering Awareness', 'daily-social-engineering-awareness',
'{
  "introduction": "Simple daily practices to protect yourself from social engineering attacks.",
  "checklist": [
    {
      "item": "Verify unexpected contact attempts",
      "description": "Confirm identity through official channels before sharing information"
    },
    {
      "item": "Question urgent requests",
      "description": "Take time to think when pressured to act immediately"
    },
    {
      "item": "Protect personal information",
      "description": "Be mindful of what you share on social media and in conversations"
    },
    {
      "item": "Trust your instincts",
      "description": "If something feels wrong, it probably is - investigate further"
    },
    {
      "item": "Stay informed about current scams",
      "description": "Keep up with new social engineering tactics and trends"
    },
    {
      "item": "Practice saying no",
      "description": "It''s okay to refuse requests for information, even from authority figures"
    }
  ]
}',
(SELECT id FROM educational_categories WHERE name = 'Social Engineering'), 'checklist', 'beginner', 5,
ARRAY['daily-habits', 'awareness', 'social-engineering', 'prevention']);

-- Expand Chatbot Knowledge Base with comprehensive security information
INSERT INTO chatbot_knowledge (question, answer, intent, category, keywords, confidence_threshold) VALUES
-- Data Protection Q&A
('What is personal data?', 'Personal data is any information that can be used to identify you as an individual. This includes obvious things like your name, email address, phone number, and address, but also less obvious data like your IP address, device identifiers, location data, browsing history, purchase history, and even your preferences and behaviors online. Think of it as your digital fingerprint - any piece of information that could be used to single you out from a crowd.', 'data_protection_basics', 'Data Protection', ARRAY['personal data', 'PII', 'information', 'privacy'], 0.7),

('How can I protect my personal data?', 'Protect your personal data by: 1) Sharing only what''s necessary - ask yourself if you really need to provide that information. 2) Review privacy settings regularly on all your accounts and apps. 3) Use strong, unique passwords with a password manager. 4) Enable two-factor authentication on important accounts. 5) Be cautious on public Wi-Fi - avoid accessing sensitive accounts. 6) Keep your software updated with the latest security patches. 7) Read privacy policies before agreeing to them. 8) Use privacy-focused browsers and search engines when possible.', 'data_protection_methods', 'Data Protection', ARRAY['protect data', 'privacy settings', 'data security'], 0.7),

('What are my rights under GDPR?', 'Under GDPR, you have several important rights: 1) Right to access - see what data organizations have about you. 2) Right to rectification - correct inaccurate information. 3) Right to erasure - request deletion of your data. 4) Right to restrict processing - limit how your data is used. 5) Right to data portability - get your data in a usable format. 6) Right to object - stop certain types of data processing. 7) Right to withdraw consent - change your mind about data sharing. Organizations must respond to your requests within 30 days.', 'gdpr_rights', 'Data Protection', ARRAY['GDPR', 'rights', 'privacy law', 'data protection'], 0.8),

-- Fake Apps Q&A  
('How can I tell if an app is fake?', 'Warning signs of fake apps include: 1) Downloaded from unofficial sources (not Google Play or App Store). 2) Developer name doesn''t match the official company. 3) Poor grammar or spelling in the description. 4) Excessive permissions that don''t match the app''s purpose. 5) Very few downloads despite claiming to be popular. 6) Mostly negative recent reviews mentioning security issues. 7) No contact information or support options. 8) Requests for unusual permissions like SMS access for a calculator app. Always verify apps through official channels before installing.', 'fake_app_detection', 'Fake Apps', ARRAY['fake apps', 'malicious apps', 'app security', 'mobile security'], 0.8),

('What should I check before installing an app?', 'Before installing any app: 1) Verify it''s from the official app store (Google Play or Apple App Store). 2) Check the developer name matches the official company. 3) Read recent reviews, especially negative ones. 4) Review permissions requested - they should match the app''s functionality. 5) Look up the app online for any security warnings. 6) Check the app''s update history for regular maintenance. 7) Compare download numbers with similar legitimate apps. 8) Verify the app''s website and contact information. If anything seems suspicious, don''t install it.', 'app_installation_safety', 'Fake Apps', ARRAY['app installation', 'mobile security', 'app verification'], 0.7),

-- Financial Fraud Q&A
('How can I protect myself from online banking fraud?', 'Protect yourself while banking online by: 1) Only access your bank through their official website or app - bookmark the correct URL. 2) Always look for https:// and the padlock icon. 3) Never bank on public Wi-Fi or shared computers. 4) Log out completely after each session. 5) Set up account alerts for all transactions. 6) Use strong, unique passwords with two-factor authentication. 7) Check statements regularly for unauthorized charges. 8) Keep your devices and browsers updated. 9) Never click banking links in emails - type the URL directly. 10) Contact your bank immediately if you notice anything suspicious.', 'online_banking_security', 'Financial Fraud', ARRAY['online banking', 'banking security', 'financial fraud'], 0.8),

('What are signs of financial fraud?', 'Warning signs of financial fraud include: 1) Unexpected charges on your statements. 2) Bills for accounts you didn''t open. 3) Missing bills or statements (mail theft). 4) Denied credit for unknown reasons. 5) Calls about debts you don''t owe. 6) Unfamiliar accounts on your credit report. 7) IRS notices about unreported income. 8) Medical bills for services you didn''t receive. 9) Urgent requests for personal or financial information. 10) Investment opportunities that seem too good to be true. If you notice any of these, check your accounts immediately and contact your financial institutions.', 'fraud_warning_signs', 'Financial Fraud', ARRAY['fraud signs', 'financial fraud', 'identity theft'], 0.7),

-- Privacy & Security Q&A
('How do I create a strong password?', 'Create strong passwords by: 1) Using at least 12 characters (longer is better). 2) Mixing uppercase and lowercase letters, numbers, and symbols. 3) Avoiding dictionary words, personal information, and common patterns. 4) Making each password unique for every account. 5) Using a passphrase method - combine unrelated words like ''Coffee$Mountain9Purple''. 6) Using a password manager to generate and store passwords. 7) Avoiding substitutions like ''P@ssw0rd'' which are easily cracked. 8) Never sharing passwords or writing them down in plain text. Remember: length and uniqueness are more important than complexity.', 'strong_passwords', 'Privacy and Security', ARRAY['passwords', 'strong passwords', 'password security'], 0.8),

('What is two-factor authentication and why should I use it?', 'Two-factor authentication (2FA) adds a second layer of security beyond your password. It requires something you know (password) plus something you have (like your phone). Even if someone steals your password, they can''t access your account without the second factor. Use 2FA because: 1) It dramatically reduces the risk of account takeover. 2) It protects against password breaches. 3) Many services now require it for sensitive accounts. 4) It''s usually free and easy to set up. Use authenticator apps rather than SMS when possible, as they''re more secure. Enable 2FA on email, banking, social media, and work accounts first.', 'two_factor_authentication', 'Privacy and Security', ARRAY['2FA', 'two-factor', 'authentication', 'account security'], 0.8),

-- Social Engineering Q&A
('What is social engineering?', 'Social engineering is the practice of manipulating people to divulge confidential information or perform actions that compromise security. Instead of attacking technology directly, social engineers exploit human psychology, trust, and emotions. Common techniques include phishing emails, pretexting (creating fake scenarios), baiting (offering something appealing), quid pro quo (offering a service in exchange for information), and tailgating (following someone into a restricted area). Social engineering works because it exploits natural human tendencies to be helpful, trusting, and responsive to authority.', 'social_engineering_definition', 'Social Engineering', ARRAY['social engineering', 'manipulation', 'human hacking'], 0.8),

('How can I recognize social engineering attempts?', 'Recognize social engineering by watching for: 1) Urgent requests that pressure you to act quickly. 2) Appeals to authority (''your boss needs this immediately''). 3) Requests for sensitive information via unofficial channels. 4) Offers that seem too good to be true. 5) Emotional manipulation using fear, guilt, or excitement. 6) Requests to bypass normal security procedures. 7) Unsolicited contact asking personal questions. 8) Impersonation of trusted individuals or organizations. When in doubt, verify the person''s identity through official channels before sharing any information or taking action.', 'social_engineering_recognition', 'Social Engineering', ARRAY['social engineering', 'manipulation tactics', 'security awareness'], 0.7),

-- Phishing Q&A (expanding existing)
('What should I do if I clicked a phishing link?', 'If you clicked a phishing link: 1) Don''t panic, but act quickly. 2) Disconnect from the internet immediately. 3) Don''t enter any credentials if you haven''t already. 4) If you entered passwords, change them immediately on a clean device. 5) Run a full antivirus scan on your device. 6) Check your accounts for unauthorized activity. 7) Enable 2FA if you haven''t already. 8) Monitor your credit reports for suspicious activity. 9) Report the incident to your IT department if it''s a work device. 10) Consider placing fraud alerts on your financial accounts. The faster you act, the better you can minimize potential damage.', 'phishing_response', 'Phishing Detection', ARRAY['phishing response', 'clicked phishing', 'incident response'], 0.8),

('How can I verify if an email is legitimate?', 'Verify email legitimacy by: 1) Checking the sender''s email address carefully for misspellings or suspicious domains. 2) Hovering over links without clicking to see the actual destination. 3) Looking for personalization - legitimate emails usually address you by name. 4) Checking for poor grammar, spelling errors, or urgent language. 5) Verifying through official channels - call the company directly. 6) Looking for generic greetings like ''Dear Customer'' instead of your name. 7) Being suspicious of unexpected attachments. 8) Checking if the email signature and contact information seem legitimate. When in doubt, don''t click anything and verify through official company channels.', 'email_verification', 'Phishing Detection', ARRAY['email verification', 'legitimate email', 'phishing detection'], 0.7),

-- General Security Q&A
('What should I do if my account gets hacked?', 'If your account is hacked: 1) Change passwords immediately on a clean, secure device. 2) Enable two-factor authentication if not already active. 3) Check and update all security settings. 4) Review recent account activity and report unauthorized actions. 5) Check for any new accounts created with your information. 6) Scan your devices for malware. 7) Notify contacts that your account was compromised. 8) Monitor your credit reports and financial accounts. 9) Document everything for potential law enforcement reports. 10) Consider freezing your credit if financial information was involved. Act quickly to minimize damage and prevent further unauthorized access.', 'account_hacked_response', 'Privacy and Security', ARRAY['hacked account', 'account compromise', 'incident response'], 0.8),

('How often should I update my passwords?', 'Update passwords: 1) Immediately if there''s been a security breach at a service you use. 2) Every 3-6 months for critical accounts (banking, email, work). 3) Annually for less critical accounts. 4) Whenever you suspect they might be compromised. 5) If you''ve shared them with someone who no longer needs access. However, it''s more important to use unique, strong passwords with two-factor authentication than to change weak passwords frequently. Focus on using a password manager to create and maintain unique passwords for every account rather than trying to remember constantly changing passwords.', 'password_update_frequency', 'Privacy and Security', ARRAY['password updates', 'password management', 'security maintenance'], 0.7);