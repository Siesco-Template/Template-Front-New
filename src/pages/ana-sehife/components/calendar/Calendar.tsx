import { DateRangePicker } from '@/ui/date-picker/DateRangePicker'
import styles from '../../style.module.css'
import { useState } from 'react'
import { DateValue } from '@ark-ui/react'
import { CalendarDate } from '@internationalized/date'

type Props = {
  focusedDate: CalendarDate;
}

const Calendar = ({ focusedDate }: Props) => {
  const [value, setValue] = useState<DateValue[]>([]);

  return (
    <div className={styles.calendarContainer}>
      <DateRangePicker
        value={value}
        onChange={setValue}
        focusedValue={focusedDate}
      />
    </div>
  )
}

export default Calendar