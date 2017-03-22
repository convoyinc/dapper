import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Button from './Button';
import ButtonSimple from './ButtonSimple';

const mountNode = document.getElementById('root');

ReactDOM.render(<div>
  <Button large />
  <Button />
  <Button ghost />
  <Button ghost large />
  <ButtonSimple />
</div>, mountNode);
