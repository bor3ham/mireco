import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'

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
    current: PropTypes.number,
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
    let valueYear = moment().year()
    let valueMonth = moment().month()
    if (typeof value === 'number') {
      let momentValue = moment.utc(value)
      valueYear = momentValue.year()
      valueMonth = momentValue.month()
    }
    return {
      year: valueYear,
      month: valueMonth,
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.current !== prevProps.current && typeof this.props.current === 'number') {
      this.setState(this.splitDateValue(prevProps.current))
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
    let today = +moment.utc().startOf('day')

    let weeks = []
    let firstDay = moment.utc([this.state.year, this.state.month]).startOf('isoweek')
    let lastDay = moment.utc([this.state.year, this.state.month]).endOf('month')
    let day = firstDay.clone()
    while (+day < +lastDay) {
      let newWeek = []
      for (var i = 0; i < 7; i++) {
        newWeek.push(day.clone().add({days: i}))
      }
      weeks.push(newWeek)
      day.add(moment.duration({weeks: 1}))
    }

    return (
      <div className="MIRECO-calendar">
        <div className="calendar-header">
          <h5>{moment.utc([this.state.year, this.state.month]).format('MMMM YYYY')}</h5>
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
                return (
                  <th key={`header-${dayIndex}`}>
                    {day.format('ddd')[0]}
                  </th>
                )
              })}
            </tr>
            {weeks.map((week, weekIndex) => {
              return (
                <tr key={`week-${weekIndex}`}>
                  {week.map((day, dayIndex) => {
                    return (
                      <td key={`day-${dayIndex}`} className={classNames({
                        'outside-month': day.month() != this.state.month,
                        'current': (this.props.current === +day),
                        'today': (+day === today && this.props.showToday),
                      })}>
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => {
                            this.selectDay(+day)
                          }}
                        >
                          {day.format('D')}
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
