import React from 'react';
import Button from '../button'
import PropTypes from 'prop-types'
import { sortBy } from 'lodash'
import classNames from 'classnames'
import './table.css';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse()
}

const Sort = ({ sortKey, activeSortKey, onSort, children }) =>{
  const sortClass = classNames(
    'button-inline',
    { 'button-active': sortKey === activeSortKey }
  )
  return (
    <Button 
      onClick={() => onSort(sortKey)}
      className={sortClass}
    >
      {children}
    </Button>
  )
}

const Table = ({list, sortKey, isSortReverse, onSort, onDismiss}) => {
  const sortedList = SORTS[sortKey](list)
  const reverseSortedList = isSortReverse
    ? sortedList.reverse()
    : sortedList
  return (
    <div className="table">
      <div className="table-header">
        <span style={{ width: '40%' }}>
          <Sort
            sortKey={'TITLE'}
            onSort={onSort}
            activeSortKey={sortKey}
          >
            Заголовок
          </Sort>
        </span>
        <span style={{ width: '30%' }}>
          <Sort
            sortKey={'AUTHOR'}
            onSort={onSort}
            activeSortKey={sortKey}
          >
            Автор
          </Sort>
        </span>
        <span style={{ width: '10%' }}>
          <Sort
            sortKey={'COMMENTS'}
            onSort={onSort}
            activeSortKey={sortKey}
          >
            Комментарии
          </Sort>
        </span>
        <span style={{ width: '10%' }}>
          <Sort
            sortKey={'POINTS'}
            onSort={onSort}
            activeSortKey={sortKey}
          >
            Очки
          </Sort>
        </span>
        <span style={{ width: '10%' }}>
          Архив
        </span>
      </div>
      {reverseSortedList.map((item) => {
        return (
          <div key={item.objectID} className="table-row">
            <span style={{ width: '40%' }}>
              <a href={item.url}>{item.title} </a>
            </span>
            <span style={{ width: '30%' }}>{item.author} </span>
            <span style={{ width: '10%' }}>{item.num_comments}</span>
            <span style={{ width: '10%' }}>{item.points}</span>
            <span>
              <Button 
                onClick={() => onDismiss(item.objectID)}
                className="button-inline"
              >
                Отбросить
              </Button>
            </span>
          </div>
        )
      })}
    </div>
  )
}

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired
}

export default Table