import React, {Component} from 'react';
import './App.css';
import Loader from './loader/loader'

class App extends Component{
  constructor() {
    super();
    this.state = {
      size: 0,
      pageNumber: 1,
      urlList: [],
      loader:false,
      repoName: [],
      repoUrl: [],
      total_count: 0,
      searchTerm: ""
    };
    this.searchRepo = this.searchRepo.bind(this)
  }

  componentDidMount() {
    this.callPage(1,30);
  }

  callPage = (pageNo,perPage) => {
    //Fetching data from the API.
    this.setState({
      ...this.state,
      loader:true
    })
    fetch(`https://api.github.com/search/issues?page=${pageNo}&per_page=${perPage}&q=author:hacktoberfest-team`)
      .then(response => {
        return response.json();
      })
      .then(response => {
        let total_count = response['total_count'];
        let tempArr=[]
        //Storing the URLs from the API into tempArr[].
        if(response.items){
        for (var i = 0; i < response.items.length; i++) {
          tempArr.push(response.items[i].html_url+"\n")
        }
        //Storing total number of entries into totalCount.
        var totalCount=response.items.length
        //Calling stringSlice function to remove junk values from urls.
        this.stringSlice(tempArr,totalCount)
        this.setState({
          ...this.state,
          loader:false
        })
        if(this.state.total_count !== total_count){
          this.setState({
            total_count: total_count
          });
        }
      }
      });
  }


  loadMore = () => {
    var incrementPage=this.state.pageNumber+1
    let perPage = 30;
    this.callPage(incrementPage, perPage);
    this.setState({
      pageNumber: incrementPage
    });
  }

  stringSlice = (tempArr,totalCount) => {
    const urls=[]
    const repo=[]
    let {urlList, repoName, size} = this.state;
    for (const [index, value] of tempArr.entries()){
      urls.push(value)
      let urlSplit=value.replace(/https:\/\/github.com\/|\/issues\/[0-9]+/g,'')
      var repName=urlSplit.split("/")
      repo.push(<div class="card"><p key={size+index}><a href={value}>{size+index+1}. {repName[1]}</a></p></div>)
    }
    urlList = urlList.concat(urls);
    repoName = repoName.concat(repo);
    this.setState({
      urlList: urlList,
      size: size+totalCount,
      repoName: repoName
    })
  }

  hasMore = () => {
    return this.state.size < this.state.total_count;
  }

  searchRepo = (event) => {
    this.setState({
      searchTerm: event.target.value,
      loader:true,
      repoName: [],
      urlList: [],
      repoUrl: [],
      totalCount: 0
    })
    console.log()
    if( this.state.searchTerm === 0 ){
      this.callPage(1, 30)
    }
    else {
      window.scrollTo(0, 0)
      var totalCount=0
      fetch("https://api.github.com/search/issues?q="+this.state.searchTerm)
      .then(response => {
        return response.json();
      })
      .then(response => {
        let total_count = response['total_count'];
        let tempArr=[]
        if(response.items){
          //Storing the URLs from the API into tempArr[].
          for (var i = 0; i < response.items.length; i++) {
            tempArr.push(response.items[i].html_url+"\n")
          }
          //Storing total number of entries into totalCount.
          totalCount=response.items.length
          //Calling stringSlice function to remove junk values from urls.
          this.stringSlice(tempArr,totalCount)
        }
          this.setState({
            ...this.state,
            loader:false
          })
          if(this.state.total_count !== total_count){
            this.setState({
              total_count: total_count
            });
          }
      });
    }
  }

  render() {
    return(
      <div class="background">
        <a href="https://github.com/akramkazmi71/hacktoberfest-xrepos">
        <img border="0" alt="Github" src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149" width="150" height="150"></img></a>
        <h2><u>Hacktoberfest Excluded Repositories</u></h2>
        <div class="container">
        <input 
          name= "searchTerm"
          type="text" 
          placeholder="Search"
          value= { this.state.searchTerm }
          onChange= { this.searchRepo }  
          />
          {this.state.loader ?
            <Loader loader={this.state.loader}/>
            :
            this.state.repoName
          }
         {this.hasMore() && <button class="nextPrev" onClick={this.loadMore}>Load More</button>}
        </div>
      </div>
    )
  }
}

export default App;

