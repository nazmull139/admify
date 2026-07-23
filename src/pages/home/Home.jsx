import React from 'react'
import Banner from './Banner'
import Destination from './Destination'
import FeatureSection from './FeatureSection'
import HowWorks from './HowWorks'
import LastBanner from './LastBanner'
import StudentReviews from './StudentReviews'

const Home = () => {
  return (
    <div>
        <Banner/>
        <FeatureSection/>
        <Destination/>
        <HowWorks/>
        <StudentReviews/>
        <LastBanner/>
    </div>
  )
}

export default Home