'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactInfoSchema } from '@/lib/cv-validation'
import { ContactInfo } from '@/types/cv'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useEffect, useCallback } from 'react'

interface ContactInfoStepProps {
  data: ContactInfo
  onChange: (data: ContactInfo) => void
}

export function ContactInfoStep({ data, onChange }: ContactInfoStepProps) {
  const form = useForm<ContactInfo>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: data
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange(values as ContactInfo)
    })
    return () => subscription.unsubscribe()
  }, [form, onChange])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
        <p className="text-gray-600">
          Provide your basic contact details. This information will appear at the top of your CV.
        </p>
      </div>

      <Form {...form}>
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address *</FormLabel>
                <FormControl>
                  <Input placeholder="City, State, Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn Profile</FormLabel>
                <FormControl>
                  <Input placeholder="linkedin.com/in/johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personal Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://johndoe.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 ATS Tip</h3>
        <p className="text-blue-800 text-sm">
          Use a professional email address and include your phone number. ATS systems look for this information 
          in standard locations at the top of your CV.
        </p>
      </div>
    </div>
  )
}
