import {useUserInfo} from "../../store/hooks/useUserInfo";

const Home = () => {
  const {studentId, name, isTeacher} = useUserInfo();

  return (
    <div>
      Sure! Here's a more complete example of a `Home` component in React
      <p>{studentId}</p>
      <p>{name}</p>
      <p>{isTeacher ? "老師" : "學生"}</p>
    </div>
  )
}

export default Home;