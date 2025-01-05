'use client';

import { useActionState } from 'react';
import {
  Button,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DateRangePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  I18nProvider,
  Label,
  Popover,
  RangeCalendar,
} from 'react-aria-components';

import { DbSpecialHourPeriod } from '@/services/google-apis';
import { holidaysAction, StateValidation } from './holidays-action';
import styles from './holidays.module.css';

type AddHolidayProps = {
  name: string;
  previousDates: DbSpecialHourPeriod[];
};

const initialState: StateValidation = {};

export const AddHoliday = ({ name, previousDates }: AddHolidayProps) => {
  const holidaysActionWithPrevious = holidaysAction.bind(null, previousDates);

  const [state, formAction, pending] = useActionState(
    holidaysActionWithPrevious,
    initialState
  );

  return (
    <form action={formAction}>
      <input type="hidden" value={name} name="name" />
      <div className={styles.datepickerContainer}>
        <I18nProvider locale="it">
          <DateRangePicker startName="startDate" endName="endDate">
            <Label>Date</Label>
            <Group>
              <DateInput slot="start">
                {(segment) => <DateSegment segment={segment} />}
              </DateInput>
              <span aria-hidden="true">–</span>
              <DateInput slot="end">
                {(segment) => <DateSegment segment={segment} />}
              </DateInput>
              <Button>▼</Button>
            </Group>
            <Popover>
              <Dialog>
                <RangeCalendar>
                  <header>
                    <Button slot="previous">◀</Button>
                    <Heading />
                    <Button slot="next">▶</Button>
                  </header>
                  <CalendarGrid>
                    {(date) => <CalendarCell date={date} />}
                  </CalendarGrid>
                </RangeCalendar>
              </Dialog>
            </Popover>
          </DateRangePicker>
        </I18nProvider>
      </div>

      {state.error}

      <div className={styles.buttonsContainer}>
        <button disabled={pending}>Aggiungi date</button>
      </div>

      {state.success}
    </form>
  );
};
