import type { APIRoute } from 'astro';
import { getSectionData, getNavItems, isSectionEnabled } from '../lib/manifest-loader';

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.origin || 'http://localhost:4321';
  const seo = getSectionData('seo') as any;
  const sd = seo.structuredData;

  const propertyName = sd?.propertyName || seo.title || 'Property';
  const propertyType = sd?.propertyType || '';
  const description = seo.description || '';
  const keywords: string[] = seo.keywords || [];

  const priceRange = sd?.priceRange
    ? `${sd.priceRange.currency} ${Number(sd.priceRange.low).toLocaleString()} – ${Number(sd.priceRange.high).toLocaleString()}`
    : '';

  const address = sd?.address
    ? [sd.address.street, sd.address.locality, sd.address.region, sd.address.country].filter(Boolean).join(', ')
    : '';

  const developerName = sd?.developer?.name || '';
  const developerUrl = sd?.developer?.url || '';

  const navLinks = getNavItems('home').filter((item) => item.visible);

  const sectionsBlock = navLinks.length > 0
    ? navLinks.map(l => `- [${l.label}](${siteUrl}${l.href.startsWith('/') || l.href.startsWith('#') ? l.href.replace(/^#/, '/#') : l.href})`).join('\n')
    : `- [Home](${siteUrl}/)`;

  const content = [
    `# ${propertyName}`,
    '',
    `> ${description}`,
    '',
    '## Property Details',
    propertyType ? `- **Type:** ${propertyType}` : null,
    address ? `- **Location:** ${address}` : null,
    priceRange ? `- **Price Range:** ${priceRange}` : null,
    developerName ? `- **Developer:** ${developerName}${developerUrl ? ` — ${developerUrl}` : ''}` : null,
    keywords.length > 0 ? `- **Keywords:** ${keywords.join(', ')}` : null,
    '',
    '## Pages',
    sectionsBlock,
    '',
    '## About This Site',
    `This is an ultra-luxury real estate property landing page. It features dark elegant design, 360° virtual tours, amenities showcase, and a contact form for prospective buyers and investors.`,
    isSectionEnabled('price-unlock') ? `\n## Pricing\n- Pricing details are available upon enquiry at ${siteUrl}/#price-unlock` : null,
  ].filter(line => line !== null).join('\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
