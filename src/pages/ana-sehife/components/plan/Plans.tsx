import { CalendarIcon } from '@/shared/icons';
import styles from '../../style.module.css';
import { S_Checkbox } from '@/ui';
import { useState } from 'react';
import { formatOnlyDate } from '@/shared/utils/transformDate'

type Subtask = {
    id: string;
    text: string;
    completed: boolean;
};

type TaskGroup = {
    id: string;
    deadline: string;
    subtasks: Subtask[];
};

type Props = {
    taskGroups?: TaskGroup[];
};

const Plans = (props: Props) => {
    const defaultTaskGroups: TaskGroup[] = [
        {
            id: '1',
            deadline: '01.03.2025–ci il',
            subtasks: [
                {
                    id: '1-1',
                    text: 'İllik - Əlavə 1. Büdcə vəsaitlərindən istifadə barədə hesabat',
                    completed: false,
                },
                {
                    id: '1-2',
                    text: 'İllik - Əlavə 2. Büdcədənkənar vəsaitləri üzrə hesabat',
                    completed: false,
                },
                {
                    id: '1-3',
                    text: 'İllik - Əlavə 3. Büdcə vəsaitlərindən istifadəsi üzrə debitor və kreditor borclar barədə hesabat',
                    completed: false,
                },
            ],
        },
        {
            id: '2',
            deadline: '02.04.2025–ci il',
            subtasks: [
                {
                    id: '2-1',
                    text: 'I rüb - Əlavə 1. Büdcə vəsaitlərindən istifadə barədə hesabat',
                    completed: false,
                },
                {
                    id: '2-2',
                    text: 'I rüb - Əlavə 2. Büdcədənkənar vəsaitləri üzrə hesabat',
                    completed: false,
                },
                {
                    id: '2-3',
                    text: 'I rüb - Əlavə 3. Büdcə vəsaitlərindən istifadəsi üzrə debitor və kreditor borclar barədə hesabat',
                    completed: false,
                },
            ],
        },
        {
            id: '3',
            deadline: '01.07.2025–ci il',
            subtasks: [
                {
                    id: '3-1',
                    text: 'Forma № 1. Maliyyə vəziyyəti haqqında hesabat',
                    completed: false,
                },
                {
                    id: '3-2',
                    text: 'Forma № 2. Maliyyə fəaliyyətinin nəticələri haqqında hesabat',
                    completed: false,
                },
                {
                    id: '3-3',
                    text: 'Forma № 3. Xalis aktivlər/Kapitalda dəyişiklər haqqında hesabat',
                    completed: false,
                },
                {
                    id: '3-4',
                    text: 'Forma № 4. Pul vəsaitlərinin hərəkəti haqqında hesabat',
                    completed: false,
                },
            ],
        },
        {
            id: '4',
            deadline: '20.07.2025–ci il ',
            subtasks: [
                {
                    id: '4-1',
                    text: 'II rüb - Əlavə 1. Büdcə vəsaitlərindən istifadə barədə hesabat',
                    completed: false,
                },
                {
                    id: '4-2',
                    text: 'II rüb - Əlavə 2. Büdcədənkənar vəsaitləri üzrə hesabat',
                    completed: false,
                },
                {
                    id: '4-3',
                    text: 'II rüb - Əlavə 3. Büdcə vəsaitlərindən istifadəsi üzrə debitor və kreditor borclar barədə hesabat',
                    completed: false,
                },
            ],
        },
    ];

    const [taskGroups, setTaskGroups] = useState<TaskGroup[]>(props.taskGroups || defaultTaskGroups);

    const handleChange = (groupId: string, subtaskId: string) => {
        setTaskGroups(prevGroups =>
            prevGroups.map(group => {
                if (group.id === groupId) {
                    return {
                        ...group,
                        subtasks: group.subtasks.map(subtask => {
                            if (subtask.id === subtaskId) {
                                return {
                                    ...subtask,
                                    completed: !subtask.completed
                                };
                            }
                            return subtask;
                        })
                    };
                }
                return group;
            })
        );
    };

    const today = formatOnlyDate(new Date());


    return (
        <div className={styles.planContainer}>
            {taskGroups.map((group) => (
                <div key={group.id} className={styles.taskGroup}>
                    <div className={styles.taskDeadline}>
                        <div className={styles.taskTime}>
                            <CalendarIcon /> <h3>{group.deadline}</h3>
                        </div>
                        <p>tarixinədək</p>
                    </div>
                    <ul className={styles.subtaskList}>
                        {group.subtasks.map((subtask) => (
                            <li key={subtask.id} className={styles.subtaskItem}>
                                <div className={styles.subtaskCheckbox}>
                                    <S_Checkbox checked={subtask.completed}
                                        onChange={() => handleChange(group.id, subtask.id)}
                                        size="100"
                                    />
                                    <div>
                                        <span
                                            className={`${styles.subtaskText} ${subtask.completed ? styles.completedText : ''
                                                }`}
                                        >
                                            {subtask.text}
                                        </span>
                                        {subtask.completed && (
                                            <div className={styles.completedNote}>
                                                Tamamlandı – {today}
                                            </div>
                                        )}
                                    </div>
                                    {/* <span className={styles.subtaskText}>{subtask.text}</span> */}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Plans;