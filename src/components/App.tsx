import * as React from 'react';
import { Coordinates, Debug, Line, Mafs, MovablePoint, Plot, Point, Polygon, Theme, Transform, useMovablePoint, vec, Vector } from 'mafs';

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

function ObservingEye({ at, color }) {
  const id = `eye-${React.useId()}`;
  const [x, y] = at;
  const size = 1;
  const translate = [x - 0.125, y - 0.5];

  return (
    <>
      <g style={{ transform: `var(--mafs-view-transform) var(--mafs-user-transform)` }}>
        <clipPath id={`${id}-bg`}>
          <path d="M.603.79A.309.309 0 0 0 .71.728.239.239 0 0 1 .713.273.31.31 0 0 0 .609.209a1.085 1.085 0 0 1-.21.19 2.154 2.154 0 0 1-.16.103C.283.53.341.567.4.61a1.237 1.237 0 0 1 .202.18Z" />
        </clipPath>
        <clipPath id={id}>
          <path d="M.71.728A.308.308 0 0 0 .713.273.239.239 0 0 0 .71.728Z" />
          <path d="M.612 0c.031 0 .057.026.057.057C.669.13.626.195.578.248.528.303.463.355.4.399A2.154 2.154 0 0 1 .24.502C.284.53.342.567.4.61c.062.046.127.098.176.152a.454.454 0 0 1 .064.084.2.2 0 0 1 .028.097.057.057 0 1 1-.114 0A.09.09 0 0 0 .54.902.342.342 0 0 0 .493.839a1.127 1.127 0 0 0-.16-.136A2.47 2.47 0 0 0 .096.55L0 .498l.097-.05h.001a.796.796 0 0 0 .073-.04C.216.384.275.349.334.307A.974.974 0 0 0 .493.17C.536.123.555.084.555.057.555.026.58 0 .612 0Z" />
        </clipPath>
        <g transform={`translate(${translate[0]}, ${translate[1]})`}>
          <rect clipPath={`url(#${id}-bg)`} width={size} height={size} fill={Theme.background} />
          <rect clipPath={`url(#${id})`} width={size} height={size} fill={color || Theme.foreground} />
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

  const radius = 3;
  // Source: https://mafs.dev/guides/interaction/movable-points
  const radialMotion = useMovablePoint([radius, 0], {
    // Constrain this point to specific angles from the center
    constrain: (point) => {
      const angle = Math.atan2(point[1], point[0]);
      // const snap = Math.PI / 32;
      // const roundedAngle = Math.round(angle / snap) * snap;
      const newPoint = vec.rotate([radius, 0], angle);
      return newPoint;
    },
    color: Theme.violet,
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

      {/* <Line.ThroughPoints point1={[0, 0]} point2={radialMotion.point} color={Theme.violet} style="dashed" /> */}

      <Vector tail={[0, 0]} tip={radialMotion.point} color={Theme.violet} />
      {radialMotion.element}
      <Transform rotate={userAngle}>
        <ObservingEye at={[0, 0]} color={Theme.violet} />
      </Transform>

      {/* <Debug.TransformWidget> */}
      {/* <PizzaSlice /> */}
      {/* </Debug.TransformWidget> */}
    </Mafs>
  );
}
