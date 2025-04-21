import React from 'react'
import { FaTrashAlt } from "react-icons/fa";
import api from '../utils/api';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteJob } from '../redux/slices/jobSlice';

const DeleteButton = ({id}) => {
  const dispatch=useDispatch()

  const handleDelete=()=>{
    if(!confirm("Silmek İstediğinizden Emin Misiniz?")) return;
    api.delete(`/jobs/${id}`)
    .then(()=>{
      dispatch(deleteJob(id));
      toast.success("Başvuru Listeden Kaldırıldı")
    })
    .catch(()=>toast.error("Başvuru Kaldırılırken Bir Hata Oluştu"))
    
  }
  return (
    <button onClick={handleDelete} className='delete'><FaTrashAlt /></button>
  )
}

export default DeleteButton