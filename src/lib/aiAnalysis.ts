// Enhanced AI Analysis Engine for Fraud Detection
// This module provides local AI/ML capabilities for analyzing URLs and detecting fraud patterns

import { pipeline, env } from '@huggingface/transformers';

// Configure transformers to work in browser environment
env.allowRemoteModels = false;
env.allowLocalModels = true;

export interface AIAnalysisResult {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  threatCategories: string[];
  suspiciousPatterns: { pattern: string; severity: string; confidence: number }[];
  technicalAnalysis: {
    domainReputation: number;
    contentAnalysis: any;
    structuralAnalysis: any;
  };
  recommendations: string[];
}

class AIFraudAnalyzer {
  private textClassifier: any = null;
  private embeddingsModel: any = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize text classification model for phishing detection
      this.textClassifier = await pipeline(
        'text-classification',
        'microsoft/DialoGPT-medium',
        { device: 'webgpu' }
      );

      // Initialize embeddings model for content analysis
      this.embeddingsModel = await pipeline(
        'feature-extraction',
        'sentence-transformers/all-MiniLM-L6-v2',
        { device: 'webgpu' }
      );

      this.initialized = true;
      console.log('AI Fraud Analyzer initialized successfully');
    } catch (error) {
      console.warn('GPU not available, falling back to CPU');
      try {
        this.textClassifier = await pipeline(
          'text-classification',
          'microsoft/DialoGPT-medium'
        );
        this.initialized = true;
      } catch (cpuError) {
        console.error('Failed to initialize AI models:', cpuError);
        // Fallback to rule-based analysis
      }
    }
  }

  async analyzeURL(url: string, content?: string): Promise<AIAnalysisResult> {
    await this.initialize();

    const analysis = {
      domainAnalysis: await this.analyzeDomain(url),
      contentAnalysis: content ? await this.analyzeContent(content) : null,
      structuralAnalysis: await this.analyzeURLStructure(url),
      reputationAnalysis: await this.analyzeReputation(url)
    };

    return this.generateFinalAnalysis(url, analysis);
  }

  private async analyzeDomain(url: string) {
    const domain = new URL(url).hostname;
    const domainParts = domain.split('.');
    
    // Domain age estimation (mock implementation)
    const domainAge = Math.floor(Math.random() * 3650) + 30;
    
    // Suspicious TLD check
    const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.click', '.download'];
    const hasSuspiciousTLD = suspiciousTLDs.some(tld => domain.endsWith(tld));
    
    // Subdomain analysis
    const subdomainCount = domainParts.length - 2;
    const hasExcessiveSubdomains = subdomainCount > 3;
    
    // Homograph attack detection
    const hasHomographs = this.detectHomographs(domain);
    
    return {
      age: domainAge,
      suspicious: hasSuspiciousTLD || hasExcessiveSubdomains || hasHomographs,
      subdomainCount,
      hasHomographs,
      reputation: Math.random() * 100
    };
  }

  private async analyzeContent(content: string) {
    if (!this.textClassifier) {
      return this.fallbackContentAnalysis(content);
    }

    try {
      // Use AI model for content classification
      const classification = await this.textClassifier(content.substring(0, 512));
      
      return {
        aiClassification: classification,
        phishingKeywords: this.detectPhishingKeywords(content),
        suspiciousElements: this.detectSuspiciousElements(content),
        languageAnalysis: this.analyzeLanguage(content)
      };
    } catch (error) {
      console.warn('AI content analysis failed, using fallback:', error);
      return this.fallbackContentAnalysis(content);
    }
  }

  private fallbackContentAnalysis(content: string) {
    return {
      phishingKeywords: this.detectPhishingKeywords(content),
      suspiciousElements: this.detectSuspiciousElements(content),
      languageAnalysis: this.analyzeLanguage(content),
      confidence: 0.7
    };
  }

  private async analyzeURLStructure(url: string) {
    const urlObj = new URL(url);
    
    return {
      length: url.length,
      hasIP: /\d+\.\d+\.\d+\.\d+/.test(urlObj.hostname),
      hasPort: urlObj.port !== '',
      pathComplexity: urlObj.pathname.split('/').length,
      queryParams: Object.keys(Object.fromEntries(urlObj.searchParams)).length,
      protocolSecurity: urlObj.protocol === 'https:',
      suspiciousChars: /[%&=@#$]/.test(url)
    };
  }

  private async analyzeReputation(url: string) {
    // Mock reputation analysis - in real implementation, this would check
    // against various reputation databases and blacklists
    const domain = new URL(url).hostname;
    
    // Simulate reputation checks
    const reputationScore = Math.random() * 100;
    const isBlacklisted = Math.random() < 0.1;
    const hasComplaints = Math.random() < 0.15;
    
    return {
      score: reputationScore,
      blacklisted: isBlacklisted,
      complaints: hasComplaints,
      trustScore: Math.max(0, reputationScore - (isBlacklisted ? 50 : 0) - (hasComplaints ? 20 : 0))
    };
  }

  private detectPhishingKeywords(content: string): number {
    const phishingKeywords = [
      'urgent', 'verify account', 'suspended', 'click here', 'limited time',
      'act now', 'confirm identity', 'security alert', 'update payment',
      'winner', 'congratulations', 'claim prize', 'free money',
      'nigerian prince', 'inheritance', 'lottery', 'bitcoin'
    ];
    
    const contentLower = content.toLowerCase();
    return phishingKeywords.filter(keyword => contentLower.includes(keyword)).length;
  }

  private detectSuspiciousElements(content: string) {
    return {
      hiddenInputs: (content.match(/type=["\']hidden["\']/) || []).length,
      externalLinks: (content.match(/href=["\'][^"']*[^"']*["\']/) || []).length,
      iframes: (content.match(/<iframe/gi) || []).length,
      scripts: (content.match(/<script/gi) || []).length,
      forms: (content.match(/<form/gi) || []).length
    };
  }

  private analyzeLanguage(content: string) {
    // Simple language analysis
    const words = content.split(/\s+/).length;
    const avgWordLength = content.replace(/\s/g, '').length / words;
    
    return {
      wordCount: words,
      avgWordLength,
      hasMultipleLanguages: /[^\x00-\x7F]/.test(content),
      suspiciousEncoding: content.includes('%') || content.includes('&#')
    };
  }

  private detectHomographs(domain: string): boolean {
    // Detect potential homograph attacks (simplified)
    const suspiciousChars = /[а-я]/; // Cyrillic characters that look like Latin
    return suspiciousChars.test(domain);
  }

  private generateFinalAnalysis(url: string, analysis: any): AIAnalysisResult {
    let riskScore = 0;
    const suspiciousPatterns: { pattern: string; severity: string; confidence: number }[] = [];
    const threatCategories: string[] = [];
    const recommendations: string[] = [];

    // Domain analysis scoring
    if (analysis.domainAnalysis.age < 90) {
      riskScore += 30;
      suspiciousPatterns.push({
        pattern: 'Recently registered domain',
        severity: 'high',
        confidence: 0.9
      });
      threatCategories.push('New Domain');
      recommendations.push('Exercise caution with recently registered domains');
    }

    if (analysis.domainAnalysis.hasHomographs) {
      riskScore += 40;
      suspiciousPatterns.push({
        pattern: 'Homograph attack detected',
        severity: 'critical',
        confidence: 0.95
      });
      threatCategories.push('Homograph Attack');
      recommendations.push('Verify domain spelling carefully');
    }

    // Structural analysis scoring
    if (analysis.structuralAnalysis.hasIP) {
      riskScore += 25;
      suspiciousPatterns.push({
        pattern: 'IP address instead of domain',
        severity: 'medium',
        confidence: 0.8
      });
      threatCategories.push('Direct IP Access');
    }

    if (!analysis.structuralAnalysis.protocolSecurity) {
      riskScore += 20;
      suspiciousPatterns.push({
        pattern: 'Insecure HTTP protocol',
        severity: 'medium',
        confidence: 1.0
      });
      threatCategories.push('Insecure Protocol');
      recommendations.push('Avoid entering sensitive information on HTTP sites');
    }

    // Content analysis scoring
    if (analysis.contentAnalysis?.phishingKeywords > 3) {
      riskScore += 35;
      suspiciousPatterns.push({
        pattern: 'Multiple phishing keywords detected',
        severity: 'high',
        confidence: 0.85
      });
      threatCategories.push('Phishing Content');
      recommendations.push('Be wary of urgent language and requests for personal information');
    }

    // Reputation analysis scoring
    if (analysis.reputationAnalysis.blacklisted) {
      riskScore += 50;
      suspiciousPatterns.push({
        pattern: 'Domain found on blacklists',
        severity: 'critical',
        confidence: 0.98
      });
      threatCategories.push('Blacklisted Domain');
      recommendations.push('Avoid this website - known malicious domain');
    }

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (riskScore >= 80) riskLevel = 'critical';
    else if (riskScore >= 60) riskLevel = 'high';
    else if (riskScore >= 30) riskLevel = 'medium';
    else riskLevel = 'low';

    // Calculate overall confidence
    const confidence = Math.min(95, 70 + (suspiciousPatterns.length * 5));

    // Add general recommendations
    if (riskLevel !== 'low') {
      recommendations.push('Enable two-factor authentication where possible');
      recommendations.push('Keep your browser and security software updated');
    }

    return {
      riskScore: Math.min(100, riskScore),
      riskLevel,
      confidence,
      threatCategories: [...new Set(threatCategories)],
      suspiciousPatterns,
      technicalAnalysis: {
        domainReputation: analysis.reputationAnalysis.score,
        contentAnalysis: analysis.contentAnalysis,
        structuralAnalysis: analysis.structuralAnalysis
      },
      recommendations: [...new Set(recommendations)]
    };
  }
}

// Singleton instance
export const aiAnalyzer = new AIFraudAnalyzer();

// Enhanced simulation function that uses the AI analyzer
export const simulateEnhancedAnalysis = async (url: string): Promise<any> => {
  try {
    const aiResult = await aiAnalyzer.analyzeURL(url);
    
    return {
      id: Math.random().toString(36).substring(2),
      url,
      riskScore: aiResult.riskScore,
      riskLevel: aiResult.riskLevel,
      status: 'completed',
      analysisResults: {
        domainAge: Math.floor(Math.random() * 3650) + 30,
        sslStatus: Math.random() > 0.3 ? 'valid' : 'invalid',
        redirectCount: Math.floor(Math.random() * 5),
        maliciousContent: aiResult.riskScore > 60,
        phishingKeywords: Math.floor(aiResult.riskScore / 10),
        riskFactors: aiResult.suspiciousPatterns.map(p => p.pattern),
        scanTimestamp: new Date().toISOString(),
        technicalDetails: {
          serverLocation: ['US', 'EU', 'Asia', 'Unknown'][Math.floor(Math.random() * 4)],
          responseTime: Math.floor(Math.random() * 2000) + 100,
          contentType: 'text/html',
          certExpiry: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        mlAnalysis: {
          confidenceScore: aiResult.confidence,
          threatCategories: aiResult.threatCategories,
          suspiciousPatterns: aiResult.suspiciousPatterns
        }
      }
    };
  } catch (error) {
    console.error('AI analysis failed, using fallback:', error);
    
    // Fallback to original simulation
    const riskScore = Math.floor(Math.random() * 100);
    const riskLevel = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low';
    
    return {
      id: Math.random().toString(36).substring(2),
      url,
      riskScore,
      riskLevel,
      status: 'completed',
      analysisResults: {
        domainAge: Math.floor(Math.random() * 3650) + 30,
        sslStatus: Math.random() > 0.3 ? 'valid' : 'invalid',
        redirectCount: Math.floor(Math.random() * 5),
        maliciousContent: Math.random() > 0.7,
        phishingKeywords: Math.floor(Math.random() * 10),
        riskFactors: [
          'Suspicious domain age',
          'Unusual SSL certificate',
          'Multiple redirects detected',
          'Missing security headers'
        ].slice(0, Math.floor(Math.random() * 4) + 1),
        scanTimestamp: new Date().toISOString(),
        technicalDetails: {
          serverLocation: ['US', 'EU', 'Asia', 'Unknown'][Math.floor(Math.random() * 4)],
          responseTime: Math.floor(Math.random() * 2000) + 100,
          contentType: 'text/html',
          certExpiry: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      }
    };
  }
};