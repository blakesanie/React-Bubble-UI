import * as React from 'react';
import { render } from '@testing-library/react';
import { Bubble } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    render(
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
      </Bubble>
    );
  });
});
