import React from 'react'
import Hero from './sections/Hero/Hero'
import Navbar from '../../components/Navbar/Navbar'
import Jurisdictions from './sections/Jurisdictions/Jurisdictions'
import WhyOffshore from './sections/WhyOffshore/WhyOffshore'
import FormationTimeline from './sections/FormationTimeline/FormationTimeline'
import ImmigrationLeverage from './sections/ImmigrationLeverage/ImmigrationLeverage'
import TrustedNetwork from './sections/TrustedNetwork/TrustedNetwork'
import OffshoreSuccessStories from './sections/SuccessStories/OffshoreSuccessStories'
import FAQ from './sections/FAQ/FAQ'
import CTA from './sections/CTA/CTA'
import Footer from "../Home/sections/Footer/Footer"


function OffshoreCompany() {
  return (
    <div>
     
      <Hero/>
      <Jurisdictions/>
      <WhyOffshore/>
      <FormationTimeline/>
      <ImmigrationLeverage/>
      <TrustedNetwork/>
      <OffshoreSuccessStories/>
      <FAQ/>
      <CTA/>
    
    </div>
  )
}

export default OffshoreCompany
