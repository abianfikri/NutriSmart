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

const ProfileInfoCard = ({ name, email, gender, age, weight, height, tddeInfo }) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={cardVariants}
        >
            <div className="card mb-3">
                <div className="card-header">
                    Informasi Dasar
                </div>
                <div className="card-body">
                    <table>
                        <tbody>
                            <tr>
                                <th style={{ width: '35%' }}>Nama</th>
                                <td style={{ width: '65%' }}>: {name || '-'}</td>
                            </tr>
                            <tr>
                                <th style={{ width: '35%' }}>Email</th>
                                <td>: {email || '-'}</td>
                            </tr>
                            <tr>
                                <th style={{ width: '35%' }}>Jenis Kelamin</th>
                                <td>: {getGenderLabel(gender)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card mb-3">
                <div className="card-header">
                    Data Fisik
                </div>
                <div className="card-body d-flex justify-content-between flex-wrap">
                    <div className="p-2 border rounded shadow-sm m-2 flex-fill text-center">
                        <h6>Umur</h6>
                        <p className="fs-4">{age || '-'} Tahun</p>
                    </div>
                    <div className="p-2 border rounded shadow-sm m-2 flex-fill text-center">
                        <h6>Berat Badan</h6>
                        <p className="fs-4">{weight || '-'} Kg</p>
                    </div>
                    <div className="p-2 border rounded shadow-sm m-2 flex-fill text-center">
                        <h6>Tinggi Badan</h6>
                        <p className="fs-4">{height || '-'} cm</p>
                    </div>
                </div>
            </div>

            {/* Card Analisis Kebutuhan Kalori */}
            <div className="card mb-3 shadow-sm">
                <div className="card-header bg-light">
                    Analisis Kebutuhan Kalori
                </div>
                <div className="card-body">
                    {tddeInfo && tddeInfo.amb && tddeInfo.tdd ? ( // Periksa apakah data ada
                        <table className="table table-borderless table-sm mb-0">
                            <tbody>
                                <tr>
                                    <th style={{ width: '35%' }}>Angka Metabolisme Basal (AMB)</th>
                                    <td>: {tddeInfo.amb?.toFixed(2) || '-'} {tddeInfo.unit || 'kcal/hari'}</td>
                                </tr>
                                <tr>
                                    <th style={{ width: '35%' }}>Total Kebutuhan Energi (TDDE)</th>
                                    <td>: {tddeInfo.tdd?.toFixed(2) || '-'} {tddeInfo.unit || 'kcal/hari'}</td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-muted fst-italic">
                            {age && weight && height && gender ?
                                'Sedang memuat data analisis kalori atau data tidak tersedia...' :
                                'Lengkapi data fisik dan tingkat aktivitas pada menu "Edit Profil" untuk melihat analisis kebutuhan kalori Anda.'}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileInfoCard;