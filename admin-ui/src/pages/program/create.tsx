import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { fetchApi } from '@/utils/fetch-api.util';
import { ICategory, IProgram } from '@/types/program';
import Cookies from 'js-cookie';
import { appConfig } from '@/configs/app.config';
import styles from '@/styles/Edit.module.css';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/authContext';

const CreateProgram: React.FC = () => {
    const [formData, setFormData] = useState<IProgram>({
        _id: '',
        programName: '',
        registerDate: new Date(),
        endRegisterDate: new Date(),
        startDate: new Date(),
        quantity: 0,
        point: 0,
        isMinus: false,
        categoryId: '',
        description: '',
        image: '',
        status: '',
        adminId: ''
    });
    const [categories, setCategories] = useState<ICategory[]>([]);
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { addToast } = useToast();
    const inputRef = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            if (!isAuthenticated) {
                router.push('/login');
                return;
            }

            try {
                const accessToken = Cookies.get('accessToken');
                const response = await fetchApi({
                    url: `${appConfig.apiBaseUrl}/category`,
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setCategories(response.categories || []); // Ensure categories is an array
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, [isAuthenticated, router]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedImage(URL.createObjectURL(file)); // Create URL for image preview
            setFormData(prevData => ({ ...prevData, image: file.toString() })); // Convert file object to string and save it to formData
        }
    };

    const handleSubmit = async () => {
        try {
            const accessToken = Cookies.get('accessToken');

            // Create FormData object
            const formDataToSend = new FormData();
            formDataToSend.append('programName', formData.programName);
            formDataToSend.append('registerDate', formData.registerDate.toISOString());
            formDataToSend.append('endRegisterDate', formData.endRegisterDate.toISOString());
            formDataToSend.append('startDate', formData.startDate.toISOString());
            formDataToSend.append('quantity', formData.quantity.toString());
            formDataToSend.append('point', formData.point.toString());
            formDataToSend.append('isMinus', formData.isMinus.toString());
            formDataToSend.append('categoryId', formData.categoryId);
            formDataToSend.append('description', formData.description);

            if (formData.image) {
                formDataToSend.append('image', formData.image); // Ensure image is a File object
            }

            console.log('formDataToSend:', formDataToSend.get('programName'));

            await fetchApi({
                url: `${appConfig.apiBaseUrl}/program/create`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                    // No need for 'Content-Type': 'application/json' when using FormData
                },
                body: formDataToSend
            });
            addToast('Tạo chương trình thành công', 'success', 'success');
            router.push('/program');
        } catch (error) {
            console.error('Failed to create program:', error);
            addToast('Tạo chương trình thất bại', 'error', 'error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => {
            if (name === 'registerDate' || name === 'endRegisterDate' || name === 'startDate') {
                return { ...prevData, [name]: new Date(value) };
            } else {
                return { ...prevData, [name]: value };
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Tạo chương trình mới</h1>
            </div>
            <div className={styles.saveButtonContainer}>
                <button onClick={handleSubmit} className={styles.saveButton}>Lưu</button>
            </div>
            <div className={styles.content}>
                <div className={styles.imageContainer}>
                    {selectedImage && <img className={styles.image} src={selectedImage} alt="Selected" />}
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
                                { label: 'Tên chương trình', name: 'programName', value: formData.programName, type: 'text' },
                                { label: 'Ngày bắt đầu đăng ký', name: 'registerDate', value: formData.registerDate.toISOString().slice(0, 16), type: 'datetime-local' },
                                { label: 'Ngày kết thúc đăng ký', name: 'endRegisterDate', value: formData.endRegisterDate.toISOString().slice(0, 16), type: 'datetime-local' },
                                { label: 'Ngày bắt đầu', name: 'startDate', value: formData.startDate.toISOString().slice(0, 16), type: 'datetime-local' },
                                { label: 'Số lượng', name: 'quantity', value: formData.quantity.toString(), type: 'number' },
                                { label: 'Điểm', name: 'point', value: formData.point.toString(), type: 'number' },
                                {
                                    label: 'Trừ điểm', name: 'isMinus', value: formData.isMinus.toString(), type: 'select', options: [
                                        { value: 'true', label: 'Có' },
                                        { value: 'false', label: 'Không' }
                                    ]
                                },
                                {
                                    label: 'Hình thức', name: 'categoryId', value: formData.categoryId, type: 'select', options: categories.map(category => ({
                                        value: category._id,
                                        label: category.categoryName
                                    }))
                                },
                                { label: 'Mô tả', name: 'description', value: formData.description, type: 'textarea' }
                            ].map(({ label, name, value, type, options }) => (
                                <tr key={name}>
                                    <td><strong>{label}:</strong></td>
                                    <td>
                                        {type === 'text' || type === 'number' ? (
                                            <input
                                                type={type}
                                                name={name}
                                                value={value}
                                                onChange={handleChange}
                                            />
                                        ) : type === 'datetime-local' ? (
                                            <input
                                                type="datetime-local"
                                                name={name}
                                                value={value}
                                                onChange={handleChange}
                                            />
                                        ) : type === 'select' ? (
                                            <select
                                                name={name}
                                                value={value}
                                                onChange={handleChange}
                                            >
                                                {options?.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : type === 'textarea' ? (
                                            <textarea
                                                name={name}
                                                value={value}
                                                onChange={handleChange}
                                            />
                                        ) : null}
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

export default CreateProgram;
