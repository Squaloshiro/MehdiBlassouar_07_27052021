import createPersistedState from "use-persisted-state";
const useLogginState = createPersistedState(false);

const useLoggin = (test) => {
  console.log("-------------test-----------------------");
  console.log(test);
  console.log("------------------------------------");
  const [isLoggedin, setIsLoggedin] = useLogginState("");

  return {
    isLoggedin,
    onLoggin: () => setIsLoggedin(true),
    onLoggOut: () => setIsLoggedin(false),
  };
};
export default useLoggin;
