import React from 'react';
import ReactDOM from 'react-dom';
import CardGrid from './components/CardGrid.js'


ReactDOM.render(
    <CardGrid cardType="items" data={ document.getElementById('card-grid').getAttribute('card-data') }/>,
    document.getElementById('card-grid')
);