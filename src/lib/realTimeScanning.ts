// Real-Time Website Scanning Engine
// Continuously monitors and analyzes content for immediate threat detection

import { aiAnalyzer } from './aiAnalysis';
import { whoisAnalyzer, dnsAnalyzer } from './whoisAnalysis';
import { computerVisionAnalyzer } from './computerVision';
import { advancedNLPAnalyzer } from './advancedNLP';
import { supabase } from '@/integrations/supabase/client';

export interface ScanResult {
  url: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  threats: string[];
  timestamp: Date;
  details: {
    whois?: any;
    dns?: any;
    visual?: any;
    nlp?: any;
    ai?: any;
  };
}

export interface ScanOptions {
  includeWhois?: boolean;
  includeDNS?: boolean;
  includeVisual?: boolean;
  includeNLP?: boolean;
  enableRealTimeAlerts?: boolean;
  storeResults?: boolean;
}

export class RealTimeScanEngine {
  private scanQueue: Map<string, Promise<ScanResult>> = new Map();
  private alertCallbacks: Set<(result: ScanResult) => void> = new Set();
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      await Promise.all([
        aiAnalyzer.initialize(),
        computerVisionAnalyzer.initialize(),
        advancedNLPAnalyzer.initialize()
      ]);
      
      this.isInitialized = true;
      console.log('Real-time scan engine initialized');
    } catch (error) {
      console.error('Failed to initialize scan engine:', error);
      throw error;
    }
  }

  async scanURL(
    url: string, 
    options: ScanOptions = {},
    content?: string
  ): Promise<ScanResult> {
    // Check if scan is already in progress
    if (this.scanQueue.has(url)) {
      return this.scanQueue.get(url)!;
    }

    const scanPromise = this.performScan(url, content, options);
    this.scanQueue.set(url, scanPromise);

    try {
      const result = await scanPromise;
      
      // Trigger real-time alerts if enabled
      if (options.enableRealTimeAlerts && result.riskLevel !== 'low') {
        this.triggerAlert(result);
      }

      // Store results if enabled
      if (options.storeResults) {
        await this.storeResults(result);
      }

      return result;
    } finally {
      this.scanQueue.delete(url);
    }
  }

  private async performScan(
    url: string, 
    content?: string, 
    options: ScanOptions
  ): Promise<ScanResult> {
    await this.initialize();

    const domain = new URL(url).hostname;
    const scanPromises: Promise<any>[] = [];
    const details: any = {};

    // Core AI analysis (always included)
    scanPromises.push(
      aiAnalyzer.analyzeURL(url, content).then(result => {
        details.ai = result;
        return result;
      })
    );

    // Optional analyses based on options
    if (options.includeWhois !== false) {
      scanPromises.push(
        whoisAnalyzer.analyzeWhois(domain).then(result => {
          details.whois = result;
          return result;
        }).catch(error => {
          console.warn('WHOIS analysis failed:', error);
          return null;
        })
      );
    }

    if (options.includeDNS !== false) {
      scanPromises.push(
        dnsAnalyzer.analyzeDNS(domain).then(result => {
          details.dns = result;
          return result;
        }).catch(error => {
          console.warn('DNS analysis failed:', error);
          return null;
        })
      );
    }

    if (options.includeVisual !== false && content) {
      scanPromises.push(
        computerVisionAnalyzer.analyzeWebsiteVisuals(url, content).then(result => {
          details.visual = result;
          return result;
        }).catch(error => {
          console.warn('Visual analysis failed:', error);
          return null;
        })
      );
    }

    if (options.includeNLP !== false && content) {
      scanPromises.push(
        advancedNLPAnalyzer.analyzeText(content).then(result => {
          details.nlp = result;
          return result;
        }).catch(error => {
          console.warn('NLP analysis failed:', error);
          return null;
        })
      );
    }

    // Wait for all analyses to complete
    const results = await Promise.allSettled(scanPromises);
    
    // Combine results into final assessment
    return this.combineResults(url, details, results);
  }

  private combineResults(url: string, details: any, results: PromiseSettledResult<any>[]): ScanResult {
    let totalRiskScore = 0;
    let riskFactorCount = 0;
    const threats: string[] = [];

    // Process AI analysis results
    if (details.ai) {
      totalRiskScore += details.ai.riskScore;
      riskFactorCount++;
      
      details.ai.threatCategories?.forEach((threat: string) => {
        if (!threats.includes(threat)) {
          threats.push(threat);
        }
      });
    }

    // Process WHOIS results
    if (details.whois) {
      let whoisRisk = 0;
      
      if (details.whois.age < 30) {
        whoisRisk += 40;
        threats.push('Very new domain');
      } else if (details.whois.age < 90) {
        whoisRisk += 20;
        threats.push('Recently registered domain');
      }

      details.whois.suspiciousIndicators?.forEach((indicator: string) => {
        whoisRisk += 15;
        threats.push(`WHOIS: ${indicator}`);
      });

      totalRiskScore += Math.min(100, whoisRisk);
      riskFactorCount++;
    }

    // Process DNS results
    if (details.dns) {
      let dnsRisk = 0;
      
      if (details.dns.ipReputation < 30) {
        dnsRisk += 30;
        threats.push('Poor IP reputation');
      }

      if (details.dns.subdomainCount > 10) {
        dnsRisk += 20;
        threats.push('Excessive subdomains');
      }

      details.dns.suspiciousPatterns?.forEach((pattern: string) => {
        dnsRisk += 15;
        threats.push(`DNS: ${pattern}`);
      });

      totalRiskScore += Math.min(100, dnsRisk);
      riskFactorCount++;
    }

    // Process visual analysis results
    if (details.visual) {
      let visualRisk = 0;
      
      if (details.visual.layoutSuspicion > 50) {
        visualRisk += 30;
        threats.push('Suspicious page layout');
      }

      details.visual.brandSimilarities?.forEach((brand: any) => {
        if (brand.similarity > 70) {
          visualRisk += 25;
          threats.push(`Potential ${brand.brand} impersonation`);
        }
      });

      totalRiskScore += Math.min(100, visualRisk);
      riskFactorCount++;
    }

    // Process NLP results
    if (details.nlp) {
      let nlpRisk = 0;
      
      if (details.nlp.urgencyScore > 40) {
        nlpRisk += details.nlp.urgencyScore * 0.3;
        threats.push('High-pressure tactics detected');
      }

      if (details.nlp.impersonationScore > 30) {
        nlpRisk += details.nlp.impersonationScore * 0.4;
        threats.push('Authority impersonation detected');
      }

      if (details.nlp.financialRiskScore > 30) {
        nlpRisk += details.nlp.financialRiskScore * 0.4;
        threats.push('Financial information request');
      }

      totalRiskScore += Math.min(100, nlpRisk);
      riskFactorCount++;
    }

    // Calculate average risk score
    const finalRiskScore = riskFactorCount > 0 
      ? Math.round(totalRiskScore / riskFactorCount) 
      : 0;

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (finalRiskScore >= 80) riskLevel = 'critical';
    else if (finalRiskScore >= 60) riskLevel = 'high';
    else if (finalRiskScore >= 30) riskLevel = 'medium';
    else riskLevel = 'low';

    return {
      url,
      riskScore: finalRiskScore,
      riskLevel,
      threats: [...new Set(threats)], // Remove duplicates
      timestamp: new Date(),
      details
    };
  }

  private triggerAlert(result: ScanResult) {
    this.alertCallbacks.forEach(callback => {
      try {
        callback(result);
      } catch (error) {
        console.error('Alert callback error:', error);
      }
    });
  }

  private async storeResults(result: ScanResult) {
    try {
      // Store in real_time_alerts table for high-risk results
      if (result.riskLevel === 'high' || result.riskLevel === 'critical') {
        const { error } = await supabase
          .from('real_time_alerts')
          .insert({
            alert_type: result.riskLevel === 'critical' ? 'danger' : 'warning',
            threat_category: result.threats[0] || 'Unknown',
            url: result.url,
            risk_score: result.riskScore,
            triggered_features: result.threats,
            explanation: `Automated scan detected ${result.threats.length} security concerns with risk score ${result.riskScore}`,
            session_id: this.getSessionId()
          });

        if (error) {
          console.error('Failed to store alert:', error);
        }
      }

      // Store detailed results if WHOIS data available
      if (result.details.whois) {
        await this.storeWhoisData(result.details.whois);
      }

      // Store DNS results
      if (result.details.dns) {
        await this.storeDNSData(result.url, result.details.dns);
      }

    } catch (error) {
      console.error('Failed to store scan results:', error);
    }
  }

  private async storeWhoisData(whoisData: any) {
    try {
      const { error } = await supabase
        .from('whois_data')
        .upsert({
          domain: whoisData.domain,
          registrar: whoisData.registrar,
          creation_date: whoisData.creationDate,
          expiration_date: whoisData.expirationDate,
          registrant_country: whoisData.registrantCountry,
          privacy_protection: whoisData.privacyProtection
        }, {
          onConflict: 'domain'
        });

      if (error) {
        console.error('Failed to store WHOIS data:', error);
      }
    } catch (error) {
      console.error('WHOIS storage error:', error);
    }
  }

  private async storeDNSData(url: string, dnsData: any) {
    try {
      const domain = new URL(url).hostname;
      
      const { error } = await supabase
        .from('dns_records')
        .insert({
          domain,
          record_type: 'analysis',
          record_value: JSON.stringify(dnsData),
          ip_reputation_score: dnsData.ipReputation,
          mx_records: dnsData.mxRecords,
          subdomain_count: dnsData.subdomainCount,
          suspicious_subdomains: dnsData.suspiciousSubdomains
        });

      if (error) {
        console.error('Failed to store DNS data:', error);
      }
    } catch (error) {
      console.error('DNS storage error:', error);
    }
  }

  private getSessionId(): string {
    // Generate or retrieve session ID for anonymous users
    let sessionId = localStorage.getItem('fraud_detection_session');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('fraud_detection_session', sessionId);
    }
    return sessionId;
  }

  // Public methods for alert management
  onAlert(callback: (result: ScanResult) => void) {
    this.alertCallbacks.add(callback);
    
    return () => {
      this.alertCallbacks.delete(callback);
    };
  }

  clearAlertCallbacks() {
    this.alertCallbacks.clear();
  }

  // Batch scanning for multiple URLs
  async scanMultipleURLs(
    urls: string[], 
    options: ScanOptions = {}
  ): Promise<ScanResult[]> {
    const scanPromises = urls.map(url => this.scanURL(url, undefined, options));
    const results = await Promise.allSettled(scanPromises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<ScanResult> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  }

  // Get scan statistics
  getStats() {
    return {
      activeScans: this.scanQueue.size,
      alertCallbacks: this.alertCallbacks.size,
      isInitialized: this.isInitialized
    };
  }
}

// Singleton instance
export const realTimeScanEngine = new RealTimeScanEngine();