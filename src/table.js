import React from 'react';
import ReactDOM, { render } from 'react-dom';
import './table.css';
import Box from './box.js';


class Table extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const renderTable = this.props.table.map((list, i) => {
            const renderList = list.map((character, j) => {
                return (
                    <Box key={j}
                        i={i} 
                        j={j} 
                        character={character} 
                    />
                );
            });
            return (
                <div key={i} className="line">
                    {renderList}
                </div>
            );
        });
        return (
            <div className="table">
                {renderTable}
            </div>
        )
    }

}


export default Table;