import LegalPage, { Section, P, A } from '../components/LegalPage'

// NOTE FOR OWNER: governing-law jurisdiction is intentionally left general
// ("the laws applicable to our place of business"). Before relying on these
// terms commercially, set your specific jurisdiction and have them reviewed by
// a lawyer for your market.
export default function Terms() {
  return (
    <LegalPage
      title="Terms of Use"
      path="/terms"
      updated="June 8, 2026"
      intro="These Terms of Use govern your access to and use of manaracode.com. By using this website, you agree to them. If you do not agree, please do not use the site."
    >
      <Section heading="Use of the site">
        <P>
          This website is provided for general information about manaracode and our work. You may view
          and share it for lawful, personal, and business purposes. You agree not to misuse the site,
          interfere with its normal operation, or attempt to access it in any unauthorised way.
        </P>
      </Section>

      <Section heading="The contact form">
        <P>
          When you use the contact form, you agree to provide accurate information and not to submit
          unlawful, abusive, or infringing content. We may decline to respond to, or may remove, any
          submission at our discretion.
        </P>
      </Section>

      <Section heading="Intellectual property">
        <P>
          The content, design, and code of this site are owned by manaracode unless stated otherwise.
          Third-party names, logos, and projects referenced on the site belong to their respective
          owners and are used for identification only.
        </P>
      </Section>

      <Section heading="External links">
        <P>
          The site may link to third-party websites we do not control. We are not responsible for the
          content, policies, or practices of those sites.
        </P>
      </Section>

      <Section heading="No warranty">
        <P>
          The site is provided “as is” and “as available”, without warranties of any kind, whether
          express or implied. We do not guarantee that it will be uninterrupted, error-free, or secure.
        </P>
      </Section>

      <Section heading="Limitation of liability">
        <P>
          To the fullest extent permitted by law, manaracode will not be liable for any indirect,
          incidental, or consequential damages arising from your use of, or inability to use, this site.
        </P>
      </Section>

      <Section heading="Changes to these terms">
        <P>We may update these terms from time to time. The date at the top reflects the latest version.</P>
      </Section>

      <Section heading="Governing law">
        <P>
          These terms are governed by the laws applicable to our place of business, without regard to
          conflict-of-law rules.
        </P>
      </Section>

      <Section heading="Contact">
        <P>
          Questions about these terms? Email{' '}
          <A href="mailto:contact@manaracode.com">contact@manaracode.com</A>.
        </P>
      </Section>
    </LegalPage>
  )
}
