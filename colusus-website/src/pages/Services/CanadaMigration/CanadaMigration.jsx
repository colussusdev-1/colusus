import React from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import CanadaHero from './Sections/Hero/CanadaHero'
import CanadaOverview from './Sections/OverView/CanadaOverview'
import WhyChooseCanada from './Sections/WhyChooseCanada/WhyChooseCanada'
import EligibilityAssessment from './Sections/EligibilityAssessment/EligibilityAssessment'

function CanadaMigration() {
  return (
    <div>
     
      <CanadaHero />
      <CanadaOverview />
      <WhyChooseCanada />
      <EligibilityAssessment />
    </div>
  )
}

export default CanadaMigration
