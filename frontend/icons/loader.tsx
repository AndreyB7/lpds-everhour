import React from 'react';

const Loader = () => {
  const color = '#465e75'
  return (
    <svg width="70%" height="70%" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient x1="8%" y1="0%" x2="65%" y2="23%" id="a">
          <stop stopColor={ color } stopOpacity="0" offset="0%"/>
          <stop stopColor={ color } stopOpacity=".6" offset="63%"/>
          <stop stopColor={ color } offset="100%"/>
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)">
          <path d="M36 18c0-9-8-18-18-18" stroke="url(#a)" strokeWidth="2">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur=".9s"
              repeatCount="indefinite"/>
          </path>
          <circle fill={ color } cx="36" cy="18" r="1">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur=".9s"
              repeatCount="indefinite"/>
          </circle>
        </g>
      </g>
    </svg>
  );
};

export default Loader;