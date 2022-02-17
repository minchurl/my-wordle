import React from 'react';
import ReactDOM, { render } from 'react-dom';
import './box.css';

class Box extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.box.color}>
                {this.props.box.character}
            </div>
        );
    }

}

export default Box;