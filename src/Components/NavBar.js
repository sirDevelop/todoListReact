import { Button } from 'react-bootstrap'
import { useGlobal } from './ParentComponent'
import {  faRightFromBracket, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link} from "react-router-dom"

export const NavBar = ({ showAddTask, setShowAddTask }) => {
const { authApi, user, setUser, apiInstance, isLoginLoading } = useGlobal()
  return (
    <>
      <Button variant={!showAddTask ? "success" : "secondary"} className='mx-auto bg-gradient mx-2' onClick={() => {setShowAddTask((showAddTask) => !showAddTask)}}>
        {!showAddTask ? "Add Task" : "Collapse"}
      </Button>
      {user ? (
        <Button
          className='mx-2'
          onClick={() => {
            apiInstance
              .get("auth/logout")
              .then((response) => {
                setUser()
              })
          }}
        >
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="me-2"
          />
          Sign out
        </Button>
      ) : (
        <Button className='mx-auto bg-gradient mx-2'
          as={Link}
          to="http://localhost:9000/auth/google/callback"
          variant="outline-info"
          disabled={isLoginLoading}

        // onClick={() => {
        //   apiInstance
        //     .get("auth/google/callback")
        //     .then((response) => {
        //       console.log(response);
        //     })
        // }}
        >
          {!isLoginLoading ? "Login With Google" : <FontAwesomeIcon icon={faSpinner} spin />}
        </Button>

      )}
    </>
  )
}

// https://draw.chat/dc2zx6ei1r8x8gwhol3vemzox6wqai:upp4l981pbde6ugqqfbnb3ikwi5xpqrgurdz