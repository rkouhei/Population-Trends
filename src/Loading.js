import React, {Component} from 'react'

class Loading extends Component {
  constructor (props) {
    super(props)
    this.state ={
      title: props.title,
    }
  }

  render () {
    return (
      <div>
        <h1>{this.state.title}</h1>
        <h2>ロードちう</h2>
      </div>
    )
  }
}

export default Loading