import { FC, MouseEventHandler, ReactNode } from 'react';

import { Menu, Portal } from '@ark-ui/react';

import { MoreVerticalIcon, PencilPaperIcon, TrashIcon } from '../icons';

interface TableActionProps {
    edit?: ReactNode | string | null;
    onClickEdit?: MouseEventHandler<HTMLDivElement>;
    delete?: ReactNode | string | null;
    onClickDelete?: MouseEventHandler<HTMLDivElement>;
    info?: ReactNode | string | null;
    onClickInfo?: MouseEventHandler<HTMLDivElement>;
}

const TableActions: FC<TableActionProps> = ({
    delete: deleteAction,
    onClickDelete,
    edit,
    onClickEdit,
    info,
    onClickInfo,
}) => {
    return (
        <Menu.Root positioning={{ placement: 'bottom-end' }}>
            <Menu.Trigger>
                <MoreVerticalIcon />
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content className="header-menu">
                        {edit && (
                            <Menu.Item
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: '10px',
                                }}
                                value="edit"
                                onClick={onClickEdit}
                            >
                                {edit} <span> Düzəliş et</span>
                            </Menu.Item>
                        )}
                        {info && (
                            <Menu.Item
                                value="info"
                                onClick={onClickInfo}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: '10px',
                                }}
                            >
                                {info}
                                <span>Ətraflı</span>
                            </Menu.Item>
                        )}
                        {deleteAction && (
                            <Menu.Item
                                value="delete"
                                onClick={onClickDelete}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: '10px',
                                }}
                            >
                                {deleteAction} <span>Sil</span>
                            </Menu.Item>
                        )}
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};

export default TableActions;
