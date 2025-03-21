import React, { useState } from "react"; // ✅ Import useState

function TaskCreation({ refreshTasks }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const taskData = {
            title,
            description: description || "", // Send empty string instead of null
        };

        try {
            const response = await fetch("https://taskproject-ype1.onrender.com/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                throw new Error("Failed to create task");
            }

            alert("Task created successfully!");
            setTitle("");
            setDescription("");

            refreshTasks(); // ✅ Refresh task list after creation
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Task Title" 
                required 
            />
            <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Task Description (optional)" 
            />
            <button type="submit">Add Task</button>
        </form>
    );
}

export default TaskCreation; 
