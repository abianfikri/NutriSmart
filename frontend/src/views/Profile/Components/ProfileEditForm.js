import React from 'react';
import { motion } from 'framer-motion';

const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const ProfileEditForm = ({
    name, setName,
    email, setEmail,
    age, setAge,
    weight, setWeight,
    height, setHeight,
    gender, setGender,
    editMode, setEditMode,
    handleSubmit,
    getProfile // Untuk tombol batal
}) => {
    return (
        <motion.div
            className="card shadow-sm"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
        >
            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <h4 className="mb-3 text-muted">Informasi Dasar</h4>
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
                        <label htmlFor="gender" className="form-label">Jenis Kelamin</label>
                        <select
                            id="gender"
                            className='form-select'
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            disabled={!editMode}
                        >
                            <option value="" disabled>-- Pilih Jenis Kelamin --</option>
                            <option value="L">Laki-Laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                    </div>

                    <hr className="my-4" />

                    <h4 className="mb-3 text-muted">Data Fisik</h4>
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
                                <label htmlFor="floatingWeight">Berat Badan (Kg)</label>
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
                                <label htmlFor="floatingHeight">Tinggi Badan (cm)</label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        {!editMode ? (
                            <motion.button
                                type="button"
                                className="btn btn-primary w-100"
                                onClick={() => setEditMode(true)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <i className="bi bi-pencil-square me-2"></i>Edit Data
                            </motion.button>
                        ) : (
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                <motion.button
                                    type="submit"
                                    className="btn btn-success me-md-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <i className="bi bi-check-circle me-2"></i>Simpan Perubahan
                                </motion.button>
                                <motion.button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setEditMode(false);
                                        getProfile(); // Re-fetch profile to discard unsaved changes
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