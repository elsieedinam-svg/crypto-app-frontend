import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import FilterDropdown from '../components/ui/FilterDropdown';

/* ═══════════════════════════════════════════════
	CONSTANTS & DATA
	═══════════════════════════════════════════════ */

const FALLBACK_GHS = 16.5;

/* Coin metadata — same list as landing page CryptoTable (Binance symbols) */
const COIN_META = [
	{ binance: 'BTCUSDT', name: 'Bitcoin', symbol: 'BTC', supply: 19700000 },
	{ binance: 'ETHUSDT', name: 'Ethereum', symbol: 'ETH', supply: 120200000 },
	{ binance: 'BNBUSDT', name: 'BNB', symbol: 'BNB', supply: 145900000 },
	{ binance: 'SOLUSDT', name: 'Solana', symbol: 'SOL', supply: 441000000 },
	{ binance: 'XRPUSDT', name: 'XRP', symbol: 'XRP', supply: 56600000000 },
	{ binance: 'ADAUSDT', name: 'Cardano', symbol: 'ADA', supply: 37100000000 },
	{ binance: 'DOGEUSDT', name: 'Dogecoin', symbol: 'DOGE', supply: 143600000000 },
	{ binance: 'DOTUSDT', name: 'Polkadot', symbol: 'DOT', supply: 1400000000 },
	{ binance: 'LTCUSDT', name: 'Litecoin', symbol: 'LTC', supply: 73800000 },
	{ binance: 'AVAXUSDT', name: 'Avalanche', symbol: 'AVAX', supply: 403000000 },
	{ binance: 'LINKUSDT', name: 'Chainlink', symbol: 'LINK', supply: 608000000 },
	{ binance: 'UNIUSDT', name: 'Uniswap', symbol: 'UNI', supply: 600000000 },
	{ binance: 'ATOMUSDT', name: 'Cosmos', symbol: 'ATOM', supply: 292000000 },
	{ binance: 'XLMUSDT', name: 'Stellar', symbol: 'XLM', supply: 29600000000 },
	{ binance: 'ETCUSDT', name: 'Ethereum Classic', symbol: 'ETC', supply: 147000000 },
	{ binance: 'AAVEUSDT', name: 'Aave', symbol: 'AAVE', supply: 15100000 },
	{ binance: 'ALGOUSDT', name: 'Algorand', symbol: 'ALGO', supply: 8100000000 },
	{ binance: 'FILUSDT', name: 'Filecoin', symbol: 'FIL', supply: 530000000 },
	{ binance: 'TRXUSDT', name: 'TRON', symbol: 'TRX', supply: 86200000000 },
	{ binance: 'XTZUSDT', name: 'Tezos', symbol: 'XTZ', supply: 983000000 },
	{ binance: 'MKRUSDT', name: 'Maker', symbol: 'MKR', supply: 900000 },
	{ binance: 'COMPUSDT', name: 'Compound', symbol: 'COMP', supply: 8300000 },
	{ binance: 'DASHUSDT', name: 'Dash', symbol: 'DASH', supply: 11500000 },
	{ binance: 'EOSUSDT', name: 'EOS', symbol: 'EOS', supply: 1100000000 },
	{ binance: 'BATUSDT', name: 'Basic Attention', symbol: 'BAT', supply: 1500000000 },
	{ binance: 'VETUSDT', name: 'VeChain', symbol: 'VET', supply: 72700000000 },
	{ binance: 'NEOUSDT', name: 'NEO', symbol: 'NEO', supply: 70500000 },
	{ binance: 'WAVESUSDT', name: 'Waves', symbol: 'WAVES', supply: 100000000 },
	{ binance: 'SHIBUSDT', name: 'Shiba Inu', symbol: 'SHIB', supply: 589000000000000 },
	{ binance: 'MATICUSDT', name: 'Polygon', symbol: 'MATIC', supply: 9900000000 },
];

const COIN_META_MAP = Object.fromEntries(COIN_META.map((c) => [c.binance, c]));
const BINANCE_SYMBOLS = encodeURIComponent(JSON.stringify(COIN_META.map((c) => c.binance)));

const getCoinIcon = (symbol) =>
	`https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/${symbol.toLowerCase()}.png`;
/* Currency list (CoinGecko supported) */
const CURRENCIES = [
	{ value: 'usd', label: 'USD', sublabel: 'US Dollar' },
	{ value: 'ghs', label: 'GHS', sublabel: 'Ghanaian Cedi' },
	{ value: 'eur', label: 'EUR', sublabel: 'Euro' },
	{ value: 'gbp', label: 'GBP', sublabel: 'British Pound' },
	{ value: 'jpy', label: 'JPY', sublabel: 'Japanese Yen' },
	{ value: 'cad', label: 'CAD', sublabel: 'Canadian Dollar' },
	{ value: 'aud', label: 'AUD', sublabel: 'Australian Dollar' },
	{ value: 'chf', label: 'CHF', sublabel: 'Swiss Franc' },
	{ value: 'cny', label: 'CNY', sublabel: 'Chinese Yuan' },
	{ value: 'inr', label: 'INR', sublabel: 'Indian Rupee' },
	{ value: 'ngn', label: 'NGN', sublabel: 'Nigerian Naira' },
	{ value: 'zar', label: 'ZAR', sublabel: 'South African Rand' },
	{ value: 'brl', label: 'BRL', sublabel: 'Brazilian Real' },
	{ value: 'krw', label: 'KRW', sublabel: 'South Korean Won' },
	{ value: 'aed', label: 'AED', sublabel: 'United Arab Emirates Dirham' },
	{ value: 'nzd', label: 'NZD', sublabel: 'New Zealand Dollar' },
	{ value: 'sgd', label: 'SGD', sublabel: 'Singapore Dollar' },
	{ value: 'hkd', label: 'HKD', sublabel: 'Hong Kong Dollar' },
	{ value: 'sek', label: 'SEK', sublabel: 'Swedish Krona' },
	{ value: 'nok', label: 'NOK', sublabel: 'Norwegian Krone' },
	{ value: 'mxn', label: 'MXN', sublabel: 'Mexican Peso' },
	{ value: 'try', label: 'TRY', sublabel: 'Turkish Lira' },
	{ value: 'rub', label: 'RUB', sublabel: 'Russian Ruble' },
	{ value: 'pln', label: 'PLN', sublabel: 'Polish Zloty' },
	{ value: 'php', label: 'PHP', sublabel: 'Philippine Peso' },
	{ value: 'thb', label: 'THB', sublabel: 'Thai Baht' },
	{ value: 'idr', label: 'IDR', sublabel: 'Indonesian Rupiah' },
	{ value: 'czk', label: 'CZK', sublabel: 'Czech Koruna' },
	{ value: 'ils', label: 'ILS', sublabel: 'Israeli New Shekel' },
	{ value: 'clp', label: 'CLP', sublabel: 'Chilean Peso' },
	{ value: 'pkr', label: 'PKR', sublabel: 'Pakistani Rupee' },
	{ value: 'ars', label: 'ARS', sublabel: 'Argentine Peso' },
	{ value: 'cop', label: 'COP', sublabel: 'Colombian Peso' },
	{ value: 'sar', label: 'SAR', sublabel: 'Saudi Riyal' },
	{ value: 'myr', label: 'MYR', sublabel: 'Malaysian Ringgit' },
	{ value: 'twd', label: 'TWD', sublabel: 'New Taiwan Dollar' },
	{ value: 'kes', label: 'KES', sublabel: 'Kenyan Shilling' },
	{ value: 'egp', label: 'EGP', sublabel: 'Egyptian Pound' },
	{ value: 'btc', label: 'BTC', sublabel: 'Bitcoin' },
	{ value: 'eth', label: 'ETH', sublabel: 'Ethereum' },
];

/* Asset filter options */
const ASSET_FILTERS = [
	{ value: 'all', label: 'All assets', icon: <GlobeIcon /> },
	{ value: 'tradeable', label: 'Tradeable', icon: <TradeIcon /> },
	{ value: 'new', label: 'New', icon: <NewIcon /> },
	{ value: 'gainers', label: 'Gainers', icon: <GainersIcon /> },
	{ value: 'losers', label: 'Losers', icon: <LosersIcon /> },
];

/* Time period options */
const TIME_PERIODS = [
	{ value: '1h', label: '1H' },
	{ value: '24h', label: '1D' },
	{ value: '7d', label: '1W' },
	{ value: '30d', label: '1M' },
	{ value: '1y', label: '1Y' },
];

/* Rows per page */
const ROWS_OPTIONS = [
	{ value: 10, label: '10 rows' },
	{ value: 30, label: '30 rows' },
	{ value: 50, label: '50 rows' },
];

/* ═══════════════════════════════════════════════
	FILTER ICONS
	═══════════════════════════════════════════════ */
function GlobeIcon() {
	return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
}
function TradeIcon() {
	return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 3v18h18" /><path d="M7 16 12 11 15 14 21 8" /></svg>;
}
function NewIcon() {
	return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></svg>;
}
function GainersIcon() {
	return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7 17 5-5 5 5" /><path d="m7 11 5-5 5 5" /></svg>;
}
function LosersIcon() {
	return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7 7 5 5 5-5" /><path d="m7 13 5 5 5-5" /></svg>;
}

/* ═══════════════════════════════════════════════
	SVG ICONS (page)
	═══════════════════════════════════════════════ */
const SearchIcon = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
	</svg>
);

const ArrowDown = () => (
	<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9.5 8.5L2.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M9.5 3.5V8.5H4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const ArrowUp = () => (
	<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 3.5L9.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M2.5 8.5V3.5H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const ChevronLeft = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
);

const ChevronRight = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);

const StarIcon = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);

const SortIcon = () => (
	<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></svg>
);

/* ═══════════════════════════════════════════════
	HELPERS
	═══════════════════════════════════════════════ */
const fmtCompact = (val, currLabel) => {
	if (val == null) return '--';
	if (val >= 1e12) return `${currLabel} ${(val / 1e12).toFixed(2)}T`;
	if (val >= 1e9) return `${currLabel} ${(val / 1e9).toFixed(1)}B`;
	if (val >= 1e6) return `${currLabel} ${(val / 1e6).toFixed(1)}M`;
	return `${currLabel} ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const fmtPrice = (val, currLabel) => {
	if (val == null) return '--';
	return `${currLabel} ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const fmtPct = (pct) => {
	if (pct == null) return '0.00';
	return Math.abs(pct).toFixed(2);
};

/* ═══════════════════════════════════════════════
	CHANGE INDICATOR
	═══════════════════════════════════════════════ */
const ChangeIndicator = ({ value, className = '' }) => {
	if (value == null) return <span className={`text-gray-40 ${className}`}>0.00%</span>;
	const isNeg = value < 0;
	const color = isNeg ? 'text-red-60' : value > 0 ? 'text-green-60' : 'text-gray-60';
	return (
		<span className={`inline-flex items-center gap-0.5 ${color} ${className}`}>
			{isNeg ? <ArrowDown /> : value > 0 ? <ArrowUp /> : null}
			{fmtPct(value)}%
		</span>
	);
};

/* ═══════════════════════════════════════════════
	SKELETON LOADERS
	═══════════════════════════════════════════════ */
const StatSkeleton = () => (
	<div className="flex-1 min-w-[200px] bg-white rounded-xl border border-gray-10 p-5 animate-pulse">
		<div className="w-24 h-3 bg-gray-10 rounded mb-3" />
		<div className="w-20 h-5 bg-gray-10 rounded mb-2" />
		<div className="w-14 h-3 bg-gray-10 rounded" />
	</div>
);

const TableRowSkeleton = () => (
	<tr className="border-b border-gray-10 animate-pulse">
		<td className="py-4 px-3"><div className="w-4 h-4 bg-gray-10 rounded" /></td>
		<td className="py-4 px-3"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-gray-10 rounded-full" /><div><div className="w-20 h-4 bg-gray-10 rounded mb-1" /><div className="w-12 h-3 bg-gray-10 rounded" /></div></div></td>
		<td className="py-4 px-3"><div className="w-24 h-4 bg-gray-10 rounded" /></td>
		<td className="py-4 px-3"><div className="w-16 h-8 bg-gray-10 rounded" /></td>
		<td className="py-4 px-3"><div className="w-14 h-4 bg-gray-10 rounded" /></td>
		<td className="py-4 px-3"><div className="w-20 h-4 bg-gray-10 rounded" /></td>
		<td className="py-4 px-3"><div className="w-18 h-4 bg-gray-10 rounded" /></td>
		<td className="py-4 px-3"><div className="w-16 h-8 bg-gray-10 rounded-full" /></td>
	</tr>
);

/* ═══════════════════════════════════════════════
	MARKET STAT CARD
	═══════════════════════════════════════════════ */
const MarketStatCard = ({ label, value, change, statId }) => {
	const isNeg = (change ?? 0) < 0;
	return (
		<Link to="/market-stats" className="flex-1 min-w-[240px] h-[140px] bg-gray-5 rounded-lg p-4 hover:shadow-elevation-1 transition-shadow duration-200 cursor-pointer overflow-hidden relative border border-transparent hover:border-gray-10 block">
			<div className="relative z-10 pt-1">
				<p className="text-body text-gray-60 mb-1 leading-tight">{label}</p>
				<div className="flex items-center gap-1.5 mt-1">
					<p className="text-headline text-gray-100">{value}</p>
					{change !== null && (
						<span className={`text-label-1 ${isNeg ? 'text-red-60' : 'text-green-60'}`}>
							{isNeg ? '↘' : '↗'} {Math.abs(change).toFixed(2)}%
						</span>
					)}
				</div>
			</div>
			<div className="absolute left-0 bottom-0 w-full h-[60px]">
				<StatChart changePct={change} statId={statId || label.replace(/\s/g, '')} />
			</div>
		</Link>
	);
};

/* ═══════════════════════════════════════════════
	TOP MOVER CARD
	═══════════════════════════════════════════════ */
const TopMoverCard = ({ coin, currLabel }) => (
	<div className="flex flex-col items-center bg-white rounded-xl border border-gray-10 p-4 min-w-[120px] hover:shadow-elevation-1 transition-shadow duration-200 cursor-pointer">
		<img src={coin.image} alt={coin.symbol} className="w-10 h-10 rounded-full mb-2" />
		<p className="text-label-1 text-gray-100 uppercase">{coin.symbol}</p>
		<ChangeIndicator value={coin.price_change_percentage_24h} className="text-label-2" />
		<p className="text-legal text-gray-40 mt-0.5">{fmtPrice(coin.current_price, currLabel)}</p>
	</div>
);

/* ═══════════════════════════════════════════════
	NEW ON Easy Crypto CARD
	═══════════════════════════════════════════════ */
const NewCoinCard = ({ coin }) => (
	<div className="flex flex-col items-center bg-white rounded-xl border border-gray-10 p-4 min-w-[140px] hover:shadow-elevation-1 transition-shadow duration-200 cursor-pointer">
		<img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full mb-2" />
		<p className="text-label-1 text-gray-100 uppercase">{coin.symbol}</p>
		<p className="text-label-2 text-gray-60">{coin.name}</p>
		<p className="text-legal text-gray-40 mt-1">Recently listed</p>
	</div>
);



/* ═══════════════════════════════════════════════
	SPARKLINE GENERATOR (Coinbase-style with smooth bezier curves)
	═══════════════════════════════════════════════ */
function generateSparklineData(changePct, coinId = '', W = 120, H = 40) {
	const pts = 24;
	const change = changePct ?? 0;
	// Create seed from coinId string for deterministic variation per coin
	let seed = 0;
	for (let i = 0; i < (coinId || 'x').length; i++) seed += (coinId || 'x').charCodeAt(i);
	const points = [];
	for (let i = 0; i < pts; i++) {
		const x = (i / (pts - 1)) * W;
		const progress = i / (pts - 1);
		// Trend line based on change
		const trend = change < 0
			? H * 0.25 + progress * H * 0.4
			: H * 0.65 - progress * H * 0.4;
		// Noise for organic feel
		const n1 = Math.sin(i * 1.7 + seed * 0.1) * H * 0.12;
		const n2 = Math.cos(i * 0.9 + seed * 0.3) * H * 0.08;
		const n3 = Math.sin(i * 3.1 + seed * 0.05) * H * 0.05;
		const y = Math.max(3, Math.min(H - 3, trend + n1 + n2 + n3));
		points.push({ x, y });
	}
	return { points, W, H };
}

function buildSmoothPath(points) {
	if (points.length < 2) return '';
	let d = `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
	for (let i = 0; i < points.length - 1; i++) {
		const p0 = points[Math.max(0, i - 1)];
		const p1 = points[i];
		const p2 = points[i + 1];
		const p3 = points[Math.min(points.length - 1, i + 2)];
		const cp1x = p1.x + (p2.x - p0.x) / 6;
		const cp1y = p1.y + (p2.y - p0.y) / 6;
		const cp2x = p2.x - (p3.x - p1.x) / 6;
		const cp2y = p2.y - (p3.y - p1.y) / 6;
		d += `C${cp1x.toFixed(1)},${cp1y.toFixed(1)},${cp2x.toFixed(1)},${cp2y.toFixed(1)},${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
	}
	return d;
}

const getCoinBrandColor = (symbol) => {
	const colors = {
		BTC: '#F7931A', ETH: '#627EEA', BNB: '#F3BA2F', SOL: '#14F195',
		XRP: '#23292F', ADA: '#0033AD', DOGE: '#C2A633', DOT: '#E6007A',
		LTC: '#BFBBBB', AVAX: '#E84142', LINK: '#2A5ADA', UNI: '#FF007A',
		ATOM: '#2E3148', XLM: '#14B6E7', ETC: '#328332', AAVE: '#2EBAC6',
		ALGO: '#000000', FIL: '#0090FF', TRX: '#FF0013', XTZ: '#2C7DF7',
		MKR: '#1AAB9B', COMP: '#00D395', DASH: '#008CE7', EOS: '#000000',
		BAT: '#FF5000', VET: '#15BDFF', NEO: '#00E599', WAVES: '#0155FF',
		SHIB: '#FFA409', MATIC: '#8247E5',
	};
	if (colors[symbol]) return colors[symbol];
	const fallbackColors = ['#0052FF', '#CF202F', '#098551', '#F7931A'];
	const hash = symbol.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
	return fallbackColors[hash % fallbackColors.length];
};

const TableLineChart = ({ changePct, coinId, symbol }) => {
	const { points, W, H } = generateSparklineData(changePct, coinId, 64, 32);
	const color = getCoinBrandColor(symbol);
	const linePath = buildSmoothPath(points);

	return (
		<svg height="32" width="64"><g><path d="M2,6.096L2.455,6.574C2.909,7.052,3.818,8.008,4.727,8.187C5.636,8.366,6.545,7.768,7.455,9.368C8.364,10.968,9.273,14.768,10.182,17.231C11.091,19.694,12,20.822,12.909,20.191C13.818,19.56,14.727,17.171,15.636,16.579C16.545,15.988,17.455,17.194,18.364,17.275C19.273,17.357,20.182,16.313,21.091,16.703C22,17.092,22.909,18.914,23.818,18.982C24.727,19.051,25.636,17.366,26.545,17.868C27.455,18.37,28.364,21.058,29.273,23.444C30.182,25.831,31.091,27.915,32,27.04C32.909,26.164,33.818,22.328,34.727,20.716C35.636,19.105,36.545,19.718,37.455,19.574C38.364,19.431,39.273,18.529,40.182,15.474C41.091,12.419,42,7.209,42.909,6.417C43.818,5.624,44.727,9.249,45.636,12.476C46.545,15.704,47.455,18.535,48.364,19.207C49.273,19.879,50.182,18.393,51.091,17.532C52,16.67,52.909,16.433,53.818,16.842C54.727,17.25,55.636,18.304,56.545,18.831C57.455,19.358,58.364,19.358,58.818,19.358L59.273,19.35" fill="transparent" stroke="#0052FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></g></svg>
	);
};

/* Easy Crypto-style market stat chart with line + dotted fill */
const StatChart = ({ changePct, statId }) => {
	const { points, W, H } = generateSparklineData(changePct, statId, 240, 60);
	const isNeg = (changePct ?? 0) < 0;
	// Use slightly darker stat border colors than in the table
	const color = isNeg ? '#F0616D' : '#098551';
	const patternId = `dots-${statId || 'x'}`;

	const linePath = buildSmoothPath(points);
	// Fill path = line path + close to bottom-right → bottom-left
	const lastPt = points[points.length - 1];
	const firstPt = points[0];
	const fillPath = `${linePath}L${lastPt.x.toFixed(1)},${H}L${firstPt.x.toFixed(1)},${H}Z`;

	return (
		<svg height="60" width="240">
			<defs>
				<pattern height="4" id={patternId} patternUnits="userSpaceOnUse" width="4" x="0" y="0">
					<g>
						<rect fill="transparent" height="4" width="4"></rect>
						<circle cx="1" cy="1" fill={color} fillOpacity="0.2" r="1"></circle>
					</g>
				</pattern>
			</defs>
			<g>
				<path d={linePath} fill="transparent" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
				<path d={fillPath} fill={`url(#${patternId})`}></path>
			</g>
		</svg>
	);
};

/* ═══════════════════════════════════════════════
	MAIN EXPLORE PAGE
	═══════════════════════════════════════════════ */
const ExplorePage = () => {
	// Data
	const [coins, setCoins] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const fxRates = useRef({ ghs: FALLBACK_GHS });

	// Filters
	const [assetFilter, setAssetFilter] = useState('all');
	const [timePeriod, setTimePeriod] = useState('24h');
	const [currency, setCurrency] = useState('ghs');
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// Table state
	const [currentPage, setCurrentPage] = useState(1);
	const [sortField, setSortField] = useState('market_cap');
	const [sortDir, setSortDir] = useState('desc');
	const [showMoreStats, setShowMoreStats] = useState(false);
	const [showMorePrices, setShowMorePrices] = useState(false);

	// Derived currency label & rate
	const currLabel = currency.toUpperCase();
	const getRate = useCallback(() => {
		if (currency === 'usd') return 1;
		return fxRates.current[currency] ?? FALLBACK_GHS;
	}, [currency]);

	/* ── Fetch FX rates once ── */
	useEffect(() => {
		(async () => {
			try {
				const res = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
				if (res.ok) {
					const data = await res.json();
					if (data?.usd) fxRates.current = data.usd;
				}
			} catch { /* keep defaults */ }
		})();
	}, []);

	/* ── Fetch from Binance (same as CryptoTable) ── */
	const fetchPrices = useCallback(async () => {
		try {
			const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${BINANCE_SYMBOLS}`);
			if (!res.ok) throw new Error(`Binance ${res.status}`);
			return await res.json();
		} catch (error) {
			console.warn('Binance fetch failed, using fallback data:', error);
			// Fallback mock data structure derived from COIN_META
			return COIN_META.map((meta, i) => {
				// Deterministic mock values based on index to look realistic
				const basePrice = [67200, 3500, 590, 145, 0.5, 0.45, 0.16][i % 7];
				const lastPrice = (basePrice * (1 + (Math.sin(i) * 0.05))).toFixed(4);
				const priceChangePercent = (Math.sin(i * 1.5) * 5).toFixed(2);
				return {
					symbol: meta.binance,
					lastPrice,
					priceChangePercent,
					quoteVolume: (Math.abs(Math.cos(i)) * 1000000000 + 100000000).toFixed(2),
				};
			});
		}
	}, []);

	const buildCoins = useCallback((tickers) => {
		const rate = getRate();
		return tickers
			.map((t) => {
				const meta = COIN_META_MAP[t.symbol];
				if (!meta) return null;
				const priceUsd = parseFloat(t.lastPrice);
				const price = priceUsd * rate;
				const change24h = parseFloat(t.priceChangePercent);
				const volumeUsd = parseFloat(t.quoteVolume);
				const mktCap = priceUsd * (meta.supply || 1) * rate;
				return {
					id: t.symbol,
					name: meta.name,
					symbol: meta.symbol,
					image: getCoinIcon(meta.symbol),
					current_price: price,
					price_change_percentage_24h: change24h,
					market_cap: mktCap,
					total_volume: volumeUsd * rate,
				};
			})
			.filter(Boolean)
			.sort((a, b) => b.market_cap - a.market_cap);
	}, [getRate]);

	/* ── Initial load + polling ── */
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const tickers = await fetchPrices();
				if (!cancelled) { setCoins(buildCoins(tickers)); setLoading(false); }
			} catch (err) {
				if (!cancelled) { setError(err.message); setLoading(false); }
			}
		})();
		const id = setInterval(async () => {
			try {
				const tickers = await fetchPrices();
				if (!cancelled) setCoins(buildCoins(tickers));
			} catch { /* silent */ }
		}, 5000);
		return () => { cancelled = true; clearInterval(id); };
	}, [fetchPrices, buildCoins]);

	/* ── Reset page when filters change ── */
	useEffect(() => { setCurrentPage(1); }, [assetFilter, timePeriod, currency, rowsPerPage, searchQuery]);

	/* ── Get change value (we only have 24h from Binance) ── */
	const getCoinChange = (coin) => coin.price_change_percentage_24h ?? null;

	/* ── Apply asset filter ── */
	const applyAssetFilter = (list) => {
		switch (assetFilter) {
			case 'tradeable':
				return [...list].sort((a, b) => b.market_cap - a.market_cap).slice(0, 20);
			case 'new':
				return list.slice(-10);
			case 'gainers':
				return [...list]
					.filter((c) => getCoinChange(c) > 0)
					.sort((a, b) => (getCoinChange(b) ?? 0) - (getCoinChange(a) ?? 0));
			case 'losers':
				return [...list]
					.filter((c) => getCoinChange(c) < 0)
					.sort((a, b) => (getCoinChange(a) ?? 0) - (getCoinChange(b) ?? 0));
			default:
				return list;
		}
	};

	/* ── Derived data ── */
	const topGainers = [...coins]
		.filter((c) => c.price_change_percentage_24h != null)
		.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
		.slice(0, 6);

	const newCoins = coins.slice(-3);

	// Search filter
	const searchFiltered = coins.filter((c) =>
		c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Asset category filter
	const categoryFiltered = applyAssetFilter(searchFiltered);

	// Sort
	const sortedCoins = [...categoryFiltered].sort((a, b) => {
		let valA, valB;
		if (sortField === 'change') {
			valA = getCoinChange(a) ?? 0;
			valB = getCoinChange(b) ?? 0;
		} else if (sortField === 'name') {
			return sortDir === 'asc'
				? a.name.localeCompare(b.name)
				: b.name.localeCompare(a.name);
		} else {
			valA = a[sortField] ?? 0;
			valB = b[sortField] ?? 0;
		}
		return sortDir === 'asc' ? valA - valB : valB - valA;
	});

	const totalPages = Math.ceil(sortedCoins.length / rowsPerPage);
	const pageCoins = sortedCoins.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

	const handleSort = (field) => {
		if (sortField === field) {
			setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDir('desc');
		}
		setCurrentPage(1);
	};

	/* ── Market stats (computed from our data) ── */
	const totalMktCap = coins.reduce((s, c) => s + (c.market_cap || 0), 0);
	const totalVol = coins.reduce((s, c) => s + (c.total_volume || 0), 0);
	const btcCoin = coins.find((c) => c.symbol === 'BTC');
	const btcDom = btcCoin && totalMktCap > 0 ? ((btcCoin.market_cap / totalMktCap) * 100) : 0;
	const marketStats = [
		{ label: 'Total market cap', value: fmtCompact(totalMktCap, currLabel), change: -1.20 },
		{ label: 'Trade volume', value: fmtCompact(totalVol, currLabel), change: -3.46 },
		{ label: 'Buy-sell ratio', value: `${currLabel} 0.76`, change: -3.36 },
		{ label: 'BTC dominance', value: `${btcDom.toFixed(2)}%`, change: 0.01 },
	];

	/* ── Pagination range ── */
	const getPageRange = () => {
		const pages = [];
		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			pages.push(1, 2, 3);
			if (currentPage > 4) pages.push('...');
			if (currentPage > 3 && currentPage < totalPages - 2) pages.push(currentPage);
			if (currentPage < totalPages - 3) pages.push('...');
			pages.push(totalPages);
		}
		return [...new Set(pages)];
	};

	/* ── Get display label for asset filter ── */
	const assetFilterLabel = ASSET_FILTERS.find((f) => f.value === assetFilter)?.label || 'All assets';

	return (
		<div className="min-h-screen flex flex-col bg-white">
			<Header />
			<main className="flex-1">
				<Container className="py-8 md:py-12">
					<div className="flex flex-col lg:flex-row gap-8">

						{/* ═══ LEFT MAIN CONTENT ═══ */}
						<div className="flex-1 min-w-0">

							{/* ── Page Header ── */}
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-gray-10 mb-8 mt-2">
								<div>
									<h1 className="text-[32px] font-bold leading-tight text-gray-100 flex items-center md:items-end flex-wrap gap-2 md:gap-3">
										Explore crypto
									</h1>
									<p className="text-body text-gray-60 mt-1 flex items-center gap-1">
										Easy Crypto 50 Index is down <span className="text-red-60">↘ 1.23%</span> (24hrs)
										<svg className="w-4 h-4 text-gray-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
									</p>
								</div>

								{/* Search bar */}
								<div className="relative w-full md:w-[360px]">
									<div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-100">
										<SearchIcon />
									</div>
									<input
										type="text"
										placeholder="Search for an asset"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full pl-11 pr-4 py-3 rounded-full bg-gray-5 text-body text-gray-100 outline-none hover:bg-gray-10 focus:bg-white focus:border focus:border-blue-60 transition-colors duration-200 placeholder:text-gray-60"
									/>
								</div>
							</div>

							{/* ── Market Stats ── */}
							<section className="pb-8 border-b border-gray-10 mb-8">
								<div className="flex items-center justify-between mb-2">
									<h2 className="text-title-1 text-gray-100">Market stats</h2>
									<div className="flex gap-4 text-gray-40">
										<button className="hover:text-gray-100 transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg></button>
										<button className="hover:text-gray-100 transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></button>
									</div>
								</div>
								{coins.length > 0 && (
									<div className="text-body text-gray-60 mb-2 max-w-4xl">
										<p className="mb-4">
											The overall crypto market is {(btcCoin?.price_change_percentage_24h ?? 0) > 0 ? 'growing' : 'shrinking'} this week. As of today, the total crypto market capitalization is {fmtCompact(totalMktCap, currLabel)}, representing a 0.38% increase from last week.
										</p>
										{showMoreStats && (
											<p>
												The 24-hour crypto market trading volume has also seen a 1.31% decrease over the past day. The top performing cryptocurrencies by price are Plume, Assemble AI and Parcl. Bitcoin remains the largest cryptocurrency by market capitalization of GHS 14,406,950,473,319.81. Its 24-hour trading volume has seen a 12.92% increase over the past day. Ethereum, the second largest cryptocurrency by market cap of GHS 2,519,780,153,459.30, has seen its 24-hour trading volume increase 19.11% in the last day.
											</p>
										)}
									</div>
								)}
								<button
									onClick={(e) => { e.preventDefault(); setShowMoreStats(!showMoreStats); }}
									className="text-blue-60 text-label-1 hover:underline mb-6 inline-block focus:outline-none cursor-pointer"
								>
									{showMoreStats ? 'Read less' : 'Read more'}
								</button>
								<div className="flex gap-4 overflow-x-auto pb-2">
									{loading ? (
										<><StatSkeleton /><StatSkeleton /><StatSkeleton /></>
									) : (
										marketStats.map((stat) => (
											<MarketStatCard key={stat.label} {...stat} />
										))
									)}
								</div>
							</section>

							{/* ── Crypto Market Prices ── */}
							<section>
								<div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-4">
									<div>
										<h2 className="text-title-1 text-gray-100">
											Crypto market prices
											<span className="text-label-2 text-gray-40 font-normal ml-2">{(coins.length > 0 ? coins.length * 529 : 18559).toLocaleString()} assets</span>
										</h2>
									</div>
								</div>

								{coins.length > 0 && (
									<div className="text-body text-gray-60 mb-4 max-w-4xl">
										<p className="mb-4">
											The overall crypto market is {(btcCoin?.price_change_percentage_24h ?? 0) > 0 ? 'growing' : 'shrinking'} this week. As of today, the total crypto market capitalization is {fmtCompact(totalMktCap, currLabel)}, representing a 0.38% increase from last week.
										</p>
										{showMorePrices && (
											<p>
												The 24-hour crypto market trading volume has also seen a 1.31% decrease over the past day. The top performing cryptocurrencies by price are Plume, Assemble AI and Parcl. Bitcoin remains the largest cryptocurrency by market capitalization of GHS 14,406,950,473,319.81. Its 24-hour trading volume has seen a 12.92% increase over the past day. Ethereum, the second largest cryptocurrency by market cap of GHS 2,519,780,153,459.30, has seen its 24-hour trading volume increase 19.11% in the last day.
											</p>
										)}
									</div>
								)}
								<button
									onClick={(e) => { e.preventDefault(); setShowMorePrices(!showMorePrices); }}
									className="text-blue-60 text-label-1 hover:underline mb-4 inline-block focus:outline-none cursor-pointer"
								>
									{showMorePrices ? 'Read less' : 'Read more'}
								</button>

								{/* ══ FUNCTIONAL FILTER DROPDOWNS ══ */}
								<div className="flex gap-2 mb-6 mt-4 flex-wrap">
									{/* Asset filter */}
									<FilterDropdown
										label="All assets"
										value={assetFilter}
										options={ASSET_FILTERS}
										onChange={setAssetFilter}
										icon={<GlobeIcon />}
									/>

									{/* Time period */}
									<FilterDropdown
										label="1D"
										value={timePeriod}
										options={TIME_PERIODS}
										onChange={setTimePeriod}
									/>

									{/* Currency */}
									<FilterDropdown
										label="GHS"
										value={currency}
										options={CURRENCIES}
										onChange={setCurrency}
										searchable
									/>

									{/* Rows per page */}
									<FilterDropdown
										label="10 rows"
										value={rowsPerPage}
										options={ROWS_OPTIONS}
										onChange={setRowsPerPage}
									/>
								</div>

								{/* Table */}
								<div className="overflow-x-auto border-t border-gray-10">
									<table className="w-full text-left">
										<thead>
											<tr className="border-b border-gray-10">
												<th className="py-3 px-3 w-10"></th>
												<th
													className="py-3 px-3 text-label-2 text-gray-60 cursor-pointer hover:text-gray-100 transition-colors select-none"
													onClick={() => handleSort('name')}
												>
													<span className="inline-flex items-center gap-1">Asset <SortIcon /></span>
												</th>
												<th
													className="py-3 px-3 text-label-2 text-gray-60 cursor-pointer hover:text-gray-100 transition-colors select-none"
													onClick={() => handleSort('current_price')}
												>
													<span className="inline-flex items-center gap-1">Market price <SortIcon /></span>
												</th>
												<th className="py-3 px-3 text-label-2 text-gray-60">Chart</th>
												<th
													className="py-3 px-3 text-label-2 text-gray-60 cursor-pointer hover:text-gray-100 transition-colors select-none"
													onClick={() => handleSort('change')}
												>
													<span className="inline-flex items-center gap-1">Change <SortIcon /></span>
												</th>
												<th
													className={`py-3 px-3 text-label-2 cursor-pointer hover:text-gray-100 transition-colors select-none ${sortField === 'market_cap' ? 'text-blue-60' : 'text-gray-60'}`}
													onClick={() => handleSort('market_cap')}
												>
													<span className="inline-flex items-center gap-1">Mkt cap <SortIcon /></span>
												</th>
												<th
													className="py-3 px-3 text-label-2 text-gray-60 cursor-pointer hover:text-gray-100 transition-colors select-none"
													onClick={() => handleSort('total_volume')}
												>
													<span className="inline-flex items-center gap-1">Volume <SortIcon /></span>
												</th>
												<th className="py-3 px-3 text-label-2 text-gray-60">Actions</th>
											</tr>
										</thead>
										<tbody>
											{loading ? (
												Array.from({ length: rowsPerPage }).map((_, i) => <TableRowSkeleton key={i} />)
											) : pageCoins.length === 0 ? (
												<tr><td colSpan="8" className="py-12 text-center text-body text-gray-40">No assets found</td></tr>
											) : (
												pageCoins.map((coin) => {
													const changeVal = getCoinChange(coin);
													return (
														<tr key={coin.id} className="border-b border-gray-10 hover:bg-gray-5 transition-colors cursor-pointer group">
															<td className="py-4 px-3">
																<button className="text-gray-20 hover:text-yellow-30 transition-colors"><StarIcon /></button>
															</td>
															<td className="py-4 px-3">
																<div className="flex items-center gap-3">
																	<img src={coin.image} alt={coin.symbol} className="w-8 h-8 rounded-full bg-gray-10" onError={(e) => { e.currentTarget.src = `https://placehold.co/32x32/e5e7eb/666?text=${coin.symbol.slice(0, 2)}`; }} />
																	<div>
																		<p className="text-headline text-gray-100">{coin.name}</p>
																		<p className="text-label-2 text-gray-40 uppercase">{coin.symbol}</p>
																	</div>
																</div>
															</td>
															<td className="py-4 px-3 text-body text-gray-100">{fmtPrice(coin.current_price, currLabel)}</td>
															<td className="py-4 px-3">
																<TableLineChart changePct={changeVal} coinId={coin.id} symbol={coin.symbol} />
															</td>
															<td className="py-4 px-3">
																<ChangeIndicator value={changeVal} className="text-body" />
															</td>
															<td className="py-4 px-3 text-body text-gray-100">{fmtCompact(coin.market_cap, currLabel)}</td>
															<td className="py-4 px-3 text-body text-gray-100">{fmtCompact(coin.total_volume, currLabel)}</td>
															<td className="py-4 px-3">
																<Link
																	to="/signup"
																	className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-blue-60 text-white text-label-1 hover:opacity-90 transition-opacity"
																>
																	Trade
																</Link>
															</td>
														</tr>
													);
												})
											)}
										</tbody>
									</table>
								</div>

								{/* Pagination */}
								{!loading && totalPages > 1 && (
									<div className="flex flex-col items-center gap-3 mt-6">
										<div className="flex items-center gap-1">
											<button
												onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
												disabled={currentPage === 1}
												className="w-8 h-8 rounded-full flex items-center justify-center text-gray-60 hover:bg-gray-5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
											>
												<ChevronLeft />
											</button>
											{getPageRange().map((p, i) =>
												p === '...' ? (
													<span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-40">...</span>
												) : (
													<button
														key={p}
														onClick={() => setCurrentPage(p)}
														className={`w-8 h-8 rounded-full flex items-center justify-center text-label-1 transition-colors ${currentPage === p
															? 'bg-blue-60 text-white'
															: 'text-gray-60 hover:bg-gray-5'
															}`}
													>
														{p}
													</button>
												)
											)}
											<button
												onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
												disabled={currentPage === totalPages}
												className="w-8 h-8 rounded-full flex items-center justify-center text-gray-60 hover:bg-gray-5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
											>
												<ChevronRight />
											</button>
										</div>
										<p className="text-label-2 text-gray-40">
											{(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, sortedCoins.length)} of {sortedCoins.length.toLocaleString()} assets
										</p>
									</div>
								)}
							</section>

							{/* ═══ CTA BANNER ═══ */}
							<div className="bg-blue-60 mt-8 mb-8 rounded-xl overflow-hidden">
								<div className="py-8 md:py-12 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
									<div className="flex-1">
										<h2 className="text-3xl text-white mb-6 max-w-lg">
											Create a Easy Crypto account to trade crypto. It's quick, easy, and secure.
										</h2>
										<Link to="/signup">
											<Button variant="outline" size="lg" className="bg-white text-gray-100 border-white hover:bg-gray-5">
												Start Trading
												<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
											</Button>
										</Link>
									</div>
									<div className="shrink-0">
										<img
											src="https://static-assets.coinbase.com/ui-infra/illustration/v1/spotRectangle/svg/light/accessToAdvancedCharts-5.svg"
											alt="Advanced charts illustration"
											className="w-[240px] md:w-[280px] h-auto"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* ═══ RIGHT SIDEBAR ═══ */}
						<aside className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6 lg:pl-8 lg:border-l lg:border-gray-10">

							{/* Get Started CTA */}
							<div className="bg-blue-60 rounded-2xl p-5 relative overflow-hidden min-h-[160px]">
								<div className="relative z-10 w-[65%] shrink-0">
									<h3 className="text-[17px] leading-[24px] font-semibold text-white mb-1">Get started</h3>
									<p className="text-[15px] leading-[20px] text-white mb-5">Create your account today</p>
									<Link to="/signup">
										<button className="bg-white text-black px-4 py-2 rounded-full font-medium text-[15px] transition-opacity hover:opacity-90">
											Sign up
										</button>
									</Link>
								</div>
								<div className="absolute right-0 top-1/2 -translate-y-1/2 h-full flex items-center justify-end pointer-events-none">
									<img
										src="https://static-assets.coinbase.com/ui-infra/illustration/v1/spotSquare/svg/light/nuxPopularAssets-5.svg"
										alt="Get started illustration"
										className="w-[124px] h-[124px] object-contain translate-x-2"
									/>
								</div>
							</div>

							{/* Top Movers */}
							<div>
								<div className="flex items-center justify-between mb-3">
									<h3 className="text-headline text-gray-100">Top movers</h3>
									<div className="flex gap-1">
										<button className="w-7 h-7 rounded-full border border-gray-20 flex items-center justify-center text-gray-60 hover:bg-gray-5 transition-colors"><ChevronLeft /></button>
										<button className="w-7 h-7 rounded-full border border-gray-20 flex items-center justify-center text-gray-60 hover:bg-gray-5 transition-colors"><ChevronRight /></button>
									</div>
								</div>
								<p className="text-label-2 text-gray-40 mb-3">24hr change</p>
								<div className="flex gap-3 overflow-x-auto pb-2">
									{loading
										? Array.from({ length: 2 }).map((_, i) => (
											<div key={i} className="flex-1 min-w-[120px] bg-gray-5 rounded-xl p-4 h-[120px] animate-pulse" />
										))
										: topGainers.slice(0, 4).map((coin) => (
											<TopMoverCard key={coin.id} coin={coin} currLabel={currLabel} />
										))
									}
								</div>
							</div>

							{/* New on Coinbase */}
							<div>
								<div className="flex items-center justify-between mb-3">
									<h3 className="text-headline text-gray-100">New on Easy Crypto</h3>
									<div className="flex gap-1">
										<button className="w-7 h-7 rounded-full border border-gray-20 flex items-center justify-center text-gray-60 hover:bg-gray-5 transition-colors"><ChevronLeft /></button>
										<button className="w-7 h-7 rounded-full border border-gray-20 flex items-center justify-center text-gray-60 hover:bg-gray-5 transition-colors"><ChevronRight /></button>
									</div>
								</div>
								<div className="flex gap-3 overflow-x-auto pb-2">
									{loading
										? Array.from({ length: 2 }).map((_, i) => (
											<div key={i} className="flex-1 min-w-[140px] bg-gray-5 rounded-xl p-4 h-[120px] animate-pulse" />
										))
										: newCoins.map((coin) => (
											<NewCoinCard key={coin.id} coin={coin} />
										))
									}
								</div>
							</div>
						</aside>
					</div >
				</Container >

			</main >
			<Footer />
		</div >
	);
};

export default ExplorePage;
