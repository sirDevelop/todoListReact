import { faNoteSticky, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row, Form, Collapse, InputGroup } from 'react-bootstrap'
import { useGlobal } from "../Components/ParentComponent"
import { Link, Navigate, useLocation } from "react-router-dom"

const ToDo = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  const [formData, setFormData] = useState({})
  const { authApi, user, setUser, apiInstance } = useGlobal()

  const [appIsLoaded, setAppIsLoaded] = useState(false)

  const itemHandler = (data) => {
    // setIsMoreAvailable(data.moreItemsAvailable)
    // setMaxPriceRange(data.maxPriceValue)
    setTasks((tasks) => { return [...tasks, ...data] })
    // setPage(page + 1)
  }

  useEffect(() => {
    if (!appIsLoaded) {
      authApi.post("/tasks/getTasks").then((response) => {
        console.log(response.data);
        // itemHandler(response.data)
      }).finally(() => {
        setAppIsLoaded(true)
      })
    }
  }, [appIsLoaded]);

  const handleFormData = (e) => {
    setFormData((formData) => { return { ...formData, [e.target.name]: e.target.value } })
  }

  const saveTask = () => {
    try {
      authApi.post("/tasks/addTask").then((response) => {
        console.log(response.data.taskResult)
        // setTasks((tasks) => [...tasks, ...response.data.taskResult])
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Container className='border shadow p-3 rounded' fluid>
      <Row>
        <Col className='text-center'>
          <Button className='mx-auto bg-gradient' onClick={() => { setShowAddTask(!showAddTask) }}>
            Add Task
          </Button>


          {user ? (
            <Button
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
            <Button className='mx-auto bg-gradient'
              as={Link}
              to="http://localhost:9000/auth/google/callback"
              variant="outline-info"

              // onClick={() => {
              //   apiInstance
              //     .get("auth/google/callback")
              //     .then((response) => {
              //       console.log(response);
              //     })
              // }}
            >
              Login With Google
            </Button>

          )}

          <Collapse in={showAddTask}>
            <Form className='mt-3'>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <InputGroup className="mb-3">
                  {/* <span class="fa-li"><i class="fas fa-spinner fa-pulse"></i></span> */}
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faNoteSticky} />
                  </InputGroup.Text>
                  <Form.Control name="description" as="textarea" value={formData.description} onChange={handleFormData} rows={3} placeholder="Add task description" />
                </InputGroup>
                <Button variant='success' className='mx-auto bg-gradient' onClick={() => {
                  setShowAddTask(!showAddTask)
                  // clear input
                  // save the task
                  saveTask()
                }}>
                  Save
                </Button>
              </Form.Group>

            </Form>
          </Collapse>
        </Col>
      </Row>
      <Row>Tasks</Row>
      <Button></Button>
    </Container>
  )
}

export default ToDo