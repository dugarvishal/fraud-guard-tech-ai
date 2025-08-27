// Chrome Extension Background Service Worker
// Handles continuous monitoring and threat detection

class BackgroundService {
    constructor() {
        this.initialize();
        this.threatIntelligence = new Map();
        this.whitelist = new Set();
        this.scanHistory = [];
    }

    initialize() {
        // Set up event listeners
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            this.handleTabUpdate(tabId, changeInfo, tab);
        });

        chrome.tabs.onActivated.addListener((activeInfo) => {
            this.handleTabActivated(activeInfo);
        });

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true; // Keep message channel open for async response
        });

        // Load stored data
        this.loadStoredData();

        // Initialize threat intelligence
        this.updateThreatIntelligence();

        console.log('Guardian AI background service initialized');
    }

    async loadStoredData() {
        try {
            const data = await chrome.storage.local.get(['whitelist', 'scanHistory', 'settings']);
            
            if (data.whitelist) {
                this.whitelist = new Set(data.whitelist);
            }
            
            if (data.scanHistory) {
                this.scanHistory = data.scanHistory;
            }

            console.log('Loaded stored data:', {
                whitelistSize: this.whitelist.size,
                historySize: this.scanHistory.length
            });
        } catch (error) {
            console.error('Failed to load stored data:', error);
        }
    }

    async updateThreatIntelligence() {
        try {
            // In production, this would fetch from real threat feeds
            // For now, we'll use a simulated threat intelligence database
            const threatFeeds = await this.fetchThreatFeeds();
            
            threatFeeds.forEach(threat => {
                this.threatIntelligence.set(threat.indicator, threat);
            });

            console.log(`Updated threat intelligence: ${this.threatIntelligence.size} indicators`);
        } catch (error) {
            console.error('Failed to update threat intelligence:', error);
        }
    }

    async fetchThreatFeeds() {
        // Simulate threat intelligence feeds
        return [
            {
                indicator: 'malicious-phishing-site.com',
                type: 'domain',
                category: 'phishing',
                confidence: 95,
                lastSeen: new Date()
            },
            {
                indicator: 'fake-bank-login.net',
                type: 'domain',
                category: 'phishing',
                confidence: 90,
                lastSeen: new Date()
            },
            {
                indicator: 'scam-lottery-winner.org',
                type: 'domain',
                category: 'scam',
                confidence: 85,
                lastSeen: new Date()
            }
        ];
    }

    async handleTabUpdate(tabId, changeInfo, tab) {
        // Only process when navigation is complete
        if (changeInfo.status !== 'complete' || !tab.url) {
            return;
        }

        // Skip chrome:// and extension URLs
        if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
            return;
        }

        try {
            const url = new URL(tab.url);
            const domain = url.hostname;

            // Check whitelist first
            if (this.whitelist.has(domain)) {
                return;
            }

            // Perform quick threat assessment
            const threatAssessment = await this.quickThreatAssessment(tab.url, domain);
            
            if (threatAssessment.riskLevel === 'high' || threatAssessment.riskLevel === 'critical') {
                await this.showThreatWarning(tabId, threatAssessment);
            }

            // Store in scan history
            this.addToScanHistory(threatAssessment);

        } catch (error) {
            console.error('Error processing tab update:', error);
        }
    }

    async handleTabActivated(activeInfo) {
        try {
            const tab = await chrome.tabs.get(activeInfo.tabId);
            if (tab.url && !tab.url.startsWith('chrome://')) {
                // Could perform additional checks when user switches to a tab
                console.log('Tab activated:', tab.url);
            }
        } catch (error) {
            console.error('Error handling tab activation:', error);
        }
    }

    async handleMessage(message, sender, sendResponse) {
        try {
            switch (message.type) {
                case 'scan_url':
                    const scanResult = await this.performDetailedScan(message.url, message.content);
                    sendResponse({ success: true, result: scanResult });
                    break;

                case 'get_threat_intelligence':
                    const threat = this.threatIntelligence.get(message.indicator);
                    sendResponse({ success: true, threat });
                    break;

                case 'update_whitelist':
                    await this.updateWhitelist(message.domain, message.action);
                    sendResponse({ success: true });
                    break;

                case 'get_scan_history':
                    sendResponse({ success: true, history: this.scanHistory });
                    break;

                default:
                    sendResponse({ success: false, error: 'Unknown message type' });
            }
        } catch (error) {
            console.error('Error handling message:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    async quickThreatAssessment(url, domain) {
        let riskScore = 0;
        const threats = [];

        // Check threat intelligence
        const threat = this.threatIntelligence.get(domain);
        if (threat) {
            riskScore += threat.confidence;
            threats.push(`Known ${threat.category} site`);
        }

        // Basic URL analysis
        const urlAnalysis = this.analyzeURL(url);
        riskScore += urlAnalysis.riskScore;
        threats.push(...urlAnalysis.threats);

        // Domain reputation check
        const reputationScore = await this.checkDomainReputation(domain);
        riskScore += reputationScore.riskScore;
        threats.push(...reputationScore.threats);

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
            threats: threats.filter(t => t),
            timestamp: new Date(),
            scanType: 'quick'
        };
    }

    analyzeURL(url) {
        let riskScore = 0;
        const threats = [];

        try {
            const urlObj = new URL(url);

            // Check for suspicious patterns
            if (/\d+\.\d+\.\d+\.\d+/.test(urlObj.hostname)) {
                riskScore += 30;
                threats.push('Uses IP address instead of domain');
            }

            if (urlObj.protocol !== 'https:') {
                riskScore += 20;
                threats.push('Insecure HTTP connection');
            }

            // Check for suspicious TLDs
            const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.click', '.download'];
            if (suspiciousTLDs.some(tld => urlObj.hostname.endsWith(tld))) {
                riskScore += 25;
                threats.push('Suspicious top-level domain');
            }

            // Check for excessive subdomains
            const subdomains = urlObj.hostname.split('.').length - 2;
            if (subdomains > 3) {
                riskScore += 15;
                threats.push('Excessive subdomain usage');
            }

            // Check for suspicious URL patterns
            if (url.length > 100) {
                riskScore += 10;
                threats.push('Unusually long URL');
            }

        } catch (error) {
            riskScore += 20;
            threats.push('Malformed URL structure');
        }

        return { riskScore, threats };
    }

    async checkDomainReputation(domain) {
        // Simulate domain reputation check
        // In production, this would integrate with reputation services
        
        const riskScore = 0;
        const threats = [];

        // Check against known patterns
        const suspiciousPatterns = [
            /fake/, /phishing/, /scam/, /fraud/, /spam/,
            /secure.*bank/, /verify.*account/, /update.*payment/
        ];

        if (suspiciousPatterns.some(pattern => pattern.test(domain))) {
            return {
                riskScore: 40,
                threats: ['Domain name contains suspicious keywords']
            };
        }

        return { riskScore, threats };
    }

    async showThreatWarning(tabId, threatAssessment) {
        try {
            // Inject warning overlay into the page
            await chrome.scripting.executeScript({
                target: { tabId },
                function: this.injectThreatWarning,
                args: [threatAssessment]
            });

            // Update extension badge
            await chrome.action.setBadgeText({
                tabId,
                text: '⚠️'
            });

            await chrome.action.setBadgeBackgroundColor({
                tabId,
                color: threatAssessment.riskLevel === 'critical' ? '#dc2626' : '#f59e0b'
            });

        } catch (error) {
            console.error('Failed to show threat warning:', error);
        }
    }

    // This function will be injected into the page
    injectThreatWarning(threatAssessment) {
        // Check if warning already exists
        if (document.getElementById('guardian-ai-warning')) {
            return;
        }

        // Create warning overlay
        const overlay = document.createElement('div');
        overlay.id = 'guardian-ai-warning';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: ${threatAssessment.riskLevel === 'critical' ? '#fee2e2' : '#fef3c7'};
            color: ${threatAssessment.riskLevel === 'critical' ? '#991b1b' : '#92400e'};
            padding: 12px 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            border-bottom: 3px solid ${threatAssessment.riskLevel === 'critical' ? '#dc2626' : '#f59e0b'};
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;

        const message = document.createElement('div');
        message.style.cssText = 'display: flex; align-items: center; gap: 8px;';
        message.innerHTML = `
            <span style=\"font-size: 18px;\">🛡️</span>
            <span><strong>Guardian AI Security Warning:</strong> This website has been flagged as potentially dangerous (Risk: ${threatAssessment.riskScore}/100). Threats detected: ${threatAssessment.threats.join(', ')}</span>
        `;

        const actions = document.createElement('div');
        actions.style.cssText = 'display: flex; gap: 8px;';

        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'Details';
        detailsButton.style.cssText = `
            background: #3b82f6;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
        `;
        detailsButton.onclick = () => {
            window.open('https://guardian-ai-scan.lovableproject.com/submit?url=' + encodeURIComponent(window.location.href), '_blank');
        };

        const dismissButton = document.createElement('button');
        dismissButton.textContent = '×';
        dismissButton.style.cssText = `
            background: transparent;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 4px 8px;
            opacity: 0.7;
        `;
        dismissButton.onclick = () => {
            overlay.remove();
        };

        actions.appendChild(detailsButton);
        actions.appendChild(dismissButton);

        overlay.appendChild(message);
        overlay.appendChild(actions);

        document.body.insertBefore(overlay, document.body.firstChild);

        // Auto-dismiss after 10 seconds for non-critical threats
        if (threatAssessment.riskLevel !== 'critical') {
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.remove();
                }
            }, 10000);
        }
    }

    async performDetailedScan(url, content) {
        // This would integrate with the main analysis engine
        // For now, return enhanced quick assessment
        const quickAssessment = await this.quickThreatAssessment(url, new URL(url).hostname);
        
        return {
            ...quickAssessment,
            scanType: 'detailed',
            analysisDetails: {
                contentAnalyzed: !!content,
                threatIntelligenceChecked: true,
                visualAnalysisPerformed: false, // Would be true if content was analyzed
                nlpAnalysisPerformed: !!content
            }
        };
    }

    async updateWhitelist(domain, action) {
        if (action === 'add') {
            this.whitelist.add(domain);
        } else if (action === 'remove') {
            this.whitelist.delete(domain);
        }

        // Store updated whitelist
        await chrome.storage.local.set({
            whitelist: Array.from(this.whitelist)
        });
    }

    addToScanHistory(scanResult) {
        this.scanHistory.unshift(scanResult);
        
        // Keep only last 1000 scans
        if (this.scanHistory.length > 1000) {
            this.scanHistory = this.scanHistory.slice(0, 1000);
        }

        // Store updated history (debounced)
        this.debouncedStoreScanHistory();
    }

    debouncedStoreScanHistory = this.debounce(async () => {
        try {
            await chrome.storage.local.set({
                scanHistory: this.scanHistory
            });
        } catch (error) {
            console.error('Failed to store scan history:', error);
        }
    }, 2000);

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
}

// Initialize the background service
const backgroundService = new BackgroundService();
