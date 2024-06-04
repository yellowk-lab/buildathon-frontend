import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { loadTranslations } from "@core/intl/utils";

export function withTranslations(moduleName: string) {
  return (getServerSidePropsFunc?: any) =>
    async (
      context: GetServerSidePropsContext,
    ): Promise<GetServerSidePropsResult<any>> => {
      const locales = await loadTranslations({
        module: moduleName,
        locale: context.locale,
      });

      let additionalProps = {};

      if (getServerSidePropsFunc) {
        const result = await getServerSidePropsFunc(context);
        additionalProps = result.props || {};
      }

      return {
        props: {
          ...additionalProps,
          locales,
        },
      };
    };
}
