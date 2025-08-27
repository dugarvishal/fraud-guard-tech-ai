/**
 * Mobile App Analysis Module
 * Analyzes mobile applications for security threats, malicious behavior, and fraudulent patterns
 */

export interface AppAnalysisResult {
  appId: string;
  appName: string;
  platform: 'android' | 'ios';
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  threatCategories: string[];
  suspiciousPatterns: {
    pattern: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    explanation: string;
  }[];
  permissionAnalysis: {
    totalPermissions: number;
    suspiciousPermissions: string[];
    permissionRiskScore: number;
    unusualPermissions: string[];
  };
  developerAnalysis: {
    developerName: string;
    developerReputation: number;
    otherApps: number;
    suspiciousPatterns: string[];
  };
  metadataAnalysis: {
    rating: number;
    reviewCount: number;
    installCount: string;
    lastUpdated: string;
    contentRating: string;
    suspiciousMetadata: string[];
  };
  cloneDetection: {
    isLikelyClone: boolean;
    originalApp?: string;
    similarity: number;
    cloneIndicators: string[];
  };
  recommendations: string[];
}

export interface AppMetadata {
  appId: string;
  appName: string;
  platform: 'android' | 'ios';
  developerName: string;
  rating: number;
  reviewCount: number;
  installCount: string;
  permissions: string[];
  contentRating: string;
  lastUpdated: string;
  appStoreUrl: string;
  description: string;
  screenshots?: string[];
}

export class MobileAppAnalyzer {
  private suspiciousPermissions: Set<string>;
  private fleecewarePatterns: string[];
  private legitimateApps: Map<string, AppMetadata>;
  private maliciousKeywords: string[];

  constructor() {
    this.initializeThreatDatabase();
  }

  private initializeThreatDatabase() {
    // Suspicious permissions that indicate potential malicious behavior
    this.suspiciousPermissions = new Set([
      'SYSTEM_ALERT_WINDOW',
      'DEVICE_ADMIN',
      'ACCESSIBILITY_SERVICE',
      'READ_SMS',
      'SEND_SMS',
      'RECEIVE_SMS',
      'READ_PHONE_STATE',
      'RECORD_AUDIO',
      'CAMERA',
      'ACCESS_FINE_LOCATION',
      'READ_CONTACTS',
      'WRITE_CONTACTS',
      'GET_ACCOUNTS',
      'READ_CALL_LOG',
      'WRITE_CALL_LOG',
      'CALL_PHONE',
      'PROCESS_OUTGOING_CALLS',
      'WRITE_EXTERNAL_STORAGE',
      'READ_EXTERNAL_STORAGE',
      'INSTALL_PACKAGES',
      'DELETE_PACKAGES',
      'CLEAR_APP_CACHE',
      'CLEAR_APP_USER_DATA'
    ]);

    // Patterns indicating fleeceware (subscription scams)
    this.fleecewarePatterns = [
      'step counter premium',
      'fortune teller pro',
      'palm reader premium',
      'horoscope plus',
      'qr scanner pro',
      'wifi analyzer premium',
      'battery optimizer pro',
      'cleaner master premium',
      'antivirus premium',
      'vpn premium'
    ];

    // Keywords indicating malicious intent
    this.maliciousKeywords = [
      'covidlock', 'coronavirus tracker', 'covid tracker',
      'free whatsapp', 'whatsapp plus', 'gb whatsapp',
      'free netflix', 'netflix premium', 'netflix hack',
      'free spotify', 'spotify premium', 'spotify hack',
      'instagram hack', 'facebook hack', 'snapchat hack',
      'bank account hack', 'credit card generator',
      'fake gps', 'location spoofer', 'imei changer',
      'root access', 'superuser', 'bootloader unlock'
    ];

    // Database of legitimate apps for clone detection
    this.legitimateApps = new Map([
      ['com.whatsapp', { 
        appId: 'com.whatsapp', 
        appName: 'WhatsApp Messenger', 
        platform: 'android',
        developerName: 'WhatsApp LLC',
        rating: 4.1,
        reviewCount: 100000000,
        installCount: '5,000,000,000+',
        permissions: ['CAMERA', 'RECORD_AUDIO', 'READ_CONTACTS'],
        contentRating: 'Everyone',
        lastUpdated: '2024-01-15',
        appStoreUrl: 'https://play.google.com/store/apps/details?id=com.whatsapp',
        description: 'Simple. Reliable. Secure.'
      }],
      ['com.netflix.mediaclient', {
        appId: 'com.netflix.mediaclient',
        appName: 'Netflix',
        platform: 'android',
        developerName: 'Netflix, Inc.',
        rating: 4.2,
        reviewCount: 10000000,
        installCount: '1,000,000,000+',
        permissions: ['INTERNET', 'ACCESS_NETWORK_STATE'],
        contentRating: 'Teen',
        lastUpdated: '2024-01-10',
        appStoreUrl: 'https://play.google.com/store/apps/details?id=com.netflix.mediaclient',
        description: 'Watch TV shows & movies'
      }]
    ]);
  }

  async analyzeApp(appMetadata: AppMetadata): Promise<AppAnalysisResult> {
    // Perform comprehensive app analysis
    const permissionAnalysis = this.analyzePermissions(appMetadata.permissions, appMetadata.appName);
    const developerAnalysis = await this.analyzeDeveloper(appMetadata.developerName);
    const metadataAnalysis = this.analyzeMetadata(appMetadata);
    const cloneDetection = this.detectClone(appMetadata);
    
    // Calculate overall risk score
    const riskScore = this.calculateRiskScore(
      permissionAnalysis,
      developerAnalysis,
      metadataAnalysis,
      cloneDetection,
      appMetadata
    );

    const riskLevel = this.determineRiskLevel(riskScore);
    const threatCategories = this.identifyThreatCategories(appMetadata, cloneDetection);
    const suspiciousPatterns = this.identifySuspiciousPatterns(appMetadata, permissionAnalysis, cloneDetection);
    const recommendations = this.generateRecommendations(riskLevel, threatCategories, suspiciousPatterns);

    return {
      appId: appMetadata.appId,
      appName: appMetadata.appName,
      platform: appMetadata.platform,
      riskScore,
      riskLevel,
      threatCategories,
      suspiciousPatterns,
      permissionAnalysis,
      developerAnalysis,
      metadataAnalysis,
      cloneDetection,
      recommendations
    };
  }

  private analyzePermissions(permissions: string[], appName: string) {
    const suspiciousPermissions = permissions.filter(p => this.suspiciousPermissions.has(p));
    const totalPermissions = permissions.length;
    
    // Calculate permission risk score
    let permissionRiskScore = 0;
    
    // Base score from suspicious permissions
    permissionRiskScore += suspiciousPermissions.length * 15;
    
    // Contextual analysis - some permissions are suspicious for certain app types
    const appNameLower = appName.toLowerCase();
    
    // Step counter app requesting camera access
    if (appNameLower.includes('step') || appNameLower.includes('fitness')) {
      if (permissions.includes('CAMERA') || permissions.includes('RECORD_AUDIO')) {
        permissionRiskScore += 30;
      }
    }
    
    // Calculator app requesting SMS access
    if (appNameLower.includes('calculator') || appNameLower.includes('calc')) {
      if (permissions.includes('READ_SMS') || permissions.includes('SEND_SMS')) {
        permissionRiskScore += 40;
      }
    }
    
    // Unusual permission combinations
    const unusualPermissions = this.detectUnusualPermissions(permissions, appName);
    permissionRiskScore += unusualPermissions.length * 10;
    
    return {
      totalPermissions,
      suspiciousPermissions,
      permissionRiskScore: Math.min(100, permissionRiskScore),
      unusualPermissions
    };
  }

  private detectUnusualPermissions(permissions: string[], appName: string): string[] {
    const unusual: string[] = [];
    const appType = this.detectAppType(appName);
    
    // Define expected permissions for different app types
    const expectedPermissions: Record<string, string[]> = {
      'messaging': ['CAMERA', 'RECORD_AUDIO', 'READ_CONTACTS', 'INTERNET'],
      'banking': ['INTERNET', 'ACCESS_NETWORK_STATE', 'CAMERA'],
      'fitness': ['ACCESS_FINE_LOCATION', 'INTERNET'],
      'utility': ['INTERNET', 'ACCESS_NETWORK_STATE'],
      'game': ['INTERNET', 'ACCESS_NETWORK_STATE']
    };
    
    const expected = expectedPermissions[appType] || [];
    
    permissions.forEach(permission => {
      if (this.suspiciousPermissions.has(permission) && !expected.includes(permission)) {
        unusual.push(permission);
      }
    });
    
    return unusual;
  }

  private detectAppType(appName: string): string {
    const name = appName.toLowerCase();
    
    if (name.includes('whatsapp') || name.includes('messenger') || name.includes('chat')) return 'messaging';
    if (name.includes('bank') || name.includes('wallet') || name.includes('pay')) return 'banking';
    if (name.includes('fitness') || name.includes('step') || name.includes('health')) return 'fitness';
    if (name.includes('calculator') || name.includes('cleaner') || name.includes('scanner')) return 'utility';
    if (name.includes('game') || name.includes('puzzle') || name.includes('play')) return 'game';
    
    return 'unknown';
  }

  private async analyzeDeveloper(developerName: string) {
    // Mock developer analysis - in real implementation, this would check reputation databases
    let reputation = 70; // Base reputation
    
    // Check for suspicious developer patterns
    if (developerName.length < 5) reputation -= 20;
    if (/\d{3,}/.test(developerName)) reputation -= 15; // Too many numbers
    if (developerName.toLowerCase().includes('hack') || developerName.toLowerCase().includes('crack')) {
      reputation -= 50;
    }
    
    const suspiciousPatterns: string[] = [];
    if (developerName.includes('LLC') && developerName.length < 10) {
      suspiciousPatterns.push('Suspicious LLC name');
    }
    if (/^[A-Z]{2,}$/.test(developerName)) {
      suspiciousPatterns.push('All caps developer name');
    }
    
    return {
      developerName,
      developerReputation: Math.max(0, reputation),
      otherApps: Math.floor(Math.random() * 20), // Mock
      suspiciousPatterns
    };
  }

  private analyzeMetadata(appMetadata: AppMetadata) {
    const suspiciousMetadata: string[] = [];
    
    // Low rating with high install count
    if (appMetadata.rating < 3.0 && appMetadata.installCount.includes('1,000,000')) {
      suspiciousMetadata.push('Low rating despite high install count');
    }
    
    // Very few reviews for high install count
    if (appMetadata.reviewCount < 1000 && appMetadata.installCount.includes('100,000')) {
      suspiciousMetadata.push('Few reviews for install count');
    }
    
    // Fleeceware detection
    const appNameLower = appMetadata.appName.toLowerCase();
    if (this.fleecewarePatterns.some(pattern => appNameLower.includes(pattern))) {
      suspiciousMetadata.push('Potential fleeceware pattern');
    }
    
    // Check for malicious keywords
    if (this.maliciousKeywords.some(keyword => appNameLower.includes(keyword))) {
      suspiciousMetadata.push('Contains malicious keywords');
    }
    
    return {
      rating: appMetadata.rating,
      reviewCount: appMetadata.reviewCount,
      installCount: appMetadata.installCount,
      lastUpdated: appMetadata.lastUpdated,
      contentRating: appMetadata.contentRating,
      suspiciousMetadata
    };
  }

  private detectClone(appMetadata: AppMetadata) {
    let isLikelyClone = false;
    let originalApp: string | undefined;
    let similarity = 0;
    const cloneIndicators: string[] = [];
    
    // Check against legitimate apps
    for (const [appId, legitApp] of this.legitimateApps) {
      const nameSimilarity = this.calculateStringSimilarity(
        appMetadata.appName.toLowerCase(),
        legitApp.appName.toLowerCase()
      );
      
      if (nameSimilarity > 0.7 && appMetadata.appId !== appId) {
        isLikelyClone = true;
        originalApp = legitApp.appName;
        similarity = nameSimilarity;
        cloneIndicators.push(`Similar name to ${legitApp.appName}`);
      }
      
      // Check for typosquatting
      if (appMetadata.developerName !== legitApp.developerName && nameSimilarity > 0.6) {
        cloneIndicators.push('Different developer for similar app');
      }
    }
    
    // Additional clone detection patterns
    const suspiciousAppNames = [
      'whatsapp plus', 'gb whatsapp', 'whatsapp gold',
      'netflix premium', 'netflix free', 'netflix hack',
      'facebook lite', 'messenger plus', 'instagram plus'
    ];
    
    const appNameLower = appMetadata.appName.toLowerCase();
    if (suspiciousAppNames.some(name => appNameLower.includes(name))) {
      isLikelyClone = true;
      cloneIndicators.push('Known clone app pattern');
    }
    
    return {
      isLikelyClone,
      originalApp,
      similarity,
      cloneIndicators
    };
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private calculateRiskScore(
    permissionAnalysis: any,
    developerAnalysis: any,
    metadataAnalysis: any,
    cloneDetection: any,
    appMetadata: AppMetadata
  ): number {
    let score = 0;
    
    // Permission risk contributes 30%
    score += permissionAnalysis.permissionRiskScore * 0.3;
    
    // Developer reputation contributes 25%
    score += (100 - developerAnalysis.developerReputation) * 0.25;
    
    // Clone detection contributes 25%
    if (cloneDetection.isLikelyClone) {
      score += 70 * 0.25;
    }
    
    // Metadata suspicion contributes 20%
    score += metadataAnalysis.suspiciousMetadata.length * 10 * 0.2;
    
    return Math.min(100, Math.round(score));
  }

  private determineRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore >= 80) return 'critical';
    if (riskScore >= 60) return 'high';
    if (riskScore >= 40) return 'medium';
    return 'low';
  }

  private identifyThreatCategories(appMetadata: AppMetadata, cloneDetection: any): string[] {
    const categories: string[] = [];
    
    if (cloneDetection.isLikelyClone) categories.push('App Clone');
    if (this.fleecewarePatterns.some(p => appMetadata.appName.toLowerCase().includes(p))) {
      categories.push('Fleeceware');
    }
    if (this.maliciousKeywords.some(k => appMetadata.appName.toLowerCase().includes(k))) {
      categories.push('Malware');
    }
    if (appMetadata.permissions.some(p => this.suspiciousPermissions.has(p))) {
      categories.push('Privacy Risk');
    }
    
    return categories;
  }

  private identifySuspiciousPatterns(appMetadata: AppMetadata, permissionAnalysis: any, cloneDetection: any) {
    const patterns: any[] = [];
    
    if (permissionAnalysis.unusualPermissions.length > 0) {
      patterns.push({
        pattern: 'Unusual Permission Requests',
        severity: 'high' as const,
        confidence: 0.9,
        explanation: `App requests ${permissionAnalysis.unusualPermissions.join(', ')} which are unusual for this app type`
      });
    }
    
    if (cloneDetection.isLikelyClone) {
      patterns.push({
        pattern: 'Potential App Clone',
        severity: 'critical' as const,
        confidence: cloneDetection.similarity,
        explanation: `App appears to be a clone of ${cloneDetection.originalApp}`
      });
    }
    
    return patterns;
  }

  private generateRecommendations(riskLevel: string, threatCategories: string[], suspiciousPatterns: any[]): string[] {
    const recommendations: string[] = [];
    
    if (riskLevel === 'critical' || riskLevel === 'high') {
      recommendations.push('Do not install this app');
      recommendations.push('Report this app to the app store');
    }
    
    if (threatCategories.includes('App Clone')) {
      recommendations.push('Install the original app from the official developer instead');
    }
    
    if (threatCategories.includes('Privacy Risk')) {
      recommendations.push('Review app permissions carefully before granting access');
    }
    
    if (threatCategories.includes('Fleeceware')) {
      recommendations.push('Be aware of hidden subscription fees');
    }
    
    return recommendations;
  }
}

// Export singleton instance
export const mobileAppAnalyzer = new MobileAppAnalyzer();