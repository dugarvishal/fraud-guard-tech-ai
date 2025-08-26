import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Scale, AlertCircle, CheckCircle, XCircle } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-hero">
                <Scale className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>
            <p className="text-xl text-muted-foreground">
              Last updated: January 2025
            </p>
          </div>

          <div className="prose prose-gray max-w-none space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <h2 className="text-2xl font-semibold text-foreground">Acceptance of Terms</h2>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <p className="text-muted-foreground">
                  By accessing and using FraudGuard AI services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-orange-500" />
                <h2 className="text-2xl font-semibold text-foreground">Service Description</h2>
              </div>
              <div className="bg-card p-6 rounded-lg border space-y-4">
                <p className="text-muted-foreground">
                  FraudGuard AI provides automated fraud detection and security analysis services using artificial intelligence and machine learning technologies.
                </p>
                <h3 className="text-lg font-medium">Our Services Include:</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>URL and website security analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>File and document fraud detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Risk scoring and threat assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Educational resources and security guidance</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">User Responsibilities</h2>
              <div className="bg-card p-6 rounded-lg border space-y-4">
                <p className="text-muted-foreground">By using our services, you agree to:</p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide accurate and truthful information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use the service only for legitimate security analysis purposes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Not attempt to circumvent or manipulate our detection systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Comply with all applicable laws and regulations</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-6 w-6 text-red-500" />
                <h2 className="text-2xl font-semibold text-foreground">Prohibited Uses</h2>
              </div>
              <div className="bg-card p-6 rounded-lg border space-y-4">
                <p className="text-muted-foreground">You may not use our service to:</p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Analyze content that you do not own or have permission to analyze</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Attempt to reverse engineer our detection algorithms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use the service for illegal or harmful activities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Overload or disrupt our systems through excessive requests</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Limitation of Liability</h2>
              <div className="bg-card p-6 rounded-lg border">
                <p className="text-muted-foreground">
                  FraudGuard AI provides analysis results as a security tool and educational resource. While we strive for accuracy, our service should not be the sole basis for critical security decisions. We are not liable for any damages resulting from the use or inability to use our services.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Service Availability</h2>
              <div className="bg-card p-6 rounded-lg border">
                <p className="text-muted-foreground">
                  We strive to maintain high service availability but do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue any aspect of the service with reasonable notice.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Changes to Terms</h2>
              <div className="bg-card p-6 rounded-lg border">
                <p className="text-muted-foreground">
                  We may update these terms from time to time. Users will be notified of significant changes via email or through the platform. Continued use of the service after changes constitutes acceptance of the new terms.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Contact Information</h2>
              <div className="bg-card p-6 rounded-lg border">
                <p className="text-muted-foreground">
                  For questions about these Terms of Service, please contact us at:
                </p>
                <p className="mt-2 font-medium text-foreground">legal@fraudguard.ai</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;