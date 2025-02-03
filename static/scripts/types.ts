type DataJSON = {
	title: string;
	thumbnail: {
		trending: {
			small: string;
			large: string;
		};
		regular: {
			small: string;
			medium: string;
			large: string;
		};
	};
	year: number;
	category: string;
	rating: string;
	isBookmarked: boolean;
	isTrending: boolean;
};

type RouteParam = "" | "movies" | "tv-series" | "bookmarked";

export type { DataJSON, RouteParam };
