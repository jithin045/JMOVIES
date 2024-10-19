import React from 'react'
import { Tabs } from 'antd'
import PageTitle from '../../components/PageTitle'
import TheatresList from './TheatresList'
import Bookings from './Shows/Bookings'

function Profile() {
  return (
    <>
      <div>
        <PageTitle title="Profile" />

        <Tabs defaultActiveKey='1'>
          <Tabs.TabPane tab="Booking" key="1">
            <Bookings />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Theatres" key="2">
            <TheatresList />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  )
}

export default Profile