import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getTableColumns } from "@/config/tableColumns"

const products = [
  {
    name: "Anestezic articaină",
    sku: "SKU-4521",
    stock: 48,
    minStock: 30,
    supplier: "DentalExpert",
    status: "În stoc",
  },
  {
    name: "Kit implant premium",
    sku: "SKU-9983",
    stock: 8,
    minStock: 10,
    supplier: "BioImplant",
    status: "Sub stoc minim",
  },
  {
    name: "Material amprentă",
    sku: "SKU-2231",
    stock: 26,
    minStock: 20,
    supplier: "DentalLab",
    status: "În stoc",
  },
  {
    name: "Periosteal elevator",
    sku: "SKU-6154",
    stock: 14,
    minStock: 15,
    supplier: "SurgicalLine",
    status: "Sub stoc minim",
  },
  {
    name: "Set fațete provizorii",
    sku: "SKU-7812",
    stock: 35,
    minStock: 25,
    supplier: "SmileDesign",
    status: "În stoc",
  },
]

const statusTone = {
  "În stoc": "bg-emerald-500/10 text-emerald-600",
  "Sub stoc minim": "bg-red-500/10 text-red-600",
}

const ProductsView = () => {
  const columns = getTableColumns("produse")

  return (
    <div className="flex h-[calc(100vh-128px)] flex-col overflow-hidden">
      <div className="min-w-[960px] overflow-auto">
        <Table className="w-full">
          <TableHeader className="sticky top-0 z-10 bg-white">
            <TableRow>
              {columns.map((column, index) => (
                <TableHead
                  key={column.id}
                  className={index < columns.length - 1 ? "border-r border-border/70" : ""}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.sku} className="hover:bg-muted/30">
                {columns.map((column, index) => (
                  <TableCell
                    key={column.id}
                    className={index < columns.length - 1 ? "border-r border-border/60" : ""}
                  >
                    {column.id === "produs" ? (
                      <span className="font-medium text-foreground">{column.accessor(product)}</span>
                    ) : column.id === "cod" ? (
                      <span className="text-sm text-muted-foreground">{column.accessor(product)}</span>
                    ) : column.id === "stoc" ? (
                      <span>{column.accessor(product)} buc</span>
                    ) : column.id === "minim" ? (
                      <span>{column.accessor(product)} buc</span>
                    ) : column.id === "status" ? (
                      <Badge variant="secondary" className={statusTone[product.status] ?? "bg-muted text-muted-foreground"}>
                        {column.accessor(product)}
                      </Badge>
                    ) : (
                      column.accessor(product)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ProductsView

