import React, { Component } from "react";
import "./App.css";
import Loader from "./components/Loader";
import Card from "./components/Card";

class App extends Component {
	constructor() {
		super();
		this.state = {
			size: 0,
			pageNumber: 1,
			urlList: [],
			loader: false,
			repoName: [],
			repoUrl: [],
			total_count: 0
		};
	}

	componentDidMount() {
		this.callPage(1, 30);
	}

	callPage = (pageNo, perPage) => {
		//Fetching data from the API.
		this.setState({
			...this.state,
			loader: true
		});
		fetch(
			`https://api.github.com/search/issues?page=${pageNo}&per_page=${perPage}&q=author:hacktoberfest-team`
		)
			.then(response => {
				return response.json();
			})
			.then(response => {
				let total_count = response["total_count"];
				let tempArr = [];
				//Storing the URLs from the API into tempArr[].
				for (var i = 0; i < response.items.length; i++) {
					tempArr.push(response.items[i].html_url + "\n");
				}
				//Storing total number of entries into totalCount.
				var totalCount = response.items.length;
				//Calling stringSlice function to remove junk values from urls.
				this.stringSlice(tempArr, totalCount);
				this.setState({
					...this.state,
					loader: false
				});
				if (this.state.total_count !== total_count) {
					this.setState({
						total_count: total_count
					});
				}
			});
	};

	loadMore = () => {
		var incrementPage = this.state.pageNumber + 1;
		let perPage = 30;
		this.callPage(incrementPage, perPage);
		this.setState({
			pageNumber: incrementPage
		});
	};

	stringSlice = (tempArr, totalCount) => {
		const urls = [];
		const repo = [];
		let { urlList, repoName, size } = this.state;
		for (const [index, value] of tempArr.entries()) {
			urls.push(value);
			let urlSplit = value.replace(
				/https:\/\/github.com\/|\/issues\/[0-9]+/g,
				""
			);
			var repName = urlSplit.split("/");
			var repAddress = "https://github.com/" + urlSplit;
			repo.push(
				<Card
					repName={repName[1]}
					index={size + index + 1}
					key={size + index}
					repoIssue={value}
					repAddress={repAddress}
				/>
			);
		}
		urlList = urlList.concat(urls);
		repoName = repoName.concat(repo);
		this.setState({
			urlList: urlList,
			size: size + totalCount,
			repoName: repoName
		});
	};

	hasMore = () => {
		return this.state.size < this.state.total_count;
	};

	render() {
		return (
				<>
					<a
						href="https://github.com/akramkazmi71/hacktoberfest-xrepos"
						className="forkLink"
					>
						<img
							border="0"
							alt="Github"
							src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149"
							width="150"
							height="150"
						/>
					</a>
					<h2>Hacktoberfest Excluded Repositories</h2>
					<div className="container">
						{this.state.loader ? (
							<Loader loader={this.state.loader} />
						) : (
							this.state.repoName
						)}
					</div>

					{!this.state.loader && (
						<footer className="footer">
							{this.hasMore() && (
								<button className="nextPrev" onClick={this.loadMore}>
									Load More
								</button>
							)}
						</footer>
					)}
				</>
			);
	}
}

export default App;
