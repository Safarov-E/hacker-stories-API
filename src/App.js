import React, {Component} from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1
  }
]

function isSearched(searchTerm) {
  return (item)  => {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase())
  }
}

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list,
      searchTerm: ''
    }
  }
  onDismiss = (id) => {
    const updatedList = this.state.list.filter(item => item.objectID !== id)
    this.setState({list: updatedList})
  }
  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value })
  }
  render() {
    const { searchTerm, list } = this.state;
    return (
      <div className="App">
        <Search 
          value={searchTerm}
          onChange={this.onSearchChange}
        />
        <Table 
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
        <form>
          <input 
            type="text" 
            value={searchTerm}
            onChange={this.onSearchChange}  
          />
        </form>
        {list.filter(isSearched(searchTerm)).map((item) => {
          return (
            <div key={item.objectID}>
              <span>
                <a href={item.url}>{item.title} </a>
              </span>
              <span>{item.author} </span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
              <span>
                <button
                  onClick={() => this.onDismiss(item.objectID)}
                  type="button"
                >Отбросить</button>
              </span>
            </div>
          )
        })}
      </div>
    )
  }
}
