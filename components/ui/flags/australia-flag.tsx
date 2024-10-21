import React from 'react';

const AustraliaFlag: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg className="w-8 h-auto border-2 rounded bg-background hover:bg-accent hover:text-accent-foreground" viewBox="0 0 9600 4800">
      <defs>
        <clipPath id="c">
          <path d="M0,0V1.5H7V3H6zM6,0H3V3.5H0V3z" />
        </clipPath>
        <path
          id="Star7"
          d="M0,-360 69.421398,-144.155019 281.459334,-224.456329 155.988466,-35.603349 350.974048,80.107536 125.093037,99.758368 156.198146,324.348792 0,160 -156.198146,324.348792 -125.093037,99.758368 -350.974048,80.107536 -155.988466,-35.603349 -281.459334,-224.456329 -69.421398,-144.155019z"
        />
        <path
          id="Star5"
          d="M0,-210 54.859957,-75.508253 199.721868,-64.893569 88.765275,28.841586 123.434903,169.893569 0,93.333333 -123.434903,169.893569 -88.765275,28.841586 -199.721868,-64.893569 -54.859957,-75.508253z"
        />
        <use id="Cstar" xlinkHref="#Star7" transform="scale(2.1)" />
      </defs>
      <g transform="scale(840)">
        <rect width="12" height="6" fill="#00008b" />
        <path d="M0,0 6,3M6,0 0,3" stroke="#fff" stroke-width="0.6" />
        <path
          d="M0,0 6,3M6,0 0,3"
          stroke="#f00"
          stroke-width="0.4"
          clip-path="url(#c)"
        />
        <path d="M3,0V3.5M0,1.5H7" stroke="#fff" />
        <path d="M3,0V3.5M0,1.5H7" stroke="#f00" stroke-width="0.6" />
        <path d="M0,3H6V0H8V4H0z" fill="#00008b" />
      </g>
      <g fill="#fff">
        <use id="Comwlth" xlinkHref="#Cstar" x="2520" y="3780" />
        <use id="αCrucis" xlinkHref="#Star7" x="7560" y="4200" />
        <use id="βCrucis" xlinkHref="#Star7" x="6300" y="2205" />
        <use id="γCrucis" xlinkHref="#Star7" x="7560" y="840" />
        <use id="δCrucis" xlinkHref="#Star7" x="8680" y="1869" />
        <use id="εCrucis" xlinkHref="#Star5" x="8064" y="2730" />
      </g>
    </svg>
  );
};

export default AustraliaFlag;
