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
	const svgBookmark = `<svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M10.7112 0.771005L10.7215 0.775484L10.7319 0.779653C10.7992 0.806575 10.8386 0.840492 10.8705 0.886923C10.9032 0.934576 10.9167 0.977859 10.9167 1.03635V12.9636C10.9167 13.0221 10.9032 13.0654 10.8705 13.1131C10.8386 13.1595 10.7992 13.1934 10.7319 13.2203L10.7237 13.2236L10.7156 13.2271C10.7107 13.2292 10.6807 13.2407 10.6094 13.2407C10.5085 13.2407 10.4397 13.2142 10.3686 13.15L6.3572 9.2346L5.83333 8.72327L5.30946 9.2346L1.29754 13.1505C1.21287 13.2276 1.14206 13.25 1.05729 13.25C1.02004 13.25 0.988249 13.2433 0.955471 13.229L0.945175 13.2245L0.934749 13.2203C0.867434 13.1934 0.828051 13.1595 0.796199 13.1131C0.763509 13.0654 0.75 13.0221 0.75 12.9636V1.03635C0.75 0.977859 0.763509 0.934576 0.796198 0.886924C0.828051 0.840491 0.867435 0.806574 0.93475 0.779653L0.945175 0.775484L0.95547 0.771004C0.988248 0.756743 1.02004 0.75 1.05729 0.75H10.6094C10.6466 0.75 10.6784 0.756743 10.7112 0.771005Z" stroke="white" stroke-width="1.5" />	</svg>	`;
	const svgBookmarked = `<svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M10.61 0c.14 0 .273.028.4.083a1.03 1.03 0 0 1 .657.953v11.928a1.03 1.03 0 0 1-.656.953c-.116.05-.25.074-.402.074-.291 0-.543-.099-.756-.296L5.833 9.77l-4.02 3.924c-.218.203-.47.305-.756.305a.995.995 0 0 1-.4-.083A1.03 1.03 0 0 1 0 12.964V1.036A1.03 1.03 0 0 1 .656.083.995.995 0 0 1 1.057 0h9.552Z" fill="#FFF"/></svg>`;
	for (const element of data) {
		const bookmarkButton = document.createElement("button");
		bookmarkButton.innerHTML = `${svgBookmark}\n${svgBookmarked}`;
		const svgBookmarkIcon = bookmarkButton.querySelector(
			"svg:nth-of-type(1)",
		) as HTMLElement;
		const svgBookmarkedIcon = bookmarkButton.querySelector(
			"svg:nth-of-type(2)",
		) as HTMLElement;
		const listItem = document.createElement("li");
		const image = document.createElement("img");
		const movieInfo = document.createElement("div");
		movieInfo.innerHTML = "XYZ";
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
		image.src = element.thumbnail.regular.large;
		image.alt = element.title;
		listItem.appendChild(image);
		listItem.appendChild(bookmarkButton);
		listItem.appendChild(movieInfo);
		if (element.isTrending) {
			listItem.classList.add("embla__slide");
			trendingList.appendChild(listItem);
		} else {
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
