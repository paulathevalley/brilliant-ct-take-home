import * as React from 'react';
import { Coordinates, Debug, Line, Mafs, MovablePoint, Plot, Point, Polygon, Theme, Transform, useMovablePoint, vec, Vector } from 'mafs';

type Props = {
  width: number;
  height: number;
  count: number;
  initial: number[] | vec.Vector2;
};

export function RoomObjects(props: Props) {
  const { count, width, height, initial } = props;
  // render real object & virtual objects

  const OFFSET = [0.25, 0.25];

  const renderVirtualObjects = (count: number) => {
    const virtualObjectsArray = Array.from(new Array(count));
    return virtualObjectsArray.map((_, index) => {
      const indexStart = index - 1;
      const x = initial[0] + width * indexStart;
      // if indexStart is even, it should be reflected over the y-axis ("backwards")
      const isEven = indexStart % 2 === 0;
      return (
        <Polygon
          key={`virtual-initial-${index}`}
          points={[
            [isEven ? x - OFFSET[0] : x + OFFSET[0], initial[1] + OFFSET[1]],
            [isEven ? x - OFFSET[0] : x + OFFSET[0], initial[1] - OFFSET[1]],
            [x, initial[1]],
          ]}
          color={Theme.red}
          fillOpacity={0.5}
          weight={0}
        />
      );
    });
  };

  return (
    <>
      <Polygon
        points={[
          [initial[0] - OFFSET[0], initial[1] + OFFSET[1]],
          [initial[0] - OFFSET[0], initial[1] - OFFSET[1]],
          [initial[0], initial[1]],
        ]}
        color={Theme.red}
        fillOpacity={1}
        weight={0}
      />
      {renderVirtualObjects(count)}
    </>
  );
}
