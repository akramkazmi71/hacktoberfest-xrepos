import React, {Component} from 'react';

class List extends Component {
  constructor() {
    super();
    this.state = {
        list: []
    };
}

componentDidMount() {
  fetch('https://api.github.com/search/issues?q=author:hacktoberfest-team')
      .then(response => {
          return response.json();
      })
      .then(response => {
          let tempArr=[]  
          for (var i = 0; i < response.items.length; i++) {
              tempArr.push(response.items[i].url)
          }

          this.setState({
              list: tempArr
          })
      });

}
}
export default List;
