import EmblaCarousel from "embla-carousel";
import type { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import type { DataJSON, RouteParam } from "./types";
import { movieType, seriesType, svgBookmarked, svgBookmark } from "./const";
const main = document.querySelector("main") as HTMLElement;
const mainScript = document.getElementById("main-script") as HTMLScriptElement;
const routeParam = mainScript.dataset.param as RouteParam;
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
	const storage = window.localStorage.getItem("bookmarkedList");
	let bookmarkedList: Record<string, boolean> = {};
	if (storage) {
		bookmarkedList = JSON.parse(storage);
	}
	const trendingListContainer = document.createElement("div");
	const trendingListInnerContainer = document.createElement("div");
	const trendingListTitle = document.createElement("h2");
	const trendingList = document.createElement("ul");
	const recommendedListContainer = document.createElement("div");
	const recommendedListTitle = document.createElement("h2");
	const recommendedList = document.createElement("ul");

	//start of loop
	for (const element of data) {
		const listItem = document.createElement("li");
		const image = document.createElement("img");
		const movieInfo = document.createElement("div");
		const showInfoInnerDiv = document.createElement("div");
		const showInfoInnerDivYear = document.createElement("p");
		const separator = document.createElement("span");
		const showInfoInnerDivType = document.createElement("div");
		const movieTypeDescription = document.createElement("p");
		const movieRating = document.createElement("p");
		const movieTitle = document.createElement("h3");
		movieTypeDescription.textContent = element.category;
		movieRating.textContent = element.rating;
		movieTitle.textContent = element.title;

		image.src = element.thumbnail.regular.large;
		image.alt = element.title;
		showInfoInnerDivYear.textContent = element.year.toString();
		separator.textContent = "•";
		if (element.category === "Movie") {
			showInfoInnerDivType.innerHTML = movieType;
		} else {
			showInfoInnerDivType.innerHTML = seriesType;
		}
		if (routeParam === "") {
			trendingListTitle.textContent = "Trending";
			trendingListContainer.id = "div-trending-title-ul";
			trendingListInnerContainer.classList.add("embla");
			trendingList.classList.add("embla__container");
			trendingListContainer.appendChild(trendingListInnerContainer);
			trendingListContainer.appendChild(trendingListTitle);
			trendingListInnerContainer.appendChild(trendingList);
			const options: EmblaOptionsType = { loop: false, dragFree: true };
			EmblaCarousel(trendingListInnerContainer, options) as EmblaCarouselType;
			if (element.isTrending) {
				listItem.classList.add("embla__slide");
				trendingList.appendChild(listItem);
			}
		}
		if (routeParam !== "bookmarked") {
			listItem.appendChild(image);
			listItem.appendChild(createBookmarkButton(bookmarkedList, element));
			showInfoInnerDiv.appendChild(showInfoInnerDivYear);
			showInfoInnerDiv.appendChild(separator.cloneNode(true));
			showInfoInnerDivType.appendChild(movieTypeDescription);
			showInfoInnerDiv.appendChild(showInfoInnerDivType);
			showInfoInnerDiv.appendChild(separator.cloneNode(true));
			showInfoInnerDiv.appendChild(movieRating);
			movieInfo.appendChild(showInfoInnerDiv);
			movieInfo.appendChild(movieTitle);
			listItem.appendChild(movieInfo);
			recommendedListContainer.appendChild(recommendedListTitle);
			recommendedListContainer.appendChild(recommendedList);
			if (!element.isTrending) {
				recommendedList.appendChild(listItem);
			}
		}
	}
	//end of loop
	recommendedListContainer.id = "div-recommended-title-ul";
	recommendedListContainer.className = "div-show-gallery";
	switch (routeParam) {
		case "movies":
			recommendedListTitle.textContent = "Movies";
			break;
		case "tv-series":
			recommendedListTitle.textContent = "TV Series";
	}
	if (routeParam === "") main.appendChild(trendingListContainer);
	main.appendChild(recommendedListContainer);
}

const createBookmarkButton = (
	bookmarkedList: Record<string, boolean>,
	element: DataJSON,
) => {
	const bookmarkButton = document.createElement("button");
	bookmarkButton.innerHTML = `${svgBookmark}\n${svgBookmarked}`;
	const svgBookmarkIcon = bookmarkButton.querySelector(
		"svg:nth-of-type(1)",
	) as HTMLElement;
	const svgBookmarkedIcon = bookmarkButton.querySelector(
		"svg:nth-of-type(2)",
	) as HTMLElement;
	if (bookmarkedList[element.title] === true) {
		svgBookmarkIcon.style.opacity = "0";
		svgBookmarkedIcon.style.opacity = "1";
	} else {
		svgBookmarkIcon.style.opacity = "1";
		svgBookmarkedIcon.style.opacity = "0";
	}
	bookmarkButton.addEventListener("click", () => {
		if (bookmarkedList[element.title] === true) {
			bookmarkedList[element.title] = false;
			svgBookmarkIcon.style.opacity = "1";
			svgBookmarkedIcon.style.opacity = "0";
		} else {
			bookmarkedList[element.title] = true;
			svgBookmarkIcon.style.opacity = "0";
			svgBookmarkedIcon.style.opacity = "1";
		}
		window.localStorage.setItem(
			"bookmarkedList",
			JSON.stringify(bookmarkedList),
		);
	});
	return bookmarkButton;
};
