"use client";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import SignupModal from "../modals/SignupModal";
import LoginModal from "../modals/LoginModal";

export default function SignUpPrompt() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const name = useSelector((state) => state.user.name);
  return (
    !name && (
      <div>
        <div className="hidden sm:block mt-4 p-4 border border-gray-200 rounded-2xl shadow-md text-center bg-white">
          {!isAuthenticated ? (
            <>
              <h2 className="text-lg font-bold mb-2">New to Clustr?</h2>
              <p className="text-sm text-gray-600 mb-4">
                Sign up now to follow topics, connect with people, and share
                your thoughts.
              </p>
              <div className="flex flex-col gap-3 justify-center w-full">
                <SignupModal />
                <LoginModal />
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">
                {user?.email || "You are logged in."}
              </p>
              <button
                onClick={() => dispatch(logout())}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition"
              >
                Log Out
              </button>
            </>
          )}
        </div>
        {!isAuthenticated && (
          <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex flex-row justify-center gap-3 z-50">
            <SignupModal />
            <LoginModal />
          </div>
        )}
      </div>
    )
  );
}
