import PageWrapper from "components/layout/PageWrapper";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Profile from "views/directory/IndexDetail/Profile";

const ProfileUser: NextPage = () => {
  const router = useRouter();
  const { id }: any = router.query;

  return (
    <PageWrapper>
      <Profile deployer={id} />
    </PageWrapper>
  );
};

export default ProfileUser;
