import HomeSectionHeader from '@/components/HomeSectionHeader'
import React from 'react'
import BookAppointment from '@/components/BookAppointment'

const Appointment = () => {
  return (
    <div>
        <div>
            <HomeSectionHeader title="Book an appointment" description="Great doctor if you need your family member to get effective immediate assistance, emergency treatment or a simple consultation."/>
            <BookAppointment/>
        </div>
    </div>
  )
}

export default Appointment