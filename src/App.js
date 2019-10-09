import React, { Component } from 'react';
import { map, orderBy } from 'lodash';

import './App.css';
import Loader from './components/Loader';
import Card from './components/Card';


const PROJECT_REPO = 'https://github.com/akramkazmi71/hacktoberfest-xrepos';
const ISSUE_REGEX = /https:\/\/github.com\/|\/issues\/[0-9]+/g;
const GITHUB_URL = 'https://github.com/';

class App extends Component {
  constructor() {
    super();
    this.state = {
      size: 0,
      pageNumber: 1,
      issues: [],
      loader: false,
      totalCount: 0,
      issueCards: []
    };
  }


  componentDidMount() {
    this.callPage(1, 30);
  }


  callPage = async (pageNo, perPage) => {

    //Fetching data from the API.
    this.setState({ loader: true });

    const response = await fetch(
      `https://api.github.com/search/issues?page=${pageNo}&per_page=${perPage}&q=author:hacktoberfest-team`
    ).catch((err) => {
      console.log(err);
    });

    const responseData = await response.json();
    const totalCount = responseData['total_count'];
    const issues = orderBy(
      map(responseData.items, item => this.formatIssue(item.html_url)),
      ['repoName'],
      ['asc']
    );

    this.createCards(issues, totalCount);
  };


  loadMore = () => {
    var incrementPage = this.state.pageNumber + 1;
    let perPage = 30;
    this.callPage(incrementPage, perPage);
    this.setState({
      pageNumber: incrementPage
    });
  };


  formatIssue = (issueUrl) => {

    const userRepo = issueUrl.replace(ISSUE_REGEX, '');
    const [user, repo] = userRepo.split('/');
    return {
      issueUrl: issueUrl,
      repoUrl: `${GITHUB_URL}${userRepo}`,
      userName: user,
      repoName: repo
    }
  };


  createCards = (issues, totalCount) => {
    let issueCards = map(issues, issue => this.createRepoDiv(issue));
    issueCards = this.state.issueCards.concat(issueCards);

    this.setState({
      size: issueCards.length,
      loader: false,
      issueCards,
      totalCount
    });
  };


  hasMore = () => {
    return this.state.size < this.state.totalCount;
  };


  createRepoDiv = ({ repoName, issueUrl, repoUrl }) => {
    return <Card
      repoName={repoName}
      key={issueUrl}
      repoIssue={issueUrl}
      repAddress={repoUrl}
    />
  }

  render() {
    return (
      <React.Fragment>
        <a href={PROJECT_REPO} className='forkLink'>
          <img
            border='0' alt='Github' width='150' height='150'
            src='https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149'
          />
        </a>
        <h2>Hacktoberfest Excluded Repositories</h2>
        <div className='main-container'>
          <div className='container'>
            {this.state.issueCards}
          </div>
          <Loader loader={this.state.loader} />Î
        </div>
        {!this.state.loader && (
          <footer className='footer'>
            {this.hasMore() && (
              <button className='nextPrev' onClick={this.loadMore}>Load More</button>
            )}
          </footer>
        )}
      </React.Fragment>
    );
  }
}

export default App;
