import * as React from 'react';
import { Mafs, Coordinates, Debug, Point, Polygon, useMovablePoint, Theme, Line } from 'mafs';

const ROOM_WIDTH = 5;
const ROOM_HEIGHT = 3;

function EyeAsset() {
  return (
    <>
      <g style={{ transform: `var(--mafs-view-transform) var(--mafs-user-transform)` }}>
        <clipPath id="myspecialclip">
          <path d="M.534 0c.024 0 .043.02.043.044a.167.167 0 0 1-.025.08.5.5 0 0 1-.057.077 1.562 1.562 0 0 1-.161.155A3.415 3.415 0 0 1 .153.5a3.276 3.276 0 0 1 .18.139C.392.686.452.74.497.793a.478.478 0 0 1 .056.08.18.18 0 0 1 .025.083.044.044 0 1 1-.087 0A.095.095 0 0 0 .476.914.393.393 0 0 0 .429.85 1.318 1.318 0 0 0 .278.705 2.896 2.896 0 0 0 .054.537L0 .5.053.464a1.232 1.232 0 0 0 .07-.051C.164.381.22.338.276.29.334.242.39.19.43.144A.414.414 0 0 0 .476.081.085.085 0 0 0 .49.044C.49.02.51 0 .534 0Z" />
          <path d="M.63.247a.288.288 0 0 0 0 .508.456.456 0 0 0 0-.508Z" />
        </clipPath>
        <rect clip-path="url(#myspecialclip)" width="2" height="2" fill="#000" />
      </g>
    </>
  );
}

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

      <Line.Segment point1={[0, ROOM_HEIGHT]} point2={[ROOM_WIDTH, ROOM_HEIGHT]} />
      <Line.Segment point1={[0, 0]} point2={[0, ROOM_HEIGHT]} color={Theme.blue} />
      <Line.Segment point1={[ROOM_WIDTH, ROOM_HEIGHT]} point2={[ROOM_WIDTH, 0]} color={Theme.blue} />
      <Line.Segment point1={[0, 0]} point2={[ROOM_WIDTH, 0]} />

      <Point x={-c.x} y={c.y} />
      <Point x={c.x + ROOM_WIDTH} y={c.y} />

      {c.element}

      <EyeAsset />

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
