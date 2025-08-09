import styles from '../../style.module.css'
import Plans from './Plans'

type Props = {}

const HomePlan = (props: Props) => {
    return (
        <div className={styles.plansContainer}>
            <div className={styles.title}>
                <h3>Planlarım</h3>
            </div>
            <Plans />
        </div>
    )
}

export default HomePlan