// Advanced NLP Analysis for Scam and Phishing Detection
// Detects sophisticated language patterns, urgency tactics, and impersonation attempts

export interface NLPAnalysisResult {
  urgencyScore: number;
  impersonationScore: number;
  threatLanguageScore: number;
  financialRiskScore: number;
  flags: { flag: string; confidence: number; explanation: string }[];
  languagePatterns: string[];
  suspiciousEntities: { entity: string; type: string; context: string }[];
}

export class AdvancedNLPAnalyzer {
  private urgencyKeywords: Set<string> = new Set();
  private impersonationPatterns: RegExp[] = [];
  private financialKeywords: Set<string> = new Set();
  private threatKeywords: Set<string> = new Set();
  private authorityTerms: Set<string> = new Set();
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    this.loadLanguagePatterns();
    this.initialized = true;
    console.log('Advanced NLP Analyzer initialized');
  }

  private loadLanguagePatterns() {
    // Urgency indicators
    this.urgencyKeywords = new Set([
      'urgent', 'immediate', 'expires', 'limited time', 'act now', 'hurry',
      'deadline', 'last chance', 'time sensitive', 'expires today',
      'within 24 hours', 'before midnight', 'don\'t delay', 'instant',
      'asap', 'emergency', 'critical', 'final notice', 'last warning'
    ]);

    // Financial risk keywords
    this.financialKeywords = new Set([
      'money', 'payment', 'credit card', 'bank account', 'routing number',
      'ssn', 'social security', 'tax refund', 'inheritance', 'lottery',
      'winner', 'prize', 'million dollars', 'bitcoin', 'cryptocurrency',
      'investment', 'profit', 'guaranteed returns', 'wire transfer',
      'western union', 'moneygram', 'paypal', 'venmo', 'cashapp'
    ]);

    // Threat and intimidation keywords
    this.threatKeywords = new Set([
      'suspended', 'blocked', 'terminated', 'legal action', 'lawsuit',
      'arrest', 'warrant', 'police', 'investigation', 'fraud alert',
      'security breach', 'compromised', 'hacked', 'unauthorized access',
      'verify identity', 'confirm account', 'update payment method'
    ]);

    // Authority impersonation terms
    this.authorityTerms = new Set([
      'irs', 'fbi', 'police', 'government', 'microsoft', 'apple', 'google',
      'amazon', 'paypal', 'bank', 'visa', 'mastercard', 'american express',
      'wells fargo', 'chase', 'citibank', 'customer service', 'support team',
      'security department', 'fraud prevention', 'account verification'
    ]);

    // Impersonation patterns
    this.impersonationPatterns = [
      /we are (microsoft|apple|google|amazon|paypal)/gi,
      /this is .* from (the irs|fbi|police department)/gi,
      /(bank|financial institution) security (alert|department)/gi,
      /your (microsoft|apple|google) account/gi,
      /(customer|technical) support (team|department)/gi
    ];
  }

  async analyzeText(text: string): Promise<NLPAnalysisResult> {
    await this.initialize();

    const cleanText = text.toLowerCase().trim();
    const sentences = this.splitIntoSentences(cleanText);
    
    const urgencyScore = this.calculateUrgencyScore(cleanText, sentences);
    const impersonationScore = this.calculateImpersonationScore(cleanText);
    const threatLanguageScore = this.calculateThreatScore(cleanText);
    const financialRiskScore = this.calculateFinancialRiskScore(cleanText);
    
    const flags = this.generateFlags(cleanText, {
      urgencyScore,
      impersonationScore,
      threatLanguageScore,
      financialRiskScore
    });
    
    const languagePatterns = this.detectLanguagePatterns(cleanText);
    const suspiciousEntities = this.extractSuspiciousEntities(cleanText);

    return {
      urgencyScore,
      impersonationScore,
      threatLanguageScore,
      financialRiskScore,
      flags,
      languagePatterns,
      suspiciousEntities
    };
  }

  private splitIntoSentences(text: string): string[] {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  }

  private calculateUrgencyScore(text: string, sentences: string[]): number {
    let score = 0;
    const wordCount = text.split(/\s+/).length;
    
    // Count urgency keywords
    for (const keyword of this.urgencyKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = (text.match(regex) || []).length;
      score += matches * 15;
    }
    
    // Check for time pressure patterns
    const timePatterns = [
      /within \d+ (hours?|minutes?|days?)/gi,
      /expires? (today|tomorrow|soon)/gi,
      /before \d+/gi,
      /only \d+ (hours?|minutes?|days?) (left|remaining)/gi
    ];
    
    timePatterns.forEach(pattern => {
      if (pattern.test(text)) score += 20;
    });
    
    // Check for excessive capitalization
    const capsWords = (text.match(/\b[A-Z]{3,}\b/g) || []).length;
    score += Math.min(capsWords * 5, 25);
    
    // Check for excessive exclamation marks
    const exclamations = (text.match(/!/g) || []).length;
    score += Math.min(exclamations * 3, 20);
    
    // Normalize by text length
    if (wordCount > 0) {
      score = (score / wordCount) * 100;
    }
    
    return Math.min(100, score);
  }

  private calculateImpersonationScore(text: string): number {
    let score = 0;
    
    // Check for authority impersonation
    for (const term of this.authorityTerms) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      if (regex.test(text)) {
        score += 25;
      }
    }
    
    // Check impersonation patterns
    this.impersonationPatterns.forEach(pattern => {
      if (pattern.test(text)) {
        score += 30;
      }
    });
    
    // Check for fake credentials
    if (/employee id|badge number|reference number/gi.test(text)) {
      score += 20;
    }
    
    // Check for official-sounding language
    if (/official (notice|communication|document)/gi.test(text)) {
      score += 15;
    }
    
    return Math.min(100, score);
  }

  private calculateThreatScore(text: string): number {
    let score = 0;
    
    // Count threat keywords
    for (const keyword of this.threatKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      if (regex.test(text)) {
        score += 20;
      }
    }
    
    // Check for consequences language
    const consequencePatterns = [
      /will be (suspended|terminated|blocked|closed)/gi,
      /legal action will be taken/gi,
      /account will be (frozen|locked|suspended)/gi,
      /failure to (respond|comply|verify)/gi
    ];
    
    consequencePatterns.forEach(pattern => {
      if (pattern.test(text)) score += 25;
    });
    
    return Math.min(100, score);
  }

  private calculateFinancialRiskScore(text: string): number {
    let score = 0;
    
    // Count financial keywords
    for (const keyword of this.financialKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      if (regex.test(text)) {
        score += 15;
      }
    }
    
    // Check for requests for financial information
    const financialRequestPatterns = [
      /enter.*(credit card|bank account|ssn|social security)/gi,
      /provide.*(payment|financial|banking) (information|details)/gi,
      /verify.*(account|payment) (information|details)/gi,
      /update.*(payment|billing) (method|information)/gi
    ];
    
    financialRequestPatterns.forEach(pattern => {
      if (pattern.test(text)) score += 30;
    });
    
    // Check for too-good-to-be-true offers
    if (/guaranteed.*(profit|return|money)/gi.test(text)) {
      score += 25;
    }
    
    return Math.min(100, score);
  }

  private generateFlags(text: string, scores: any): { flag: string; confidence: number; explanation: string }[] {
    const flags: { flag: string; confidence: number; explanation: string }[] = [];
    
    if (scores.urgencyScore > 40) {
      flags.push({
        flag: 'High Urgency Language',
        confidence: scores.urgencyScore / 100,
        explanation: 'Text contains multiple urgency indicators and time pressure tactics commonly used in scams'
      });
    }
    
    if (scores.impersonationScore > 30) {
      flags.push({
        flag: 'Authority Impersonation',
        confidence: scores.impersonationScore / 100,
        explanation: 'Text appears to impersonate legitimate organizations or authorities'
      });
    }
    
    if (scores.threatLanguageScore > 35) {
      flags.push({
        flag: 'Threatening Language',
        confidence: scores.threatLanguageScore / 100,
        explanation: 'Text contains threatening language about account suspension or legal consequences'
      });
    }
    
    if (scores.financialRiskScore > 30) {
      flags.push({
        flag: 'Financial Information Request',
        confidence: scores.financialRiskScore / 100,
        explanation: 'Text requests sensitive financial information or offers suspicious financial opportunities'
      });
    }
    
    // Grammar and spelling analysis
    const grammarScore = this.analyzeGrammarAndSpelling(text);
    if (grammarScore > 50) {
      flags.push({
        flag: 'Poor Grammar/Spelling',
        confidence: grammarScore / 100,
        explanation: 'Text contains multiple grammatical errors and spelling mistakes typical of scam communications'
      });
    }
    
    return flags;
  }

  private analyzeGrammarAndSpelling(text: string): number {
    let score = 0;
    
    // Common misspellings in scams
    const commonMisspellings = [
      'recieve', 'seperate', 'teh', 'adn', 'hte', 'youre', 'there account',
      'you account', 'verificiation', 'secuirty', 'suspeneded'
    ];
    
    commonMisspellings.forEach(misspelling => {
      if (text.includes(misspelling)) score += 15;
    });
    
    // Check for inconsistent capitalization
    const sentences = this.splitIntoSentences(text);
    let capitalErrors = 0;
    sentences.forEach(sentence => {
      if (sentence.length > 0 && sentence[0] !== sentence[0].toUpperCase()) {
        capitalErrors++;
      }
    });
    score += (capitalErrors / sentences.length) * 30;
    
    return Math.min(100, score);
  }

  private detectLanguagePatterns(text: string): string[] {
    const patterns: string[] = [];
    
    // Detect common scam phrases
    const scamPhrases = [
      'congratulations, you have won',
      'verify your account immediately',
      'click here to claim',
      'limited time offer',
      'act now or lose',
      'this is not a scam',
      '100% guaranteed',
      'no risk involved',
      'government grant',
      'work from home'
    ];
    
    scamPhrases.forEach(phrase => {
      if (text.includes(phrase)) {
        patterns.push(`Scam phrase detected: "${phrase}"`);
      }
    });
    
    // Detect phishing patterns
    if (/click (here|below|this link)/gi.test(text)) {
      patterns.push('Contains suspicious click instructions');
    }
    
    if (/download (attachment|file)/gi.test(text)) {
      patterns.push('Requests file download');
    }
    
    return patterns;
  }

  private extractSuspiciousEntities(text: string): { entity: string; type: string; context: string }[] {
    const entities: { entity: string; type: string; context: string }[] = [];
    
    // Extract URLs
    const urlPattern = /(https?:\/\/[^\s]+)/gi;
    const urls = text.match(urlPattern) || [];
    urls.forEach(url => {
      entities.push({
        entity: url,
        type: 'URL',
        context: 'Embedded link requires verification'
      });
    });
    
    // Extract email addresses
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi;
    const emails = text.match(emailPattern) || [];
    emails.forEach(email => {
      entities.push({
        entity: email,
        type: 'Email',
        context: 'Contact information provided'
      });
    });
    
    // Extract phone numbers
    const phonePattern = /(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\(\d{3}\)\s?\d{3}[-.\s]?\d{4})/gi;
    const phones = text.match(phonePattern) || [];
    phones.forEach(phone => {
      entities.push({
        entity: phone,
        type: 'Phone',
        context: 'Phone number provided for contact'
      });
    });
    
    return entities;
  }
}

// Singleton instance
export const advancedNLPAnalyzer = new AdvancedNLPAnalyzer();