import S_Select_Simple from '@/ui/select/select-simple'
import styles from '../../style.module.css'
import { useState, useMemo } from 'react'
import Calendar from './Calendar'
import { CalendarDate } from '@internationalized/date'

type Item = {
    value: string,
    label: string
}

const getQuarterLabel = (q: number): string => {
    const labels = ["I rüb", "II rüb", "III rüb", "IV rüb"];
    return labels[q - 1];
}

const HomeCalendar = () => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const currentQuarter = Math.floor(currentMonth / 3) + 1;

    const [selectedQuarter, setSelectedQuarter] = useState<Item>({
        value: currentQuarter.toString(),
        label: getQuarterLabel(currentQuarter)
    });

    const quarterItems = [
        { value: "1", label: "I rüb" },
        { value: "2", label: "II rüb" },
        { value: "3", label: "III rüb" },
        { value: "4", label: "IV rüb" }
    ]

    const [selectedYear, setSelectedYear] = useState<Item>({ value: currentYear.toString(), label: currentYear.toString() })
    const yearItems = Array.from({ length: 10 }, (_, i) => {
        const year = currentYear - i
        return { value: year.toString(), label: year.toString() }
    })

    const calendarDates = useMemo(() => {
        const year = parseInt(selectedYear.value, 10);
        const quarter = parseInt(selectedQuarter.value, 10);
        const startMonth = (quarter - 1) * 3 + 1;

        return [
            new CalendarDate(year, startMonth, 1),
            new CalendarDate(year, startMonth + 1, 1),
            new CalendarDate(year, startMonth + 2, 1)
        ];
    }, [selectedQuarter, selectedYear]);

    const handleQuarterChange = (selected: Item[]) => {
        if (selected.length > 0) {
            setSelectedQuarter(selected[0])
        }
    }

    const handleYearChange = (selected: Item[]) => {
        if (selected.length > 0) {
            setSelectedYear(selected[0])
        }
    }

    return (
        <div className={styles.calendarsContainer}>
            <div className={styles.headerContainer}>
                <div className={styles.title}>
                    <h3>Təqvim</h3>
                </div>
                <div className={styles.selectsContainer}>
                    <S_Select_Simple
                        items={quarterItems}
                        value={[selectedQuarter.value]}
                        setSelectedItems={handleQuarterChange}
                    />
                    <S_Select_Simple
                        items={yearItems}
                        value={[selectedYear.value]}
                        setSelectedItems={handleYearChange}
                    />
                </div>
            </div>
            <div className={styles.allCalendarsWrapper}>
                {calendarDates.map((date, index) => (
                    <Calendar key={index} focusedDate={date} />
                ))}
            </div>
        </div>
    )
}

export default HomeCalendar