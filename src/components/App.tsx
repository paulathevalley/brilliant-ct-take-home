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
  // const [foundIntersections, setFoundIntersections] = React.useState<vec.Vector2[]>([]);
  const [activeIntersection, setActiveIntersection] = React.useState<vec.Vector2 | null>(null);
  const [reflectionPoints, setReflectionPoints] = React.useState<{ point1: vec.Vector2; point2: vec.Vector2 }[] | null>(null);

  // atan2 returns the angle in the plane (in radians)
  const userAngle = Math.atan2(midpoint[1], midpoint[0]);

  // TODO: Check if light ray passes through any virtual object
  const initialObject = { x: 3, y: 2 };
  const objectsArray = Array.from(new Array(VIRTUAL_COUNT));

  const OBJECTS: vec.Vector2[] = objectsArray.map((_, index) => {
    const start = index + 1;
    return [initialObject.x + ROOM_WIDTH * start, initialObject.y];
  });

  React.useMemo(() => {
    const intersections = OBJECTS.filter((object) => {
      // does it intersect with the light ray?
      // y = mx + b
      // y = (midpoint[1] / midpoint[0]) x
      const slope = midpoint[1] / midpoint[0];
      const pointerY = slope * object[0];
      // Mafs is very precise, but the learner’s pointer is not
      const roundedY = Math.round(pointerY);
      if (roundedY === object[1]) {
        // if object[0] (x) is greater than the 1st virtual mirror's x position,
        // then we also need to check whether the slope intersects with the virtual mirror
        setActiveIntersection(object);
      }
      return roundedY === object[1];
    });
    if (!intersections.length) {
      setActiveIntersection(null);
      setReflectionPoints(null);
    }
  }, [midpoint]);

  React.useMemo(() => {
    if (activeIntersection) {
      // find reflection point
      const slope = activeIntersection[1] / activeIntersection[0];
      // how many virtual rooms are we in?
      const roomCount = Math.floor(activeIntersection[0] / ROOM_WIDTH);
      // find intersection points with all the mirrors
      const roomCountArray = Array.from(new Array(roomCount));
      const mirrorIntersections = roomCountArray.map((_, index) => {
        const x = ROOM_WIDTH * (index + 1);
        const y = slope * x;
        return [x, y] as vec.Vector2;
      });

      // find reflection points in 'real room' where domain is [0, ROOM_WIDTH]
      const buildLineSegment = (index: number): { point1: vec.Vector2; point2: vec.Vector2 } => {
        if (index <= 0) {
          return { point1: [0, 0], point2: mirrorIntersections[0] };
        }
        // we are either starting at the left mirror or the right mirror of the room
        const isEven = index % 2 === 0;
        const x1 = isEven ? 0 : ROOM_WIDTH;
        let x2 = isEven ? ROOM_WIDTH : 0;
        // the previous line segment will give us the y for our starting point
        const previousLineSegment = buildLineSegment(index - 1);
        const y1 = previousLineSegment.point2[1];
        // the next point is the y from the mirror intersection
        let y2;
        if (mirrorIntersections[index]) {
          y2 = mirrorIntersections[index][1];
        } else {
          // the last line segment should end at the real object
          x2 = initialObject.x;
          y2 = activeIntersection[1];
        }

        const point1: vec.Vector2 = [x1, y1];
        const point2: vec.Vector2 = [x2, y2];

        return { point1: point1, point2: point2 };
      };
      // build line segment for each reflection point
      const lineSegments = [...roomCountArray, undefined].map((_, index) => {
        return buildLineSegment(index);
      });
      setReflectionPoints(lineSegments);
    }
  }, [activeIntersection]);

  // TODO: it would be cool to animate this line starting from object and going to eye
  const renderActiveLightRay = activeIntersection ? (
    <Line.Segment point1={[0, 0]} point2={activeIntersection} color={Theme.violet} style="dashed" />
  ) : null;

  const renderReflectedLightRays = reflectionPoints
    ? reflectionPoints.map(({ point1, point2 }, index) => (
        <Line.Segment key={`reflected-lightrays-${index}`} point1={point1} point2={point2} color={Theme.violet} style="solid" />
      ))
    : null;

  return (
    <Mafs viewBox={{ y: [0, ROOM_HEIGHT], x: [-ROOM_WIDTH, ROOM_WIDTH * 5] }}>
      <Coordinates.Cartesian />

      <Rooms width={ROOM_WIDTH} height={ROOM_HEIGHT} count={VIRTUAL_COUNT} />

      {renderActiveLightRay}
      {renderReflectedLightRays}

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
