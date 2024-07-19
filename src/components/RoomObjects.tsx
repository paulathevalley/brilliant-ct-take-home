import * as React from 'react';
import { Coordinates, Debug, Line, Mafs, MovablePoint, Plot, Point, Polygon, Theme, Transform, useMovablePoint, vec, Vector } from 'mafs';

type Props = {
  width: number;
  height: number;
  count: number;
};

export function RoomObjects(props: Props) {
  const { count, width, height } = props;
  // render real object & virtual objects
  const triangle = {
    x: 3,
    y: 2,
  };

  const OFFSET = [0.25 * 1.3, 0.25];

  const renderVirtualObjects = (count: number) => {
    const virtualObjectsArray = Array.from(new Array(count));
    return virtualObjectsArray.map((_, index) => {
      const indexStart = index - 1;
      const x = triangle.x + width * indexStart;
      // if indexStart is even, it should be reflected over the y-axis ("backwards")
      const isEven = indexStart % 2 === 0;
      return (
        <Polygon
          key={`virtual-triangle-${index}`}
          points={[
            [isEven ? x - OFFSET[0] : x + OFFSET[0], triangle.y + OFFSET[1]],
            [isEven ? x - OFFSET[0] : x + OFFSET[0], triangle.y - OFFSET[1]],
            [x, triangle.y],
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
          [triangle.x - OFFSET[0], triangle.y + OFFSET[1]],
          [triangle.x - OFFSET[0], triangle.y - OFFSET[1]],
          [triangle.x, triangle.y],
        ]}
        color={Theme.red}
        fillOpacity={1}
        weight={0}
      />
      {renderVirtualObjects(count)}
    </>
  );
}
