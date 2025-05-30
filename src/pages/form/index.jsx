import React, { useEffect, useState } from 'react'
import İnput from "./input"
import { statusOptions,typeOptions } from '../../utils/constans'
import "./form.scss";
import api from '../../utils/api';
import { createJob } from '../../redux/slices/jobSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getJob } from '../../utils/service';
import { updateJob } from '../../redux/slices/jobSlice';

const Form = () => {
  // sadece status değerini state'de tutuyoruz çünkü seçilen status'e göre tarih inputunun label ve name değerleri değişicek
  const [editItem, setEditItem] = useState(null);
  const [status, setStatus] = useState(editItem?.status || "Mülakat");
  

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useParams();

  useEffect(() => {
    // oluşturma modunda: fonksiyon dursun
    if (mode === "create") return setEditItem(null);

    // güncelleme modunda: elemanın bilgilerini al
    getJob(mode).then((data) => {
      setEditItem(data);
      setStatus(data.status);
    });
  }, [mode]);

  // form gönderilince
  const handleSubmit = (e) => {
    // sayfa yenilenmesini engelle
    e.preventDefault();

    // formdaki veirleri bir nesne içersinde kaydet
    const formData = new FormData(e.target);
    const jobData = Object.fromEntries(formData.entries());

    // api'a istek at
    if (!editItem) {
      api
        .post("/jobs", jobData)
        .then((res) => {
          // reducer'a yeni başvuru oluşturma haberi ver
          dispatch(createJob(res.data));

          // kullanıcıyı başvurlar sayfasını yönlendir
          navigate("/");

          // bildirm ver
          toast.success("Başvuru oluşturuldu");
        })
        .catch((err) => {
          // bildirim ver
          toast.error("Başvuru oluşturma başarısız");
        });
    } else {
      api
        .patch(`/jobs/${editItem.id}`, jobData)
        .then((res) => {
          // reducer'a yeni başvuru oluşturma haberi ver
          dispatch(updateJob(res.data));

          // kullanıcıyı başvurlar sayfasını yönlendir
          navigate("/");

          // bildirm ver
          toast.success("Güncelleme başarılı");
        })
        .catch(() => {
          // bildirim ver
          
          toast.error("Güncelleme başarısız");
        });
    }
  };

  // date alanın name değeri
  const dateName =
    editItem?.status === "Mülakat"
      ? "interview_date"
      : editItem?.status === "Reddedildi"
      ? "rejection_date"
      : "date";

  const dateValue =
    editItem &&
    new Date(editItem[dateName])
      .toISOString()
      .slice(0, editItem.status === "Mülakat" ? 16 : 10);

  return (
    <div className="create-page">
      <section>
        <h2>{editItem ? "Başvuruyu Güncelle" : " Yeni Başvuru Oluştur"}</h2>

        <form onSubmit={handleSubmit}>
          <İnput label="Pozisyon" name="position" value={editItem?.position} />

          <İnput label="Şirket" name="company" value={editItem?.company} />

          <İnput label="Lokasyon" name="location" value={editItem?.location} />

          <İnput
            label="Durum"
            name="status"
            options={statusOptions}
            handleChange={(e) => setStatus(e.target.value)}
            value={editItem?.status}
          />

          <İnput
            label="Tür"
            name="type"
            options={typeOptions}
            value={editItem?.type}
          />

          <İnput
            label={
              status === "Mülakat"
                ? "Mülakat Tarihi"
                : status === "Reddedildi"
                ? "Reddedilme Tarihi"
                : "Başvuru Tarihi"
            }
            name={
              status === "Mülakat"
                ? "interview_date"
                : status === "Reddedildi"
                ? "rejection_date"
                : "date"
            }
            type={status === "Mülakat" ? "datetime-local" : "date"}
            value={dateValue}
          />

          <div className="btn-wrapper">
            <button>{editItem ? "Kaydet" : "Oluştur"}</button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Form;