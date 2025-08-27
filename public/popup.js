// Chrome Extension Popup Script
// Handles the popup interface for real-time website scanning

class PopupController {
    constructor() {
        this.currentTab = null;
        this.scanResults = null;
        this.initialize();
    }

    async initialize() {
        await this.getCurrentTab();
        this.setupEventListeners();
        this.updateUI();
    }

    async getCurrentTab() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            this.currentTab = tab;
        } catch (error) {
            console.error('Failed to get current tab:', error);
        }
    }

    setupEventListeners() {
        const scanButton = document.getElementById('scanButton');
        const viewDetailsButton = document.getElementById('viewDetailsButton');
        const reportButton = document.getElementById('reportButton');
        const whitelistButton = document.getElementById('whitelistButton');

        scanButton.addEventListener('click', () => this.performScan());
        viewDetailsButton.addEventListener('click', () => this.viewDetails());
        reportButton.addEventListener('click', () => this.reportFalsePositive());
        whitelistButton.addEventListener('click', () => this.addToWhitelist());
    }

    updateUI() {
        const currentUrlElement = document.getElementById('currentUrl');
        
        if (this.currentTab && this.currentTab.url) {
            try {
                const url = new URL(this.currentTab.url);
                currentUrlElement.textContent = url.hostname;
            } catch (error) {
                currentUrlElement.textContent = 'Invalid URL';
            }
        } else {
            currentUrlElement.textContent = 'No active tab';
        }
    }

    async performScan() {
        if (!this.currentTab || !this.currentTab.url) {
            this.showError('No valid URL to scan');
            return;
        }

        this.showScanningState();

        try {
            // Get page content from content script
            const pageContent = await this.getPageContent();
            
            // Perform comprehensive scan
            const scanResults = await this.scanURL(this.currentTab.url, pageContent);
            
            this.scanResults = scanResults;
            this.showResults(scanResults);
            
            // Store scan history
            await this.storeScanHistory(scanResults);
            
        } catch (error) {
            console.error('Scan failed:', error);
            this.showError('Scan failed. Please try again.');
        }
    }

    async getPageContent() {
        try {
            const [result] = await chrome.scripting.executeScript({
                target: { tabId: this.currentTab.id },
                function: () => {
                    return {
                        content: document.documentElement.outerHTML,
                        title: document.title,
                        text: document.body.innerText || document.body.textContent || '',
                        links: Array.from(document.links).map(link => link.href),
                        forms: Array.from(document.forms).length,
                        scripts: Array.from(document.scripts).length
                    };
                }
            });
            
            return result.result;
        } catch (error) {
            console.error('Failed to get page content:', error);
            return null;
        }
    }

    async scanURL(url, pageContent) {
        // This would integrate with the main analysis engine
        // For now, we'll simulate the analysis with realistic patterns
        
        const domain = new URL(url).hostname;
        let riskScore = 0;
        const threats = [];
        const analysis = {};

        // Domain analysis
        if (await this.isDomainSuspicious(domain)) {
            riskScore += 30;
            threats.push('Suspicious domain characteristics');
        }

        // Content analysis
        if (pageContent && pageContent.content) {
            const contentAnalysis = this.analyzeContent(pageContent.content, pageContent.text);
            riskScore += contentAnalysis.riskScore;
            threats.push(...contentAnalysis.threats);
            analysis.content = contentAnalysis;
        }

        // URL structure analysis
        const urlAnalysis = this.analyzeURLStructure(url);
        riskScore += urlAnalysis.riskScore;
        threats.push(...urlAnalysis.threats);

        // Check against threat intelligence
        const threatIntelAnalysis = await this.checkThreatIntelligence(domain);
        riskScore += threatIntelAnalysis.riskScore;
        threats.push(...threatIntelAnalysis.threats);

        // Determine risk level
        let riskLevel;
        if (riskScore >= 80) riskLevel = 'critical';
        else if (riskScore >= 60) riskLevel = 'high';
        else if (riskScore >= 30) riskLevel = 'medium';
        else riskLevel = 'low';

        return {
            url,
            domain,
            riskScore: Math.min(100, riskScore),
            riskLevel,
            threats: threats.filter(t => t), // Remove empty threats
            timestamp: new Date(),
            analysis
        };
    }

    async isDomainSuspicious(domain) {
        // Check for suspicious TLDs
        const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.click', '.download'];
        if (suspiciousTLDs.some(tld => domain.endsWith(tld))) {
            return true;
        }

        // Check for suspicious patterns
        const suspiciousPatterns = [
            /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, // IP addresses
            /[0-9]{5,}/, // Long numbers in domain
            /-{2,}/, // Multiple hyphens
            /[a-z]{20,}/, // Very long words
        ];

        return suspiciousPatterns.some(pattern => pattern.test(domain));
    }

    analyzeContent(htmlContent, textContent) {
        let riskScore = 0;
        const threats = [];

        // Check for phishing keywords
        const phishingKeywords = [
            'verify account', 'suspended', 'click here', 'urgent',
            'winner', 'congratulations', 'claim prize', 'act now',
            'limited time', 'confirm identity', 'update payment'
        ];

        const textLower = textContent.toLowerCase();
        let keywordCount = 0;
        phishingKeywords.forEach(keyword => {
            if (textLower.includes(keyword)) {
                keywordCount++;
            }
        });

        if (keywordCount > 0) {
            riskScore += keywordCount * 10;
            threats.push(`Contains ${keywordCount} phishing keywords`);
        }

        // Check for suspicious elements
        const hiddenInputs = (htmlContent.match(/type=["']hidden["']/) || []).length;
        if (hiddenInputs > 5) {
            riskScore += 20;
            threats.push('Multiple hidden form inputs');
        }

        const iframes = (htmlContent.match(/<iframe/gi) || []).length;
        if (iframes > 2) {
            riskScore += 15;
            threats.push('Multiple embedded frames');
        }

        // Check for obfuscated JavaScript
        if (/eval\(|document\.write\(/.test(htmlContent)) {
            riskScore += 25;
            threats.push('Obfuscated JavaScript detected');
        }

        return { riskScore, threats };
    }

    analyzeURLStructure(url) {
        let riskScore = 0;
        const threats = [];

        const urlObj = new URL(url);

        // Check protocol
        if (urlObj.protocol !== 'https:') {
            riskScore += 20;
            threats.push('Insecure HTTP protocol');
        }

        // Check for IP address
        if (/\d+\.\d+\.\d+\.\d+/.test(urlObj.hostname)) {
            riskScore += 30;
            threats.push('Uses IP address instead of domain');
        }

        // Check for suspicious characters
        if (/[%&=@#$]/.test(url)) {
            riskScore += 10;
            threats.push('Contains suspicious URL characters');
        }

        // Check URL length
        if (url.length > 100) {
            riskScore += 15;
            threats.push('Unusually long URL');
        }

        // Check for excessive subdomains
        const subdomains = urlObj.hostname.split('.').length - 2;
        if (subdomains > 3) {
            riskScore += 20;
            threats.push('Excessive subdomain usage');
        }

        return { riskScore, threats };
    }

    async checkThreatIntelligence(domain) {
        // Simulate checking against threat intelligence feeds
        // In production, this would check against real threat feeds
        
        const knownBadDomains = ['example-phishing.com', 'fake-bank.net', 'scam-site.org'];
        const suspiciousDomains = ['suspicious-domain.com', 'questionable-site.net'];

        if (knownBadDomains.includes(domain)) {
            return {
                riskScore: 80,
                threats: ['Domain found in threat intelligence feeds']
            };
        }

        if (suspiciousDomains.includes(domain)) {
            return {
                riskScore: 40,
                threats: ['Domain flagged as suspicious']
            };
        }

        return { riskScore: 0, threats: [] };
    }

    showScanningState() {
        const scanButton = document.getElementById('scanButton');
        const scanIcon = document.getElementById('scanIcon');
        const scanText = document.getElementById('scanText');
        const results = document.getElementById('results');

        scanButton.disabled = true;
        scanIcon.innerHTML = '<div class="loading-spinner"></div>';
        scanText.textContent = 'Scanning...';
        results.classList.add('hidden');
    }

    showResults(scanResults) {
        const scanButton = document.getElementById('scanButton');
        const scanIcon = document.getElementById('scanIcon');
        const scanText = document.getElementById('scanText');
        const results = document.getElementById('results');

        // Reset scan button
        scanButton.disabled = false;
        scanIcon.textContent = '🔍';
        scanText.textContent = 'Scan Again';

        // Show results
        results.classList.remove('hidden');

        // Update risk score display
        this.updateRiskScoreDisplay(scanResults);

        // Update threats list
        this.updateThreatsDisplay(scanResults);

        // Update explanation
        this.updateExplanation(scanResults);
    }

    updateRiskScoreDisplay(scanResults) {
        const riskScore = document.getElementById('riskScore');
        const statusIndicator = document.getElementById('statusIndicator');
        const riskLabel = document.getElementById('riskLabel');
        const scoreValue = document.getElementById('scoreValue');

        // Remove existing risk classes
        riskScore.className = 'risk-score';

        // Add appropriate risk class and update display
        switch (scanResults.riskLevel) {
            case 'low':
                riskScore.classList.add('risk-low');
                statusIndicator.className = 'status-indicator status-safe';
                riskLabel.textContent = 'Low Risk';
                break;
            case 'medium':
                riskScore.classList.add('risk-medium');
                statusIndicator.className = 'status-indicator status-warning';
                riskLabel.textContent = 'Medium Risk';
                break;
            case 'high':
                riskScore.classList.add('risk-high');
                statusIndicator.className = 'status-indicator status-danger';
                riskLabel.textContent = 'High Risk';
                break;
            case 'critical':
                riskScore.classList.add('risk-critical');
                statusIndicator.className = 'status-indicator status-danger';
                riskLabel.textContent = 'Critical Risk';
                break;
        }

        scoreValue.textContent = scanResults.riskScore;
    }

    updateThreatsDisplay(scanResults) {
        const threatsList = document.getElementById('threatsList');
        const threatsSection = document.getElementById('threatsSection');

        if (scanResults.threats.length === 0) {
            threatsSection.style.display = 'none';
            return;
        }

        threatsSection.style.display = 'block';
        threatsList.innerHTML = '';

        scanResults.threats.forEach(threat => {
            const threatItem = document.createElement('div');
            threatItem.className = 'threat-item';
            threatItem.textContent = threat;
            threatsList.appendChild(threatItem);
        });
    }

    updateExplanation(scanResults) {
        const explanation = document.getElementById('explanation');
        
        let explanationText = '';
        
        if (scanResults.riskLevel === 'low') {
            explanationText = 'This website appears to be safe based on our analysis. No significant security threats were detected.';
        } else if (scanResults.riskLevel === 'medium') {
            explanationText = 'This website has some characteristics that warrant caution. Review the detected threats and exercise appropriate care.';
        } else if (scanResults.riskLevel === 'high') {
            explanationText = 'This website shows multiple indicators of potential threats. We recommend avoiding sensitive activities on this site.';
        } else if (scanResults.riskLevel === 'critical') {
            explanationText = 'This website appears to be dangerous and likely malicious. We strongly recommend leaving this site immediately.';
        }

        explanation.textContent = explanationText;
    }

    showError(message) {
        const scanButton = document.getElementById('scanButton');
        const scanIcon = document.getElementById('scanIcon');
        const scanText = document.getElementById('scanText');

        scanButton.disabled = false;
        scanIcon.textContent = '⚠️';
        scanText.textContent = message;

        setTimeout(() => {
            scanIcon.textContent = '🔍';
            scanText.textContent = 'Scan Current Page';
        }, 3000);
    }

    async storeScanHistory(scanResults) {
        try {
            const history = await chrome.storage.local.get(['scanHistory']) || { scanHistory: [] };
            history.scanHistory = history.scanHistory || [];
            
            // Add new result
            history.scanHistory.unshift({
                ...scanResults,
                id: Date.now().toString()
            });
            
            // Keep only last 100 scans
            if (history.scanHistory.length > 100) {
                history.scanHistory = history.scanHistory.slice(0, 100);
            }
            
            await chrome.storage.local.set(history);
        } catch (error) {
            console.error('Failed to store scan history:', error);
        }
    }

    async viewDetails() {
        if (!this.scanResults) return;

        // Open detailed analysis in new tab
        const detailsUrl = `https://guardian-ai-scan.lovableproject.com/submit?url=${encodeURIComponent(this.scanResults.url)}&ref=extension`;
        await chrome.tabs.create({ url: detailsUrl });
    }

    async reportFalsePositive() {
        if (!this.scanResults) return;

        // Open feedback form
        const feedbackUrl = `https://guardian-ai-scan.lovableproject.com/feedback?url=${encodeURIComponent(this.scanResults.url)}&type=false_positive`;
        await chrome.tabs.create({ url: feedbackUrl });
    }

    async addToWhitelist() {
        if (!this.scanResults) return;

        try {
            const whitelist = await chrome.storage.local.get(['whitelist']) || { whitelist: [] };
            whitelist.whitelist = whitelist.whitelist || [];
            
            if (!whitelist.whitelist.includes(this.scanResults.domain)) {
                whitelist.whitelist.push(this.scanResults.domain);
                await chrome.storage.local.set(whitelist);
                
                // Update UI to show success
                const whitelistButton = document.getElementById('whitelistButton');
                const originalText = whitelistButton.textContent;
                whitelistButton.textContent = '✅ Added to Trusted Sites';
                whitelistButton.disabled = true;
                
                setTimeout(() => {
                    whitelistButton.textContent = originalText;
                    whitelistButton.disabled = false;
                }, 2000);
            }
        } catch (error) {
            console.error('Failed to add to whitelist:', error);
        }
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PopupController();
});
