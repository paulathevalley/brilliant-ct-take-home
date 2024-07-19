import * as React from 'react';
import { Coordinates, Debug, Line, Mafs, MovablePoint, Plot, Point, Polygon, Theme, Transform, useMovablePoint, vec, Vector } from 'mafs';
import { Rooms } from './Rooms.tsx';
import { AdjustableMirror } from './AdjustableMirror.tsx';
import { Observer } from './Observer.tsx';
import { RoomObjects } from './RoomObjects.tsx';

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
  const initialMirrorPosition: vec.Vector2[] = [
    [ROOM_WIDTH, 2.5],
    [ROOM_WIDTH, 1.5],
  ];
  const [midpoint, setMidpoint] = React.useState<vec.Vector2>(vec.lerp(initialMirrorPosition[0], initialMirrorPosition[1], 0.5));
  // how many intersections has the learner found?
  const [intersections, setIntersections] = React.useState<vec.Vector2[]>([]);

  // atan2 returns the angle in the plane (in radians)
  const userAngle = Math.atan2(midpoint[1], midpoint[0]);

  // TODO: Check if light ray passes through any virtual object
  const initialObject = { x: 3, y: 2 };
  const objectsArray = Array.from(new Array(VIRTUAL_COUNT));

  const OBJECTS: vec.Vector2[] = objectsArray.map((_, index) => {
    const start = index - 1;
    return [initialObject.x + ROOM_WIDTH * start, initialObject.y];
  });
  // useMemo useRef? since midpoint is in state.
  const isIntersecting = React.useMemo(() => {
    return OBJECTS.filter((object) => {
      // does it intersect with the light ray?
      // y = mx + b
      // y = (midpoint[1] / midpoint[0]) x
      const slope = midpoint[1] / midpoint[0];
      const slopeY = slope * object[0];
      if (Math.round(slopeY) === object[1]) {
        setIntersections((prevState) => {
          const copy = [...prevState];
          // arrays are not primitives :<
          if (copy.find((o) => o[0] === object[0] && o[1] === object[1])) {
            // do not add same vector to intersections
          } else {
            copy.push(object);
          }
          return copy;
        });
        return object;
      }
    });
  }, [midpoint]);

  return (
    <Mafs viewBox={{ y: [0, ROOM_HEIGHT], x: [-ROOM_WIDTH, ROOM_WIDTH * 5] }}>
      <Coordinates.Cartesian />

      <Rooms width={ROOM_WIDTH} height={ROOM_HEIGHT} count={VIRTUAL_COUNT} />

      <Line.ThroughPoints point1={[0, 0]} point2={midpoint} color={Theme.violet} style="dashed" />

      <RoomObjects width={ROOM_WIDTH} height={ROOM_HEIGHT} count={VIRTUAL_COUNT} />

      <AdjustableMirror
        count={VIRTUAL_COUNT}
        height={ROOM_HEIGHT}
        initialMirrorPosition={initialMirrorPosition}
        midpoint={midpoint}
        setMidpoint={setMidpoint}
        width={ROOM_WIDTH}
      />

      <Transform rotate={userAngle}>
        <Observer at={[0, 0]} color={'#000'} />
      </Transform>
    </Mafs>
  );
}
