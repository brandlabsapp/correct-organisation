declare namespace home {
	export interface IFeature {
		title: string;
		description: string;
		icon?: string | JSX.Element;
	}
	export interface ITestimonial {
		id?: string;
		name: string;
		company: string;
		title?: string;
		quote: string;
	}
	export interface IPricing {
		name: string;
		price: string;
		features: string[];
	}
}
