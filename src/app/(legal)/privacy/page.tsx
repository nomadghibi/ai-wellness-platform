import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — AI Wellness Platform",
};

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="text-sm text-gray-500">Last updated: July 2025</p>

      <h2>1. What we collect</h2>
      <p>
        We collect the information you provide during registration (name, email, password) and
        through use of the service (health profile, goals, activity logs, sleep logs, meal logs,
        water logs, and WhatsApp messages).
      </p>

      <h2>2. How we use it</h2>
      <p>
        Your data is used exclusively to provide personalised wellness coaching through the AI
        Wellness Platform. We do not sell your data or share it with third parties for advertising.
      </p>
      <p>
        We share data with the following sub-processors to operate the service:
      </p>
      <ul>
        <li><strong>OpenAI</strong> — AI coaching responses (messages are sent for processing; no training on your data by default)</li>
        <li><strong>Meta / WhatsApp</strong> — message delivery via the WhatsApp Cloud API</li>
        <li><strong>PostgreSQL hosting provider</strong> — secure database storage</li>
      </ul>

      <h2>3. Health data</h2>
      <p>
        We treat wellness data (weight, food intake, activity, sleep, and health conditions) with
        the highest level of care. This information is never exposed to other users and is only used
        to personalise your coaching experience.
      </p>

      <h2>4. Data retention</h2>
      <p>
        We retain your data for as long as your account is active. You may request deletion at any
        time from your account settings. Upon deletion, your personal information is anonymised
        within 30 days.
      </p>

      <h2>5. Security</h2>
      <p>
        Passwords are hashed using bcrypt. All connections use TLS. We do not store payment card
        information directly.
      </p>

      <h2>6. Your rights</h2>
      <p>
        You have the right to access, correct, and delete your personal data. To exercise these
        rights, delete your account in settings or contact us at{" "}
        <a href="mailto:privacy@example.com">privacy@example.com</a>.
      </p>

      <h2>7. Changes</h2>
      <p>
        We may update this policy. Significant changes will be communicated via email or in-app
        notification.
      </p>
    </>
  );
}
