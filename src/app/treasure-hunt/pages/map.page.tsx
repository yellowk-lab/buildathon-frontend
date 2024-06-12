import { withTranslations } from "@core/intl";
import Map from "../components/Map";

export default function MapPage() {
  return <Map />;
}

export const getServerSideProps = withTranslations("treasure-hunt")();
