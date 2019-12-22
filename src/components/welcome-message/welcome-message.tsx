import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import { useUser } from '../../shared/hooks/useUser';
import { GREETINGS, MONTHS } from '../../common/consts';
import { Emoji } from '../icons';

interface IGreeting {
  greeting: string;
  day: number;
  month: string;
  hour: number;
  minute: number;
}

const mapTimeToGreeting: (hour: number) => string = hour => {
  switch (hour) {
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
      return GREETINGS.morning;
    case 12:
    case 13:
    case 14:
    case 15:
    case 16:
    case 17:
      return GREETINGS.afternoon;
    case 18:
    case 19:
    case 20:
    case 21:
    case 22:
    case 23:
      return GREETINGS.evening;
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      return GREETINGS.night;
    default:
      return GREETINGS.morning;
  }
};

const getDateObj: () => IGreeting = () => {
  const now = new Date();

  return {
    greeting: mapTimeToGreeting(now.getHours()),
    month: MONTHS[now.getMonth()],
    day: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes(),
  };
};

const StyledDiv = styled.div`
  position: relative;
  border-radius: 5px;
  padding: 2rem;
  background: #FFF;
  color: #24305E;

  .waving {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 2rem;
    height: 2rem;
    
    svg {
      width: 100%;
      height: auto;
    }
  }

  .date {
    margin-bottom: .5rem;
    border-bottom: 1px solid #ddd;
    padding-bottom: .5rem;
    font-size: 1.2rem;
  }

  h1 {
    font-size: 2.5rem;
  }

  .name {
    font-weight: 900;
  }

  .uppercase {
    text-transform: capitalize;
  }
`;

export const WelcomeMessage: React.FC = () => {
  const [greetingObject, setGreetingObject] = useState(null);
  const [{ name }] = useUser();

  const setDateObj: () => void = () => {
    setGreetingObject(getDateObj());
  };

  useEffect(() => {
    const updateClock = setTimeout(setDateObj, 60000);
    setDateObj();

    return (): void => {
      clearTimeout(updateClock);
    };
  }, []);

  const { greeting, month, day, hour, minute } = greetingObject || {};

  return (
    <StyledDiv>
      <span className="waving"><Emoji.Wave /></span>
      <div className="date"><p>{day} <span className="uppercase">{month}</span> - {hour}:{minute}</p></div>
      <h1>{greeting},<br /><span className="name">{name}</span>!</h1>
    </StyledDiv>
  );
};
