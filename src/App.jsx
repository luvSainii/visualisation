'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload, FileSpreadsheet, AlertCircle, Search } from 'lucide-react'
import * as XLSX from 'xlsx'


export default function FileUploadSearchTable() {
  const [tableData, setTableData] = useState(null)
  const [filteredData, setFilteredData] = useState(null)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    setError(null)

    if (file) {
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      if (fileExt !== 'xlsx' && fileExt !== 'csv') {
        setError('Please upload only .xlsx or .csv files.')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const sheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })

          if (jsonData.length > 0) {
            const newTableData = {
              headers: jsonData[0],
              rows: jsonData.slice(1)
            }
            setTableData(newTableData)
            setFilteredData(newTableData)
          } else {
            setError('The uploaded file is empty.')
          }
        } catch (err) {
          setError('Error parsing the file. Please make sure it\'s a valid .xlsx or .csv file.')
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
        headers: tableData.headers,
        rows: tableData.rows.filter(row =>
          row.some(cell => cell.toString().toLowerCase().includes(term))
        )
      }
      setFilteredData(filtered)
    }
  }
  console.log(filteredData);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {!tableData && (
        <div className="flex items-center justify-center w-full">
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">XLSX or CSV (MAX. 10MB)</p>
            </div>
            <Input id="file-upload" type="file" className="hidden" accept=".xlsx,.csv" onChange={handleFileUpload} />
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
              <TableHeader>
                <TableRow>
                  {filteredData.headers.map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}