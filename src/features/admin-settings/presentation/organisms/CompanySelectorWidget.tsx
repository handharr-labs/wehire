'use client';

import Link from 'next/link';
import { type Company } from '@/shared/domain/entities/Company';

interface Props {
  companies: Company[];
}

const NAV_ITEMS = [
  {
    key: 'jobs',
    label: 'Manage Jobs',
    href: (id: string) => `/admin/jobs?companyId=${id}`,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path strokeLinecap="round" d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" strokeLinecap="round" />
        <line x1="10" y1="14" x2="14" y2="14" strokeLinecap="round" />
      </svg>
    ),
    description: 'Create, edit, and manage job postings',
    primary: true,
  },
  {
    key: 'form-fields',
    label: 'Form Fields',
    href: (id: string) => `/admin/form-fields?companyId=${id}`,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <line x1="9" y1="12" x2="15" y2="12" strokeLinecap="round" />
        <line x1="9" y1="16" x2="13" y2="16" strokeLinecap="round" />
      </svg>
    ),
    description: 'Customise your application form fields',
    primary: false,
  },
  {
    key: 'settings',
    label: 'Settings',
    href: (id: string) => `/admin/settings?companyId=${id}`,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path strokeLinecap="round" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    description: 'Edit company profile and branding',
    primary: false,
  },
] as const;

export function CompanySelectorWidget({ companies }: Props) {
  if (companies.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
        <p className="text-sm text-gray-500">No companies found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
}

function CompanyCard({ company }: { company: Company }) {
  const initial = company.name.charAt(0).toUpperCase();
  const accent = /^#[0-9a-fA-F]{6}$/.test(company.primaryColor)
    ? company.primaryColor
    : '#4262FF';

  const isActive = company.siteStatus === 'active';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Brand accent bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />

      <div className="p-6">
        {/* Company identity */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            {company.logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={company.logoUrl}
                alt={company.name}
                className="w-11 h-11 rounded-lg object-contain border border-gray-100 bg-gray-50 p-1 shrink-0"
              />
            ) : (
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0"
                style={{ backgroundColor: accent }}
              >
                {initial}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900 leading-tight">{company.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">/{company.slug}</p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
              isActive
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}
            />
            {isActive ? 'Live' : 'Inactive'}
          </span>
        </div>

        {/* Quick actions */}
        <div className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href(company.id)}
              className={`flex items-center gap-3 rounded-lg px-3.5 py-3 text-sm font-medium transition-colors group ${
                item.primary
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className={item.primary ? 'text-white/90' : 'text-gray-400 group-hover:text-gray-600'}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              <svg
                className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                  item.primary ? 'text-white/70' : 'text-gray-400'
                }`}
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Microsite link */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <a
            href={`/${company.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View career page
          </a>
        </div>
      </div>
    </div>
  );
}
