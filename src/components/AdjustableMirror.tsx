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

type Props = {
  count: number;
  height: number;
  initialMirrorPosition: vec.Vector2[];
  midpoint: vec.Vector2;
  setMidpoint: React.Dispatch<React.SetStateAction<vec.Vector2>>;
  width: number;
};

// reference: dynamic movable points https://mafs.dev/guides/interaction/movable-points
export const AdjustableMirror = ({ count, height, width, midpoint, setMidpoint, initialMirrorPosition }: Props) => {
  // render adjustable mirror & virtual mirrors
  const constrain: UseMovablePointArguments['constrain'] = ([x, y]) => {
    const mirrorMidpointBounds = [0.5, height - 0.5];
    // Only allow lengthening the mirror (along the y-axis)
    // and do not break out of room
    if (y < mirrorMidpointBounds[0]) {
      return [width, mirrorMidpointBounds[0]];
    }
    if (y > mirrorMidpointBounds[1]) {
      return [width, mirrorMidpointBounds[1]];
    }
    return [width, y];
  };

  const [top, setTop] = React.useState<vec.Vector2>(initialMirrorPosition[0]);
  const [bottom, setBottom] = React.useState(initialMirrorPosition[1] as vec.Vector2);

  const virtualMirrorsArray = Array.from(new Array(count));

  const renderVirtualMirrors = React.useMemo(() => {
    return virtualMirrorsArray.map((_, index) => {
      const indexStart = index - 1;
      const isEven = indexStart % 2 === 0;
      const isRealMirror = indexStart === 0;
      const x1 = top[0] + width * indexStart;

      const renderMirror = indexStart === -1 || (isEven && !isRealMirror);

      return renderMirror ? (
        <Line.Segment key={`virtual-mirror-${index}`} point1={[x1, top[1]]} point2={[x1, bottom[1]]} color={Theme.blue} weight={6} />
      ) : null;
    });
  }, [top, bottom]);

  return (
    <>
      {renderVirtualMirrors}
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
};
