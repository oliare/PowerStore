import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRefreshMutation } from "../../services/authApi";
import { setCredentials } from "../../store/authSlice";
import type { RootState } from "../../store/store";

const REFRESH_THRESHOLD_MS = 60_000;

/**
 * Silently refreshes the access token on app load when it is close to expiry.
 * Parallel API 401s are still handled by baseQueryWithReauth.
 */
export const AuthBootstrap = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state: RootState) => state.account.accessToken,
  );
  const expiresAt = useSelector((state: RootState) => state.account.expiresAt);
  const [refresh] = useRefreshMutation();
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (!accessToken || attemptedRef.current) return;

    const shouldRefresh =
      !expiresAt || expiresAt - Date.now() <= REFRESH_THRESHOLD_MS;

    if (!shouldRefresh) return;

    attemptedRef.current = true;

    refresh()
      .unwrap()
      .then((result) => {
        dispatch(
          setCredentials({
            accessToken: result.accessToken,
            expiresIn: result.expiresIn,
          }),
        );
      })
      .catch(() => {
        // 401 is handled by baseQueryWithReauth / logOut when API calls run
      });
  }, [accessToken, expiresAt, dispatch, refresh]);

  return null;
};
