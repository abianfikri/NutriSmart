import React from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const getGenderLabel = (code) => {
    if (code === "L") return "Laki-laki";
    if (code === "P") return "Perempuan";
    return "-";
};

const activityLevelOptions = [
    { value: "Tidak Aktif", label: "Tidak aktif/minim olahraga" },
    { value: "Ringan", label: "Olahraga ringan 1-3 hari/minggu" },
    { value: "Sedang", label: "Olahraga sedang 3-5 hari/minggu" },
    { value: "Berat", label: "Olahraga berat 6-7 hari/minggu" },
    { value: "Sangat Berat", label: "Pekerjaan fisik berat/olahraga intensif setiap hari" }
];

const ProfileInfoCard = ({ name, email, gender, age, weight, height, activityLevel, tddeInfo }) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={cardVariants}
        >
            {/* Informasi Dasar */}
            <div className="card mb-4 shadow-sm border-0 rounded-4">
                <div className="card-header bg-success text-white rounded-top-4 fw-semibold">
                    Informasi Dasar
                </div>
                <div className="card-body">
                    <table className="table table-borderless mb-0">
                        <tbody>
                            <tr>
                                <th style={{ width: '35%' }}>Nama</th>
                                <td>: {name || '-'}</td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td>: {email || '-'}</td>
                            </tr>
                            <tr>
                                <th>Jenis Kelamin</th>
                                <td>: {getGenderLabel(gender)}</td>
                            </tr>
                            <tr>
                                <th>Aktivitas</th>
                                <td>: {activityLevelOptions.find(option => option.value === activityLevel)?.label || '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Data Fisik */}
            <div className="card mb-4 shadow-sm border-0 rounded-4">
                <div className="card-header bg-success text-white rounded-top-4 fw-semibold">
                    Data Fisik
                </div>
                <div className="card-body d-flex justify-content-between flex-wrap gap-3">
                    <div className="flex-fill text-center p-3 border rounded-3 shadow-sm" style={{ backgroundColor: '#e9f7ef' }}>
                        <h6 className="text-success mb-1">Umur</h6>
                        <p className="fs-4 fw-bold">{age || '-'} Tahun</p>
                    </div>
                    <div className="flex-fill text-center p-3 border rounded-3 shadow-sm" style={{ backgroundColor: '#e9f7ef' }}>
                        <h6 className="text-success mb-1">Berat Badan</h6>
                        <p className="fs-4 fw-bold">{weight || '-'} Kg</p>
                    </div>
                    <div className="flex-fill text-center p-3 border rounded-3 shadow-sm" style={{ backgroundColor: '#e9f7ef' }}>
                        <h6 className="text-success mb-1">Tinggi Badan</h6>
                        <p className="fs-4 fw-bold">{height || '-'} cm</p>
                    </div>
                </div>
            </div>

            {/* Analisis Kalori */}
            <div className="card mb-4 shadow-sm border-0 rounded-4">
                <div className="card-header bg-success text-white rounded-top-4 fw-semibold">
                    Analisis Kebutuhan Kalori
                </div>
                <div className="card-body">
                    {tddeInfo && tddeInfo.amb && tddeInfo.tdd ? (
                        <table className="table table-borderless mb-0">
                            <tbody>
                                <tr>
                                    <th style={{ width: '35%' }}>AMB (Metabolisme Basal)</th>
                                    <td>: {tddeInfo.amb?.toFixed(2)} {tddeInfo.unit || 'kcal/hari'}</td>
                                </tr>
                                <tr>
                                    <th>TDDE (Kebutuhan Energi Total)</th>
                                    <td>: {tddeInfo.tdd?.toFixed(2)} {tddeInfo.unit || 'kcal/hari'}</td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-muted fst-italic mb-0">
                            {age && weight && height && gender ? (
                                'Sedang memuat data analisis kalori atau data tidak tersedia...'
                            ) : (
                                'Lengkapi data fisik dan aktivitas di "Edit Profil" untuk melihat analisis kalori Anda.'
                            )}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileInfoCard;
