import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  getYear,
  getMonth,
  startOfDay,
  startOfISOWeek,
  endOfMonth,
  format,
  addWeeks,
  addDays,
  parse,
} from 'date-fns'

import { ISO_8601_DATE_FORMAT, dayPropType } from 'utilities'

const arrowLeft = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 6.35 6.35"
  >
    <g transform="translate(0,-290.65)">
      <path
        style={{
          fill: 'none',
          stroke: '#333',
          strokeWidth: '0.5291667',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
          strokeOpacity: '1',
        }}
        d="M 3.96875,292.2375 2.3812499,293.825 3.96875,295.4125"
      />
    </g>
  </svg>
)
const arrowRight = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 6.35 6.35"
  >
    <g transform="translate(0,-290.65)">
      <path
        style={{
          fill: 'none',
          stroke: '#333',
          strokeWidth: '0.5291667',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
          strokeOpacity: '1',
        }}
        d="M 2.38125,292.2375 3.9687501,293.825 2.38125,295.4125"
        id="path817"
      />
    </g>
  </svg>
)

export default class Calendar extends React.Component {
  static propTypes = {
    selectDay: PropTypes.func,
    current: dayPropType,
    showToday: PropTypes.bool,
  }
  static defaultProps = {
    showToday: true,
  }
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      ...this.splitDateValue(this.props.current),
    }
  }
  splitDateValue(value) {
    let valueYear = getYear(new Date())
    let valueMonth = getMonth(new Date())
    if (typeof value === 'string') {
      let parsedValue = parse(value, ISO_8601_DATE_FORMAT, new Date())
      valueYear = getYear(parsedValue)
      valueMonth = getMonth(parsedValue)
    }
    return {
      year: valueYear,
      month: valueMonth,
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.current !== prevProps.current && typeof this.props.current === 'string') {
      this.setState(this.splitDateValue(this.props.current))
    }
  }
  selectDay = (day) => {
    if (typeof this.props.selectDay === 'function') {
      this.props.selectDay(day)
    }
  }
  prevMonth = () => {
    this.setState(prevState => {
      let updates = {
        month: prevState.month - 1,
      }
      if (updates.month < 0) {
        updates.month = 11
        updates.year = prevState.year - 1
      }
      return updates
    })
  }
  nextMonth = () => {
    this.setState(prevState => {
      let updates = {
        month: prevState.month + 1,
      }
      if (updates.month >= 12) {
        updates.month = 0
        updates.year = prevState.year + 1
      }
      return updates
    })
  }
  render() {
    let today = startOfDay(new Date())

    let weeks = []
    let firstDay = startOfISOWeek(new Date(this.state.year, this.state.month))
    let lastDay = endOfMonth(new Date(this.state.year, this.state.month))
    let day = firstDay
    while (+day < +lastDay) {
      let newWeek = []
      for (var i = 0; i < 7; i++) {
        newWeek.push(format(addDays(day, i), ISO_8601_DATE_FORMAT))
      }
      weeks.push(newWeek)
      day = addWeeks(day, 1)
    }

    return (
      <div className="MIRECO-calendar">
        <div className="calendar-header">
          <h5>{format(new Date(this.state.year, this.state.month), 'MMMM yyyy')}</h5>
          <button type="button" tabIndex={-1} alt="Prev Month" onClick={this.prevMonth}>
            {arrowLeft}
          </button>
          <button type="button" tabIndex={-1} alt="Next Month" onClick={this.nextMonth}>
            {arrowRight}
          </button>
        </div>
        <table>
          <tbody>
            <tr>
              {weeks[0].map((day, dayIndex) => {
                const parsedDay = parse(day, ISO_8601_DATE_FORMAT, new Date())
                return (
                  <th key={`header-${dayIndex}`}>
                    {format(parsedDay, 'EEEEEE')}
                  </th>
                )
              })}
            </tr>
            {weeks.map((week, weekIndex) => {
              return (
                <tr key={`week-${weekIndex}`}>
                  {week.map((day, dayIndex) => {
                    const parsedDay = parse(day, ISO_8601_DATE_FORMAT, new Date())
                    return (
                      <td key={`day-${dayIndex}`} className={classNames({
                        'outside-month': getMonth(parsedDay) != this.state.month,
                        'current': (this.props.current === day),
                        'today': (day === today && this.props.showToday),
                      })}>
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => {
                            this.selectDay(day)
                          }}
                        >
                          {format(parsedDay, 'd')}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}
