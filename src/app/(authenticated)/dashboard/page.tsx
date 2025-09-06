"use client"
import React,{useState,useCallback, useEffect} from 'react'
import { useUser } from '@clerk/nextjs'
import { useDebounceValue } from 'usehooks-ts'
import { Todo } from '@prisma/client'

function Dashboard() {
    const {user}=useUser()
    const [todos,setTodos]=useState<Todo[]>([])
    const [searchTerm,setSearchTerm]=useState("")
    const debounceSearchTerm=useDebounceValue(searchTerm,300)
    const [loading,setLoading]=useState(false)
    const [currentPage,setCurrentPage]=useState(1)
    const [totalPages,setTotalPages]=useState(1)
    const [isSubscribed,setIsSubscribed]=useState(false)
    const fetchTodos=useCallback(async(page:number)=>{
        try {
            setLoading(true)
            const response=await fetch(`/api/todos?page=${page}&search=${debounceSearchTerm}`)
            if(!response.ok){
                throw new Error("Failed to fetch todos")
            }
            const data=await response.json()
            setTodos(data.todos)
            setTotalPages(data.totalPages)
            setCurrentPage(data.totalItems)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error("Error fetching todos:", error);
        }
    },[debounceSearchTerm])
    useEffect(()=>{
        fetchTodos(1)
        fetchSubscriptionStatus()
    },[])
    const fetchSubscriptionStatus=async()=>{
        const response=await fetch('/api/subscription')
        if(response.ok){
            const data=await response.json()
            setIsSubscribed(data.isSubscribed)
        }
        

    }
    const handleAddTodo=async(title:string)=>{
        try {
            const response=await fetch('/api/todos',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({title
            })
            })
            if(!response.ok){
                throw new Error("Failed to add todo")
            }
            await fetchTodos(currentPage)
            }catch (error) {
            console.error("Error adding todo:", error);
        }}
    const handleUpdateTodo=async(id:string,completed:boolean)=>{
        try {
            await fetch(`/api/todos/${id}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({completed})
            })
            if(!response.ok){
                throw new Error("Failed to update todo")
            }
            await fetchTodos(currentPage)
        } catch (error) {
            console.error("Error updating todo:", error);
        }}

    const handleDeleteTodo=async(id:string)=>{
        try {
            const response=await fetch(`/api/todos/${id}`,{
                method:'DELETE'
            })
            if(!response.ok){
                throw new Error("Failed to delete todo")
            }
            await fetchTodos(currentPage)
        }
        catch (error) {
            console.error("Error deleting todo:", error);
        }   
    }
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard