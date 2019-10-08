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
      total_count: 0
    };
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
        const me = this;
        const urls=[]
        const repo=[]
        let data = tempArr.concat(this.state.urlList).reduce(function(result, value, index){
            var repName = me.extractRepName(value);
            var repAddress = me.extractRepAdress(value);
            result.push({
                "repName": repName,
                "url": value,
                "repAddress": repAddress
            });

            return result;
        }, []);

        data.sort(function(a, b){
            return a.repName.localeCompare(b.repName);   
        }).forEach(function(obj, index){
            urls.push(obj.url);
            repo.push(me.createRepoDiv(index, obj.url, obj.repName, obj.repAddress));
        });

        this.setState({
            urlList: urls,
            size: data.length,
            repoName: repo
        })
    }

    hasMore = () => {
        return this.state.size < this.state.total_count;
    }
    createRepoDiv = (index, value, repName, repAddress) => {
        return <div class="card"><p key={index}>{index+1}.{repName}</p>
                  <button class="repoIssue"><a href={value}>Issue</a></button>
                  <button class="repoIssue"><a href={repAddress}>Repository</a></button>
                </div>;
    }

    extractRepName = (value)  => {
        let repName = (value.replace(/https:\/\/github.com\/|\/issues\/[0-9]+/g,'')).split("/");
        return repName.length === 2 ? repName[1] : repName[0];
    }

    extractRepAdress = (value) => {
        let urlSplit=value.replace(/https:\/\/github.com\/|\/issues\/[0-9]+/g,'');
        return "https://github.com/"+urlSplit;
    }

  render() {
    return(
      <div class="background">
        <a href="https://github.com/akramkazmi71/hacktoberfest-xrepos">
        <img border="0" alt="Github" src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149" width="150" height="150"></img></a>
        <h2><u>Hacktoberfest Excluded Repositories</u></h2>
        <div class="container">
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

