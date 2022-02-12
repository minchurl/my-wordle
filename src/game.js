import React from 'react';
import ReactDOM, { render } from 'react-dom';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import RenderTable from './renderTable';
import axios from 'axios';

const ALPHABET_LIST = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

// <KeyboardEventHandler
// handleKeys={['a']}
// onKeyEvent={(key, e) => console.log('only handle "a" key')} />

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden_word: "ultra",
            ch_table: Array.from(Array(6), () => Array(5).fill('_')),
            curr_i: 0,
            curr_j: 0,
            is_game_ended: false, 
        };
        this.handleAddCharacter = this.handleAddCharacter.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleBackspace = this.handleBackspace.bind(this);
    }

    handleAddCharacter(ch, e) {
        console.log('input:: alphabet');
        if (is_game_ended(this.state)) {
            return;
        }
        
        if (this.state.curr_j == 5) {
            return;
        }

        const ch_table = this.state.ch_table.slice();
        ch_table[this.state.curr_i][this.state.curr_j] = ch;

        this.setState({
            ch_table: ch_table, 
            curr_j: this.state.curr_j + 1, 
        });
        
    }
    
    async handleEnter(e) {
        console.log('input:: enter');
        if (is_game_ended(this.state)) {
            return;
        }

        if (this.state.curr_j != 5) {
            return;
        }

        // make word
        
        var word = new String("");
        for (let i = 0; i < 5; i++) {
            word += this.state.ch_table[this.state.curr_i][i];
        }

        // TODO: validate the word's existance and compare with the secret word

        var is_valid_word = null;

        await axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + word)
            .then(() => {is_valid_word = true;})
            .catch(() => {is_valid_word = false;})
        ;
        
        if (!is_valid_word) {
            return;
        }

        // TODO: is_game_done??

        if (word === this.state.hidden_word) {
            this.setState({
                is_game_ended: true, 
            });
            return;
        }

        // After done, update the state of game

        this.setState({
            curr_i: this.state.curr_i + 1, 
            curr_j: 0, 
        });

    }

    handleBackspace(e) {
        console.log('input:: backspace');
        if (is_game_ended(this.state)) {
            return;
        }

        if (this.state.curr_j == 0 ){
            return;
        }
        const ch_table = this.state.ch_table.slice();
        ch_table[this.state.curr_i][this.state.curr_j - 1] = '_';

        this.setState({
            ch_table: ch_table, 
            curr_j: this.state.curr_j - 1, 
        });
    }

    render() {
        return (
            <div>
                <RenderTable
                    ch_table={this.state.ch_table}
                />

                <KeyboardEventHandler
                    handleKeys={ALPHABET_LIST}
                    onKeyEvent={(key, e) => this.handleAddCharacter(key, e)}
                />

                <KeyboardEventHandler
                    handleKeys={['enter']}
                    onKeyEvent={(e) => this.handleEnter(e)}
                />

                <KeyboardEventHandler
                    handleKeys={['backspace']}
                    onKeyEvent={(e) => this.handleBackspace(e)}
                />

            </div>
        );
    }

}

function is_game_ended(state) {
    // test
    return state.curr_i == 6 || state.is_game_ended;
}

export default Game;