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

type Props {}

// reference: dynamic movable points https://mafs.dev/guides/interaction/movable-points
export const AdjustableMirror = ({ midpoint, setMidpoint }: Props) => {
  // render adjustable mirror & virtual mirrors
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

  // const renderVirtualMirrors = Array.from(new Array(VIRTUAL_COUNT)).map((_, index) => {
  //   const indexStart = index - 1;
  //   const isEven = indexStart % 2 === 0;
  //   const isRealMirror = indexStart === 0;
  //   const x1 = top[0] + ROOM_WIDTH * indexStart;

  //   const renderMirror = indexStart === -1 || (isEven && !isRealMirror);
  //   // if (renderMirror) {
  //   //   console.log(indexStart, top[0], ROOM_WIDTH * indexStart);
  //   // }
  //   return renderMirror ? <Line.Segment point1={[x1, top[1]]} point2={[x1, bottom[1]]} color={Theme.blue} weight={6} /> : null;
  // });

  return (
    <>
      <Line.Segment point1={top} point2={bottom} color={Theme.blue} weight={6} />
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