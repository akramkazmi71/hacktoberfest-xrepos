import React, {Component} from 'react';
import './App.css';

class App extends Component{
  constructor() {
    super();
    this.state = {
      list: [],
      size: 0,
      pageNumber: 1,
      max_page: 1,
      count: 0
    };
  }

  componentDidMount() {
    this.callPage();
  }

  callPage = () => {
    fetch(`https://api.github.com/search/issues?page=${this.state.pageNumber}&q=author:hacktoberfest-team`)
      .then(response => {
        return response.json();
      })
      .then(response => {
        let tempArr=[]  
        for (var i = 0; i < response.items.length; i++) {
          tempArr.push(response.items[i].url+"\n")
        }

        this.setState({
          list: tempArr,
          size: response.total_count
        })
      });
  }
    
  nextPage = () => {
    var x=this.state.size/30
    this.state.max_page=Math.floor(x)+1
    this.state.pageNumber=this.state.pageNumber+1
    if(this.state.pageNumber<=this.state.max_page){
      this.callPage();
    }
  }

  previousPage = () => {
    this.state.pageNumber-=1
    this.state.count-=(this.state.count%30)+30
    this.callPage();
  }

  render() {
    const urls=[]
    for (const [index, value] of this.state.list.entries()){
      var url0=JSON.stringify({value})
      var url1=String(url0)
      var url2=url1.replace('{"value":"','')
      var url3=url2.replace('n"}','')
      var url4=url3.replace('api.','www.')
      var final_url=url4.replace('/repos','')
      this.state.count++
      urls.push(<p key={index}><a href={final_url}>{index+1}.{final_url}</a></p>)
      urls.sort()
    }
    return(
      <div>
        {urls}  
        {this.state.pageNumber>1 && <button onClick={this.previousPage}>Previous Page</button>}
        <button onClick={this.nextPage}>Next Page</button> 
      </div>
    )
  }
}

export default App;