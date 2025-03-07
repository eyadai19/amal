import { Path } from "react-hook-form";
import { ZodType, z } from "zod";

export interface BaseZodError<T extends ZodType<any, any, any>> {
	field: Path<z.TypeOf<T>> | "root";
	message: string;
}

export const zEmptyStrToUndefined = (str: ZodType<string | null, any, any>) =>
	z.preprocess((arg) => {
		if (typeof arg === "string" && arg === "") {
			return null;
		} else {
			return arg;
		}
	}, str.nullable());