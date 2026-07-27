import React from 'react'
import CanadaMigration from './CanadaMigration/CanadaMigration'
import GlobalWorkImmigration from './GlobalWorkImmigration/GlobalWorkImmigration'
// import TouristVisa from './TouristVisa/TouristVisa'
// import WorkPermit from '../WorkPermit/WorkPermit'

function Services() {
  return (
    <div>
      <CanadaMigration/>
      <GlobalWorkImmigration/>
      <TouristVisa/>
      {/* <WorkPermit/> */}
    </div>
  )
}

export default Services
