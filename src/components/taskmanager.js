import React, { useState, useEffect } from "react";
import useLocalStorage from "../utils/useLocal";
import "./taskManager.css";

const TaskManager = () => {
  const [phases, setPhases] = useLocalStorage("phases", []);
  const [taskInput, setTaskInput] = useState([]);
  const [phaseNameInput, setPhaseNameInput] = useState("");
  const [phasesCompleteBringOnTheJokes, setUselessFacts] = useState("");
  const [allPhasesComplete, setAllPhasesComplete] = useState(false);
  useEffect(() => {
    fetch("https://uselessfacts.jsph.pl/random.json")
      .then((res) => res.json())
      .then((data) => setUselessFacts(data));

    setPhases([
      {
        name: "Phase 1",
        tasks: [
          {
            name: "Task 1.1",
            isCompleted: false,
          },
          {
            name: "Task 1.2",
            isCompleted: false,
          },
        ],
        isCompleted: false,
      },
      {
        name: "Phase 2",
        tasks: [
          {
            name: "Task 2.1",
            isCompleted: false,
          },
          {
            name: "Task 2.2",
            isCompleted: false,
          },
        ],
        isCompleted: false,
      },
    ]);
  }, []);

  const addTask = (phaseIndex, task) => {
    const newPhases = [...phases];
    const taskObj = { name: task, isCompleted: false };
    newPhases[phaseIndex].tasks.push(taskObj);
    setPhases(newPhases);
  };
  const addPhase = () => {
    const newPhaseObj = {
      isCompleted: false,
      name: phaseNameInput,
      tasks: [],
    };
    setPhases([...phases, newPhaseObj]);
  };
  const AllPhasesComplete = async () => {
    if (phases.every((phase) => phase.isCompleted)) {
      setAllPhasesComplete(true);
    }
  };

  const isPhaseCompleted = (phase) => {
    return phase.tasks.every((task) => task.isCompleted);
  };

  const markTaskAsCompleted = (phaseIndex, taskIndex) => {
    const newPhases = [...phases];
    const previousPhasesCompleted = newPhases
      .slice(0, phaseIndex)
      .every(isPhaseCompleted);
    if (!previousPhasesCompleted) {
      alert(
        "Please complete the previous phases before marking this task as completed."
      );
      return;
    }
    newPhases[phaseIndex].tasks[taskIndex].isCompleted =
      !newPhases[phaseIndex].tasks[taskIndex].isCompleted;
    if (
      taskIndex === newPhases[phaseIndex].tasks.length - 1 &&
      isPhaseCompleted(newPhases[phaseIndex])
    ) {
      markPhaseAsCompleted(phaseIndex);
    }
    setPhases(newPhases);
  };

  const markPhaseAsCompleted = (phaseIndex) => {
    const newPhases = [...phases];

    newPhases[phaseIndex].isCompleted = true;
    AllPhasesComplete();
    setPhases(newPhases);
  };

  const handleTaskInputChange = (event, phaseIndex) => {
    const newTaskInput = taskInput;
    newTaskInput[phaseIndex] = event.target.value;
    setTaskInput(newTaskInput);
  };

  const handleFormSubmit = (event, phaseIndex) => {
    event.preventDefault();
    addTask(phaseIndex, taskInput[phaseIndex]);
    const newTaskInput = taskInput;
    newTaskInput[phaseIndex] = "";
    setTaskInput(newTaskInput);
  };
  const handlePhaseNameInputChange = (event) => {
    setPhaseNameInput(event.target.value);
  };
  const handlePhaseFormSubmit = (event) => {
    addPhase();
    event.preventDefault();
  };

  return (
    <div>
      {!allPhasesComplete &&
        phases.map((phase, phaseIndex) => (
          <div key={phaseIndex}>
            <div className="row">
              <h3>{phase.name}</h3>
              {phaseIndex > 0 && !phases[phaseIndex - 1].isCompleted && (
                <span>&#128274;</span>
              )}
              {phase.isCompleted && <span>&#10003;</span>}
            </div>

            <form onSubmit={(event) => handleFormSubmit(event, phaseIndex)}>
              <label>
                Add a task:
                <input
                  type="text"
                  value={taskInput.phaseIndex}
                  onChange={(event) => handleTaskInputChange(event, phaseIndex)}
                />
              </label>
              <button type="submit">Add task</button>
            </form>
            {phase.tasks.map((task, taskIndex) => (
              <div key={taskIndex}>
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => markTaskAsCompleted(phaseIndex, taskIndex)}
                />
                <label>{task.name}</label>
              </div>
            ))}
          </div>
        ))}
      {!allPhasesComplete && (
        <form onSubmit={(event) => handlePhaseFormSubmit(event)}>
          <label>
            Add a New Phase:
            <input
              type="text"
              value={phaseNameInput}
              onChange={(event) => handlePhaseNameInputChange(event)}
            />
          </label>
          <button type="submit">Add phase</button>
        </form>
      )}
      {allPhasesComplete && <h2>{phasesCompleteBringOnTheJokes.text}</h2>}
    </div>
  );
};

export default TaskManager;
