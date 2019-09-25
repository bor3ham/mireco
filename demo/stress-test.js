import React from 'react'
import ReactDOM from 'react-dom'
import {
  constants as mirecoConstants,
  Date as DateInput,
  Datetime,
  DatetimeRange,
  Checkbox,
  Text,
  Textarea,
  Button,
  Time,
  Select,
  Duration,
} from 'mireco'
import casual from 'casual-browserify'
import beautify from 'json-beautify'
import Cookies from 'js-cookie'
import { startOfDay, startOfHour, addDays, addHours, addMinutes, format } from 'date-fns'

import ResizeContainer from './resize-container.js'

const SELECT_OPTIONS = [
  {value: 'car', label: 'Car'},
  {value: 'bike', label: 'Bicycle'},
  {value: 'plane', label: 'Aeroplane'},
  {value: 'hike', label: 'Hiking'},
  {value: 'glider', label: 'Hanglider'},
  {value: 'jetski', label: 'Jetski'},
  {value: 'tumbling', label: 'Tumbling Down Hill'},
  {value: 'walking', label: 'Walking'},
  {value: 'bouncing', label: 'Bouncing Off the Walls'},
]

const defaultValue = {
  text: 'hi there',
  checked: false,
  select: null,
  time: null,
  textarea: 'Wow this is two lines...\nIn this text box',
  date: null,
  duration: null,
  datetime: +(new Date()),
  datetime_range: {start: null, end: null},
}
function randomValue() {
  return {
    text: casual.title,
    checked: casual.coin_flip,
    select: casual.coin_flip ? null : casual.random_element(SELECT_OPTIONS).value,
    time: casual.coin_flip ? null : casual.integer(0, 24 * 60) * 60 * 1000,
    textarea: casual.description,
    date: casual.coin_flip ? null : format(
      addDays(startOfDay(new Date()), casual.integer(-30, 30)),
      mirecoConstants.ISO_8601_DATE_FORMAT,
    ),
    duration: casual.coin_flip ? null : +addMinutes(0, casual.integer(0, 400) * 30),
    datetime: casual.coin_flip ? null : +addDays(new Date(), casual.integer(-10, 10)),
    datetime_range: casual.coin_flip ? null : {
      start: +addHours(
        startOfHour(new Date()),
        casual.integer(-3 * 24, 3 * 24)
      ),
      end: +addHours(
        startOfHour(new Date()),
        casual.integer(4 * 24, 7 * 24)
      ),
    },
  }
}

class Demo extends React.Component {
  state = {
    formValue: {
      ...defaultValue,
    },
    flags: {
      disabled: !!Cookies.get('disabled'),
      intervalDisable: !!Cookies.get('intervalDisable'),
      intervalRandomise: !!Cookies.get('intervalRandomise'),
      intervalRemount: !!Cookies.get('intervalRemount'),
      blockMode: !!Cookies.get('blockMode'),

      showText: !!Cookies.get('showText'),
      showCheckbox: !!Cookies.get('showCheckbox'),
      showSelect: !!Cookies.get('showSelect'),
      showTime: !!Cookies.get('showTime'),
      showTextarea: !!Cookies.get('showTextarea'),
      showDate: !!Cookies.get('showDate'),
      showDuration: !!Cookies.get('showDuration'),
      showDatetime: !!Cookies.get('showDatetime'),
      showDatetimeRange: !!Cookies.get('showDatetimeRange'),
    },
    mountIndex: 0,
  }
  componentDidMount() {
    this.interval = window.setInterval(this.onInterval, 3000)
  }
  componentWillUnmount() {
    window.clearInterval(this.interval)
  }
  onInterval = () => {
    if (this.state.flags.intervalDisable) {
      this.toggleFlag('disabled')
    }
    if (this.state.flags.intervalRandomise) {
      this.randomise()
    }
    if (this.state.flags.intervalRemount) {
      this.setState(prevState => {
        return {
          mountIndex: prevState.mountIndex + 1,
        }
      })
    }
  }
  setFlag = (key, value) => {
    this.setState(prevState => {
      let updates = {
        flags: {
          ...prevState.flags,
        },
      }
      updates.flags[key] = value
      return updates
    }, () => {
      if (this.state.flags[key]) {
        Cookies.set(key, true)
      }
      else {
        Cookies.remove(key)
      }
    })
  }
  toggleFlag = (key) => {
    this.setFlag(key, !this.state.flags[key])
  }
  reset = () => {
    this.setState({formValue: {
      ...defaultValue,
    }})
  }
  randomise = () => {
    const newValue = randomValue()
    this.setState({formValue: newValue})
  }
  remount = () => {
    this.setState(prevState => {
      let updates ={
        mountIndex: prevState.mountIndex + 1,
      }
      return updates
    })
  }
  updateFormValue = (key, value) => {
    this.setState(prevState => {
      let updates = {
        formValue: {
          ...prevState.formValue,
        },
      }
      updates.formValue[key] = value
      return updates
    })
  }
  handleSubmit = (event) => {
    if (event) {
      event.preventDefault()
    }
    alert('submitting value!')
  }
  render() {
    let inlineSpace
    if (!this.state.flags.blockMode) {
      inlineSpace = (<span>{' '}</span>)
    }
    return (
      <div>
        <style>{`
          body {
            padding: 0;
            margin: 0;
          }
          div.flag-column {
            flex: 1;
            min-width: 10rem;
          }
        `}</style>
        <div style={{
          background: '#464656',
          color: '#fff',
          padding: '3rem',
        }}>
          <h1>Mireco demo form</h1>
          <div style={{display: 'flex', flexWrap: 'wrap'}}>
            <div className="flag-column">
              <h2>Form settings</h2>
              <Checkbox
                block
                value={this.state.flags.blockMode}
                onChange={(newValue) => {
                  this.setFlag('blockMode', newValue)
                }}
                label="Block mode"
              />
              <Checkbox
                block
                value={this.state.flags.disabled}
                onChange={(newValue) => {
                  this.setFlag('disabled', newValue)
                }}
                label="Disabled"
              />
            </div>
            <div className="flag-column">
              <h2>Interval changes</h2>
              <Checkbox
                block
                value={this.state.flags.intervalDisable}
                onChange={(newValue) => {
                  this.setFlag('intervalDisable', newValue)
                }}
                label="Periodically disable"
              />
              <Checkbox
                block
                value={this.state.flags.intervalRandomise}
                onChange={(newValue) => {
                  this.setFlag('intervalRandomise', newValue)
                }}
                label="Periodically randomise"
              />
              <Checkbox
                block
                value={this.state.flags.intervalRemount}
                onChange={(newValue) => {
                  this.setFlag('intervalRemount', newValue)
                }}
                label="Periodically remount"
              />
            </div>
            <div className="flag-column">
              <h2>Basic inputs</h2>
              <Checkbox
                block
                value={this.state.flags.showText}
                onChange={(newValue) => {
                  this.setFlag('showText', newValue)
                }}
                label="Show text input"
              />
              <Checkbox
                block
                value={this.state.flags.showCheckbox}
                onChange={(newValue) => {
                  this.setFlag('showCheckbox', newValue)
                }}
                label="Show checkbox input"
              />
              <Checkbox
                block
                value={this.state.flags.showSelect}
                onChange={(newValue) => {
                  this.setFlag('showSelect', newValue)
                }}
                label="Show select input"
              />
              <Checkbox
                block
                value={this.state.flags.showTime}
                onChange={(newValue) => {
                  this.setFlag('showTime', newValue)
                }}
                label="Show time input"
              />
              <Checkbox
                block
                value={this.state.flags.showTextarea}
                onChange={(newValue) => {
                  this.setFlag('showTextarea', newValue)
                }}
                label="Show textarea input"
              />
              <Checkbox
                block
                value={this.state.flags.showDate}
                onChange={(newValue) => {
                  this.setFlag('showDate', newValue)
                }}
                label="Show date input"
              />
              <Checkbox
                block
                value={this.state.flags.showDuration}
                onChange={(newValue) => {
                  this.setFlag('showDuration', newValue)
                }}
                label="Show duration input"
              />
            </div>
            <div className="flag-column">
              <h2>Compound inputs</h2>
              <Checkbox
                block
                value={this.state.flags.showDatetime}
                onChange={(newValue) => {
                  this.setFlag('showDatetime', newValue)
                }}
                label="Show datetime input"
              />
              <Checkbox
                block
                value={this.state.flags.showDatetimeRange}
                onChange={(newValue) => {
                  this.setFlag('showDatetimeRange', newValue)
                }}
                label="Show datetime range input"
              />
            </div>
          </div>
          <div style={{marginBottom: '1rem'}}>
            <Button
              onClick={this.randomise}
              className="secondary"
            >
              Randomise
            </Button>
            {' '}
            <Button
              onClick={this.remount}
              className="secondary"
            >
              Remount
            </Button>
            {' '}
            <Button
              onClick={this.reset}
              className="secondary"
            >
              Reset
            </Button>
          </div>
        </div>
        <div style={{
          background: '#f5f5f5',
          padding: '3rem',
          margin: '0',
        }}>
          <h2>Form state value</h2>
          <pre style={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
          }}>
            {beautify(this.state.formValue, null, 2, 80)}
          </pre>
        </div>
        <ResizeContainer>
          <form
            onSubmit={this.handleSubmit}
            key={`form-mount-${this.state.mountIndex}`}
            style={{margin: '20rem 1rem'}}
          >
            {this.state.flags.showText && (
              <Text
                value={this.state.formValue.text}
                onChange={(newValue) => {
                  this.updateFormValue('text', newValue)
                }}
                placeholder="Single text"
                disabled={this.state.flags.disabled}
                block={this.state.flags.blockMode}
              />
            )}
            {this.state.flags.showText && inlineSpace}
            {this.state.flags.showCheckbox && (
              <Checkbox
                value={this.state.formValue.checked}
                onChange={(newValue) => {
                  this.updateFormValue('checked', newValue)
                }}
                label="Checked or not?"
                disabled={this.state.flags.disabled}
                block={this.state.flags.blockMode}
              />
            )}
            {this.state.flags.showCheckbox && inlineSpace}
            {this.state.flags.showSelect && (
              <Select
                value={this.state.formValue.select}
                options={SELECT_OPTIONS}
                onChange={(newValue) => {
                  this.updateFormValue('select', newValue)
                }}
                placeholder="Mode of transport"
                disabled={this.state.flags.disabled}
                block={this.state.flags.blockMode}
              />
            )}
            {this.state.flags.showSelect && inlineSpace}
            {this.state.flags.showTime && (
              <Time
                value={this.state.formValue.time}
                onChange={(newValue) => {
                  this.updateFormValue('time', newValue)
                }}
                disabled={this.state.flags.disabled}
                block={this.state.flags.blockMode}
              />
            )}
            {this.state.flags.showTime && inlineSpace}
            {this.state.flags.showTextarea && (
              <Textarea
                value={this.state.formValue.textarea}
                onChange={(newValue) => {
                  this.updateFormValue('textarea', newValue)
                }}
                placeholder="Multiline text..."
                disabled={this.state.flags.disabled}
                block={this.state.flags.blockMode}
              />
            )}
            {this.state.flags.showTextarea && inlineSpace}
            {this.state.flags.showDate && (
              <DateInput
                value={this.state.formValue.date}
                onChange={(newValue) => {
                  this.updateFormValue('date', newValue)
                }}
                disabled={this.state.flags.disabled}
                block={this.state.flags.blockMode}
              />
            )}
            {this.state.flags.showDate && inlineSpace}
            {this.state.flags.showDuration && (
              <Duration
                value={this.state.formValue.duration}
                onChange={(newValue) => {
                  this.updateFormValue('duration', newValue)
                }}
                disabled={this.state.flags.disabled}
                block={this.state.flags.blockMode}
              />
            )}
            {this.state.flags.showDuration && inlineSpace}
            {this.state.flags.showDatetime && (
              <Datetime
                value={this.state.formValue.datetime}
                onChange={(newValue) => {
                  this.updateFormValue('datetime', newValue)
                }}
                disabled={this.state.flags.disabled}
                block={this.state.flags.blockMode}
              />
            )}
            {this.state.flags.showDatetime && inlineSpace}
            {this.state.flags.showDatetimeRange && (
              <DatetimeRange
                value={this.state.formValue.datetime_range}
                onChange={(newValue) => {
                  this.updateFormValue('datetime_range', newValue)
                }}
                disabled={this.state.flags.disabled}
                block={this.state.flags.blockMode}
              />
            )}
            {this.state.flags.showDatetimeRange && inlineSpace}
            <Button
              type="submit"
              block={this.state.flags.blockMode}
              disabled={this.state.flags.disabled}
            >
              Submit Results
            </Button>
          </form>
        </ResizeContainer>
      </div>
    )
  }
}

const mount = document.querySelectorAll('div.demo-mount-stress-test')
if (mount.length) {
  ReactDOM.render(<Demo />, mount[0])
}
