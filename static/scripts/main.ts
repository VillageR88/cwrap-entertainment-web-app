import EmblaCarousel from "embla-carousel";
import type { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import { type DataJSON, RouteParam } from "./types";
import { movieType, seriesType, routeParam } from "./const";
import {
	createBookmarkButton,
	fetchData,
	createGalleryListContainer,
} from "./functions";
const main = document.querySelector("main") as HTMLElement;
const SEARCH_RESULT_CONTAINER = "search-result-container";
const EMBLA = "embla";
const EMBLA_CONTAINER = "embla__container";
const EMBLA_SLIDE = "embla__slide";
const DIV_TRENDING_TITLE_UL = "div-trending-title-ul";
const DIV_SHOW_GALLERY = "div-show-gallery";
const MOVIE = "Movie";
const BOOKMARKED_MOVIES = "Bookmarked Movies";
const BOOKMARKED_TV_SERIES = "Bookmarked TV Series";
const MOVIES = "Movies";
const TV_SERIES = "TV Series";
fetchData()
	.then((data) => {
		fillMain(data);
	})
	.catch((error) => {
		console.error("Error fetching data:", error);
	});
function fillMain(data: DataJSON[]) {
	const search = document.getElementById("search-input") as HTMLInputElement;
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
		if (element.category === MOVIE) {
			showInfoInnerDivType.innerHTML = movieType;
		} else {
			showInfoInnerDivType.innerHTML = seriesType;
		}
		if (routeParam === "") {
			trendingListInnerContainer.appendChild(trendingList);

			if (element.isTrending) {
				listItem.classList.add(EMBLA_SLIDE);
				trendingList.appendChild(listItem);
			}
		}
		listItem.appendChild(image);
		const unBooked = () => {
			if (routeParam === RouteParam.BOOKMARKED) {
				listItem.remove();
				for (const element of main.querySelectorAll("div:has(ul)")) {
					if (element.querySelector("ul")?.childElementCount === 0) {
						element.remove();
					}
				}
			}
		};
		listItem.appendChild(
			createBookmarkButton(bookmarkedList, element, unBooked),
		);
		showInfoInnerDiv.appendChild(showInfoInnerDivYear);
		showInfoInnerDiv.appendChild(separator.cloneNode(true));
		showInfoInnerDivType.appendChild(movieTypeDescription);
		showInfoInnerDiv.appendChild(showInfoInnerDivType);
		showInfoInnerDiv.appendChild(separator.cloneNode(true));
		showInfoInnerDiv.appendChild(movieRating);
		movieInfo.appendChild(showInfoInnerDiv);
		movieInfo.appendChild(movieTitle);
		listItem.appendChild(movieInfo);
		if (!element.isTrending || routeParam !== RouteParam.HOME) {
			if (
				routeParam === RouteParam.BOOKMARKED &&
				!bookmarkedList[element.title]
			)
				continue;

			if (routeParam === "" || element.category === MOVIE) {
				galleryList1.appendChild(listItem);
			}
			if (routeParam !== "" && element.category !== MOVIE) {
				galleryList2.appendChild(listItem);
			}
		}
	}
	trendingListTitle.textContent = "Trending";
	trendingListContainer.id = DIV_TRENDING_TITLE_UL;
	trendingListInnerContainer.classList.add(EMBLA);
	trendingList.classList.add(EMBLA_CONTAINER);
	trendingListContainer.appendChild(trendingListInnerContainer);
	trendingListContainer.appendChild(trendingListTitle);
	if (routeParam === "") {
		const options: EmblaOptionsType = { loop: false, dragFree: true };
		EmblaCarousel(trendingListInnerContainer, options) as EmblaCarouselType;
		main.appendChild(trendingListContainer);
	}
	if (routeParam !== "tv-series") {
		if (galleryList1.childElementCount > 0) {
			const galleryListContainer = createGalleryListContainer(
				galleryList1,
				routeParam === RouteParam.BOOKMARKED ? BOOKMARKED_MOVIES : MOVIES,
			);
			main.appendChild(galleryListContainer);
		}
	}
	if (routeParam !== RouteParam.MOVIES) {
		if (galleryList2.childElementCount > 0) {
			const galleryListContainer = createGalleryListContainer(
				galleryList2,
				routeParam === RouteParam.BOOKMARKED ? BOOKMARKED_TV_SERIES : TV_SERIES,
			);
			main.appendChild(galleryListContainer);
		}
	}
	const loadedGalleries = main.querySelectorAll(
		`#${DIV_TRENDING_TITLE_UL}, .${DIV_SHOW_GALLERY}`,
	);
	if (search) {
		search.addEventListener("input", () => {
			document.getElementById(SEARCH_RESULT_CONTAINER)?.remove();
			let numberOfResults = 0;
			const gallerySearchList = document.createElement("ul");
			for (const item of loadedGalleries) {
				const itemTitleList = item.querySelectorAll("h3");
				for (const title of itemTitleList) {
					if (title.textContent?.toLowerCase()?.match(search.value)) {
						const foundListItem = title.parentElement?.parentElement;
						if (foundListItem) {
							const clonedFoundListItem = foundListItem.cloneNode(
								true,
							) as HTMLUListElement;
							clonedFoundListItem.classList.remove(EMBLA_SLIDE);
							gallerySearchList.appendChild(clonedFoundListItem);
							numberOfResults++;
						}
					}
				}
				if (search.value !== "") {
					(item as HTMLElement).style.display = "none";
				} else {
					(item as HTMLElement).style.removeProperty("display");
				}
			}
			if (search.value !== "") {
				const gallerySearchListTitle = `Found ${numberOfResults} results for ‘${search.value}’`;

				const searchListContainer = createGalleryListContainer(
					gallerySearchList,
					gallerySearchListTitle,
					SEARCH_RESULT_CONTAINER,
				);
				main.insertBefore(
					searchListContainer,
					document.querySelector(`.${DIV_SHOW_GALLERY}`),
				);
			}
		});
	}
}
