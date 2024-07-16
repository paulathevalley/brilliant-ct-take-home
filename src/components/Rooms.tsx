import * as React from 'react';
import { Line, Theme } from 'mafs';

type Props = {
  width: number;
  height: number;
  count: number;
};

export const Rooms = (props: Props) => {
  // Render real room + virtual rooms
  return Array.from(new Array(props.count)).map((_, index) => {
    const indexStart = index - 1;
    const isEven = indexStart % 2 === 0;
    const x1 = props.width * indexStart;
    const isRealRoom = indexStart === 0;
    const wallProps = { color: '#ccc', weight: 3, opacity: isRealRoom ? 1 : 0.5 };
    const mirrorProps = { color: Theme.blue, weight: 6, opacity: isRealRoom ? 1 : 0.5 };

    return (
      <React.Fragment key={`virtual-room-${index}`}>
        {/* top wall */}
        <Line.Segment point1={[x1, props.height]} point2={[x1 + props.width, props.height]} {...wallProps} />
        {/* bottom wall */}
        <Line.Segment point1={[x1, 0]} point2={[x1 + props.width, 0]} {...wallProps} />
        {/* right wall */}
        {isEven ? null : <Line.Segment point1={[x1 + props.width, 0]} point2={[x1 + props.width, props.height]} {...wallProps} />}
        {isRealRoom ? <Line.Segment point1={[x1 + props.width, 0]} point2={[x1 + props.width, props.height]} {...wallProps} /> : null}
        {/* left wall/mirror */}
        {isEven ? (
          <Line.Segment point1={[x1, 0]} point2={[x1, props.height]} {...mirrorProps} />
        ) : (
          <Line.Segment point1={[x1, 0]} point2={[x1, props.height]} {...wallProps} />
        )}
      </React.Fragment>
    );
  });
};
