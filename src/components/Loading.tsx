import PageLayout from "@/layout/PageLayout";

const Loading = () => {
  return (
    <PageLayout center={true} scroll={false}>
      <img width={30} height={30} src="/static/loading.gif" alt="🛡️" />
    </PageLayout>
  );
};

export default Loading;
