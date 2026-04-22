import { Outlet } from "react-router-dom";
import { ProfileSidebar } from "../../common/ProfileSidebar";
import { MailingSection } from "../../pages/HomePage/MailingSection";

export const ProfileLayout = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8 min-h-screen">
        <ProfileSidebar />

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
      <MailingSection />
    </>
  );
};
