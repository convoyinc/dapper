import * as React from 'react';

export default function theme<TProps>(
  Component: React.ComponentType<TProps>,
  propDefaults: Partial<TProps>,
) {

  return class ThemeComponent extends React.Component<TProps> {
    render() {
      return <Component {...propDefaults} {...this.props} />;
    }
  };
}
