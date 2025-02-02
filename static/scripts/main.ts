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

async function fetchData(): Promise<DataJSON[]> {
	const response = await fetch("./static/data.json");
	if (!response.ok) {
		throw new Error(
			`Failed to fetch data: ${response.status} ${response.statusText}`,
		);
	}

	const dataJson = await response.json();
	const transformedData = JSON.parse(
		JSON.stringify(dataJson).replace(/.assets/g, "/static/images"),
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
	const recommendedList = document.createElement("ul");
	recommendedList.classList.add("recommended-ul");
	for (const element of data) {
		console.log(element.thumbnail.regular.large);
		const listItem = document.createElement("li");
		const image = document.createElement("img");
		image.src = element.thumbnail.regular.large;
		listItem.appendChild(image);
		recommendedList.appendChild(listItem);
	}
	main.appendChild(recommendedList);
}
