import EmblaCarousel from "embla-carousel";
import type { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import type { DataJSON } from "./types";
import { movieType, seriesType, routeParam } from "./const";
import { createBookmarkButton, fetchData } from "./functions";
const main = document.querySelector("main") as HTMLElement;

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
	const galleryListContainer = document.createElement("div");
	const galleryListTitle = document.createElement("h2");
	const galleryList = document.createElement("ul");

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
			trendingListInnerContainer.appendChild(trendingList);

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
			//Here part to be derived for dynamic
			if (!element.isTrending) {
				galleryList.appendChild(listItem);
			}
		}
	}
	//end of loop
	//static start
	trendingListTitle.textContent = "Trending";
	trendingListContainer.id = "div-trending-title-ul";
	trendingListInnerContainer.classList.add("embla");
	trendingList.classList.add("embla__container");
	trendingListContainer.appendChild(trendingListInnerContainer);
	trendingListContainer.appendChild(trendingListTitle);
	//static end
	//dynamic candidate start
	galleryListContainer.appendChild(galleryListTitle);
	galleryListContainer.appendChild(galleryList);
	galleryListContainer.className = "div-show-gallery";
	switch (routeParam) {
		case "movies":
			galleryListTitle.textContent = "Movies";
			break;
		case "tv-series":
			galleryListTitle.textContent = "TV Series";
			break;
		default:
			galleryListTitle.textContent = "Recommended for you";
	}
	if (routeParam === "") {
		const options: EmblaOptionsType = { loop: false, dragFree: true };
		EmblaCarousel(trendingListInnerContainer, options) as EmblaCarouselType;
		main.appendChild(trendingListContainer);
	}
	main.appendChild(galleryListContainer);
}
