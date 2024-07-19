import * as React from 'react';
import { Line, MovablePoint, Theme, vec, type UseMovablePointArguments } from 'mafs';

type Props = {
  count: number;
  height: number;
  initialLength: number;
  initialPosition: vec.Vector2[];
  midpoint: vec.Vector2;
  setMidpoint: React.Dispatch<React.SetStateAction<vec.Vector2>>;
  width: number;
};

// reference: dynamic movable points https://mafs.dev/guides/interaction/movable-points
export const AdjustableMirror = ({ count, height, width, midpoint, setMidpoint, initialPosition, initialLength }: Props) => {
  const halfLength = initialLength / 2;
  // render adjustable mirror & virtual mirrors
  const constrain: UseMovablePointArguments['constrain'] = ([x, y]) => {
    const mirrorMidpointBounds = [halfLength, height - halfLength];
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

  // TODO: To make mirror length adjustable, replace top & bottom with `useMovablePoint()` from Mafs
  const [top, setTop] = React.useState<vec.Vector2>(initialPosition[0]);
  const [bottom, setBottom] = React.useState(initialPosition[1] as vec.Vector2);

  const virtualMirrorsArray = Array.from(new Array(count));

  const renderVirtualMirrors = React.useMemo(() => {
    return virtualMirrorsArray.map((_, index) => {
      const indexStart = index;
      const isEven = indexStart % 2 === 0;
      const isRealMirror = index === 0;
      const x1 = top[0] + width * indexStart;

      const renderMirror = !isRealMirror && (indexStart === -1 || isEven);

      return renderMirror ? (
        <Line.Segment
          key={`virtual-mirror-${index}`}
          point1={[x1, top[1]]}
          point2={[x1, bottom[1]]}
          color={Theme.blue}
          weight={6}
          opacity={0.5}
        />
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
          setTop([newPoint[0], newPoint[1] + halfLength]);
          setBottom([newPoint[0], newPoint[1] - halfLength]);
        }}
      />
    </>
  );
};
