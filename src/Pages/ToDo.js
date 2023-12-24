import { faCheck, faNoteSticky, faPencil, faRightFromBracket, faSpinner, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row, Form, Collapse, InputGroup, Table } from 'react-bootstrap'
import { useGlobal } from "../Components/ParentComponent"
import { Link, Navigate, useLocation } from "react-router-dom"
import { NavBar } from '../Components/NavBar'
import Swal from 'sweetalert2'

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

  const editTask = (id) => {
    try {
      setTasks((tasks) => [...tasks.map(task => {
        return task._id === id ? { ...task, isSaving: true } : task
      })])
      // they are already editing and they clicked the check
      const newTaskData = tasks.filter(task => task._id === id)[0]

      if (newTaskData.isEditing != null && newTaskData.isEditing) {
        authApi.post("/tasks/editTask", { ...newTaskData }).then((response) => {
          console.log("response", response);
          // alert(success)
        }).finally(() => {
          setTasks((tasks) => [...tasks.map(task => {
            return task._id === id ? { ...task, isEditing: false, isSaving: false } : task
          })])
        })
      }


    } catch (err) {
      console.log(err)
    }
  }

  const deleteTask = (id) => {
    Swal.fire({
      title: "Confirm Task Deletion",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          setTasks((tasks) => [...tasks.map(task => {
            return task._id === id ? { ...task, isDeleting: true } : task
          })])
          authApi.post("/tasks/deleteTask", { id }).then((response) => {
            setTasks((tasks) => [...tasks.filter(task => task._id !== id)])
          }).finally(() => {
            setTasks((tasks) => [...tasks.map(task => {
              return task._id === id ? { ...task, isDeleting: false } : task
            })])
            Swal.fire({
              title: "Deleted!",
              text: "The task has been deleted.",
              icon: "success"
            });
          })
        } catch (err) {
          console.log(err)
        }
      }
    });
  }


  return (
    <Container className='border shadow p-3 rounded' fluid>
      <Row>
        <Col className='text-center'>
          <NavBar showAddTask={showAddTask} setShowAddTask={setShowAddTask} setTasks={setTasks} />
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

      <Table className='mt-3'>
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
            <td className='border-0 text-end'>
              Actions
            </td>
          </tr>
        </thead>
        
        {
          tasks.map(task => {
            return <>
              <tr className={`tasks ${task.isEditing ? "edit" : ""}`}>
                <td className="border-bottom">
                  {task.isEditing ? <Form.Control
                    type="date"
                    defaultValue={new Date(task.date).toISOString().substr(0, 10)}
                    onChange={(e) => setTasks((tasks) => [...tasks.map(oldTask => {
                      return oldTask._id === task._id ? { ...oldTask, date: e.target.value } : oldTask
                    })])}
                  /> : new Date(task.date).toISOString().substr(0, 10)}
                </td>
                <td className="border-bottom">
                  {task.isEditing ? <><Form.Check
                    onChange={(e) => setTasks((tasks) => [...tasks.map(oldTask => {
                      return oldTask._id === task._id ? { ...oldTask, status: e.target.checked ? "Completed" : "Pending" } : oldTask
                    })])}
                    className='ms-5'
                    type={"checkbox"}
                    label={task.status}
                  />
                  </>
                    : task.status}

                </td>
                <td className="border-bottom">
                  {task.isEditing ? <Form.Control
                    as="textarea"
                    placeholder={task.description.substr(0, 100)}
                    defaultValue={task.description.substr(0, 100)}
                    onChange={(e) => setTasks((tasks) => [...tasks.map(oldTask => {
                      return oldTask._id===task._id ? {...oldTask, description: e.target.value}:oldTask
                    })])}
                  /> : `${task.description.substr(0, 100)}`}
                </td>
                <td className="border-bottom text-end">
                  {/* disabled={task.isEditing} */}
                  <Button disabled={task.isSaving} onClick={!task.isEditing ? () => setTasks((tasks) => [...tasks.map(oldTask => {
                    return oldTask._id === task._id ? { ...oldTask, isEditing: true } : oldTask
                  })]) : () => editTask(task._id) } className='edit-task ms-auto border-0 bg-transparent text-success'>
                    {task.isEditing ? task.isSaving ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faPencil} />}</Button>
                  <Button onClick={() => deleteTask(task._id)} disabled={task.isDeleting} className='delete-task ms-auto border-0 bg-transparent text-danger'>
                    {task.isDeleting ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faX} />}
                  </Button>
                </td>
              </tr>
            </>

          })
        }
        {!tasks.length ? <tr>
          <td colSpan={4} className='text-center py-3 bg-light '>No Tasks</td>
        </tr>:<></>}
      </Table>
    </Container>
  )
}

export default ToDo