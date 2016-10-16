
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('example')
);

/*
*	Author: Jean-Pierre Sierens
*	===========================================================================
*/

import SearchableTable from './SearchableTable';
import {data} from './data';

// Filterable CheatSheet Component
ReactDOM.render( <SearchableTable data={data}/>, document.getElementById('searchableTable') );

