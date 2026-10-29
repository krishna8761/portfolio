import type { Metadata } from "next";
import Link from "next/link";
import Legal, { type LegalSection } from "@/components/Legal";
import { LEGAL_UPDATED, studio } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy",
  description:
    "What personal data Monark Studio collects when you book a call or email us, why, who sees it, how long we keep it, and your rights.",
  path: "/privacy",
});

const email = (
  <a href={`mailto:${studio.email}`}>{studio.email}</a>
);

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          {studio.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a studio based in {studio.city}, led by Krishna Soni. We
          build custom systems, automation and websites for businesses. We decide how and why the personal data
          described here is used.
        </p>
        <p>Questions about privacy go to {email}.</p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    body: (
      <>
        <p>
          <strong>When you book a call</strong> we collect what you type into the form: your name and email, and
          optionally your phone or WhatsApp number, company and any notes. We also collect your answers (what is slowing
          you down, your budget range and timeline), the time you choose, and your browser&apos;s timezone so the invite
          shows the right time.
        </p>
        <p>
          <strong>When you email us</strong> we receive your email address and whatever you send.
        </p>
        <p>
          <strong>Automatically</strong>, our hosting provider records standard request data such as your IP address,
          browser type, the pages requested and timestamps. We use it to keep the site secure and working, not to build
          profiles of visitors.
        </p>
        <p>This site never asks for payment details or government ID. Please don&apos;t send them to us.</p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and tracking",
    body: (
      <>
        <p>
          This site does not set cookies, does not store anything in your browser, and does not use advertising,
          analytics or tracking tools. Fonts, images and videos are served from our own domain rather than from third
          parties.
        </p>
        <p>
          Links to LinkedIn, Instagram and GitHub take you to those services, which have their own privacy policies. If we
          ever add analytics or cookies, we will update this page first.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use your data",
    body: (
      <>
        <ul>
          <li>to arrange the call you booked, and send your confirmation and calendar invite;</li>
          <li>to prepare for the call and reply to you;</li>
          <li>to prepare a proposal if you ask for one, and to run the work if you become a client;</li>
          <li>to keep the site secure and block automated spam;</li>
          <li>to meet legal and accounting obligations.</li>
        </ul>
        <p>
          We don&apos;t sell your data, and we won&apos;t add you to a newsletter or marketing list without asking you
          first.
        </p>
      </>
    ),
  },
  {
    id: "legal-basis",
    title: "Our legal basis",
    body: (
      <>
        <p>
          Where the GDPR or UK GDPR applies, we rely on: <strong>taking steps at your request</strong> before a contract
          (booking and preparing for a call); <strong>our legitimate interests</strong> in running the studio, keeping
          the site secure and answering enquiries; <strong>legal obligations</strong>; and <strong>consent</strong> where
          we ask for it, which you can withdraw at any time.
        </p>
        <p>
          Where India&apos;s Digital Personal Data Protection Act, 2023 applies, we process your data on the basis of your
          consent when you submit the form, and for the other uses that law permits.
        </p>
      </>
    ),
  },
  {
    id: "who-we-share-with",
    title: "Who we share it with",
    body: (
      <>
        <p>We use a small number of service providers to run the site and the booking system:</p>
        <ul>
          <li>
            <strong>Netlify</strong> hosts the website and receives the standard request data described above.
          </li>
          <li>
            <strong>Upstash</strong> provides the database that holds your booking record for 30 days, so that no one
            else can book the same time.
          </li>
          <li>
            <strong>Google</strong> (Gmail) sends your confirmation email, with the calendar invite attached, and holds the
            emails we send and receive.
          </li>
        </ul>
        <p>
          They process data for us under their own terms and may only use it to provide their service. We may also
          disclose data where the law requires it. We do not share your data with advertisers or data brokers.
        </p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "International transfers",
    body: (
      <p>
        We are based in India and our providers operate in several countries, including the United States. Your data may
        therefore be processed outside the country where you live. We choose providers that commit to protecting it
        under contractual terms and security standards.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <>
        <ul>
          <li>
            <strong>Booking record</strong> in our scheduling database: deleted automatically 30 days after you book.
          </li>
          <li>
            <strong>Emails and notes</strong> in our mailbox: kept for as long as needed to deal with your enquiry and any
            work that follows, then deleted when no longer needed, or sooner if you ask us to.
          </li>
          <li>
            <strong>Client records</strong> (contracts and invoices): kept for as long as accounting and tax law require.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <p>
          Depending on where you live, you can ask us to: tell you what we hold about you; correct it; delete it; restrict
          or object to how we use it; give you a copy in a portable format; and withdraw consent you gave us. Email{" "}
          {email} and we will reply within one month.
        </p>
        <p>
          You can also complain to your data protection authority, such as the UK Information Commissioner&apos;s Office,
          your EU supervisory authority, or India&apos;s Data Protection Board. We would appreciate the chance to put
          things right first.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <p>
        The site uses HTTPS, access to booking data is limited to us, and credentials are kept in the hosting
        environment, not in our code. No online service is perfectly secure, so please share only what is needed to book
        a call.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        This site is for businesses and is not directed at children. We do not knowingly collect data from anyone under
        18. If you think we have, tell us and we will delete it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We will update this page when our practices change and revise the date at the top. For anything significant
        affecting people who already booked a call, we will tell them by email. See also our{" "}
        <Link href="/terms">Terms</Link>.
      </p>
    ),
  },
];

export default function Privacy() {
  return (
    <Legal
      name="Privacy Policy"
      path="/privacy"
      title="Privacy Policy"
      updated={LEGAL_UPDATED}
      intro={
        <p>
          Short version: we collect only what you give us when you book a call or email us, we use it to talk to you, we
          don&apos;t sell it, and this site has no cookies or trackers.
        </p>
      }
      sections={sections}
    />
  );
}
