import React, { useState, useEffect } from "react";
import TaskCreation from "./TaskCreation";
import API_URL from "./config";

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [isOffline, setIsOffline] = useState(false); // Track backend status

    const fetchTasks = () => {
        fetch(`${API_URL}/api/tasks`, {
            method: "GET",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setTasks(data);
            setIsOffline(false); // Backend is online
        })
        .catch((error) => {
            console.error("Error fetching tasks:", error);
            setIsOffline(true); // Backend is offline
        });
    };

    useEffect(() => {
        fetchTasks();
        const interval = setInterval(fetchTasks, 30000);
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    const completeTask = (id) => {
        fetch(`${API_URL}/api/tasks/${id}/complete`, {
            method: "PATCH",
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            fetchTasks(); // Refresh task list after completing
        })
        .catch((error) => {
            console.error("Error completing task:", error);
            setIsOffline(true); // Mark offline if request fails
        });
    };

    return (
        <div>
            <h1>Task Management</h1>
            
            {isOffline && (
                <div style={{ color: "red", fontWeight: "bold", marginBottom: "10px" }}>
                    ⚠️ The service is currently offline. Please try again later.
                </div>
            )}

            <TaskCreation refreshTasks={fetchTasks} />

            <h2>Task List</h2>
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
                        <tr key={task.id} style={{ backgroundColor: task.completed ? "#d4edda" : "transparent" }}>
                            <td style={{ border: "1px solid black", padding: "8px" }}>{task.id}</td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>{task.title}</td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>{task.description}</td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>
                                {task.completed ? "✅ Completed" : "⏳ Pending"}
                            </td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>
                                {!task.completed && (
                                    <button onClick={() => completeTask(task.id)}>Complete</button>
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
