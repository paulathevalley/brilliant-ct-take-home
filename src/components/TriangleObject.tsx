import * as React from 'react';
import { Coordinates, Debug, Line, Mafs, MovablePoint, Plot, Point, Polygon, Theme, Transform, useMovablePoint, vec, Vector } from 'mafs';

function TriangleObject() {
  // render real object & virtual objects
  const triangle = {
    x: 3,
    y: 2,
  };

  const OFFSET = [0.25 * 1.3, 0.25];

  const renderVirtualObjects = (count) => {
    return Array.from(new Array(count)).map((_, index) => {
      const indexStart = index - 1;
      const x = triangle.x + ROOM_WIDTH * indexStart;
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
      {renderVirtualObjects(VIRTUAL_COUNT)}
    </>
  );
}
