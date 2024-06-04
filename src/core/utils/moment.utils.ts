import { BaseError } from "@core/errors";
import * as moment from "moment-timezone";
import "moment/locale/fr";

export const TIMEZONE = "Europe/Zurich";
const DEFAULT_LANG = "en";

const initializeMoment = (
  date?: Date | string | number | moment.Moment | null | undefined,
  format?: string | null | undefined,
): moment.Moment => {
  if (!date) {
    return moment.tz(TIMEZONE).locale(DEFAULT_LANG);
  }
  if (date instanceof String || typeof date === "string") {
    if (format) {
      const datetime = moment
        .tz(date as string, format, TIMEZONE)
        .locale(DEFAULT_LANG);
      if (!datetime.isValid()) {
        throw BaseError.createContext(
          BaseError.SERVER_CODES.BAD_USER_INPUT,
          "The date is not in the correct format.",
        );
      }
      return datetime;
    }
    if (date.length <= 0) {
      return moment.tz(TIMEZONE).locale(DEFAULT_LANG);
    }
  }
  return moment.tz(date, TIMEZONE).locale(DEFAULT_LANG);
};

export default initializeMoment;
