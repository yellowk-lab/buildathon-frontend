import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSession } from "next-auth/react";

type GetServerSidePropsWithAuth = (
  context: GetServerSidePropsContext
) => Promise<GetServerSidePropsResult<{ [key: string]: any }>>;

const withAuth =
  (getServerSidePropsFunc?: GetServerSidePropsWithAuth) =>
  async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<{ [key: string]: any }>> => {
    const session = await getSession(context);
    const currentPage = context.resolvedUrl;

    if (session) {
      if (currentPage.startsWith("/feedback/win-gifts")) {
        const articleId = Array.isArray(context.query.articleId)
          ? context.query.articleId[0]
          : context.query.articleId;
        return {
          redirect: {
            destination: `/feedback?articleId=${articleId}`,
            permanent: false,
          },
        };
      }
      if (currentPage.startsWith("/auth")) {
        return {
          redirect: {
            destination: `/`,
            permanent: false,
          },
        };
      }
    }
    if (!session) {
      if (currentPage.startsWith("/account")) {
        return {
          redirect: {
            destination: `/`,
            permanent: false,
          },
        };
      }
    }

    if (getServerSidePropsFunc) {
      const additionalProps = await getServerSidePropsFunc(context);
      return additionalProps;
    }

    return { props: {} };
  };

export default withAuth;
