import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import GlobalPreferencesModal from './ui/GlobalPreferencesModal';
import Logo from './ui/Logo';

/* ── Data ── */
const COLUMNS = [
	{
		id: 'col1',
		sections: [
			{
				title: 'Company',
				links: [
					{ label: 'About',                    href: '#' },
					{ label: 'Careers',                  href: '#' },
					{ label: 'Affiliates',               href: '#' },
					{ label: 'Blog',                     href: '#' },
					{ label: 'Press',                    href: '#' },
					{ label: 'Security',                 href: '#' },
					{ label: 'Investors',                href: '#' },
					{ label: 'Vendors',                  href: '#' },
					{ label: 'Legal & privacy',          href: '#' },
					{ label: 'Cookie policy',            href: '#' },
					{ label: 'Cookie preferences',       href: '#' },
					{ label: 'Digital Asset Disclosures',href: '#' },
				],
			},
			{
				title: 'Learn',
				links: [
					{ label: 'Explore',                        href: '#' },
					{ label: 'Market statistics',              href: '#' },
					{ label: 'Crypto Bytes newsletter',      href: '#' },
					{ label: 'Crypto basics',                  href: '#' },
					{ label: 'Tips & tutorials',               href: '#' },
					{ label: 'Crypto glossary',                href: '#' },
					{ label: 'Market updates',                 href: '#' },
					{ label: 'What is Bitcoin?',               href: '#' },
					{ label: 'What is crypto?',                href: '#' },
					{ label: 'What is a blockchain?',          href: '#' },
					{ label: 'How to set up a crypto wallet?', href: '#' },
					{ label: 'How to send crypto?',            href: '#' },
					{ label: 'Taxes',                          href: '#' },
				],
			},
		],
	},
	{
		id: 'col2',
		sections: [
			{
				title: 'Individuals',
				links: [
					{ label: 'Buy & sell',       href: '#' },
					{ label: 'Earn free crypto', href: '#' },
					{ label: 'Base App',         href: '#' },
					{ label: 'Crypto App One',     href: '#' },
					{ label: 'Debit Card',       href: '#' },
				],
			},
			{
				title: 'Businesses',
				links: [
					{ label: 'Asset Listings',    href: '#' },
					{ label: 'Crypto Business', href: '#' },
					{ label: 'Payments',          href: '#' },
					{ label: 'Commerce',          href: '#' },
					{ label: 'Token Manager',     href: '#' },
				],
			},
			{
				title: 'Institutions',
				links: [
					{ label: 'Prime',                  href: '#' },
					{ label: 'Staking',                href: '#' },
					{ label: 'Exchange',               href: '#' },
					{ label: 'International Exchange', href: '#' },
					{ label: 'Derivatives Exchange',   href: '#' },
					{ label: 'Verified Pools',         href: '#' },
				],
			},
		],
	},
	{
		id: 'col3',
		sections: [
			{
				title: 'Developers',
				links: [
					{ label: 'Developer Platform',            href: '#' },
					{ label: 'Base',                          href: '#' },
					{ label: 'Server Wallets',                href: '#' },
					{ label: 'Embedded Wallets',              href: '#' },
					{ label: 'Base Accounts (Smart Wallets)', href: '#' },
					{ label: 'Onramp & Offramp',              href: '#' },
					{ label: 'x402',                          href: '#' },
					{ label: 'Trade API',                     href: '#' },
					{ label: 'Paymaster',                     href: '#' },
					{ label: 'OnchainKit',                    href: '#' },
					{ label: 'Data API',                      href: '#' },
					{ label: 'Verifications',                 href: '#' },
					{ label: 'Node',                          href: '#' },
					{ label: 'AgentKit',                      href: '#' },
					{ label: 'Staking',                       href: '#' },
					{ label: 'Faucet',                        href: '#' },
					{ label: 'Exchange API',                  href: '#' },
					{ label: 'International Exchange API',    href: '#' },
					{ label: 'Prime API',                     href: '#' },
					{ label: 'Derivatives API',               href: '#' },
				],
			},
		],
	},
	{
		id: 'col4',
		sections: [
			{
				title: 'Support',
				links: [
					{ label: 'Help center',         href: '#' },
					{ label: 'Contact us',          href: '#' },
					{ label: 'Create account',      href: '#' },
					{ label: 'ID verification',     href: '#' },
					{ label: 'Account information', href: '#' },
					{ label: 'Payment methods',     href: '#' },
					{ label: 'Account access',      href: '#' },
					{ label: 'Supported crypto',    href: '#' },
					{ label: 'Status',              href: '#' },
				],
			},
			{
				title: 'Asset prices',
				links: [
					{ label: 'Bitcoin price',  href: '#' },
					{ label: 'Ethereum price', href: '#' },
					{ label: 'Solana price',   href: '#' },
					{ label: 'XRP price',      href: '#' },
				],
			},
			{
				title: 'Stock prices',
				links: [
					{ label: 'NVIDIA price',    href: '#' },
					{ label: 'Apple price',     href: '#' },
					{ label: 'Microsoft price', href: '#' },
					{ label: 'Amazon price',    href: '#' },
				],
			},
		],
	},
];

const SOCIALS = [
	{ label: 'X',         href: 'https://x.com/coinbase',                   icon: 'https://static-assets.coinbase.com/marketing/cdx/x-light.svg' },
	{ label: 'LinkedIn',  href: 'https://www.linkedin.com/company/coinbase', icon: 'https://static-assets.coinbase.com/marketing/cdx/linkedin-light.svg' },
	{ label: 'Instagram', href: 'https://www.instagram.com/coinbase/',       icon: 'https://static-assets.coinbase.com/marketing/cdx/instagram-light.svg' },
	{ label: 'TikTok',    href: 'https://www.tiktok.com/@coinbase',          icon: 'https://static-assets.coinbase.com/marketing/cdx/tiktok-light.svg' },
];

/* ── Sub-components ── */
const FooterSection = ({ title, links }) => (
	<div className="flex flex-col gap-4">
		<span className="text-[1rem] leading-6 font-semibold text-gray-100">{title}</span>
		<div className="flex flex-col gap-2.5">
			{links.map((link) => (
				<a
					key={link.label}
					href={link.href}
					target={link.href.startsWith('http') ? '_blank' : undefined}
					rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
					className="text-[0.875rem] leading-6 text-gray-60 hover:text-gray-100 transition-colors duration-150"
				>
					{link.label}
				</a>
			))}
		</div>
	</div>
);

const FooterLogo = ({ height = 32 }) => (
	<Logo height={height} />
);

/* ── Footer ── */
const Footer = () => {
	const [modalOpen, setModalOpen]   = useState(false);
	const [country, setCountry]       = useState('Global');
	const [language, setLanguage]     = useState('English');

	return (
		<footer className="flex flex-col items-center bg-gray-10 w-full">
			<div className="w-full max-w-[1600px] pt-12 pb-8 md:px-8 md:pt-16 md:max-w-[1228px] lg:px-12 lg:pt-20 lg:max-w-[1600px]">

				{/* Logo — mobile only */}
				<div className="mb-8 lg:hidden">
					<FooterLogo />
				</div>

				{/* Main columns row */}
				<div className="flex flex-col lg:flex-row gap-10">
					{/* Logo column — desktop only */}
					<div className="hidden lg:flex flex-col shrink-0 pt-0.5">
						<FooterLogo />
					</div>

					{/* 4 content columns */}
					{COLUMNS.map((col) => (
						<div key={col.id} className="flex flex-col gap-10 flex-1">
							{col.sections.map((section) => (
								<FooterSection key={section.title} title={section.title} links={section.links} />
							))}
						</div>
					))}
				</div>

				{/* Bottom area */}
				<div className="flex flex-col gap-4 mt-12">
					{/* Social icons */}
					<div className="flex items-center gap-4">
						{SOCIALS.map((s) => (
							<a
								key={s.label}
								href={s.href}
								target="_blank"
								rel="noopener noreferrer"
								title={`Crypto App ${s.label} page`}
								className="opacity-100 hover:opacity-70 transition-opacity duration-150"
							>
								<img src={s.icon} alt={`${s.label} logo`} width={16} height={16} loading="lazy" />
							</a>
						))}
					</div>

					{/* Divider */}
					<hr className="w-full border-0 border-t border-gray-15 my-2" />

					{/* Copyright + legal + locale row */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						{/* Left: copyright + legal links */}
						<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
							<p className="text-[0.875rem] leading-6 text-gray-100 m-0">
								© {new Date().getFullYear()} Crypto App | Student Project
							</p>
							<span className="text-gray-40 text-[0.875rem]">•</span>
							<a href="#" className="text-[0.875rem] leading-6 text-gray-60 hover:text-gray-100 transition-colors">
								Privacy
							</a>
							<span className="text-gray-40 text-[0.875rem]">•</span>
							<a href="#" className="text-[0.875rem] leading-6 text-gray-60 hover:text-gray-100 transition-colors">
								Terms &amp; Conditions
							</a>
						</div>

						{/* Right: locale selector button */}
						<button
							onClick={() => setModalOpen(true)}
							className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
						>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-60">
								<circle cx="12" cy="12" r="10" />
								<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
								<path d="M2 12h20" />
							</svg>
							<span className="text-[0.875rem] leading-6 text-gray-60">{country}</span>
							<span className="text-gray-40 text-[0.875rem]">•</span>
							<span className="text-[0.875rem] leading-6 text-gray-60">{language}</span>
						</button>
					</div>
				</div>
			</div>

			{/* Global Preferences Modal */}
			<AnimatePresence>
				{modalOpen && (
					<GlobalPreferencesModal
						onClose={() => setModalOpen(false)}
						country={country}
						language={language}
						onCountryChange={setCountry}
						onLanguageChange={setLanguage}
					/>
				)}
			</AnimatePresence>
		</footer>
	);
};

export default Footer;
