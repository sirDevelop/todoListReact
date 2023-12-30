import { Button } from 'react-bootstrap'
import { useGlobal } from './ParentComponent'
import { faRightFromBracket, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom"
import { useState } from 'react'
import Swal from 'sweetalert2'

export const NavBar = ({ showAddTask, setShowAddTask, setTasks }) => {
  const { authApi, user, setUser, apiInstance, isLoginLoading } = useGlobal()
  const [isDeletingTask, setIsDeletingTask] = useState(false)
  return (
    <>
      <Button variant={!showAddTask ? "success" : "secondary"} className='bg-gradient mx-2' onClick={() => { setShowAddTask((showAddTask) => !showAddTask) }}>
        {!showAddTask ? "Add Task" : "Collapse"}
      </Button>
      <Button variant={"danger"} className='bg-gradient mx-2' onClick={() => {
        setIsDeletingTask(true)

        Swal.fire({
          title: "Confirm Delete All Tasks",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          if (result.isConfirmed) {
            authApi.post("/tasks/deleteAllTasks").then((response) => {
              setTasks([])
            }).finally(() => {
              Swal.fire({
                title: "Deleted!",
                text: "All Tasks have been deleted",
                icon: "success"
              });

            })
          }
          setIsDeletingTask(false)
        });


      }}>
        {!isDeletingTask ? "Delete All Tasks" : <FontAwesomeIcon icon={faSpinner} spin />}
      </Button>
      {user ? (
        <Button
          className='mx-2'
          onClick={() => {
            apiInstance
              .get("auth/logout")
              .then((response) => {
                setTasks([])
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
        <Button className='bg-gradient mx-2'
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