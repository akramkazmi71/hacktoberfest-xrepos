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
      loader:false
    };
  }

  componentDidMount() {
    this.callPage(1);
  }

  callPage = (pageNo) => {
    //Fetching data from the API.
    window.scrollTo(0, 0)
    this.setState({
      ...this.state,
      loader:true
    })
    fetch(`https://api.github.com/search/issues?page=${pageNo}&q=author:hacktoberfest-team`)
      .then(response => {
        return response.json();
      })
      .then(response => {
        let tempArr=[]  
        //Storing the URLs from the API into tempArr[].
        for (var i = 0; i < response.items.length; i++) {
          tempArr.push(response.items[i].url+"\n")
        }
        //Storing total number of entries into totalCount.
        var totalCount=response.items.length
        //Calling stringSlice function to remove junk values from urls.
        this.stringSlice(tempArr,totalCount)
        this.setState({
          ...this.state,
          loader:false
        })
      });
  }
    
  nextPage = () => {
    var x=this.state.size/30
    //Finding maximum number of pages that are formed.
    var maxPage=Math.floor(x)+1
    if(this.state.pageNumber<=maxPage){
      var incrementPage=this.state.pageNumber+1
      //Going to next page.
      this.callPage(incrementPage);
      this.setState({
        pageNumber: incrementPage
      })
    }
  }

  previousPage = () => {
    var prevPage=this.state.pageNumber-1
    //Going to previous page.
    this.callPage(prevPage);
    this.setState({
      pageNumber: prevPage
    })
  }

  stringSlice = (tempArr,totalCount) => {
    const urls=[]
    for (const [index, value] of tempArr.entries()){
      //Converting undefined data into string.
      var url0=JSON.stringify({value})
      var url1=String(url0)
      //Removing junk values from url.
      var url2=url1.replace('{"value":"','')
      var url3=url2.replace('n"}','')
      var url4=url3.replace('api.','www.')
      var final_url=url4.replace('/repos','')
      //Storing valid url into urls[].
      urls.push(<div class="card"><p key={index}><a href={final_url}>{index+1}. {final_url}</a></p></div>)
      urls.sort()
    }
    this.setState({
      urlList: urls,
      size: totalCount
    })
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
            this.state.urlList
          }
          {this.state.pageNumber>1 && <button onClick={this.previousPage}>Previous Page</button>}
          {!this.state.loader?
            <button onClick={this.nextPage}>Next Page</button> 
            :
            null
          }
        </div>
      </div>
    )
  }
}

export default App;

