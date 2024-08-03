import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/router';
import { fetchApi } from '@/utils/fetch-api.util';
import { appConfig } from '@/configs/app.config';
import { IProgram } from '@/types/program';
import { Loading } from '@/components';
import Cookies from 'js-cookie';
import styles from '@/styles/Program.module.css';
import { FaChevronDown } from 'react-icons/fa';
import Link from 'next/link';
import { categoryMapping, statusMapping } from '@/constants';
import { useToast } from '@/contexts/ToastContext'; // Import useToast hook

const Program: React.FC = () => {
    const [programs, setPrograms] = useState<IProgram[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedPrograms, setSelectedPrograms] = useState<Set<string>>(new Set());
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { addToast } = useToast(); // Use the useToast hook

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchPrograms = async () => {
            setLoading(true);
            setError(null);
            try {
                const accessToken = Cookies.get('accessToken');
                const response = await fetchApi({
                    url: `${appConfig.apiBaseUrl}/program`,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                });
                if (response && Array.isArray(response.programs)) {
                    setPrograms(response.programs);
                } else {
                    setError('Định dạng phản hồi không như mong đợi.');
                }
            } catch (error: any) {
                setError('Không thể tải chương trình. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        fetchPrograms();
    }, [isAuthenticated, router]);

    const handleSelectProgram = (id: string) => {
        setSelectedPrograms((prev) => {
            const newSelectedPrograms = new Set(prev);
            if (newSelectedPrograms.has(id)) {
                newSelectedPrograms.delete(id);
            } else {
                newSelectedPrograms.add(id);
            }
            return newSelectedPrograms;
        });
    };

    const handleCreate = () => {
        router.push('/program/create');
    };

    const handleEdit = () => {
        if (selectedPrograms.size === 0) {
            addToast('Cảnh báo!', 'Vui lòng chọn ít nhất một chương trình để chỉnh sửa.', 'warning');
            return;
        }
        router.push(`/program/edit/${Array.from(selectedPrograms)[0]}`);
    };

    const handleDelete = async () => {
        if (selectedPrograms.size === 0) {
            addToast('Cảnh báo!', 'Vui lòng chọn ít nhất một chương trình để xóa.', 'warning');
            return;
        }

        try {
            const accessToken = Cookies.get('accessToken');
            await fetch(`${appConfig.apiBaseUrl}/program/delete`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ids: Array.from(selectedPrograms) })
            });
            addToast('Thành công!', 'Chương trình đã được xóa thành công.', 'success');
            setPrograms(programs.filter(program => !selectedPrograms.has(program._id)));
            setSelectedPrograms(new Set());
        } catch {
            addToast('Thất bại!', 'Không thể xóa chương trình. Vui lòng thử lại.', 'error');
        }
    };

    const handleApprove = async () => {
        if (selectedPrograms.size === 0) {
            addToast('Cảnh báo!', 'Vui lòng chọn ít nhất một chương trình để phê duyệt.', 'warning');
            return;
        }

        try {
            const accessToken = Cookies.get('accessToken');
            await fetch(`${appConfig.apiBaseUrl}/program/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ids: Array.from(selectedPrograms) })
            });
            addToast('Thành công!', 'Chương trình đã được phê duyệt thành công.', 'success');
            setSelectedPrograms(new Set());
        } catch {
            addToast('Thất bại!', 'Không thể phê duyệt chương trình. Vui lòng thử lại.', 'error');
        }
    };

    const handleReject = async () => {
        if (selectedPrograms.size === 0) {
            addToast('Cảnh báo!', 'Vui lòng chọn ít nhất một chương trình để từ chối.', 'warning');
            return;
        }

        try {
            const accessToken = Cookies.get('accessToken');
            await fetch(`${appConfig.apiBaseUrl}/program/reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ids: Array.from(selectedPrograms) })
            });
            addToast('Thành công!', 'Chương trình đã được từ chối thành công.', 'success');
            setSelectedPrograms(new Set());
        } catch {
            addToast('Thất bại!', 'Không thể từ chối chương trình. Vui lòng thử lại.', 'error');
        }
    };

    if (!isAuthenticated) {
        return null; // Hoặc có thể hiển thị một thông báo cho người dùng chưa đăng nhập
    }

    return (
        <div className={styles.container}>
            {loading && <Loading />} {/* Hiển thị loading khi đang tải */}
            {error && <p className={styles.error}>{error}</p>}
            <h1>Chương trình</h1>
            <div className={styles.header}>
                <div className={styles.buttonGroup}>
                    <button onClick={handleCreate}>Tạo mới</button>
                    <button onClick={handleEdit} disabled={selectedPrograms.size === 0}>
                        Chỉnh sửa
                    </button>
                    <div className={styles.dropdown}>
                        <button>
                            Thao tác khác <FaChevronDown className={styles.arrow} />
                        </button>
                        <div className={styles.dropdownContent}>
                            <button
                                onClick={handleDelete}
                                className={selectedPrograms.size === 0 ? styles.disabled : ''}
                            >
                                Xóa
                            </button>
                            <button
                                onClick={handleApprove}
                                className={selectedPrograms.size === 0 ? styles.disabled : ''}
                            >
                                Phê duyệt
                            </button>
                            <button
                                onClick={handleReject}
                                className={selectedPrograms.size === 0 ? styles.disabled : ''}
                            >
                                Từ chối
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedPrograms(new Set(programs.map((program) => program._id)));
                                    } else {
                                        setSelectedPrograms(new Set());
                                    }
                                }}
                                checked={selectedPrograms.size === programs.length && programs.length > 0}
                            />
                        </th>
                        <th>Tên chương trình</th>
                        <th>Khoa</th>
                        <th>Hình thức</th>
                        <th>Số lượng</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {programs.map((program) => (
                        <tr key={program._id}>
                            <td>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={selectedPrograms.has(program._id)}
                                    onChange={() => handleSelectProgram(program._id)}
                                />
                            </td>
                            <td>
                                <Link href={`/program/${program._id}`}>
                                    {program.programName}
                                </Link>
                            </td>
                            <td>{program.adminId.facilityId.facilityName}</td>
                            <td>{categoryMapping[program.categoryId.categoryName] || 'Không xác định'}</td>
                            <td>{program.quantity}</td>
                            <td>{statusMapping[program.status] || 'Không xác định'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Program;
