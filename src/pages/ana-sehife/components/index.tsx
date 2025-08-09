import styles from '../style.module.css'
import HomeCalendar from './calendar/home-calendar'
import HomePlan from './plan/home-plan'

type Props = {}

const HomeMain = (props: Props) => {
    return (
        <div className={styles.mainPageContainer}>
            <HomePlan />
            <HomeCalendar/>
        </div>
    )
}

export default HomeMain