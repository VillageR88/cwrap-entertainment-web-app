import type { DataJSON } from "./types";
import { svgBookmarked, svgBookmark } from "./const";

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

export { createBookmarkButton };
