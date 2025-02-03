import EmblaCarousel from "embla-carousel";
import type { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
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
const main = document.querySelector("main") as HTMLElement;
const mainScript = document.getElementById("main-script") as HTMLScriptElement;
const routeParam = mainScript.dataset.param as string;

async function fetchData(): Promise<DataJSON[]> {
	const response = await fetch(
		`${routeParam?.length > 0 ? ".." : "."}/static/data.json`,
	);
	if (!response.ok) {
		throw new Error(
			`Failed to fetch data: ${response.status} ${response.statusText}`,
		);
	}

	const dataJson = await response.json();
	const transformedData = JSON.parse(
		JSON.stringify(dataJson).replace(
			/.assets/g,
			`${routeParam?.length > 0 ? "." : ""}/static/images`,
		),
	) as DataJSON[];

	return transformedData;
}

fetchData()
	.then((data) => {
		fillMain(data);
	})
	.catch((error) => {
		console.error("Error fetching data:", error);
	});

function fillMain(data: DataJSON[]) {
	const trendingListContainer = document.createElement("div");
	const trendingListInnerContainer = document.createElement("div");
	const trendingListTitle = document.createElement("h2");
	const trendingList = document.createElement("ul");
	const recommendedListContainer = document.createElement("div");
	const recommendedListTitle = document.createElement("h2");
	const recommendedList = document.createElement("ul");

	for (const element of data) {
		if (element.isTrending) {
			const listItem = document.createElement("li");
			const image = document.createElement("img");
			listItem.classList.add("embla__slide");
			image.src = element.thumbnail.regular.large;
			listItem.appendChild(image);
			trendingList.appendChild(listItem);
		} else {
			const listItem = document.createElement("li");
			const image = document.createElement("img");
			image.src = element.thumbnail.regular.large;
			listItem.appendChild(image);
			recommendedList.appendChild(listItem);
		}
		trendingListTitle.textContent = "Trending";
		trendingListContainer.id = "div-trending-title-ul";
		trendingListInnerContainer.classList.add("embla");
		trendingList.classList.add("embla__container");
		recommendedListContainer.id = "div-recommended-title-ul";
		recommendedListTitle.textContent = "Recommended for you";
		trendingListContainer.appendChild(trendingListInnerContainer);

		trendingListContainer.appendChild(trendingListTitle);
		trendingListInnerContainer.appendChild(trendingList);
		recommendedListContainer.appendChild(recommendedListTitle);
		recommendedListContainer.appendChild(recommendedList);
		main.appendChild(trendingListContainer);
		main.appendChild(recommendedListContainer);
		const options: EmblaOptionsType = { loop: false, dragFree: true };
		EmblaCarousel(trendingListInnerContainer, options) as EmblaCarouselType;
	}
}
