import * as React from 'react';

import * as dapper from '../../src';

export interface BaseState {
  hovered: boolean;
}

const BASE_STYLES = {
  root: {
    display: 'inline-block',
    margin: 10,
    padding: 10,
    border: '1px solid black',
    backgroundColor: 'mediumvioletred',
    color: 'white',
    '$hovered': {
      backgroundColor: 'deeppink',
    },
  },
};

const BASE_MODES = {
  hovered: ({ state }: { state: BaseState }) => state.hovered,
};

export class BaseComponent extends React.Component<any, BaseState> {

  state = {
    hovered: false,
  };

  baseStyles = dapper.reactTo(this, BASE_STYLES, BASE_MODES);

  render() {
    return (
      <div
        className={this._getRootClass()}
        onMouseEnter={this._onMouseEnter}
        onMouseLeave={this._onMouseLeave}
      >
        {this.renderContent()}
      </div>
    );
  }

  renderContent(): React.ReactNode {
    return null;
  }

  // TS Bug: Can't reference baseStyles within this method for some reason.
  // TODO: Find a reproduction case and file a bug.
  _getRootClass(): string {
    return this.baseStyles.root;
  }

  _onMouseEnter = () => {
    this.setState({ hovered: true });
  }

  _onMouseLeave = () => {
    this.setState({ hovered: false });
  }

}

const STYLES = dapper.compile({
  content: {
    '$hovered': {
      fontWeight: '900',
    },
  },
});

export default class InheritedButton extends BaseComponent {

  styles = dapper.reactTo(this, STYLES, BASE_MODES);

  renderContent() {
    return <div className={this.styles.content}>Inherited Button</div>;
  }

}
