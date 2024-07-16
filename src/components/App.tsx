import * as React from 'react';
import { Coordinates, Debug, Line, Mafs, MovablePoint, Plot, Point, Polygon, Theme, Transform, useMovablePoint, vec, Vector } from 'mafs';
import { Rooms } from './Rooms.tsx';
// import { AdjustableMirror } from './AdjustableMirror.tsx';
import { Observer } from './Observer.tsx';

const ROOM_WIDTH = 5;
const ROOM_HEIGHT = 3;
const VIRTUAL_COUNT = 7;

// function inverseRotate(v, a) {
//   const c = Math.cos(a);
//   const s = Math.sin(a);
//   // rotation matrix (from Mafs)
//   // return [v[0] * c - v[1] * s, v[0] * s + v[1] * c];
//   // inverse rotation matrix
//   return [v[0] * c + v[1] * s, v[0] * -1 * s + v[1] * c];
// }

export default function App() {
  const [midpoint, setMidpoint] = React.useState<vec.Vector2>(vec.lerp([ROOM_WIDTH, 1], [ROOM_WIDTH, 0], 0.5));

  // atan2 returns the angle in the plane (in radians)
  const userAngle = Math.atan2(midpoint[1], midpoint[0]);

  // TODO: Check if light ray passes through any virtual object
  const initialObject = { x: 3, y: 2 };
  const OBJECTS = Array.from(new Array(VIRTUAL_COUNT)).map((_, index) => {
    const start = index - 1;
    return { x: initialObject.x + ROOM_WIDTH * start, y: initialObject.y };
  });
  // useMemo useRef? since midpoint is in state.
  const isIntersecting = React.useMemo(() => {
    return OBJECTS.filter((object) => {
      // does it intersect with the light ray?
      // y = mx + b
      // y = (midpoint[1] / midpoint[0]) x
      const slope = midpoint[1] / midpoint[0];
      const slopeY = slope * object.x;
      if (Math.round(slopeY) === object.y) {
        // console.log('we found a match!!', object);
        return object;
      }
    });
  }, [midpoint]);

  return (
    <Mafs viewBox={{ y: [0, ROOM_HEIGHT], x: [-ROOM_WIDTH, ROOM_WIDTH * 5] }}>
      <Coordinates.Cartesian />

      <Rooms width={ROOM_WIDTH} height={ROOM_HEIGHT} count={VIRTUAL_COUNT} />

      <Line.ThroughPoints point1={[0, 0]} point2={midpoint} color={Theme.violet} style="dashed" />
      <Transform rotate={userAngle}>
        <Observer at={[0, 0]} color={'#000'} />
      </Transform>
    </Mafs>
  );
}
