import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Bubble } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Bubble
        options={{
          size: 200,
          minSize: 20,
          gutter: 16,
          provideProps: false,
          numCols: 6,
          fringeWidth: 100,
          yRadius: 200,
          xRadius: 200,
          cornerRadius: 100,
          showGuides: false,
          compact: false,
          gravitation: 0,
        }}
      >
        <div>Hello</div>
        <div>Hello</div>
      </Bubble>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
