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
	console.log("Passed param:", mainScript.dataset.param);

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
	const recommendedListContainer = document.createElement("div");
	const recommendedListTitle = document.createElement("h2");
	const recommendedList = document.createElement("ul");
	recommendedListContainer.id = "div-title-recommended-ul";
	recommendedListTitle.textContent = "Recommended for you";
	for (const element of data) {
		console.log(element.thumbnail.regular.large);
		const listItem = document.createElement("li");
		const image = document.createElement("img");
		image.src = element.thumbnail.regular.large;
		listItem.appendChild(image);
		recommendedList.appendChild(listItem);
	}
	recommendedListContainer.appendChild(recommendedListTitle);
	recommendedListContainer.appendChild(recommendedList);
	main.appendChild(recommendedListContainer);
}
