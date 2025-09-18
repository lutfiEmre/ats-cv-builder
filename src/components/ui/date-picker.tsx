'use client'

import React, { forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import { Input } from '@/components/ui/input'
import { Calendar } from 'lucide-react'
import 'react-datepicker/dist/react-datepicker.css'

interface DatePickerProps {
  selected?: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  showMonthYearPicker?: boolean
  dateFormat?: string
  className?: string
}

const CustomInput = forwardRef<HTMLInputElement, any>(
  ({ value, onClick, placeholder, className }, ref) => (
    <div className="relative">
      <Input
        ref={ref}
        value={value}
        onClick={onClick}
        placeholder={placeholder}
        className={`pr-10 cursor-pointer ${className || ''}`}
        readOnly
      />
      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    </div>
  )
)

CustomInput.displayName = 'CustomInput'

export function CustomDatePicker({
  selected,
  onChange,
  placeholder = "Select date",
  showMonthYearPicker = false,
  dateFormat = showMonthYearPicker ? "MM/yyyy" : "MM/dd/yyyy",
  className
}: DatePickerProps) {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      customInput={<CustomInput placeholder={placeholder} className={className} />}
      showMonthYearPicker={showMonthYearPicker}
      dateFormat={dateFormat}
      showPopperArrow={false}
      popperClassName="z-50"
      calendarClassName="shadow-lg border border-gray-200 rounded-lg"
      yearDropdownItemNumber={50}
      scrollableYearDropdown
    />
  )
}


