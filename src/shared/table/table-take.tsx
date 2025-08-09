import { S_Select } from '@/ui'
import { useTableContext } from './table-context'
import S_Select_Simple from '@/ui/select/select-simple'

const TableTake = () => {
	const { onPaginationChange, filterDataState} = useTableContext()
	return (
		<div style={{width: '80px'}}>
			<S_Select_Simple 
				items={[
					{ label: '25', value: '25' },
					{ label: '50', value: '50' },
					{ label: '100', value: '100' },
				]} 
				value={[String(filterDataState?.take)]} 
				setSelectedItems={(selectedItems) => onPaginationChange({take: Number(selectedItems[0]?.value), skip: null})}
				itemsContentMinWidth={'80px'}
			/>
		</div>
	)
}

export default TableTake