import * as React from 'react';
import { Coordinates, Debug, Line, Mafs, Plot, Point, Polygon, Theme, Transform, useMovablePoint, vec, Vector } from 'mafs';

const ROOM_WIDTH = 5;
const ROOM_HEIGHT = 3;

function inverseRotate(v, a) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  // rotation matrix (from Mafs)
  // return [v[0] * c - v[1] * s, v[0] * s + v[1] * c];
  // inverse rotation matrix
  return [v[0] * c + v[1] * s, v[0] * -1 * s + v[1] * c];
}

function ObservingEye({ at }) {
  const id = `eye-${React.useId()}`;
  const [x, y] = at;
  const size = 1;
  const translate = [x - 0.125, y - 0.5];

  return (
    <>
      <g style={{ transform: `var(--mafs-view-transform) var(--mafs-user-transform)` }}>
        <clipPath id={id}>
          <path d="M.534 0c.024 0 .043.02.043.044a.167.167 0 0 1-.025.08.5.5 0 0 1-.057.077 1.562 1.562 0 0 1-.161.155A3.415 3.415 0 0 1 .153.5a3.276 3.276 0 0 1 .18.139C.392.686.452.74.497.793a.478.478 0 0 1 .056.08.18.18 0 0 1 .025.083.044.044 0 1 1-.087 0A.095.095 0 0 0 .476.914.393.393 0 0 0 .429.85 1.318 1.318 0 0 0 .278.705 2.896 2.896 0 0 0 .054.537L0 .5.053.464a1.232 1.232 0 0 0 .07-.051C.164.381.22.338.276.29.334.242.39.19.43.144A.414.414 0 0 0 .476.081.085.085 0 0 0 .49.044C.49.02.51 0 .534 0Z" />
          <path d="M.63.247a.288.288 0 0 0 0 .508.456.456 0 0 0 0-.508Z" />
        </clipPath>
        <g transform={`translate(${translate[0]}, ${translate[1]})`}>
          <rect clipPath={`url(#${id})`} width={size} height={size} fill={Theme.pink} />
        </g>
      </g>
    </>
  );
}

export default function App() {
  const c = useMovablePoint([3, 2], {
    // Constrain `point` to be within the boundaries of the room
    constrain: ([x, y]) => {
      const withinRoom = (a: number, max: number) => {
        if (a > max) {
          return max;
        } else if (a < 0) {
          return 0;
        } else {
          return a;
        }
      };

      return [withinRoom(x, ROOM_WIDTH), withinRoom(y, ROOM_HEIGHT)];
    },
  });

  const radius = 1.5;
  // Source: https://mafs.dev/guides/interaction/movable-points
  const radialMotion = useMovablePoint([radius, 0], {
    // Constrain this point to specific angles from the center
    constrain: (point) => {
      const angle = Math.atan2(point[1], point[0]);
      const snap = Math.PI / 16;
      const roundedAngle = Math.round(angle / snap) * snap;
      const newPoint = vec.rotate([radius, 0], roundedAngle);
      return newPoint;
    },
  });

  // atan2 returns the angle in the plane (in radians)
  const userAngle = Math.atan2(radialMotion.point[1], radialMotion.point[0]);

  return (
    <Mafs viewBox={{ y: [0, ROOM_HEIGHT], x: [-ROOM_WIDTH, ROOM_WIDTH * 5] }}>
      <Coordinates.Cartesian />

      <Line.Segment point1={[0, ROOM_HEIGHT]} point2={[ROOM_WIDTH, ROOM_HEIGHT]} />
      <Line.Segment point1={[0, 0]} point2={[0, ROOM_HEIGHT]} color={Theme.blue} />
      <Line.Segment point1={[ROOM_WIDTH, ROOM_HEIGHT]} point2={[ROOM_WIDTH, 0]} color={Theme.blue} />
      <Line.Segment point1={[0, 0]} point2={[ROOM_WIDTH, 0]} />

      <Point x={-c.x} y={c.y} />
      <Point x={c.x + ROOM_WIDTH} y={c.y} />

      {c.element}

      {radialMotion.element}
      <Transform rotate={userAngle}>
        <ObservingEye at={[0, 0]} />
      </Transform>

      {/* <Debug.TransformWidget> */}
      {/* <PizzaSlice /> */}
      {/* </Debug.TransformWidget> */}
    </Mafs>
  );
}
