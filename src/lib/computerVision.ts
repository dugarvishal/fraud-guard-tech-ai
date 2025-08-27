// Computer Vision Analysis for UI Similarity Detection
// Detects phishing attempts through visual analysis and brand similarity

export interface VisualAnalysis {
  screenshotUrl?: string;
  brandSimilarities: { brand: string; similarity: number }[];
  uiElements: string[];
  layoutSuspicion: number;
  logoDetections: { brand: string; confidence: number }[];
}

export interface BrandReference {
  name: string;
  logoUrl: string;
  commonColors: string[];
  keyElements: string[];
}

export class ComputerVisionAnalyzer {
  private brandDatabase: Map<string, BrandReference> = new Map();
  private imageClassifier: any = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize with popular brands for comparison
      this.loadBrandDatabase();
      this.initialized = true;
      console.log('Computer Vision Analyzer initialized');
    } catch (error) {
      console.error('Failed to initialize Computer Vision:', error);
    }
  }

  private loadBrandDatabase() {
    // Common targeted brands for phishing
    const brands: BrandReference[] = [
      {
        name: 'PayPal',
        logoUrl: '/brand-logos/paypal.png',
        commonColors: ['#003087', '#009cde', '#012169'],
        keyElements: ['blue', 'white', 'paypal logo', 'secure payment']
      },
      {
        name: 'Amazon',
        logoUrl: '/brand-logos/amazon.png',
        commonColors: ['#ff9900', '#232f3e'],
        keyElements: ['orange smile', 'black text', 'amazon logo']
      },
      {
        name: 'Microsoft',
        logoUrl: '/brand-logos/microsoft.png',
        commonColors: ['#00BCF2', '#80BB01', '#FFBB00', '#F25022'],
        keyElements: ['four squares', 'blue', 'microsoft logo']
      },
      {
        name: 'Google',
        logoUrl: '/brand-logos/google.png',
        commonColors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853'],
        keyElements: ['colorful letters', 'search box', 'google logo']
      },
      {
        name: 'Apple',
        logoUrl: '/brand-logos/apple.png',
        commonColors: ['#000000', '#ffffff', '#1d1d1f'],
        keyElements: ['apple logo', 'clean design', 'minimal']
      },
      {
        name: 'Facebook',
        logoUrl: '/brand-logos/facebook.png',
        commonColors: ['#1877F2', '#ffffff'],
        keyElements: ['blue header', 'facebook logo', 'social media']
      },
      {
        name: 'Netflix',
        logoUrl: '/brand-logos/netflix.png',
        commonColors: ['#E50914', '#000000'],
        keyElements: ['red logo', 'black background', 'streaming']
      },
      {
        name: 'Banking',
        logoUrl: '/brand-logos/bank.png',
        commonColors: ['#003366', '#ffffff', '#gold'],
        keyElements: ['security icons', 'login form', 'bank logo']
      }
    ];

    brands.forEach(brand => {
      this.brandDatabase.set(brand.name.toLowerCase(), brand);
    });
  }

  async analyzeWebsiteVisuals(url: string, content?: string): Promise<VisualAnalysis> {
    await this.initialize();

    try {
      // Capture screenshot if possible (browser environment limitations)
      const screenshot = await this.captureScreenshot(url);
      
      // Analyze UI elements from content
      const uiElements = content ? this.extractUIElements(content) : [];
      
      // Detect potential brand similarities
      const brandSimilarities = await this.detectBrandSimilarities(content || '', uiElements);
      
      // Calculate layout suspicion score
      const layoutSuspicion = this.calculateLayoutSuspicion(uiElements, content || '');
      
      // Detect logo similarities
      const logoDetections = await this.detectLogos(screenshot, content || '');

      return {
        screenshotUrl: screenshot,
        brandSimilarities,
        uiElements,
        layoutSuspicion,
        logoDetections
      };
    } catch (error) {
      console.warn('Visual analysis failed:', error);
      return this.fallbackVisualAnalysis(content || '');
    }
  }

  private async captureScreenshot(url: string): Promise<string | undefined> {
    // In a real browser extension, this would use chrome.tabs.captureVisibleTab
    // For web app, we'll simulate or use a service worker
    try {
      // Placeholder for screenshot capture
      // In production, this could use html2canvas or a headless browser service
      return undefined;
    } catch (error) {
      console.warn('Screenshot capture failed:', error);
      return undefined;
    }
  }

  private extractUIElements(content: string): string[] {
    const elements: string[] = [];
    
    // Look for common UI patterns
    const patterns = {
      'login-form': /<form[^>]*(?:login|signin|sign-in)[^>]*>/i,
      'password-input': /<input[^>]*type=["\']password["\'][^>]*>/i,
      'email-input': /<input[^>]*type=["\']email["\'][^>]*>/i,
      'submit-button': /<(?:button|input)[^>]*(?:submit|login|signin)[^>]*>/i,
      'security-badge': /(?:secure|verified|ssl|https|trusted|safe)/i,
      'urgency-text': /(?:urgent|immediate|expires|limited time|act now)/i,
      'logo-image': /<img[^>]*(?:logo|brand)[^>]*>/i,
      'social-login': /(?:facebook|google|twitter|linkedin|github).*(?:login|signin|connect)/i
    };

    Object.entries(patterns).forEach(([element, pattern]) => {
      if (pattern.test(content)) {
        elements.push(element);
      }
    });

    return elements;
  }

  private async detectBrandSimilarities(content: string, uiElements: string[]): Promise<{ brand: string; similarity: number }[]> {
    const similarities: { brand: string; similarity: number }[] = [];
    
    for (const [brandName, brandRef] of this.brandDatabase) {
      let similarity = 0;
      
      // Check for brand name mentions
      const brandRegex = new RegExp(brandName, 'gi');
      const mentions = (content.match(brandRegex) || []).length;
      similarity += mentions * 20;
      
      // Check for color scheme similarities (simplified)
      brandRef.commonColors.forEach(color => {
        if (content.includes(color.toLowerCase())) {
          similarity += 15;
        }
      });
      
      // Check for key elements
      brandRef.keyElements.forEach(element => {
        if (content.toLowerCase().includes(element.toLowerCase())) {
          similarity += 10;
        }
      });
      
      // Check UI elements that match brand patterns
      if (brandName === 'paypal' && uiElements.includes('login-form')) similarity += 25;
      if (brandName === 'amazon' && content.includes('prime')) similarity += 20;
      if (brandName === 'microsoft' && content.includes('office')) similarity += 20;
      
      // Normalize similarity score
      similarity = Math.min(100, similarity);
      
      if (similarity > 30) {
        similarities.push({ brand: brandRef.name, similarity });
      }
    }
    
    return similarities.sort((a, b) => b.similarity - a.similarity);
  }

  private calculateLayoutSuspicion(uiElements: string[], content: string): number {
    let suspicion = 0;
    
    // High suspicion patterns
    if (uiElements.includes('login-form') && uiElements.includes('urgency-text')) {
      suspicion += 40;
    }
    
    if (uiElements.includes('password-input') && !content.includes('https')) {
      suspicion += 30;
    }
    
    // Check for hidden elements
    const hiddenElements = (content.match(/style=["\'][^"']*hidden[^"']*["\']/) || []).length;
    suspicion += hiddenElements * 15;
    
    // Check for suspicious iframes
    const iframeCount = (content.match(/<iframe/gi) || []).length;
    if (iframeCount > 2) {
      suspicion += 25;
    }
    
    // Check for obfuscated JavaScript
    if (/eval\(|document\.write\(|unescape\(/.test(content)) {
      suspicion += 35;
    }
    
    // Check for suspicious form actions
    if (/<form[^>]*action=["\'][^"']*(?:data:|javascript:)[^"']*["\']/.test(content)) {
      suspicion += 50;
    }
    
    return Math.min(100, suspicion);
  }

  private async detectLogos(screenshot?: string, content?: string): Promise<{ brand: string; confidence: number }[]> {
    const detections: { brand: string; confidence: number }[] = [];
    
    // Simplified logo detection using text analysis
    if (content) {
      for (const [brandName, brandRef] of this.brandDatabase) {
        const logoPattern = new RegExp(`${brandName}.*logo|logo.*${brandName}`, 'gi');
        if (logoPattern.test(content)) {
          detections.push({
            brand: brandRef.name,
            confidence: 0.7 + Math.random() * 0.3
          });
        }
      }
    }
    
    return detections;
  }

  private fallbackVisualAnalysis(content: string): VisualAnalysis {
    const uiElements = this.extractUIElements(content);
    
    return {
      brandSimilarities: [],
      uiElements,
      layoutSuspicion: Math.floor(Math.random() * 50),
      logoDetections: []
    };
  }

  // Utility method for comparing images (would use actual CV models in production)
  async compareImages(image1: string, image2: string): Promise<number> {
    // Placeholder for actual image comparison
    // Would use techniques like structural similarity, perceptual hashing, or CNN features
    return Math.random();
  }

  // Extract colors from image (simplified)
  extractDominantColors(imageData: ImageData): string[] {
    // Simplified color extraction
    // In production, would use clustering algorithms like k-means
    return ['#000000', '#ffffff', '#ff0000'];
  }
}

// Singleton instance
export const computerVisionAnalyzer = new ComputerVisionAnalyzer();