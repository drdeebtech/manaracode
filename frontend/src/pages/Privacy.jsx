import LegalPage, { Section, P, A } from '../components/LegalPage'

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy"
      updated="June 8, 2026"
      intro="This Privacy Policy explains what personal data manaracode (“we”, “us”) collects through manaracode.com, why we collect it, and the choices you have. We collect as little as possible and never sell your data."
    >
      <Section heading="What we collect">
        <P>
          When you submit the contact form, we collect the <strong>name</strong>, <strong>email
          address</strong>, and <strong>message</strong> you provide. Our server also records your{' '}
          <strong>IP address</strong> and standard request logs for a short period, used only to
          prevent spam and abuse (rate limiting and bot protection).
        </P>
        <P>We do not collect any data through the rest of the site beyond standard, privacy-preserving analytics (below).</P>
      </Section>

      <Section heading="Why we collect it">
        <P>
          We use your contact-form details for one purpose: to read and respond to your enquiry. The
          legal basis is your consent in choosing to contact us, together with our legitimate
          interest in replying. We do not use this information for marketing and maintain no mailing list.
        </P>
      </Section>

      <Section heading="Where your data is stored">
        <P>
          Contact submissions are stored in a database on our server hosted in the European Union
          (Frankfurt, Germany). Notification emails are delivered through Amazon Simple Email Service.
        </P>
      </Section>

      <Section heading="Service providers">
        <P>
          We rely on a small number of providers who process data on our behalf under their own terms:
        </P>
        <ul className="list-disc list-inside text-muted leading-relaxed space-y-1">
          <li><strong>Cloudflare</strong> — content delivery, security, bot protection, and cookieless analytics.</li>
          <li><strong>Amazon Web Services</strong> — server hosting and email delivery.</li>
        </ul>
      </Section>

      <Section heading="Bot protection">
        <P>
          The contact form is protected by Cloudflare Turnstile to keep out automated spam. It may
          process limited technical signals from your browser solely to tell humans from bots; it
          does not track you across sites.
        </P>
      </Section>

      <Section heading="Analytics & cookies">
        <P>
          We use Cloudflare Web Analytics, which is privacy-friendly: it sets <strong>no cookies</strong>,
          does not fingerprint you, and does not track you across other websites. The site sets no
          advertising or tracking cookies of its own.
        </P>
      </Section>

      <Section heading="How long we keep it">
        <P>
          We keep contact submissions only as long as needed to handle your enquiry and any follow-up,
          then delete them. Short-lived request logs are rotated automatically.
        </P>
      </Section>

      <Section heading="Your rights">
        <P>
          You can ask us to access, correct, or delete the personal data you have shared with us, or
          object to our use of it. To make a request, email{' '}
          <A href="mailto:contact@manaracode.com">contact@manaracode.com</A> and we will respond
          promptly.
        </P>
      </Section>

      <Section heading="Changes to this policy">
        <P>We may update this policy from time to time. The date at the top reflects the latest version.</P>
      </Section>

      <Section heading="Contact">
        <P>
          Questions about this policy or your data? Email{' '}
          <A href="mailto:contact@manaracode.com">contact@manaracode.com</A>.
        </P>
      </Section>
    </LegalPage>
  )
}
