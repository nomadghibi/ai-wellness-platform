import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — AI Wellness Platform",
};

export default function TermsPage() {
  return (
    <>
      <h1>Terms of Service</h1>
      <p className="text-sm text-gray-500">Last updated: July 2025</p>

      <h2>1. Acceptance</h2>
      <p>
        By creating an account or using the AI Wellness Platform (&ldquo;Service&rdquo;), you agree
        to these Terms of Service. If you do not agree, do not use the Service.
      </p>

      <h2>2. Not medical advice</h2>
      <p>
        <strong>
          The Service is a wellness coaching tool and does not provide medical advice, diagnosis, or
          treatment.
        </strong>{" "}
        Always seek professional medical advice before making changes to your diet, exercise, or
        medication. In an emergency, contact your local emergency services immediately.
      </p>

      <h2>3. Eligibility</h2>
      <p>
        You must be at least 18 years old to use the Service. By registering, you confirm that you
        meet this requirement.
      </p>

      <h2>4. Your account</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account credentials. You
        must notify us immediately of any unauthorised use of your account.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You may not:</p>
      <ul>
        <li>Use the Service for any unlawful purpose</li>
        <li>Attempt to reverse-engineer or interfere with the Service</li>
        <li>Use automated scripts to send messages via WhatsApp integration</li>
        <li>Share your account with others</li>
      </ul>

      <h2>6. AI limitations</h2>
      <p>
        AI-generated responses may contain errors. The Service&apos;s AI coach is designed to
        support general healthy living and will decline to answer medical questions. You acknowledge
        that AI responses are not a substitute for professional guidance.
      </p>

      <h2>7. Termination</h2>
      <p>
        We may suspend or terminate your account if you violate these Terms. You may delete your
        account at any time from your settings.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, the Service is provided &ldquo;as is&rdquo; without
        warranty. We are not liable for any indirect, incidental, or consequential damages arising
        from your use of the Service.
      </p>

      <h2>9. Changes</h2>
      <p>
        We may update these Terms. Continued use of the Service after changes constitutes
        acceptance. Significant changes will be communicated via email.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions? Contact us at <a href="mailto:legal@example.com">legal@example.com</a>.
      </p>
    </>
  );
}
