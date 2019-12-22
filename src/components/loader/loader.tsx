import React from 'react';
import styled from '@emotion/styled';

const StyledDiv = styled.div`
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #eaecfa;
    z-index: 1;
  }

  width: 250px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  font-family: helvetica, arial, sans-serif;
  text-transform: uppercase;
  font-weight: 900;
  color: #ce4233;
  letter-spacing: 0.2em;
  z-index: 2;
  
  &::before, &::after {
    content: "";
    display: block;
    width: 15px;
    height: 15px;
    background: #ce4233;
    position: absolute;
    animation: load .7s infinite alternate ease-in-out;
  }
  
  &::before {
    top: 0;
  }
  
  &::after {
    bottom: 0;
  }

  @keyframes load {
    0% { left: 0; height: 30px; width: 15px }
    50% { height: 8px; width: 40px }
    100% { left: 235px; height: 30px; width: 15px}
  }
`;

export const Loader: React.FC = () => (
  <>
    <div className="overlay" />
    <StyledDiv>Caricamento...</StyledDiv>
  </>
);