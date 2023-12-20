import { faNoteSticky, faRightFromBracket, faSpinner, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row, Form, Collapse, InputGroup, Table } from 'react-bootstrap'
import { useGlobal } from "../Components/ParentComponent"
import { Link, Navigate, useLocation } from "react-router-dom"
import { NavBar } from '../Components/NavBar'

const ToDo = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])
  const [isSavingTask, setIsSavingTask] = useState(false)

  const [formData, setFormData] = useState({})
  const { authApi } = useGlobal()

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
        setTasks([...tasks, ...response.data.tasks])
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
      setIsSavingTask(true)
      authApi.post("/tasks/addTask", formData).then((response) => {
        setFormData({ description: "" })
        setTasks((tasks) => [...tasks, response.data.taskResult])
      }).finally(() => {
        setShowAddTask((showAddTask) => !showAddTask)
        setIsSavingTask(false)
      })
    } catch (err) {
      console.log(err)
    }
  }

  const deleteTask = () => {
    try {
      authApi.post("/tasks/deleteTask", formData).then((response) => {
        console.log(response)
      })
    } catch (err) {
      console.log(err)
    }
  }


  return (
    <Container className='border shadow p-3 rounded' fluid>
      <Row>
        <Col className='text-center'>
          <NavBar showAddTask={showAddTask} setShowAddTask={setShowAddTask} />
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
                <Button variant='success' className='mx-auto bg-gradient' disabled={isSavingTask} onClick={() => {
                  saveTask()
                }}>
                  {!isSavingTask ? "Save" : <FontAwesomeIcon icon={faSpinner} spin />}
                </Button>

              </Form.Group>


            </Form>
          </Collapse>

        </Col>
      </Row>

      <Table>
        <thead>
          <tr className='border-bottom'>
            <td className='border-0'>
              Date
            </td>
            <td className='border-0'>
              Status
            </td>
            <td className='border-0'>
              Description
            </td>
          </tr>
        </thead>
      {
        tasks.map(task => {
          return <>
            <tr className='tasks'>
              <td className="border-bottom">
                {`${new Date(task.date).toISOString().substr(0, 10)} `}
              </td>
              <td className="border-bottom">
                {`${task.status}`}
              </td>
              <td className="border-bottom">
                {`${task.description.substr(0,100)}`}
                
              </td>
              <td className="border-bottom text-end">
                <Button className='ms-auto text-danger border-0' variant='danger'><FontAwesomeIcon icon={faX} /></Button>
              </td>
            </tr>
          </>

        })
      }
      </Table>
    </Container>
  )
}

export default ToDo