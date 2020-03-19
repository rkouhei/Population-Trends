import React, { Component } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: Array(47).fill(false),
      prefectures: {},
      series: [],
      loading: true
    }
    this.changeSelection = this.changeSelection.bind(this);
  }

  async componentDidMount () {
    await fetch('https://opendata.resas-portal.go.jp/api/v1/prefectures', {
      headers: { 'X-API-KEY': process.env.REACT_APP_RESAS_API_KEY }
    })
      .then(response => response.json())
      .then(res => {
        this.setState({ prefectures: res.result })
    })
    this.setState({loading: false})
  }

  changeSelection(index) {
    const selected_copy = this.state.selected.slice()
    selected_copy[index] = !selected_copy[index]

    if (!this.state.selected[index]) {
      fetch(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${index + 1}`,
        {
          headers: { 'X-API-KEY': process.env.REACT_APP_RESAS_API_KEY }
        }
      )
        .then(response => response.json())
        .then(res => {
          let tmp = []
          Object.keys(res.result.data[0].data).forEach(i => {
            if (res.result.data[0].data[i].year < 2020) {
              tmp.push(res.result.data[0].data[i].value)
            }
          })
          const res_series = {
            name: this.state.prefectures[index].prefName,
            data: tmp
          }
          this.setState({
            selected: selected_copy,
            series: [...this.state.series, res_series]
          })
        })
    } else {
      const series_copy = this.state.series.slice()
      for (let i = 0; i < series_copy.length; i++) {
        if (series_copy[i].name === this.state.prefectures[index].prefName) {
          series_copy.splice(i, 1)
        }
      }
      this.setState({
        selected: selected_copy,
        series: series_copy
      })
    }
  }

  renderItem(props) {
    return (
      <div key={props.prefCode} style={{ margin: '5px', display: 'inline-block' }}>
        <input type="checkbox" checked={this.state.selected[props.prefCode - 1]} onChange={() => this.changeSelection(props.prefCode - 1)} />
        {props.prefName}
      </div>
    )
  }

  render() {
    const obj = this.state.prefectures
    const options = {
      title: {
        text: '人口推移, 1965~2020'
      },

      yAxis: {
        title: {
          text: 'Population'
        }
      },

      xAxis: {
        title: {
          text: 'Year'
        }
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
          pointInterval: 5,
          pointStart: 1965
        }
      },
      series: this.state.series
    }
    return (
      <div>
        <h1 align='center'>都道府県別 総人口推移グラフ</h1>
        {Object.keys(obj).map(i => this.renderItem(obj[i]))}
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    )
  }
}

export default App
