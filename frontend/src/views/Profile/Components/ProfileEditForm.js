import React from 'react';
import { motion } from 'framer-motion';

const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const activityLevelOptions = [
    { value: "Tidak Aktif", label: "Tidak aktif/minim olahraga" },
    { value: "Ringan", label: "Olahraga ringan 1-3 hari/minggu" },
    { value: "Sedang", label: "Olahraga sedang 3-5 hari/minggu" },
    { value: "Berat", label: "Olahraga berat 6-7 hari/minggu" },
    { value: "Sangat Berat", label: "Pekerjaan fisik berat/olahraga intensif setiap hari" }
];

const ProfileEditForm = ({
    name, setName,
    email, setEmail,
    age, setAge,
    weight, setWeight,
    height, setHeight,
    gender, setGender,
    editMode, setEditMode,
    activityLevel, setActivityLevel,
    handleSubmit,
    getProfile
}) => {
    return (
        <motion.div
            className="card shadow-sm border-0 rounded-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
        >
            <div className="card-header bg-success text-white rounded-top-4 fw-semibold fs-5">
                Formulir Profil Kesehatan
            </div>
            <div className="card-body p-4" style={{ backgroundColor: '#f6fffa' }}>
                <form onSubmit={handleSubmit}>
                    {/* Informasi Dasar */}
                    <h5 className="mb-3 text-success">Informasi Dasar</h5>
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="floatingName"
                            placeholder="Masukkan nama Anda"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!editMode}
                        />
                        <label htmlFor="floatingName">Nama</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control"
                            id="floatingEmail"
                            placeholder="Masukkan email Anda"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!editMode}
                        />
                        <label htmlFor="floatingEmail">Email</label>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="gender" className="form-label fw-semibold text-success">Jenis Kelamin</label>
                        <select
                            id="gender"
                            className="form-select"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            disabled={!editMode}
                        >
                            <option value="" disabled>-- Pilih Jenis Kelamin --</option>
                            <option value="L">Laki-Laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="activityLevel" className="form-label fw-semibold text-success">Tingkat Aktivitas</label>
                        <select
                            id="activityLevel"
                            className="form-select"
                            value={activityLevel}
                            onChange={(e) => setActivityLevel(e.target.value)}
                            disabled={!editMode}
                        >
                            <option value="" disabled>-- Pilih Tingkat Aktivitas --</option>
                            {activityLevelOptions.map((option, index) => (
                                <option key={index} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <hr className="my-4" />

                    {/* Data Fisik */}
                    <h5 className="mb-3 text-success">Data Fisik</h5>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-floating mb-3">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="floatingAge"
                                    placeholder="Masukkan umur Anda"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    disabled={!editMode}
                                />
                                <label htmlFor="floatingAge">Umur (Tahun)</label>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-floating mb-3">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="floatingWeight"
                                    placeholder="Masukkan berat badan Anda"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    disabled={!editMode}
                                />
                                <label htmlFor="floatingWeight">Berat (Kg)</label>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-floating mb-3">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="floatingHeight"
                                    placeholder="Masukkan tinggi badan Anda"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    disabled={!editMode}
                                />
                                <label htmlFor="floatingHeight">Tinggi (cm)</label>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="mt-4">
                        {!editMode ? (
                            <motion.button
                                type="button"
                                className="btn btn-outline-success w-100"
                                onClick={() => setEditMode(true)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <i className="bi bi-pencil-square me-2"></i>Edit Profil
                            </motion.button>
                        ) : (
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                <motion.button
                                    type="submit"
                                    className="btn btn-success me-md-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <i className="bi bi-check-circle me-2"></i>Simpan
                                </motion.button>
                                <motion.button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                        setEditMode(false);
                                        getProfile();
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <i className="bi bi-x-circle me-2"></i>Batal
                                </motion.button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default ProfileEditForm;
