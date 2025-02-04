enum RouteParam {
	HOME = "",
	MOVIES = "movies",
	TV_SERIES = "tv-series",
	BOOKMARKED = "bookmarked",
}

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

type TRouteParam =
	| RouteParam.HOME
	| RouteParam.MOVIES
	| RouteParam.TV_SERIES
	| RouteParam.BOOKMARKED;

export { type DataJSON, type TRouteParam, RouteParam };
