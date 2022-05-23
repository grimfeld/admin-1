import { Product } from "@medusajs/medusa"
import { useAdminPriceList, useAdminPriceListProducts } from "medusa-react"
import * as React from "react"
import { HeaderGroup, Row } from "react-table"
// import CancelIcon from "../../../../../../components/fundamentals/icons/cancel-icon"
import EditIcon from "../../../../../../components/fundamentals/icons/edit-icon"
import Table from "../../../../../../components/molecules/table"
import { SelectableTable } from "../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../hooks/use-query-filters"
import useToggleState from "../../../../../../hooks/use-toggle-state"
import usePricesColumns from "./use-columns"
import BulkEditor from "../../../../bulk-editor"

const DEFAULT_PAGE_SIZE = 9
const defaultQueryProps = {
  offset: 0,
  limit: DEFAULT_PAGE_SIZE,
}

type PricesTableProps = {
  id: string
  selectProduct: (product: Product) => void
}

const PricesTable = ({ id, selectProduct }: PricesTableProps) => {
  const params = useQueryFilters(defaultQueryProps)
  const { products, isLoading, count = 0 } = useAdminPriceListProducts(
    id,
    params.queryObject
  )
  const { price_list } = useAdminPriceList(id)
  const columns = usePricesColumns()
  const [showBulkEditor, openBulkEditor, closeBulkEditor] = useToggleState()

  return (
    <div className="w-full overflow-y-auto flex flex-col justify-between min-h-[300px] h-full ">
      <SelectableTable
        columns={columns}
        data={products || []}
        renderRow={({ row }: { row: Row<Product> }) => {
          const handleSelect = () => {
            selectProduct(row.original)
          }

          const actions = [
            {
              label: "Edit prices",
              icon: <EditIcon size={20} />,
              onClick: openBulkEditor,
            },
            // {
            //   label: "Remove product",
            //   icon: <CancelIcon size={20} />,
            //   variant: "danger" as const,
            //   onClick: () => {},
            // },
          ]

          return (
            <Table.Row
              {...row.getRowProps()}
              actions={actions}
              forceDropdown
              onClick={handleSelect}
              className="hover:bg-grey-5 hover:cursor-pointer"
            >
              {row.cells.map((cell) => {
                return (
                  <Table.Cell {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </Table.Cell>
                )
              })}
            </Table.Row>
          )
        }}
        renderHeaderGroup={ProductHeader}
        isLoading={isLoading}
        totalCount={count}
        options={{
          enableSearch: false,
          searchPlaceholder: "Search by name or SKU...",
        }}
        {...params}
      />
      {showBulkEditor && price_list && (
        <BulkEditor priceList={price_list} closeEditor={closeBulkEditor} />
      )}
    </div>
  )
}

const ProductHeader = ({
  headerGroup,
}: {
  headerGroup: HeaderGroup<Product>
}) => {
  return (
    <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map((col) => (
        <Table.HeadCell {...col.getHeaderProps(col.getSortByToggleProps())}>
          {col.render("Header")}
        </Table.HeadCell>
      ))}
    </Table.HeadRow>
  )
}

export default PricesTable
