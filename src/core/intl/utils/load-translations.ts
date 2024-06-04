interface LoadTranslationsParams {
  module: string;
  locale: string | undefined;
}

export default async function loadTranslations({
  module,
  locale,
}: LoadTranslationsParams) {
  const moduleTranslations = await import(
    `@app/${module}/locales/${locale}.json`
  );
  const commonTranslations = await import(`@app/common/locales/${locale}.json`);
  return {
    ...moduleTranslations.default,
    common: commonTranslations.default,
  };
}
