import createPersistedState from "use-persisted-state";
const useLogginState = createPersistedState(false);

const useLoggin = () => {
  const [isLoggedin, setIsLoggedin] = useLogginState("");

  return {
    isLoggedin,
    onLoggin: () => setIsLoggedin(true),
    onLoggOut: () => setIsLoggedin(false),
  };
};
export default useLoggin;
