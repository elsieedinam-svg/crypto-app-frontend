const Logo = ({ height = 28, className = '' }) => (
	<div className={`flex items-center gap-2 ${className}`}>
		<div className="bg-blue-60 w-8 h-8 rounded-lg flex items-center justify-center">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
				<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
			</svg>
		</div>
		<span className="text-xl font-bold text-gray-100 tracking-tight" style={{ fontSize: `${height * 0.75}px` }}>
			Crypto App
		</span>
	</div>
);

export default Logo;
