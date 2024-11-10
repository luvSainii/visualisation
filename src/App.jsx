// "use client"

// import { useState, useEffect } from "react"
// import { Input } from "@/components/ui/input"
// import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Upload, AlertCircle, Search, Filter } from "lucide-react"
// import * as XLSX from "xlsx"
// import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// export default function FileUploadSearchFilterTable() {
//   const [tableData, setTableData] = useState(null)
//   const [filteredData, setFilteredData] = useState(null)
//   const [error, setError] = useState(null)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedColumns, setSelectedColumns] = useState([])
//   const [selectedChartColumns, setSelectedChartColumns] = useState([])
//   const [chartType, setChartType] = useState("bar")

//   const handleFileUpload = (event) => {
//     const file = event.target.files?.[0]
//     setError(null)

//     if (file) {
//       const fileExt = file.name.split(".").pop()?.toLowerCase()
//       if (fileExt !== "xlsx" && fileExt !== "csv") {
//         setError("Please upload only .xlsx or .csv files.")
//         return
//       }

//       const reader = new FileReader()
//       reader.onload = (e) => {
//         try {
//           const data = new Uint8Array(e.target?.result)
//           const workbook = XLSX.read(data, { type: "array" })
//           const sheetName = workbook.SheetNames[0]
//           const sheet = workbook.Sheets[sheetName]
//           const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })

//           if (jsonData.length >= 2) {
//             const columnNames = XLSX.utils
//               .encode_range(XLSX.utils.decode_range(sheet["!ref"]))
//               .split(":")[1]
//               .replace(/\d+/, "")
//             const newTableData = {
//               headers: jsonData[0],
//               rows: jsonData.slice(1),
//               columnNames: columnNames.split("").map((char) => char),
//             }
//             setTableData(newTableData)
//             setFilteredData(newTableData)
//             setSelectedColumns(newTableData.columnNames)
//           } else {
//             setError("The uploaded file is empty.")
//           }
//         } catch (err) {
//           setError(
//             "Error parsing the file. Please make sure it's a valid .xlsx or .csv file."
//           )
//         }
//       }
//       reader.readAsArrayBuffer(file)
//     }
//   }

//   const handleSearch = (event) => {
//     const term = event.target.value.toLowerCase()
//     setSearchTerm(term)

//     if (tableData) {
//       const filtered = {
//         ...tableData,
//         rows: tableData.rows.filter((row) =>
//           row.some((cell) => cell.toString().toLowerCase().includes(term))
//         ),
//       }
//       setFilteredData(filtered)
//     }
//   }

//   const handleColumnToggle = (columnName) => {
//     setSelectedColumns((prev) => {
//       if (prev.includes(columnName)) {
//         return prev.filter((col) => col !== columnName)
//       } else {
//         return [...prev, columnName].sort()
//       }
//     })
//   }

//   const handleChartColumnSelect = (columnName) => {
//     setSelectedChartColumns((prev) => {
//       if (prev.includes(columnName)) {
//         return prev.filter((col) => col !== columnName)
//       } else if (prev.length < 2) {
//         return [...prev, columnName]
//       } else {
//         return [prev[1], columnName]
//       }
//     })
//   }

//   useEffect(() => {
//     if (filteredData) {
//       const deselectedIndices = filteredData.columnNames
//         .map((col, index) => (selectedColumns.includes(col) ? -1 : index))
//         .filter((index) => index !== -1)

//       const newFilteredData = {
//         ...filteredData,
//         headers: filteredData.headers.filter(
//           (_, index) => !deselectedIndices.includes(index)
//         ),
//         rows: filteredData.rows.map((row) =>
//           row.filter((_, index) => !deselectedIndices.includes(index))
//         ),
//       }
//       setFilteredData(newFilteredData)
//     }
//   }, [selectedColumns, filteredData])

//   const getChartData = () => {
//     if (!filteredData || selectedChartColumns.length !== 2) return []

//     const [xColumn, yColumn] = selectedChartColumns
//     const xIndex = filteredData.headers.indexOf(xColumn)
//     const yIndex = filteredData.headers.indexOf(yColumn)

//     return filteredData.rows.map((row) => ({
//       [xColumn]: row[xIndex],
//       [yColumn]: parseFloat(row[yIndex]) || 0,
//     }))
//   }

//   const renderChart = () => {
//     const chartData = getChartData()
//     if (chartData.length === 0) return null

//     const [xColumn, yColumn] = selectedChartColumns
//     const ChartComponent = chartType === "bar" ? BarChart : LineChart
//     const DataComponent = chartType === "bar" ? Bar : Line

//     return (
//       <ChartContainer
//         config={{
//           [yColumn]: {
//             label: yColumn,
//             color: "hsl(var(--chart-1))",
//           },
//         }}
//         className="h-[400px] mt-8"
//       >
//         <ResponsiveContainer width="100%" height="100%">
//           <ChartComponent data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey={xColumn} />
//             <YAxis />
//             <ChartTooltip content={<ChartTooltipContent />} />
//             <Legend />
//             <DataComponent type="monotone" dataKey={yColumn} stroke="var(--color-primary)" fill="var(--color-primary)" />
//           </ChartComponent>
//         </ResponsiveContainer>
//       </ChartContainer>
//     )
//   }

//   return (
//     <div className="container mx-auto p-4 space-y-6">
//       {!tableData && (
//         <div className="flex items-center justify-center w-full">
//           <label
//             htmlFor="file-upload"
//             className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
//           >
//             <div className="flex flex-col items-center justify-center pt-5 pb-6">
//               <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
//               <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
//                 <span className="font-semibold">Click to upload</span> or drag
//                 and drop
//               </p>
//               <p className="text-xs text-gray-500 dark:text-gray-400">
//                 XLSX or CSV (MAX. 10MB)
//               </p>
//             </div>
//             <Input
//               id="file-upload"
//               type="file"
//               className="hidden"
//               accept=".xlsx,.csv"
//               onChange={handleFileUpload}
//             />
//           </label>
//         </div>
//       )}

//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       {filteredData && (
//         <>
//           <div className="flex items-center space-x-2">
//             <Search className="w-5 h-5 text-gray-500" />
//             <Input
//               type="text"
//               placeholder="Search table..."
//               value={searchTerm}
//               onChange={handleSearch}
//               className="max-w-sm"
//             />
//                         <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="ml-auto">
//                   <Filter className="mr-2 h-4 w-4" />
//                   Filter Columns
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-56">
//                 {filteredData.rows
//                   .filter((row) => row.length >= 2)
//                   .map((row, rowIndex) =>
//                     rowIndex === 0
//                       ? row.map((cell, cellIndex) => (
//                           <DropdownMenuCheckboxItem
//                             key={`${rowIndex}-${cellIndex}`}
//                             checked={selectedColumns.includes(cell)}
//                             onCheckedChange={() => handleColumnToggle(cell)}
//                           >
//                             {cell}
//                           </DropdownMenuCheckboxItem>
//                         ))
//                       : null
//                   )}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//           <div className="rounded-md border overflow-x-auto">
//             <Table>
//               <TableBody>
//                 {filteredData.rows
//                   .filter((row) => row.length >= 2)
//                   .map((row, rowIndex) => (
//                     <TableRow key={rowIndex}>
//                       {row.map((cell, cellIndex) => (
//                         <TableCell key={cellIndex}>{cell}</TableCell>
//                       ))}
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </div>
//           <div className="flex flex-col md:flex-row items-center mt-8 space-y-4 md:space-y-0 md:space-x-2">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline">Select Chart Columns</Button>
//               </DropdownMenuTrigger>
//             </DropdownMenu>
//             <Select value={chartType} onValueChange={setChartType}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select chart type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="bar">Bar Chart</SelectItem>
//                 <SelectItem value="line">Line Chart</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           {renderChart()}
//         </>
//       )}
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, AlertCircle, Search, Filter } from "lucide-react"
import * as XLSX from "xlsx"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function FileUploadSearchFilterTable() {
  const [tableData, setTableData] = useState(null)
  const [filteredData, setFilteredData] = useState(null)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedColumns, setSelectedColumns] = useState([])
  const [selectedChartColumns, setSelectedChartColumns] = useState([])
  const [chartType, setChartType] = useState("bar")
  const [chartGenerated, setChartGenerated] = useState(false)

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    setError(null)

    if (file) {
      const fileExt = file.name.split(".").pop()?.toLowerCase()
      if (fileExt !== "xlsx" && fileExt !== "csv") {
        setError("Please upload only .xlsx or .csv files.")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result)
          const workbook = XLSX.read(data, { type: "array" })
          const sheetName = workbook.SheetNames[0]
          const sheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })

          if (jsonData.length >= 2) {
            const columnNames = XLSX.utils
              .encode_range(XLSX.utils.decode_range(sheet["!ref"]))
              .split(":")[1]
              .replace(/\d+/, "")
            const newTableData = {
              headers: jsonData[0],
              rows: jsonData.slice(1),
              columnNames: columnNames.split("").map((char) => char),
            }
            setTableData(newTableData)
            setFilteredData(newTableData)
            setSelectedColumns(newTableData.columnNames)
          } else {
            setError("The uploaded file is empty.")
          }
        } catch (err) {
          setError(
            "Error parsing the file. Please make sure it's a valid .xlsx or .csv file."
          )
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase()
    setSearchTerm(term)

    if (tableData) {
      const filtered = {
        ...tableData,
        rows: tableData.rows.filter((row) =>
          row.some((cell) => cell.toString().toLowerCase().includes(term))
        ),
      }
      setFilteredData(filtered)
    }
  }

  const handleColumnToggle = (columnName) => {
    setSelectedColumns((prev) => {
      if (prev.includes(columnName)) {
        return prev.filter((col) => col !== columnName)
      } else {
        return [...prev, columnName].sort()
      }
    })
  }

  const handleChartColumnSelect = (columnName) => {
    setSelectedChartColumns((prev) => {
      if (prev.includes(columnName)) {
        return prev.filter((col) => col !== columnName)
      } else if (prev.length < 2) {
        return [...prev, columnName]
      } else {
        return [prev[1], columnName]
      }
    })
  }

  const generateChart = () => {
    if (selectedChartColumns.length === 2) {
      setChartGenerated(true)
    } else {
      alert("Please select exactly two columns for the chart.")
    }
  }

  useEffect(() => {
    if (filteredData) {
      const deselectedIndices = filteredData.columnNames
        .map((col, index) => (selectedColumns.includes(col) ? -1 : index))
        .filter((index) => index !== -1)

      const newFilteredData = {
        ...filteredData,
        headers: filteredData.headers.filter(
          (_, index) => !deselectedIndices.includes(index)
        ),
        rows: filteredData.rows.map((row) =>
          row.filter((_, index) => !deselectedIndices.includes(index))
        ),
      }
      setFilteredData(newFilteredData)
    }
  }, [selectedColumns, filteredData])

  const getChartData = () => {
    if (!filteredData || selectedChartColumns.length !== 2) return []

    const [xColumn, yColumn] = selectedChartColumns
    const xIndex = filteredData.headers.indexOf(xColumn)
    const yIndex = filteredData.headers.indexOf(yColumn)

    return filteredData.rows.map((row) => ({
      [xColumn]: row[xIndex],
      [yColumn]: parseFloat(row[yIndex]) || 0,
    }))
  }

  const renderChart = () => {
    if (!chartGenerated) return null

    const chartData = getChartData()
    if (chartData.length === 0) return null

    const [xColumn, yColumn] = selectedChartColumns
    const ChartComponent = chartType === "bar" ? BarChart : LineChart
    const DataComponent = chartType === "bar" ? Bar : Line

    return (
      <ChartContainer
        config={{
          [yColumn]: {
            label: yColumn,
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-[400px] mt-8"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xColumn} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <DataComponent type="monotone" dataKey={yColumn} stroke="var(--color-primary)" fill="var(--color-primary)" />
          </ChartComponent>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {!tableData && (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                XLSX or CSV (MAX. 10MB)
              </p>
            </div>
            <Input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".xlsx,.csv"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {filteredData && (
        <>
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search table..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableBody>
                {filteredData.rows
                  .filter((row) => row.length >= 2)
                  .map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  Select Columns for Chart
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {filteredData.rows
                  .filter((row) => row.length >= 2)
                  .map((row, rowIndex) =>
                    rowIndex === 0
                      ? row.map((cell, cellIndex) => (
                          <DropdownMenuCheckboxItem
                            key={`${rowIndex}-${cellIndex}`}
                            checked={selectedChartColumns.includes(cell)}
                            onCheckedChange={() => handleChartColumnSelect(cell)}
                          >
                            {cell}
                          </DropdownMenuCheckboxItem>
                        ))
                      : null
                  )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4">
            <Button variant="primary" onClick={generateChart}>
              Generate Chart
            </Button>
          </div>

          {renderChart()}
        </>
      )}
    </div>
  )
}
