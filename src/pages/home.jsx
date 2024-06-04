import { Link } from "react-router-dom";
import memoryState from 'memory-state'

export default function Home() {
  const user = memoryState.getState('userDATA')
  console.log(user);
  return (
    <>
    <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
        </ul>
    </>
  )
}
