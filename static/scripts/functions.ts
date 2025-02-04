import type { DataJSON } from "./types";
import { svgBookmarked, svgBookmark, routeParam } from "./const";

const createBookmarkButton = (
	bookmarkedList: Record<string, boolean>,
	element: DataJSON,
	unBooked: () => void,
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
			unBooked();
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

const createGalleryListContainer = (
	galleryList: HTMLUListElement,
	title: string,
	alternateId?: string,
): HTMLDivElement => {
	const galleryListContainer = document.createElement("div");
	const galleryListTitle = document.createElement("h2");
	galleryListContainer.appendChild(galleryListTitle);
	galleryListContainer.appendChild(galleryList);
	galleryListContainer.className = "div-show-gallery";
	if (alternateId) galleryListContainer.id = alternateId;
	galleryListTitle.textContent = title;
	return galleryListContainer;
};

export { createBookmarkButton, fetchData, createGalleryListContainer };
