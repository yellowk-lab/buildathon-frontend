import NextLink from "next/link";

export default function Link({ href, as, target, children, ...otherProps }) {
  return (
    <NextLink href={href} as={as} target={target} rel="noreferrer noopener">
      {children}
    </NextLink>
  );
}
