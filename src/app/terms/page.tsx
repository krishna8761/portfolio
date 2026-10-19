import type { Metadata } from "next";
import Link from "next/link";
import Legal, { type LegalSection } from "@/components/Legal";
import { LEGAL_UPDATED, studio, engagements } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Terms",
  description:
    "Terms for using the Monark Studio website, and the standard terms we work under: fees in USD, payment, ownership, AI and automation, and cancellation.",
  path: "/terms",
});

const email = <a href={`mailto:${studio.email}`}>{studio.email}</a>;
const [diagnostic] = engagements;

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: (
      <>
        <p>
          These terms cover two things: <strong>using this website</strong> (sections 2 to 7) and{" "}
          <strong>working with {studio.name}</strong> (sections 8 to 16). By using the site you agree to the first part.
          If you hire us, the second part applies, together with the written scope and price we agree with you. If the two
          conflict, your signed agreement wins.
        </p>
        <p>
          &ldquo;We&rdquo;, &ldquo;us&rdquo; and &ldquo;the studio&rdquo; mean {studio.name}, based in {studio.city}. Read
          our <Link href="/privacy">Privacy Policy</Link> to see how we handle your data.
        </p>
      </>
    ),
  },
  {
    id: "information",
    title: "Information on this site",
    body: (
      <>
        <p>
          Prices are in US dollars and are starting prices. The fixed price for your project is set in writing, at the
          end of the Blueprint stage, before any build work begins. Hours-saved figures are typical examples, not
          promises about your business.
        </p>
        <p>
          Some projects shown in our work are labelled as <strong>concept</strong> or <strong>demo</strong> sites. These
          are examples of our work, not endorsements by or partnerships with the brands named. Names, logos and
          trademarks belong to their owners.
        </p>
      </>
    ),
  },
  {
    id: "ownership-of-site",
    title: "Our content",
    body: (
      <p>
        The design, code, writing and layout of this site belong to {studio.name}. Third-party images and brand names
        remain the property of their owners. You may link to our pages and quote short extracts with credit, but please
        don&apos;t copy or republish our work without permission.
      </p>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <p>
        Please don&apos;t misuse the site: no attempts to break or overload it, no automated scraping that harms it, and
        no fake or spam bookings. We may block access or cancel a booking if the site or our time is being abused.
      </p>
    ),
  },
  {
    id: "booking-a-call",
    title: "Booking a call",
    body: (
      <>
        <p>
          The discovery call is free and carries no obligation on either side. It does not create a contract for services
          and is not professional, legal or financial advice.
        </p>
        <p>
          If you can&apos;t make your slot, reply to your confirmation email so we can move it. We may need to reschedule
          too, and will tell you as early as we can.
        </p>
      </>
    ),
  },
  {
    id: "site-availability",
    title: "Availability and third-party links",
    body: (
      <p>
        We try to keep the site running but provide it &ldquo;as is&rdquo;, without a guarantee that it will always be
        available or error-free. Links to other sites, including live concept sites, are for your convenience, and we are
        not responsible for their content.
      </p>
    ),
  },
  {
    id: "site-liability",
    title: "Liability for the website",
    body: (
      <p>
        To the extent the law allows, we are not liable for indirect or consequential loss arising from your use of this
        website. Nothing in these terms limits liability that cannot legally be limited, such as for fraud or for death or
        personal injury caused by negligence.
      </p>
    ),
  },
  {
    id: "how-we-work",
    title: "How we work",
    body: (
      <p>
        Engagements follow the stages on our <Link href="/process">Process</Link> page: Diagnose, Blueprint, Build,
        Launch and, optionally, Run. At the end of the Blueprint we give you a written scope, timeline and fixed price.
        Build work starts once you have approved it in writing. Our <Link href="/engagements">Engagements</Link> page
        lists current starting prices.
      </p>
    ),
  },
  {
    id: "fees",
    title: "Fees and payment",
    body: (
      <>
        <ul>
          <li>
            <strong>Diagnostic</strong> ({diagnostic.price}): paid upfront, and credited in full against a Build you start
            within 60 days.
          </li>
          <li>
            <strong>Builds:</strong> 50% to start, 50% at launch.
          </li>
          <li>
            <strong>Partnerships:</strong> billed monthly in advance, with a three-month minimum.
          </li>
        </ul>
        <p>
          We invoice in USD. Fees exclude any taxes that apply, and any bank or transfer charges. If an invoice is overdue
          we may pause work until it is paid.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-scope",
    title: "Changes to the scope",
    body: (
      <p>
        If you want something that is not in the agreed scope, we will describe the change and its effect on price and
        timeline in writing first, and begin the extra work only once you approve it.
      </p>
    ),
  },
  {
    id: "your-part",
    title: "What we need from you",
    body: (
      <p>
        Access to the tools involved, the content and information the work needs, timely feedback, and one person with
        authority to sign things off. Delays on your side can move the timeline.
      </p>
    ),
  },
  {
    id: "ownership",
    title: "Ownership and portfolio",
    body: (
      <>
        <p>
          Once you have paid in full, the deliverables we create for you (the code, designs and the accounts set up in your
          name) belong to you. We keep ownership of our pre-existing tools, templates and know-how, and you receive the
          right to use them as part of your deliverables. Open-source and third-party components stay under their own
          licences.
        </p>
        <p>We will ask before showing your project publicly in our portfolio or elsewhere.</p>
      </>
    ),
  },
  {
    id: "ai-automation",
    title: "AI and automation",
    body: (
      <>
        <p>
          Systems we build may use third-party AI models and services. AI output can be wrong or incomplete, so you should
          review anything important before relying on it, and you remain responsible for how you use these systems with
          your customers.
        </p>
        <p>
          That includes meeting the rules that apply to you, such as consent for call recording, permission to message
          people on WhatsApp or email, and data protection law. We will flag the requirements we know of during the
          Blueprint, but we cannot give legal advice.
        </p>
      </>
    ),
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    body: (
      <p>
        We keep your non-public business information confidential and use it only to do the work. This does not apply to
        information that is already public, or that we are legally required to disclose.
      </p>
    ),
  },
  {
    id: "ending",
    title: "Ending the work",
    body: (
      <>
        <p>
          Either side can stop after any stage by telling the other in writing. You pay for the work completed up to the
          end of that stage, and everything you have paid for is yours to keep. The Diagnostic fee is not refundable once
          the Diagnostic has begun, but it is credited against a Build as described above.
        </p>
        <p>
          After launch, we fix defects in what we delivered under the support terms in your agreement. Ongoing
          maintenance and improvements are available through Run or a Partnership.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Liability, law and changes",
    body: (
      <>
        <p>
          We work carefully, but we cannot promise particular business results, such as hours saved, leads or revenue. To
          the extent the law allows, our total liability for any engagement is limited to the fees you paid for it, and we
          are not liable for indirect or consequential loss. Nothing here limits liability that cannot legally be
          limited.
        </p>
        <p>
          These terms are governed by the laws of India, and the courts of Bhopal, Madhya Pradesh have jurisdiction,
          unless your signed agreement says otherwise. We may update these terms from time to time; the date at the top
          shows the latest version, and changes do not alter an agreement that is already signed.
        </p>
        <p>Questions? Email {email}.</p>
      </>
    ),
  },
];

export default function Terms() {
  return (
    <Legal
      name="Terms"
      path="/terms"
      title="Terms"
      updated={LEGAL_UPDATED}
      intro={
        <p>
          Plain-English terms for using this site and for working with us. Your signed agreement and written scope always
          take priority over this page.
        </p>
      }
      sections={sections}
    />
  );
}
