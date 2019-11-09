import React, { useEffect, useState } from 'react';
import { useUser } from '../shared/hooks/useUser';
import { GREETINGS, MONTHS } from '../common/consts';

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

export const WelcomeMessage: React.FC = () => {
  const [greetingObject, setGreetingObject] = useState(null);
  const [{ name }] = useUser();

  const setDateObj: () => void = () => {
    setGreetingObject(getDateObj());
  };

  useEffect(() => {
    const updateClock = setTimeout(setDateObj, 60000);
    setDateObj();

    return () => {
      clearTimeout(updateClock);
    };
  }, []);

  const { greeting, month, day, hour, minute } = greetingObject || {};

  return (
    <div>

      <div><p>{name}</p></div>
      <div><p>{greeting}</p></div>
      <div><p>{month}</p></div>
      <div><p>{day}</p></div>
      <div><p>{hour}</p></div>
      <div><p>{minute}</p></div>
    </div>
  );
};
