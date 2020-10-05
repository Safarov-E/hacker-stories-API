import React, {Component} from 'react';
import Search from '../search'
import Table from '../table'
import Button from '../button'
import Loading from '../loading'
import axios from 'axios'
import './App.css';
import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP
} from '../../constants'

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
  const { searchKey, results } = prevState;
  const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];
  const updatedHits = [
    ...oldHits,
    ...hits
  ]
  return {
    results: {
      ...results,
      [searchKey]: { hits: updatedHits, page}
    },
    isLoading: false
  }
}
export default class extends Component {
  _isMounted = false
  constructor(props) {
    super(props)
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false
    }
  }
  needsToSearchTopStories = (searchTerm) => {
    return !this.state.results[searchTerm]
  }
  onSearchSubmit = (event) => {
    const { searchTerm } = this.state
    this.setState({ searchKey: searchTerm })
    if(this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm)
    }
    event.preventDefault();
  }
  setSearchTopStories = (result) => {
    const { hits, page } = result;
    this.setState(updateSearchTopStoriesState(hits, page))
  }
  const
  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({isLoading: true})
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({error}))
  }
  componentDidMount() {
    this._isMounted = true
    const {searchTerm} = this.state;
    this.setState({ searchKey: searchTerm })
    this.fetchSearchTopStories(searchTerm)
  }
  componentWillUnmount() {
    this._isMounted = false
  }
  onDismiss = (id) => {
    const { searchKey, results } = this.state
    const { hits, page } = results[searchKey]
    const isNotId = item => item.objectID !== id
    const updatedHits = hits.filter(isNotId)
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    })
  }
  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value })
  }
  render() {
    const { 
      searchTerm, 
      results, 
      searchKey,
      error,
      isLoading
    } = this.state;
    const page = (
      results && 
      results[searchKey] &&
      results[searchKey].page
    ) || 0;
    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || []
    if(error) {
      return <p>Что-то произошло не так.</p>
    }
    return (
      <div className="page">
        <div className="interactions">
          <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Поиск
          </Search>
        </div>
        { error
          ? <div className="interactions">
              <p>Something went wrong.</p>
          </div>
          : <Table 
            list={list}
            onDismiss={this.onDismiss}
          />
        }
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            Больше историй
          </ButtonWithLoading>
        </div>
      </div>
    )
  }
}

const withLoading = (Component) => ({isLoading, ...rest}) =>
  isLoading
    ? <Loading />
    : <Component {...rest} />

const ButtonWithLoading = withLoading(Button)
export {
  Button,
  Search,
  Table
}