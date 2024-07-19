import * as React from 'react';
import { Theme, vec } from 'mafs';

type Props = {
  at: vec.Vector2;
  color: string;
};

// Eye SVG
export function Observer({ at, color }: Props) {
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
