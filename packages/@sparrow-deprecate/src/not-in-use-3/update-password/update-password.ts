// import { verifyEmail } from "../../../services/auth.service";
// import { errorMessageText } from "@app/store/auth.store/auth.store";
// import type { verifyPostbody } from "@sparrow/common/dto";
// import { notifications } from "@sparrow/library/ui";
// export const isSuccessfulResponse = writable(false);

// import { navigate } from "svelte-navigator";
// import { writable } from "svelte/store";

// export const handleVerifyEmail = async (
//   verifyCodeCredential: verifyPostbody,
// ) => {
//   const response = await verifyEmail(verifyCodeCredential);
//   if (response.isSuccessful) {
//     notifications.success("Email Verified Successfully");
//     navigate("/reset/password");
//   } else {
//     isSuccessfulResponse.set(true);
//     if (response.message === "verificationCode should not be empty") {
//       errorMessageText.set("Please enter the 6-digit verification code.");
//     }

//     if (response.message === "unauthorized") {
//       errorMessageText.set(
//         "You have entered wrong code, please check your email.",
//       );
//     }
//   }
// };
