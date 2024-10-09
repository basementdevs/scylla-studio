import {
	DEFAULT_SERVER_ERROR_MESSAGE,
	createSafeActionClient,
} from "next-safe-action";

export const actionClient = createSafeActionClient({
	handleServerError(error: Error) {
		if (error instanceof Error) {
			return error.message;
		}

		return DEFAULT_SERVER_ERROR_MESSAGE;
	},
});
