import * as React from 'react';
import {
  Coordinates,
  Debug,
  Line,
  Mafs,
  MovablePoint,
  Plot,
  Point,
  Polygon,
  Theme,
  Transform,
  useMovablePoint,
  vec,
  Vector,
  type UseMovablePointArguments,
} from 'mafs';
import range from 'lodash/range';

const ROOM_WIDTH = 5;
const ROOM_HEIGHT = 3;
const VIRTUAL_COUNT = 7;

function inverseRotate(v, a) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  // rotation matrix (from Mafs)
  // return [v[0] * c - v[1] * s, v[0] * s + v[1] * c];
  // inverse rotation matrix
  return [v[0] * c + v[1] * s, v[0] * -1 * s + v[1] * c];
}

function Room({ count }) {
  const renderRooms = Array.from(new Array(count)).map((_, index) => {
    const indexStart = index - 1;
    const isEven = indexStart % 2 === 0;
    const x1 = ROOM_WIDTH * indexStart;
    const isRealRoom = indexStart === 0;
    const wallProps = { color: '#ccc', weight: 3, opacity: isRealRoom ? 1 : 0.5 };
    const mirrorProps = { color: Theme.blue, weight: 6, opacity: isRealRoom ? 1 : 0.5 };

    return (
      <React.Fragment key={`virtual-room-${index}`}>
        {/* top wall */}
        <Line.Segment point1={[x1, ROOM_HEIGHT]} point2={[x1 + ROOM_WIDTH, ROOM_HEIGHT]} {...wallProps} />
        {/* bottom wall */}
        <Line.Segment point1={[x1, 0]} point2={[x1 + ROOM_WIDTH, 0]} {...wallProps} />
        {/* right wall */}
        {isEven ? null : <Line.Segment point1={[x1 + ROOM_WIDTH, 0]} point2={[x1 + ROOM_WIDTH, ROOM_HEIGHT]} {...wallProps} />}
        {isRealRoom ? <Line.Segment point1={[x1 + ROOM_WIDTH, 0]} point2={[x1 + ROOM_WIDTH, ROOM_HEIGHT]} {...wallProps} /> : null}
        {/* left wall/mirror */}
        {isEven ? (
          <Line.Segment point1={[x1, 0]} point2={[x1, ROOM_HEIGHT]} {...mirrorProps} />
        ) : (
          <Line.Segment point1={[x1, 0]} point2={[x1, ROOM_HEIGHT]} {...wallProps} />
        )}
      </React.Fragment>
    );
  });

  return <>{renderRooms}</>;
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

// reference: dynamic movable points https://mafs.dev/guides/interaction/movable-points
function AdjustableMirror({ midpoint, setMidpoint }) {
  const constrain: UseMovablePointArguments['constrain'] = ([x, y]) => {
    const mirrorMidpointBounds = [0.5, ROOM_HEIGHT - 0.5];
    // Only allow lengthening the mirror (along the y-axis)
    // and do not break out of room
    if (y < mirrorMidpointBounds[0]) {
      return [ROOM_WIDTH, mirrorMidpointBounds[0]];
    }
    if (y > mirrorMidpointBounds[1]) {
      return [ROOM_WIDTH, mirrorMidpointBounds[1]];
    }
    return [ROOM_WIDTH, y];
  };

  const [top, setTop] = React.useState<vec.Vector2>([ROOM_WIDTH, 1]);
  const [bottom, setBottom] = React.useState([ROOM_WIDTH, 0] as vec.Vector2);

  return (
    <>
      <Point x={top[0]} y={top[1]} color={Theme.blue} svgCircleProps={{ r: 2 }} />
      <Line.Segment point1={top} point2={bottom} color={Theme.blue} weight={6} />
      <Point x={bottom[0]} y={bottom[1]} color={Theme.blue} svgCircleProps={{ r: 2 }} />
      <MovablePoint
        point={midpoint}
        color={'#096bff'}
        constrain={constrain}
        onMove={(newPoint) => {
          setMidpoint(newPoint);
          setTop([newPoint[0], newPoint[1] + 0.5]);
          setBottom([newPoint[0], newPoint[1] - 0.5]);
        }}
      />
    </>
  );
}

function TriangleObject() {
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

      <Room count={VIRTUAL_COUNT} />

      <TriangleObject />

      {/* <Vector tail={[0, 0]} tip={midPoint} color={Theme.violet} /> */}
      <Line.ThroughPoints point1={[0, 0]} point2={midpoint} color={Theme.violet} style="dashed" />
      <Transform rotate={userAngle}>
        <ObservingEye at={[0, 0]} color={'#000'} />
      </Transform>

      <AdjustableMirror midpoint={midpoint} setMidpoint={setMidpoint} />

      {/* <Debug.TransformWidget> */}
      {/* <PizzaSlice /> */}
      {/* </Debug.TransformWidget> */}
    </Mafs>
  );
}
