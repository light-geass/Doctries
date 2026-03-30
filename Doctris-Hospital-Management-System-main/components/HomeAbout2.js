import React from 'react'
import { FaArrowRight } from "react-icons/fa6";
import HomeSectionHeader from './HomeSectionHeader';
import HomeServices from './HomeServices';
import { MdRemoveRedEye } from "react-icons/md";
import { FaHeadSideVirus } from "react-icons/fa6";
import { PiStethoscopeBold } from "react-icons/pi";
import { BsCapsule } from "react-icons/bs";
import { RiMicroscopeFill } from "react-icons/ri";
import { TbActivityHeartbeat } from "react-icons/tb";
import { BsPersonFill } from "react-icons/bs";
import { FaCircleNodes } from "react-icons/fa6";

const HomeAbout2 = () => {

  const services = [
    {
      icon: <MdRemoveRedEye />,
      name: "Eye Care",
      desc: "There is now an abundance of readable dummy texts required purely to fill a space."
    },
    {
      icon: <FaHeadSideVirus />,
      name: "Psychotherapy",
      desc: "There is now an abundance of readable dummy texts required purely to fill a space."
    },
    {
      icon: <PiStethoscopeBold />,
      name: "Primary Care",
      desc: "There is now an abundance of readable dummy texts required purely to fill a space."
    },
    {
      icon: <BsCapsule />,
      name: "Dental Care",
      desc: "There is now an abundance of readable dummy texts required purely to fill a space."
    },
    {
      icon: <RiMicroscopeFill />,
      name: "Orthopedic",
      desc: "There is now an abundance of readable dummy texts required purely to fill a space."
    },
    {
      icon: <TbActivityHeartbeat />,
      name: "Cardiology",
      desc: "There is now an abundance of readable dummy texts required purely to fill a space."
    },
    {
      icon: <BsPersonFill />,
      name: "Gynecology",
      desc: "There is now an abundance of readable dummy texts required purely to fill a space."
    },
    {
      icon: <FaCircleNodes />,
      name: "Neurology",
      desc: "There is now an abundance of readable dummy texts required purely to fill a space."
    }
  ];


  return (
    <div className='px-70 pb-20 bg-gray-100'>
      

      <div>
        <HomeSectionHeader tag="Departments" title="Our Medical Services" description="Great doctor if you need your family member to get effective immediate assistance, emergency treatment or a simple consultation." />
      </div>
      <div className='grid grid-cols-4 gap-10 '>
        {
          services.map((service, index) => (
            <HomeServices key={index} name={service.name} desc={service.desc} icon={service.icon} />
          ))
        }

      </div>
    </div>
  )
}

export default HomeAbout2