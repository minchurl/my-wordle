import React from 'react';
import ReactDOM, { render } from 'react-dom';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import Table from './table';
import axios from 'axios';
import './game.css';


const ALPHABET_LIST = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

// <KeyboardEventHandler
// handleKeys={['a']}
// onKeyEvent={(key, e) => console.log('only handle "a" key')} />

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden_word: "ultra",
            table: Array.from(Array(6), () => Array(5).fill({
                character: null, 
                color: "whiteBox",
            })),
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

        const table = this.state.table.slice();
        table[this.state.curr_i][this.state.curr_j] = {
            character: ch, 
            color: "whiteBox", 
        };

        this.setState({
            table: table, 
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
            word += this.state.table[this.state.curr_i][i].character;
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


        // After done, update the state of game

        const table = this.state.table.slice();

        for (let j = 0; j < 5; j++) {
            const ch = table[this.state.curr_i][j].character;
            if (ch === this.state.hidden_word[j]) {
                table[this.state.curr_i][j] = {
                    character: ch, 
                    color: "greenBox", 
                }
            }
            else if (this.state.hidden_word.includes(ch)) {
                table[this.state.curr_i][j] = {
                    character: ch, 
                    color: "yellowBox", 
                }
            }
        }

        this.setState({
            curr_i: this.state.curr_i + 1, 
            curr_j: 0, 
            table: table, 
        });

        // TODO: is_game_done??
        if (word === this.state.hidden_word) {
            this.setState({
                is_game_ended: true, 
            });
            return;
        }

    }

    handleBackspace(e) {
        console.log('input:: backspace');
        if (is_game_ended(this.state)) {
            return;
        }

        if (this.state.curr_j == 0 ){
            return;
        }
        const table = this.state.table.slice();
        table[this.state.curr_i][this.state.curr_j - 1] = {
            character: null, 
            color: "whiteBox", 
        };

        this.setState({
            table: table, 
            curr_j: this.state.curr_j - 1, 
        });
    }

    render() {
        return (
            <div className="game">
                <Table
                    table={this.state.table}
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