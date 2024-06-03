import styles from "./page.module.css";
import memoryState from "memory-state";

export default function Home() {
  const user = memoryState.getState('userData');

  console.log(user);

// console.log(user);

  return (
    <>
    <div>HOME</div>
    </>
  );
}
