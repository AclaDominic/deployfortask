import React, { useState } from "react";
import API_URL from "./config";

function TaskCreation({ refreshTasks }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); // Tracks form submission state

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return; // Prevent multiple submissions

        setIsSubmitting(true); // Disable button during request

        const taskData = {
            title,
            description: description || "", // Send empty string instead of null
        };

        try {
            const response = await fetch("https://9c47-149-30-138-168.ngrok-free.app/api/tasks", {
                method: "POST",
                headers: {
                    "ngrok-skip-browser-warning": "true",
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
        } finally {
            setIsSubmitting(false); // Re-enable button after request completes
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
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Task"}
            </button>
        </form>
    );
}

export default TaskCreation;
