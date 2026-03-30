import Image from "next/image";
import HomeMeet from "@/components/HomeMeet";
import ProactiveAgentBanner from "@/components/ProactiveAgentBanner";
import HomeAbout from "@/components/HomeAbout";
import HomeAvailability from "@/components/HomeAvailability";
import HomeDoctors from "@/components/HomeDoctors";
import HomePatientSays from "@/components/HomePatientSays";
import HomeBlogs from "@/components/HomeBlogs";
import HomeCompanyLogos from "@/components/HomeCompanyLogos";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <ProactiveAgentBanner/>
      <HomeMeet/>
      <HomeAbout/>
      <HomeAvailability/>
      <HomeDoctors/>
      <HomePatientSays/>
      <HomeBlogs/>
      <HomeCompanyLogos/>
    </div>
  );
}
