import dataJson from "../data.json" with { type: "json" };

type DataJSON = {
	title: string;
	thumbnail: {
		trending: {
			small: "string";
			large: "string";
		};
		regular: {
			small: "string";
			medium: "string";
			large: "string";
		};
	};
	year: number;
	category: string;
	rating: string;
	isBookmarked: boolean;
	isTrending: boolean;
};

const data = JSON.parse(
	JSON.stringify(dataJson).replace(/assets/g, "images"),
) as DataJSON[];

console.log("hello");
