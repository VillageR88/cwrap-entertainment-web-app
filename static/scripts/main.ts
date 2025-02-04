import EmblaCarousel from "embla-carousel";
import type { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import type { DataJSON } from "./types";
import { movieType, seriesType, routeParam } from "./const";
import {
	createBookmarkButton,
	fetchData,
	createGalleryListContainer,
} from "./functions";
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
	const galleryList1 = document.createElement("ul");
	const galleryList2 = document.createElement("ul");

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
		console.log(element.category);
		//Here part to be derived for dynamic
		if (!element.isTrending) {
			if (routeParam === "" || element.category === "Movie") {
				galleryList1.appendChild(listItem);
			}
			if (routeParam !== "" && element.category !== "Movie") {
				galleryList2.appendChild(listItem);
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
	if (routeParam === "") {
		const options: EmblaOptionsType = { loop: false, dragFree: true };
		EmblaCarousel(trendingListInnerContainer, options) as EmblaCarouselType;
		main.appendChild(trendingListContainer);
	}
	//static end
	//dynamic candidate start
	if (routeParam !== "tv-series") {
		const galleryListContainer = createGalleryListContainer(
			galleryList1,
			routeParam === "bookmarked" ? "Bookmarked Movies" : "Movies",
		);
		main.appendChild(galleryListContainer);
	}
	if (routeParam !== "movies") {
		const galleryListContainer = createGalleryListContainer(
			galleryList2,
			routeParam === "bookmarked" ? "Bookmarked TV Series" : "TV Series",
		);
		main.appendChild(galleryListContainer);
	}
}
