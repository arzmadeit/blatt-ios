import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          className="mb-6 text-gold hover:text-gold-light hover:bg-gold/10"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-display text-gold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

        <div className="space-y-8 text-foreground/90">
          <p>
            Blatt ("we", "our", or "us") operates the Blatt game, available as a mobile application on iOS (the "App").
          </p>
          <p>
            Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.
          </p>

          <section>
            <h2 className="text-xl font-display text-gold mb-4">1. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-gold-light mb-2">a. Information You Provide</h3>
            <p className="mb-2">Blatt collects information that you voluntarily provide when contacting support or submitting feedback, including:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
              <li>Email address</li>
              <li>Messages submitted via support channels</li>
            </ul>

            <h3 className="text-lg font-semibold text-gold-light mb-2">b. Automatically Collected Information</h3>
            <p className="mb-2">When you use the App, we may automatically collect minimal information to improve the game's functionality and stability, including:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
              <li>Device type and operating system</li>
              <li>App version</li>
              <li>IP address</li>
              <li>Usage data (e.g., levels played, time spent in the app)</li>
              <li>Crash and performance data</li>
            </ul>
            <p>This information is used solely to enhance the game experience and ensure stability.</p>
          </section>

          <section>
            <h2 className="text-xl font-display text-gold mb-4">2. How We Use Your Information</h2>
            <p className="mb-2">We use collected information to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
              <li>Maintain and improve the App</li>
              <li>Respond to user inquiries and support requests</li>
              <li>Monitor app performance and detect technical issues</li>
            </ul>
            <p className="font-semibold">We do not sell or share your personal information with third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-display text-gold mb-4">3. Cookies and Tracking Technologies</h2>
            <p className="mb-2">Blatt may use cookies or similar technologies to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
              <li>Maintain game sessions</li>
              <li>Analyze usage patterns for improving gameplay</li>
            </ul>
            <p>You can manage cookies through your device settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-display text-gold mb-4">4. Third-Party Services</h2>
            <p>
              Blatt may use trusted third-party services (e.g., hosting, analytics, or crash reporting providers) that process information on our behalf. These services are only allowed to use data as necessary to provide their services to us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-gold mb-4">5. Data Retention</h2>
            <p>
              We retain personal data only for as long as necessary to provide support and improve the App, unless a longer retention period is required or allowed by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-gold mb-4">6. Data Security</h2>
            <p>
              We implement reasonable measures to protect your information using industry-standard security practices. However, no method of storage or transmission is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-gold mb-4">7. Children's Privacy</h2>
            <p>
              Blatt is not intended for children under the age of 13. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-gold mb-4">8. Your Rights</h2>
            <p className="mb-2">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
              <li>Access your personal data</li>
              <li>Request correction or deletion of your data</li>
              <li>Object to certain data processing</li>
            </ul>
            <p>These rights can be exercised by contacting us via the email below.</p>
          </section>

          <section>
            <h2 className="text-xl font-display text-gold mb-4">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy occasionally. Any changes will be posted on this page with an updated "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-gold mb-4">10. Contact Us</h2>
            <p className="mb-2">If you have any questions about this Privacy Policy or the App, you may contact us at:</p>
            <p>
              Email: <a href="mailto:arzmadeit@gmail.com" className="text-gold hover:text-gold-light underline">arzmadeit@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;