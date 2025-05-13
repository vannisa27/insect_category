import { Button, Flex, Modal } from 'antd';
import styled from 'styled-components';
import { DataObject } from '../GoogleSheets/GoogleSheetData';
import { useState } from 'react';

function CardAnimal({ data }: { data: DataObject }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <CardAnimalWrapper>
            {data.imageUrl && (
                <div className='card-image'>
                    <img src={data.imageUrl} alt={data.insectName} />
                </div>
            )}
            <div className='card-content'>
                <div>
                    <div className='content-title'>{data.insectName}</div>
                    <div className='content-detail'>
                        <div>
                            <span className='detail-label'>ชื่อสามัญ: </span>
                            <span className='detail-desc'>{data.commonName}</span>
                        </div>
                        <div>
                            <span className='detail-label'>ชื่อวิทยาศาสตร์: </span>
                            <span className='detail-desc'>{data.scientificName}</span>
                        </div>
                        <div>
                            <span className='detail-label'>วงศ์: </span>
                            <span className='detail-desc'>{data.family}</span>
                        </div>
                        <div>
                            <span className='detail-label'>สกุล: </span>
                            <span className='detail-desc'>{data.genus}</span>
                        </div>
                        <div>
                            <span className='detail-label'>ประเภท: </span>
                            <span className='detail-desc'>{data.type}</span>
                        </div>
                    </div>
                </div>
                <div className='content-footer'>
                    <Button variant='filled' danger color='primary' onClick={() => setIsModalOpen(true)}>
                        see
                    </Button>
                </div>
            </div>
            <Modal
                title={data.insectName}
                open={isModalOpen}
                footer=''
                centered
                styles={{
                    content: {
                        padding: 12,
                    },
                }}
                onCancel={() => setIsModalOpen(false)}
            >
                <ModalContent>
                    {data.imageUrl && (
                        <div>
                            <img src={data.imageUrl} alt={data.insectName} />
                        </div>
                    )}
                    <Flex gap={6}>
                        <span className='detail-label'>ชื่อสามัญ: </span>
                        <span className='detail-desc'>{data.commonName}</span>
                    </Flex>
                    <Flex gap={6}>
                        <span className='detail-label'>ชื่อวิทยาศาสตร์: </span>
                        <span className='detail-desc'>{data.scientificName}</span>
                    </Flex>
                    <Flex gap={6}>
                        <span className='detail-label'>วงศ์: </span>
                        <span className='detail-desc'>{data.family}</span>
                    </Flex>
                    <Flex gap={6}>
                        <span className='detail-label'>สกุล: </span>
                        <span className='detail-desc'>{data.genus}</span>
                    </Flex>
                    <Flex gap={6}>
                        <span className='detail-label'>ประเภท: </span>
                        <span className='detail-desc'>{data.type}</span>
                    </Flex>
                    <Flex gap={6}>
                        <span className='detail-label'>อันดับ: </span>
                        <span className='detail-desc'>{data.order}</span>
                    </Flex>
                    <Flex gap={6}>
                        <span className='detail-label'>สถานภาพ: </span>
                        <span className='detail-desc'>{data.status}</span>
                    </Flex>
                    <Flex gap={6}>
                        <span className='detail-label'>วันที่พบ: </span>
                        <span className='detail-desc'>{data.dateFound}</span>
                    </Flex>
                    <Flex gap={6}>
                        <span className='detail-label'>สถานที่พบ: </span>
                        <span className='detail-desc'>{data.locationFound}</span>
                    </Flex>
                    <Flex gap={6}>
                        <span className='detail-label'>พฤติกรรม: </span>
                        <span className='detail-desc'>{data.behavior}</span>
                    </Flex>
                    <Flex gap={6}>
                        <span className='detail-label'>ผู้พบ: </span>
                        <span className='detail-desc'>{data.foundBy}</span>
                    </Flex>
                    <Flex gap={6}>
                        <span className='detail-label'>บันทึกเพิ่มเติม: </span>
                        <span className='detail-desc'>{data.additionalNotes}</span>
                    </Flex>
                    <Flex gap={6}>
                        <span className='detail-label'>วันที่สตัฟฟ์: </span>
                        <span className='detail-desc'>{data.dateStuffed}</span>
                    </Flex>
                    <Flex gap={6}>
                        <span className='detail-label'>วันที่จัดแสดง: </span>
                        <span className='detail-desc'>{data.dateDisplayed}</span>
                    </Flex>
                    <Flex gap={6}>
                        <span className='detail-label'>วันที่เลิกจัดแสดง: </span>
                        <span className='detail-desc'>{data.dateUndisplayed}</span>
                    </Flex>
                    <Flex gap={6}>
                        <span className='detail-label'>ตำแหน่งจัดแสดง: </span>
                        <span className='detail-desc'>{data.displayLocation}</span>
                    </Flex>
                    <Flex gap={6}>
                        <span className='detail-label'>ผู้สตัฟฟ์: </span>
                        <span className='detail-desc'>{data.stuffedBy}</span>
                    </Flex>
                    <Flex gap={6}>
                        <span className='detail-label'>เทคนิค: </span>
                        <span className='detail-desc'>{data.technique}</span>
                    </Flex>
                    <Flex gap={6}>
                        <span className='detail-label'>จำนวน(ตัว): </span>
                        <span className='detail-desc'>{data.quantity}</span>
                    </Flex>
                </ModalContent>
            </Modal>
        </CardAnimalWrapper>
    );
}

const CardAnimalWrapper = styled.div`
    position: relative;
    display: flex;
    flex: 1;
    min-width: 280px;
    height: 250px;
    border-radius: 10px;
    box-shadow: 0 0 10px #8b8b8bad;
    overflow: hidden;

    .card-image {
        min-width: 120px;
        width: 120px;
        height: 100%;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }
    }

    .card-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 12px;
        color: #ccc;
    }

    .content-footer {
        position: absolute;
        bottom: 12px;
        right: 12px;
    }

    .content-title {
        font-size: 16px;
        font-weight: 600;
        color: #000;
        margin-bottom: 12px;
    }

    .content-detail {
        color: #777;
        line-height: 1.8;

        .detail-desc {
            color: #000;
        }
    }
`;

const ModalContent = styled.div`
    color: #777;
    line-height: 1.8;
    max-height: 80vh;
    overflow-y: auto;

    .detail-desc {
        color: #000;
    }
`;

export default CardAnimal;
