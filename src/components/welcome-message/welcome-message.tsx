import { GREETINGS } from '../../consts';
import styles from './welcome-message.module.css';
// import { Emoji } from '../icons';

const mapTimeToGreeting = (hour: number) => {
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

type WelcomeMessageProps = {
  name: string;
};

export const WelcomeMessage = ({ name }: WelcomeMessageProps) => {
  const time = new Date();
  const greeting = mapTimeToGreeting(time.getHours());

  return (
    <div className={styles.container}>
      <span>👋</span>
      <h1>
        {greeting}, <span className={styles.name}>{name}</span>!
      </h1>
    </div>
  );
};
