import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/router';
import { fetchApi } from '@/utils/fetch-api.util';
import { IProgram } from '@/types/program';
import { Loading } from '@/components';
import Cookies from 'js-cookie';
import { appConfig } from '@/configs/app.config';
import moment from 'moment';
import { categoryMapping, statusMapping } from '@/constants';

import styles from '@/styles/ProgramDetail.module.css';
import Link from 'next/link';

const ProgramDetail: React.FC = () => {
    const [program, setProgram] = useState<IProgram | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { programId } = router.query;

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchProgram = async () => {
            if (!programId) return; // Chờ đến khi programId có giá trị
            setLoading(true);
            setError(null);
            try {
                const accessToken = Cookies.get('accessToken');
                const response = await fetchApi({
                    url: `${appConfig.apiBaseUrl}/program/${programId}`,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                });

                if (response && response.program) {
                    setProgram(response.program);
                } else {
                    setError('Program not found.');
                }
            } catch (error: any) {
                setError('Failed to fetch program. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProgram();
    }, [isAuthenticated, programId, router]);

    if (!isAuthenticated) {
        return null;
    }

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!program) {
        return <p>No program found.</p>;
    }
    const vietnameseCategoryName = categoryMapping[program.categoryId.categoryName] || 'Không xác định';
    const vietnameseStatusName = statusMapping[program.status] || 'Không xác định';
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Chi tiết chương trình</h1>
                <div>
                    <button>
                        <Link href={`/program/edit/${programId}`}>
                            Sửa
                        </Link>
                    </button>
                </div>
            </div>
            <div className={styles.content}>
                <img className={styles.image} src={program.image} alt={program.programName} />
                <div className={styles.details}>
                    <table className={styles.infoTable}>
                        <tbody>
                            <tr>
                                <td><strong>Tên chương trình: </strong></td>
                                <td>{program.programName}</td>
                            </tr>
                            <tr>
                                <td><strong>Khoa:</strong></td>
                                <td>{program.adminId.facilityId.facilityName}</td>
                            </tr>
                            <tr>
                                <td><strong>Ngày bắt đầu đăng ký:</strong></td>
                                <td>{moment(program.registerDate).format('DD/MM/YYYY, HH:mm')}</td>
                            </tr>
                            <tr>
                                <td><strong>Ngày kết thúc đăng ký:</strong></td>
                                <td>{moment(program.endRegisterDate).format('DD/MM/YYYY, HH:mm')}</td>
                            </tr>
                            <tr>
                                <td><strong>Ngày bắt đầu:</strong></td>
                                <td>{moment(program.startDate).format('DD/MM/YYYY, HH:mm')}</td>
                            </tr>
                            <tr>
                                <td><strong>Số lượng:</strong></td>
                                <td>{program.quantity}</td>
                            </tr>
                            <tr>
                                <td><strong>Điểm:</strong></td>
                                <td>{program.point}</td>
                            </tr>
                            <tr>
                                <td><strong>Trạng thái:</strong></td>
                                <td>{vietnameseStatusName}</td>
                            </tr>
                            <tr>
                                <td><strong>Trừ điểm:</strong></td>
                                <td>{program.isMinus ? 'Có' : 'Không'}</td>
                            </tr>
                            <tr>
                                <td><strong>Hình thức:</strong></td>
                                <td>{vietnameseCategoryName}</td>
                            </tr>
                            <tr>
                                <td><strong>Mô tả:</strong></td>
                                <td>{program.description}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

}

export default ProgramDetail;
