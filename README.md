# Amprex - SaaS & Modern Digital Agency Website

Official website for Amprex, built with modern responsive web technologies, interactive animations, Framer components, and Vercel serverless contact APIs.

## Features
- **Modern Responsive Design**: Optimized for desktop, tablet, and mobile devices.
- **Meta Pixel Tracking**: Integrated Meta Pixel tracking with custom `Lead` events for form submissions.
- **Serverless Form Handling**: Secure Node.js contact and newsletter API with spam honeypot filters.
- **SEO & Social Sharing**: Pre-configured OpenGraph tags and metadata across all pages.

## Project Structure
- `index.html` - Homepage
- `about/` - About Us page
- `service/` - Services overview & individual service offerings
- `case-study/` - Case studies and portfolio
- `blog/` - Insights and blog articles
- `contact/` - Contact page with inquiry form
- `api/contact.js` - Serverless contact and newsletter submission endpoint
- `assets/` - Stylesheets, fonts, media, and client-side scripts (`contact.js`, `socials.js`)

## Deployment
Configured for deployment on [Vercel](https://vercel.com).

## Form tracking

The shared `assets/tracking.js` initializes Pixel `1100681762872290` once per document. A delivered contact enquiry sends the standard `Lead` event. A newsletter subscription sends the custom `NewsletterSignup` event, so newsletter signups do not count as contact leads. Validation errors, honeypot submissions and SMTP failures do not send conversions.

The API must have working SMTP credentials. Missing SMTP configuration returns an error instead of reporting a successful submission. Contact email links use `hello.amprex@gmail.com`; template telephone links now point to that email because no business phone number was supplied.

### Optional Conversions API

Server tracking is disabled by default. To enable it, configure these server-only Vercel environment variables after reviewing the website's consent and privacy requirements:

- `META_CAPI_ENABLED=true`
- `META_CAPI_ACCESS_TOKEN`: the token for this dataset; never commit it or put it in browser code.
- `META_GRAPH_API_VERSION`: a supported Graph API version from Meta's current setup instructions.
- `META_TEST_EVENT_CODE`: optional code from Events Manager for verification; remove it after testing.

Browser and server conversions share the same event name and ID for deduplication. Server events include hashed email/phone and available browser identifiers. Source URLs exclude query strings. A CAPI outage does not turn a delivered email into a failed enquiry.

After deployment, use Events Manager Test Events to verify one contact `Lead`, a separate newsletter event, and browser/server deduplication if CAPI is enabled. Local simulations do not prove delivery to Gmail or Meta in production.

## Verification

Install dependencies with `npm ci`, then run `npm test` (or `node --test tests/*.test.js`). Tests cover delivery gating, event IDs, initialization guards, newsletter separation and exported-page links.

For a local browser simulation, run `node tests/serve.js` and open `http://127.0.0.1:4173/contact`. This local-only server captures mail and Pixel calls without sending them externally. Use `fail@example.com` to simulate a delivery failure. It is a test server, not a production deployment command.
