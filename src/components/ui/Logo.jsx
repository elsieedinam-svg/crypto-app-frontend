const Logo = ({ height = 28, className = '', iconOnly = false }) => (
	<div className={`flex items-center gap-2 ${className}`}>
		<div className="bg-blue-60 w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ width: `${height * 1.15}px`, height: `${height * 1.15}px` }}>
			<svg width={height * 0.7} height={height * 0.7} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
				<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
			</svg>
		</div>
		{!iconOnly && (
			<span className="text-xl font-bold text-gray-100 tracking-tight whitespace-nowrap" style={{ fontSize: `${height * 0.75}px` }}>
				Crypto App
			</span>
		)}
	</div>
);

export default Logo;
