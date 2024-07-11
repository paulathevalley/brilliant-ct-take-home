import { Mafs, Coordinates, Debug, Point, Polygon, useMovablePoint, Theme, Line } from 'mafs';
import * as React from 'react';

const ROOM_WIDTH = 5;
const ROOM_HEIGHT = 3;

export default function App() {
  const c = useMovablePoint([3, 0], {
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

  return (
    <Mafs viewBox={{ y: [0, ROOM_HEIGHT], x: [-ROOM_WIDTH, ROOM_WIDTH * 5] }}>
      <Coordinates.Cartesian />

      {/* <Point x={c.x} y={c.y} color={Theme.blue} /> */}

      <Line.Segment point1={[0, ROOM_HEIGHT]} point2={[ROOM_WIDTH, ROOM_HEIGHT]} />
      <Line.Segment point1={[0, 0]} point2={[0, ROOM_HEIGHT]} color={Theme.blue} />
      <Line.Segment point1={[ROOM_WIDTH, ROOM_HEIGHT]} point2={[ROOM_WIDTH, 0]} color={Theme.blue} />
      <Line.Segment point1={[0, 0]} point2={[ROOM_WIDTH, 0]} />

      <Point x={-c.x} y={c.y} />
      <Point x={c.x + ROOM_WIDTH} y={c.y} />

      {/* <Polygon points={[[-c.x, c.y], a, b]} strokeStyle="dashed" />
      <Polygon
        points={[
          [c.x + 5, c.y],
          [a[0] + 5, a[1]],
          [b[0] + 5, b[1]],
        ]}
        strokeStyle="dashed"
      /> */}
      {/* <Polygon points={[c.point, a, b]} color={Theme.blue} /> */}
      {c.element}

      {/* <Debug.TransformWidget> */}
      {/* <PizzaSlice /> */}
      {/* </Debug.TransformWidget> */}
    </Mafs>
  );
}

function PizzaSlice() {
  const maskId = `pizza-slice-mask-${React.useId()}`;

  return (
    <g
      style={{
        transform: `var(--mafs-view-transform) var(--mafs-user-transform)`,
      }}
    >
      <defs>
        <mask id={maskId}>
          <polyline points={`0,0 ${1},${1 / 2} ${1},${-1 / 2}`} fill="white" />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        <circle cx={0} cy={0} r={1} fill="brown" />
        <circle cx={0} cy={0} r={1 * 0.85} fill="yellow" />
        <circle cx={0.4} cy={1 * 0.1} r={0.11} fill="red" />
        <circle cx={0.2} cy={-1 * 0.1} r={0.09} fill="red" />
        <circle cx={0.5} cy={-1 * 0.15} r={0.1} fill="red" />
        <circle cx={0.7} cy={1 * 0.05} r={0.11} fill="red" />
        <circle cx={0.65} cy={1 * 0.35} r={0.1} fill="red" />
        <circle cx={0.65} cy={-1 * 0.37} r={0.08} fill="red" />
      </g>
    </g>
  );
}
