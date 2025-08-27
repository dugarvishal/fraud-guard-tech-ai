// Chrome Extension Content Script
// Monitors page content and provides real-time threat detection

class ContentScriptMonitor {
    constructor() {
        this.isInitialized = false;
        this.observerConfig = {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['href', 'src', 'action']
        };
        this.observer = null;
        this.lastScanTime = 0;
        this.scanThrottle = 2000; // 2 seconds
        
        this.initialize();
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            } else {
                this.setup();
            }

            this.isInitialized = true;
        } catch (error) {
            console.error('Guardian AI content script initialization failed:', error);
        }
    }

    setup() {
        // Perform initial page scan
        this.performPageScan();

        // Set up DOM observer for dynamic content
        this.setupDOMObserver();

        // Monitor form submissions
        this.monitorForms();

        // Monitor link clicks
        this.monitorLinks();

        // Listen for messages from popup/background
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true;
        });

        console.log('Guardian AI content script active on:', window.location.hostname);
    }

    async performPageScan() {
        const now = Date.now();
        if (now - this.lastScanTime < this.scanThrottle) {
            return; // Throttle scans
        }
        this.lastScanTime = now;

        try {
            const pageData = this.extractPageData();
            const analysis = await this.analyzePageContent(pageData);
            
            if (analysis.riskLevel === 'high' || analysis.riskLevel === 'critical') {
                await this.reportThreat(analysis);
            }

        } catch (error) {
            console.error('Page scan failed:', error);
        }
    }

    extractPageData() {
        return {
            url: window.location.href,
            title: document.title,
            content: document.documentElement.outerHTML,
            text: document.body.innerText || document.body.textContent || '',
            forms: this.extractFormData(),
            links: this.extractLinkData(),
            scripts: this.extractScriptData(),
            metadata: this.extractMetadata()
        };
    }

    extractFormData() {
        const forms = Array.from(document.forms);
        return forms.map(form => ({
            action: form.action,
            method: form.method,
            inputs: Array.from(form.elements).map(element => ({
                type: element.type,
                name: element.name,
                required: element.required,
                placeholder: element.placeholder
            }))
        }));
    }

    extractLinkData() {
        const links = Array.from(document.links);
        return links.map(link => ({
            href: link.href,
            text: link.textContent.trim(),
            target: link.target
        })).filter(link => link.href && !link.href.startsWith('javascript:'));
    }

    extractScriptData() {
        const scripts = Array.from(document.scripts);
        return {
            count: scripts.length,
            external: scripts.filter(script => script.src).map(script => script.src),
            hasInline: scripts.some(script => !script.src && script.textContent),
            suspicious: scripts.some(script => 
                script.textContent && /eval\(|document\.write\(|unescape\(/.test(script.textContent)
            )
        };
    }

    extractMetadata() {
        const metaTags = Array.from(document.querySelectorAll('meta'));
        const metadata = {};
        
        metaTags.forEach(meta => {
            const name = meta.name || meta.property;
            const content = meta.content;
            if (name && content) {
                metadata[name] = content;
            }
        });

        return metadata;
    }

    async analyzePageContent(pageData) {
        let riskScore = 0;
        const threats = [];

        // Analyze forms for phishing indicators
        const formAnalysis = this.analyzeForms(pageData.forms);
        riskScore += formAnalysis.riskScore;
        threats.push(...formAnalysis.threats);

        // Analyze text content for scam indicators
        const textAnalysis = this.analyzeText(pageData.text);
        riskScore += textAnalysis.riskScore;
        threats.push(...textAnalysis.threats);

        // Analyze links for suspicious patterns
        const linkAnalysis = this.analyzeLinks(pageData.links);
        riskScore += linkAnalysis.riskScore;
        threats.push(...linkAnalysis.threats);

        // Analyze scripts for malicious patterns
        const scriptAnalysis = this.analyzeScripts(pageData.scripts);
        riskScore += scriptAnalysis.riskScore;
        threats.push(...scriptAnalysis.threats);

        // Determine risk level
        let riskLevel;
        if (riskScore >= 80) riskLevel = 'critical';
        else if (riskScore >= 60) riskLevel = 'high';
        else if (riskScore >= 30) riskLevel = 'medium';
        else riskLevel = 'low';

        return {
            url: pageData.url,
            riskScore: Math.min(100, riskScore),
            riskLevel,
            threats: threats.filter(t => t),
            analysis: {
                forms: formAnalysis,
                text: textAnalysis,
                links: linkAnalysis,
                scripts: scriptAnalysis
            },
            timestamp: new Date()
        };
    }

    analyzeForms(forms) {
        let riskScore = 0;
        const threats = [];

        forms.forEach(form => {
            // Check for suspicious form actions
            if (form.action && !form.action.startsWith(window.location.origin)) {
                riskScore += 20;
                threats.push('Form submits to external domain');
            }

            // Check for password fields on non-HTTPS
            const hasPasswordField = form.inputs.some(input => input.type === 'password');
            if (hasPasswordField && window.location.protocol !== 'https:') {
                riskScore += 30;
                threats.push('Password field on insecure connection');
            }

            // Check for suspicious input patterns
            const sensitiveInputs = form.inputs.filter(input => 
                ['password', 'email', 'tel', 'number'].includes(input.type) ||
                /ssn|social|credit|card|account|bank/i.test(input.name || input.placeholder || '')
            );

            if (sensitiveInputs.length > 3) {
                riskScore += 25;
                threats.push('Form requests multiple sensitive information types');
            }

            // Check for hidden inputs
            const hiddenInputs = form.inputs.filter(input => input.type === 'hidden');
            if (hiddenInputs.length > 5) {
                riskScore += 15;
                threats.push('Form contains many hidden fields');
            }
        });

        return { riskScore, threats };
    }

    analyzeText(text) {
        let riskScore = 0;
        const threats = [];

        if (!text) return { riskScore, threats };

        const textLower = text.toLowerCase();

        // Check for phishing keywords
        const phishingKeywords = [
            'verify account', 'suspended', 'click here', 'urgent', 'immediate',
            'winner', 'congratulations', 'claim prize', 'act now', 'limited time',
            'confirm identity', 'update payment', 'security alert', 'locked account'
        ];

        let keywordCount = 0;
        phishingKeywords.forEach(keyword => {
            if (textLower.includes(keyword)) {
                keywordCount++;
            }
        });

        if (keywordCount > 0) {
            riskScore += keywordCount * 8;
            threats.push(`Contains ${keywordCount} phishing keywords`);
        }

        // Check for urgency language
        const urgencyPatterns = [
            /within \d+ (hours?|minutes?|days?)/gi,
            /expires? (today|tomorrow|soon)/gi,
            /final (notice|warning)/gi,
            /immediate(ly)? (action|response) required/gi
        ];

        let urgencyCount = 0;
        urgencyPatterns.forEach(pattern => {
            if (pattern.test(text)) {
                urgencyCount++;
            }
        });

        if (urgencyCount > 0) {
            riskScore += urgencyCount * 15;
            threats.push('Uses high-pressure/urgency tactics');
        }

        // Check for financial/personal info requests
        const sensitiveRequests = [
            /enter.*(credit card|bank account|ssn|social security)/gi,
            /provide.*(payment|financial|banking) (information|details)/gi,
            /verify.*(account|payment) (information|details)/gi
        ];

        let sensitiveCount = 0;
        sensitiveRequests.forEach(pattern => {
            if (pattern.test(text)) {
                sensitiveCount++;
            }
        });

        if (sensitiveCount > 0) {
            riskScore += sensitiveCount * 20;
            threats.push('Requests sensitive financial information');
        }

        return { riskScore, threats };
    }

    analyzeLinks(links) {
        let riskScore = 0;
        const threats = [];

        if (!links || links.length === 0) return { riskScore, threats };

        // Check for suspicious external links
        const currentDomain = window.location.hostname;
        const externalLinks = links.filter(link => {
            try {
                const linkDomain = new URL(link.href).hostname;
                return linkDomain !== currentDomain;
            } catch {
                return false;
            }
        });

        if (externalLinks.length > links.length * 0.7) {
            riskScore += 20;
            threats.push('High ratio of external links');
        }

        // Check for URL shorteners
        const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'short.link', 'ow.ly'];
        const shortenerLinks = links.filter(link => 
            shorteners.some(shortener => link.href.includes(shortener))
        );

        if (shortenerLinks.length > 0) {
            riskScore += 15;
            threats.push('Contains URL shortener links');
        }

        // Check for suspicious link text vs URL mismatch
        const suspiciousLinks = links.filter(link => {
            if (!link.text) return false;
            
            try {
                const linkDomain = new URL(link.href).hostname;
                const textLower = link.text.toLowerCase();
                
                // Check if text mentions a different domain
                const mentionedDomains = textLower.match(/[a-z0-9-]+\.[a-z]{2,}/g) || [];
                return mentionedDomains.some(domain => 
                    domain !== linkDomain && !linkDomain.includes(domain)
                );
            } catch {
                return false;
            }
        });

        if (suspiciousLinks.length > 0) {
            riskScore += 25;
            threats.push('Links with mismatched text and destination');
        }

        return { riskScore, threats };
    }

    analyzeScripts(scriptData) {
        let riskScore = 0;
        const threats = [];

        if (!scriptData) return { riskScore, threats };

        // Check for suspicious script patterns
        if (scriptData.suspicious) {
            riskScore += 30;
            threats.push('Contains obfuscated JavaScript');
        }

        // Check for excessive external scripts
        if (scriptData.external.length > 10) {
            riskScore += 15;
            threats.push('Loads many external scripts');
        }

        // Check for scripts from suspicious domains
        const suspiciousDomains = ['bit.ly', 'tinyurl.com', 'dropbox.com/s/', 'pastebin.com'];
        const suspiciousScripts = scriptData.external.filter(src =>
            suspiciousDomains.some(domain => src.includes(domain))
        );

        if (suspiciousScripts.length > 0) {
            riskScore += 25;
            threats.push('Loads scripts from suspicious sources');
        }

        return { riskScore, threats };
    }

    setupDOMObserver() {
        this.observer = new MutationObserver((mutations) => {
            // Check if significant changes occurred
            const significantChanges = mutations.some(mutation => 
                mutation.type === 'childList' && mutation.addedNodes.length > 0
            );

            if (significantChanges) {
                // Debounced re-scan
                this.debouncedScan();
            }
        });

        this.observer.observe(document.body, this.observerConfig);
    }

    debouncedScan = this.debounce(() => {
        this.performPageScan();
    }, 1000);

    monitorForms() {
        document.addEventListener('submit', async (event) => {
            const form = event.target;
            if (form.tagName === 'FORM') {
                const formAnalysis = await this.analyzeFormSubmission(form);
                
                if (formAnalysis.riskLevel === 'high' || formAnalysis.riskLevel === 'critical') {
                    if (confirm('Guardian AI Warning: This form submission appears risky. Are you sure you want to continue?')) {
                        // User chose to continue
                    } else {
                        event.preventDefault();
                    }
                }
            }
        });
    }

    monitorLinks() {
        document.addEventListener('click', async (event) => {
            const link = event.target.closest('a');
            if (link && link.href) {
                const linkAnalysis = await this.analyzeLinkClick(link);
                
                if (linkAnalysis.riskLevel === 'high' || linkAnalysis.riskLevel === 'critical') {
                    if (confirm(`Guardian AI Warning: This link (${link.href}) appears dangerous. Are you sure you want to continue?`)) {
                        // User chose to continue
                    } else {
                        event.preventDefault();
                    }
                }
            }
        });
    }

    async analyzeFormSubmission(form) {
        // Quick analysis of form being submitted
        const formData = {
            action: form.action,
            method: form.method,
            inputs: Array.from(form.elements).map(el => ({
                type: el.type,
                name: el.name,
                value: el.type === 'password' ? '[HIDDEN]' : el.value?.substring(0, 50)
            }))
        };

        return this.analyzeForms([formData]);
    }

    async analyzeLinkClick(link) {
        try {
            const linkUrl = new URL(link.href);
            const currentDomain = window.location.hostname;
            
            let riskScore = 0;
            const threats = [];

            // Check if external link
            if (linkUrl.hostname !== currentDomain) {
                riskScore += 10;
            }

            // Check for suspicious patterns
            if (/\d+\.\d+\.\d+\.\d+/.test(linkUrl.hostname)) {
                riskScore += 30;
                threats.push('Link uses IP address');
            }

            // Check for suspicious TLDs
            const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf'];
            if (suspiciousTLDs.some(tld => linkUrl.hostname.endsWith(tld))) {
                riskScore += 25;
                threats.push('Suspicious domain extension');
            }

            let riskLevel;
            if (riskScore >= 60) riskLevel = 'critical';
            else if (riskScore >= 40) riskLevel = 'high';
            else if (riskScore >= 20) riskLevel = 'medium';
            else riskLevel = 'low';

            return { riskScore, riskLevel, threats };

        } catch (error) {
            return { riskScore: 20, riskLevel: 'medium', threats: ['Malformed URL'] };
        }
    }

    async reportThreat(analysis) {
        try {
            // Send threat information to background script
            await chrome.runtime.sendMessage({
                type: 'threat_detected',
                analysis
            });
        } catch (error) {
            console.error('Failed to report threat:', error);
        }
    }

    handleMessage(message, sender, sendResponse) {
        switch (message.type) {
            case 'get_page_data':
                const pageData = this.extractPageData();
                sendResponse({ success: true, data: pageData });
                break;

            case 'perform_scan':
                this.performPageScan().then(() => {
                    sendResponse({ success: true });
                }).catch(error => {
                    sendResponse({ success: false, error: error.message });
                });
                break;

            default:
                sendResponse({ success: false, error: 'Unknown message type' });
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Cleanup method
    cleanup() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Initialize content script
const contentMonitor = new ContentScriptMonitor();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    contentMonitor.cleanup();
});