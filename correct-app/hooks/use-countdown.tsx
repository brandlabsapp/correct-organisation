import { useEffect, useState } from 'react';
import { COUNTDOWN_INITIAL } from '@/utils/constants/constant';

function useOtpCountdown(isActive: boolean) {
	const [countdown, setCountdown] = useState(COUNTDOWN_INITIAL);

	useEffect(() => {
		if (!isActive) {
			setCountdown(COUNTDOWN_INITIAL);
			return;
		}

		const timer = setInterval(() => {
			setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);

		return () => clearInterval(timer);
	}, [isActive]);

	const resetCountdown = () => setCountdown(COUNTDOWN_INITIAL);

	return { countdown, resetCountdown };
}

export default useOtpCountdown;
