import PageLayout from "@/layout/pageLayout";
import { withProtected } from "@/utils/auth/use-protected";
import { getStatusBadge } from "@/utils/renderUtils";

const Profile = () => {
  return (
    <PageLayout center={true} scroll={false}>
      {getStatusBadge(10)}
    </PageLayout>
  );
};

const ProfilePage = withProtected(Profile);
export default ProfilePage;
