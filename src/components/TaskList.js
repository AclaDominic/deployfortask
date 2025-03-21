import React, { useState, useEffect } from "react";
import TaskCreation from "./TaskCreation";

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [loadingTaskId, setLoadingTaskId] = useState(null); // Tracks the task being completed

    const fetchTasks = () => {
        fetch("https://taskproject-ype1.onrender.com/api/tasks")
            .then((response) => response.json())
            .then((data) => setTasks(data))
            .catch((error) => console.error("Error fetching tasks:", error));
    };

    useEffect(() => {
        fetchTasks();
        const interval = setInterval(fetchTasks, 5000); // Fetch tasks every 5 seconds
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    const completeTask = (id) => {
        if (loadingTaskId) return; // Prevent multiple requests

        setLoadingTaskId(id); // Disable button for this task

        fetch(`https://taskproject-ype1.onrender.com/api/tasks/${id}/complete`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => response.json())
        .then(() => {
            fetchTasks(); // Refresh task list after completing
        })
        .catch((error) => console.error("Error completing task:", error))
        .finally(() => setLoadingTaskId(null)); // Re-enable button
    };

    return (
        <div>
            <h1>Task Creation</h1>
            <TaskCreation refreshTasks={fetchTasks} />
            <h1>Task List</h1>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid black", padding: "8px" }}>ID</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Title</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Description</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Status</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr 
                            key={task.id} 
                            style={{ backgroundColor: task.completed ? "#d4edda" : "transparent" }} // Light green for completed tasks
                        >
                            <td style={{ border: "1px solid black", padding: "8px" }}>{task.id}</td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>{task.title}</td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>{task.description}</td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>
                                {task.completed ? "✅ Completed" : "⏳ Pending"}
                            </td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>
                                {!task.completed && ( // Hide button if task is completed
                                    <button 
                                        onClick={() => completeTask(task.id)}
                                        disabled={loadingTaskId === task.id} // Disable if request is pending
                                    >
                                        {loadingTaskId === task.id ? "Completing..." : "Complete"}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TaskList;
