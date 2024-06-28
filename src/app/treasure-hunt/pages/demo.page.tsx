import { withTranslations } from "@core/intl";
import Map from "../components/DemoMap";

export default function MapPage() {
  return <Map />;
}

export const getServerSideProps = withTranslations("treasure-hunt")();
