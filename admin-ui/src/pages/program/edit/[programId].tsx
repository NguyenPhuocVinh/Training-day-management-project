import React, { useState, useEffect, useRef, RefObject } from 'react';
import { useRouter } from 'next/router';
import { fetchApi } from '@/utils/fetch-api.util';
import { IProgram, ICategory } from '@/types/program';
import Cookies from 'js-cookie';
import { appConfig } from '@/configs/app.config';
import moment from 'moment';
import { RiEdit2Fill } from 'react-icons/ri';
import styles from '@/styles/Edit.module.css';
import { categoryMapping } from '@/constants';
import { useToast } from '@/contexts/ToastContext';

const EditProgram: React.FC = () => {
    const [program, setProgram] = useState<IProgram | null>(null);
    const [formData, setFormData] = useState<IProgram | null>(null);
    const [editMode, setEditMode] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);
    const editContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { programId } = router.query;
    const { addToast } = useToast();

    useEffect(() => {
        const fetchProgram = async () => {
            setLoading(true);
            try {
                const accessToken = Cookies.get('accessToken');
                const response = await fetchApi({
                    url: `${appConfig.apiBaseUrl}/program/${programId}`,
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                });
                if (response && response.program) {
                    setProgram(response.program);
                    setFormData(response.program);
                    setSelectedImage(response.program.image);
                } else {
                    setError('Program not found.');
                }
            } catch {
                setError('Failed to fetch program.');
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            setLoading(true);
            try {
                const accessToken = Cookies.get('accessToken');
                const response = await fetchApi({
                    url: `${appConfig.apiBaseUrl}/category`,
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                });
                if (response && response.categories) {
                    setCategories(response.categories);
                } else {
                    setError('Failed to fetch categories.');
                }
            } catch {
                setError('Failed to fetch categories.');
            } finally {
                setLoading(false);
            }
        };

        if (programId) fetchProgram();
        fetchCategories();
    }, [programId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (editContainerRef.current && !editContainerRef.current.contains(event.target as Node)) {
                setEditMode(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (editMode && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => prevData ? { ...prevData, [name as keyof IProgram]: value } : null);
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);

            // Tạo FormData
            const updatedFormData = new FormData();

            // So sánh và chỉ thêm các trường dữ liệu đã thay đổi
            if (formData) {
                const fields: (keyof IProgram)[] = [
                    'programName', 'registerDate', 'endRegisterDate', 'startDate',
                    'quantity', 'point', 'isMinus', 'categoryId', 'description'
                ];

                fields.forEach(field => {
                    const currentValue = program ? program[field] : null;
                    const newValue = formData[field as keyof IProgram];

                    if (newValue !== currentValue) {
                        if (newValue !== undefined && newValue !== null) {
                            updatedFormData.append(field, newValue as any);
                        }
                    }
                });
            }

            if (selectedImage && typeof selectedImage === 'object' && selectedImage instanceof Blob) {
                updatedFormData.append('image', selectedImage);
            }

            const accessToken = Cookies.get('accessToken');
            const response = await fetch(`${appConfig.apiBaseUrl}/program/update/${programId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: updatedFormData
            });

            const result = await response.json();

            if (response.ok) {
                addToast('Thành công!', 'Chương trình đã được cập nhật thành công.', 'success');
                router.push(`/program/${programId}`);
                setEditMode(null);
            } else {
                addToast('Thất bại!', result.error || 'Failed to update program.', 'error');
            }
        } catch (error) {
            addToast('Thất bại!', 'Failed to update program.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const toggleEdit = (field: keyof IProgram) => {
        setEditMode(prevMode => prevMode === field ? null : field);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!program) return <p>Program not found.</p>;

    const vietnameseCategoryName = categoryMapping[program.categoryId.categoryName] || 'Không xác định';

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Chỉnh sửa chương trình</h1>
            </div>
            <div className={styles.saveButtonContainer}>
                <button onClick={handleUpdate} className={styles.saveButton}>Lưu</button>
            </div>
            <div className={styles.content}>
                <div className={styles.imageContainer}>
                    <img className={styles.image} src={selectedImage as string} alt={program.programName} />
                    <input
                        type="file"
                        className={styles.fileInput}
                        ref={imageInputRef}
                        onChange={handleImageChange}
                    />
                </div>

                <div className={styles.details}>
                    <table className={styles.infoTable}>
                        <tbody>
                            {[
                                { label: 'Tên chương trình', name: 'programName', value: program.programName },
                                { label: 'Ngày bắt đầu đăng ký', name: 'registerDate', value: moment(program.registerDate).format('DD/MM/YYYY, HH:mm') },
                                { label: 'Ngày kết thúc đăng ký', name: 'endRegisterDate', value: moment(program.endRegisterDate).format('DD/MM/YYYY, HH:mm') },
                                { label: 'Ngày bắt đầu', name: 'startDate', value: moment(program.startDate).format('DD/MM/YYYY, HH:mm') },
                                { label: 'Số lượng', name: 'quantity', value: program.quantity },
                                { label: 'Điểm', name: 'point', value: program.point },
                                { label: 'Trừ điểm', name: 'isMinus', value: program.isMinus ? 'Có' : 'Không' },
                                { label: 'Hình thức', name: 'category', value: vietnameseCategoryName },
                                { label: 'Mô tả', name: 'description', value: program.description }
                            ].map(({ label, name, value }) => (
                                <tr key={name}>
                                    <td><strong>{label}:</strong></td>
                                    <td>
                                        {editMode === name ? (
                                            name === 'registerDate' || name === 'endRegisterDate' || name === 'startDate' ? (
                                                <input
                                                    ref={inputRef as RefObject<HTMLInputElement>}
                                                    type="datetime-local"
                                                    name={name}
                                                    value={moment(formData?.[name as keyof IProgram]).format('YYYY-MM-DDTHH:mm')}
                                                    onChange={handleChange}
                                                />
                                            ) : name === 'isMinus' ? (
                                                <select
                                                    ref={inputRef as RefObject<HTMLSelectElement>}
                                                    name={name}
                                                    value={formData?.[name as keyof IProgram] ? 'true' : 'false'}
                                                    onChange={handleChange}
                                                >
                                                    <option value="true">Có</option>
                                                    <option value="false">Không</option>
                                                </select>
                                            ) : name === 'category' ? (
                                                <select
                                                    ref={inputRef as RefObject<HTMLSelectElement>}
                                                    name={name}
                                                    value={formData?.[name as keyof IProgram]?.toString() || ''}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Thể loại</option>
                                                    {categories.map(category => (
                                                        <option key={category._id} value={category._id}>
                                                            {category.categoryName}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : name === 'description' ? (
                                                <textarea
                                                    ref={inputRef as RefObject<HTMLTextAreaElement>}
                                                    name={name}
                                                    value={formData?.[name as keyof IProgram] || ''}
                                                    onChange={handleChange}
                                                />
                                            ) : (
                                                <input
                                                    ref={inputRef as RefObject<HTMLInputElement>}
                                                    type="text"
                                                    name={name}
                                                    value={formData?.[name as keyof IProgram] || ''}
                                                    onChange={handleChange}
                                                />
                                            )
                                        ) : (
                                            value
                                        )}
                                    </td>
                                    <td>
                                        <button className={styles.editButton} onClick={() => toggleEdit(name as keyof IProgram)}>
                                            <RiEdit2Fill />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EditProgram;
