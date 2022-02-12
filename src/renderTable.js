import React from 'react';
import ReactDOM, { render } from 'react-dom';

class RenderTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const renderTable = this.props.ch_table.map((ch_list, i) => {
            const renderList = ch_list.map((ch, j) => {
                return (
                    <td key={j + ch}>{ch}</td>
                );
            });
            return (
                <tr key={i}>
                    {renderList}
                </tr>
            );
        });
        return (
            <div>
                <table border="1">
                    <tbody>
                        {renderTable}
                    </tbody>
                </table>
            </div>
        )
    }

}


export default RenderTable;